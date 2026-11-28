import { test, expect } from '../../../../tests/browser/ui-quality/storybook';
import { captureFrames, recordMotion } from '../../../../tests/browser/ui-quality/motion';
import { expectSpatialConstraints } from '../../../../tests/browser/ui-quality/spatial';

test('[NR-001] canceled rail swipes keep the outer edge attached', async ({ page, story }, testInfo) => {
  test.setTimeout(90000);

  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    await page.emulateMedia({ reducedMotion });

    for (const motionScheme of ['expressive', 'standard']) {
      for (const rtl of [false, true]) {
        await story('components-navigationrail--modal', { motionScheme, qaDirection: rtl ? 'rtl' : 'ltr' });

        const trigger = page.getByRole('button', { name: 'Open navigation rail', exact: true });
        const popup = page.getByRole('dialog');

        await trigger.tap();
        await expect(popup).not.toHaveAttribute('data-starting-style');
        await expect
          .poll(() =>
            popup.evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
          )
          .toBe(false);

        const initial = await popup.boundingBox();
        const client = await page.context().newCDPSession(page);

        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 450 }] });

        for (const displacement of [8, 16, 24, 32]) {
          await page.evaluate(async () => {
            for (let frame = 0; frame < 4; frame += 1) {
              await new Promise<void>((resolve) => {
                requestAnimationFrame(() => resolve());
              });
            }
          });
          await client.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x: 180 + (rtl ? displacement : -displacement), y: 450 }],
          });
        }

        const displaced = await popup.boundingBox();

        expect(
          Math.abs(displaced!.x - initial!.x),
          'The real touch gesture must displace the surface before settling',
        ).toBeGreaterThan(1);

        // Arm before release, which starts the spring; touch-start arbitration is not this transition.
        const recording = await recordMotion(page, { rail: '[data-md3-navigation-popup="rail"]' }, 240);

        await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await captureFrames(page, testInfo, `${motionScheme}-${rtl ? 'rtl' : 'ltr'}-${reducedMotion}`, 4, 6);
        await expect(popup).not.toHaveAttribute('data-ending-style');
        await expect(popup).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
        await expect
          .poll(() =>
            popup.evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
          )
          .toBe(false);

        const data = await recording.stop(testInfo, `${motionScheme}-${rtl ? 'rtl' : 'ltr'}-${reducedMotion}-motion`);
        const displacements = data.frames.flatMap((frame) =>
          frame.elements.rail ? [Math.abs(frame.elements.rail.x - initial!.x)] : [],
        );

        expect(
          Math.max(...displacements),
          'The real touch gesture must displace the surface before settling',
        ).toBeGreaterThan(1);
        expectSpatialConstraints(
          data,
          [
            {
              id: 'rail-swipe-anchor',
              kind: 'attachment',
              target: 'rail',
              boundary: 'viewport',
              edge: rtl ? 'right' : 'left',
              allowOutside: true,
            },
          ],
          {
            // This strict anchor contract detects the independently observed 0.24px residual gap.
            tolerancePx: 0.05,
            maxFrameGapMs: 100,
          },
        );
        await client.detach();
        await page.keyboard.press('Escape');
        await expect(popup).toHaveCount(0);
        await expect(trigger).toBeFocused();
      }
    }
  }
});
