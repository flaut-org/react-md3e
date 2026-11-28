import type { Locator, Page } from '@playwright/test';
import { test, expect } from '../../../../tests/browser/ui-quality/storybook';
import { captureFrames, recordMotion } from '../../../../tests/browser/ui-quality/motion';
import { expectSpatialConstraints } from '../../../../tests/browser/ui-quality/spatial';

async function waitForRestingDrawer(dialog: Locator) {
  await expect(dialog).not.toHaveAttribute('data-starting-style');
  await expect
    .poll(() =>
      dialog.evaluate((node) => node.getAnimations().filter((animation) => animation.playState === 'running').length),
    )
    .toBe(0);
  await expect(dialog).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
}

async function startMotion(page: Page) {
  return recordMotion(
    page,
    { drawer: '[data-md3-navigation-popup="drawer"]', backdrop: '[data-md3-navigation-backdrop]' },
    600,
  );
}

function constraints(width: number, viewportWidth: number, rtl: boolean) {
  return [
    {
      id: 'anchored-surface',
      kind: 'attachment' as const,
      target: 'drawer',
      boundary: 'viewport' as const,
      edge: rtl ? ('right' as const) : ('left' as const),
      allowOutside: true,
    },
    {
      id: 'legal-travel',
      kind: 'range' as const,
      target: 'drawer',
      metric: 'x' as const,
      min: rtl ? viewportWidth - width : -width,
      max: rtl ? viewportWidth : 0,
    },
  ];
}

test('[ND-001] drawer entry and exit remain attached to the viewport edge', async ({ page, story }, testInfo) => {
  test.setTimeout(90000);

  for (const motionScheme of ['expressive', 'standard']) {
    for (const rtl of [false, true]) {
      for (const viewportWidth of [1000, 390]) {
        await page.setViewportSize({ width: viewportWidth, height: 720 });
        await story(`components-navigationdrawer--${rtl ? 'right-to-left' : 'modal'}`, { motionScheme });

        const label = `${motionScheme}-${rtl ? 'rtl' : 'ltr'}-${viewportWidth}`;
        const trigger = page.getByRole('button', {
          name: rtl ? 'Open RTL drawer' : 'Open navigation drawer',
          exact: true,
        });
        const dialog = page.getByRole('dialog', { name: 'Mail navigation', exact: true });
        const width = Math.min(360, viewportWidth - 56);
        const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
        const entry = await startMotion(page);

        await trigger.click();
        await expect(dialog).toBeVisible();

        if (!reduced) {
          await expect
            .poll(
              () =>
                dialog.evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
              { intervals: [8] },
            )
            .toBe(true);
        }

        await captureFrames(page, testInfo, `${label}-entry`, 6, 3);
        await waitForRestingDrawer(dialog);

        const entryData = await entry.stop(testInfo, `${label}-entry-motion`);

        if (!reduced) {
          expect(
            entryData.frames.some((frame) => {
              const { drawer } = frame.elements;
              const distance = drawer ? Math.abs(drawer.x - (rtl ? viewportWidth - width : 0)) : 0;

              return distance > 1 && distance < width - 1;
            }),
            'Normal entry must interpolate actual rectangles instead of jumping between legal endpoints',
          ).toBe(true);
        }

        expectSpatialConstraints(entryData, constraints(width, viewportWidth, rtl), {
          tolerancePx: 0.5,
          maxFrameGapMs: 100,
        });
        await expect(dialog.getByRole('button', { name: 'Inbox 24', exact: true })).toBeFocused();

        const exit = await startMotion(page);

        // Reduced-motion exit may unmount immediately; retain two real pre-action poses.
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
        await page.keyboard.press('Escape');
        await captureFrames(page, testInfo, `${label}-exit`, 3, 2);
        await expect(dialog).toHaveCount(0);

        const exitData = await exit.stop(testInfo, `${label}-exit-motion`);

        expectSpatialConstraints(exitData, constraints(width, viewportWidth, rtl), {
          tolerancePx: 0.5,
          maxFrameGapMs: 100,
        });
        await expect(trigger).toBeFocused();
      }
    }
  }
});

test('[ND-002] interrupted drawer motion preserves edge constraints and focus', async ({ page, story }, testInfo) => {
  test.setTimeout(90000);

  for (const motionScheme of ['expressive', 'standard']) {
    for (const rtl of [false, true]) {
      await page.setViewportSize({ width: 390, height: 700 });
      await story(`components-navigationdrawer--${rtl ? 'right-to-left' : 'modal'}`, { motionScheme });

      const trigger = page.getByRole('button', {
        name: rtl ? 'Open RTL drawer' : 'Open navigation drawer',
        exact: true,
      });
      const dialog = page.getByRole('dialog', { name: 'Mail navigation', exact: true });
      const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);

      for (let repeat = 0; repeat < 3; repeat += 1) {
        const motion = await startMotion(page);

        await trigger.click();
        await expect(dialog).toBeVisible();

        if (!reduced) {
          await expect
            .poll(
              () =>
                dialog.evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
              { intervals: [8] },
            )
            .toBe(true);
          expect(
            await dialog.evaluate((node) =>
              node.getAnimations().some((animation) => animation.playState === 'running'),
            ),
          ).toBe(true);
        }

        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await trigger.click();
        await waitForRestingDrawer(dialog);
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);

        const data = await motion.stop(testInfo, `${motionScheme}-${rtl ? 'rtl' : 'ltr'}-repeat-${repeat}`);

        expectSpatialConstraints(data, constraints(334, 390, rtl), { tolerancePx: 0.5, maxFrameGapMs: 100 });
        await expect(trigger).toBeFocused();
      }
    }
  }
});
