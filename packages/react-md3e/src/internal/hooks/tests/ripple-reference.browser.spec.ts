import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import reference from './fixtures/m3e-ripple/reference.json' with { type: 'json' };

async function compareFrames(page: Page, actual: Buffer, expected: Buffer) {
  return page.evaluate(
    async ({ actualUrl, expectedUrl }) => {
      const images = await Promise.all(
        [actualUrl, expectedUrl].map(async (url) => {
          const image = new Image();

          image.src = url;
          await image.decode();

          const canvas = document.createElement('canvas');

          canvas.width = image.width;
          canvas.height = image.height;

          const context = canvas.getContext('2d')!;

          context.drawImage(image, 0, 0);

          return context.getImageData(0, 0, image.width, image.height).data;
        }),
      );

      if (images[0]!.length !== images[1]!.length) {
        throw new Error('Reference and rendered frame dimensions differ.');
      }

      let pixels = 0;
      let maxChannelError = 0;

      for (let index = 0; index < images[0]!.length; index += 4) {
        let error = 0;

        for (let channel = 0; channel < 4; channel += 1) {
          error = Math.max(error, Math.abs(images[0]![index + channel]! - images[1]![index + channel]!));
        }

        maxChannelError = Math.max(error, maxChannelError);

        if (error > 1) {
          pixels += 1;
        }
      }

      return { pixels, maxChannelError };
    },
    {
      actualUrl: `data:image/png;base64,${actual.toString('base64')}`,
      expectedUrl: `data:image/png;base64,${expected.toString('base64')}`,
    },
  );
}

for (const scheme of ['standard', 'expressive']) {
  test(`${scheme}: ripple matches synchronized m3e growth, hold and fade frames`, async ({ page }, testInfo) => {
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-button--playground&viewMode=story&globals=motionScheme:${scheme}`,
    );

    const button = page.getByRole('button', { name: 'Get started', exact: true });

    await expect(button).toBeVisible();
    await button.evaluate((node) => {
      const backdrop = document.createElement('div');
      const host = document.createElement('div');
      const surface = node.querySelector<HTMLElement>(':scope > span[aria-hidden]')!;

      Object.assign(backdrop.style, { position: 'fixed', inset: '0px', background: '#fff', zIndex: '9998' });
      document.body.append(backdrop);
      host.dataset.rippleReference = '';
      Object.assign(host.style, {
        position: 'fixed',
        left: '24px',
        top: '24px',
        width: '200px',
        height: '100px',
        borderRadius: '24px',
        background: '#f7f2fa',
        color: '#000',
        zIndex: '9999',
      });
      // Isolate the actual hook-owned layer from the button's independent state layer and shape morph.
      // Input still goes through the real Button/useRipple handlers.
      surface.style.inset = '0px';
      host.append(surface);
      document.body.append(host);
    });

    const host = page.locator('[data-ripple-reference]');
    const ink = host.locator('[data-md3-ripple-ink]');
    const measurements = [];

    for (const frame of reference.cases) {
      await host.evaluate((node) => node.firstElementChild!.replaceChildren());
      await button.dispatchEvent('pointerdown', {
        isPrimary: true,
        button: 0,
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 24 + frame.x,
        clientY: 24 + frame.y,
      });
      await expect(ink).toHaveCount(1);
      await ink.evaluate(
        (node, elapsed) => {
          const animation = node.getAnimations()[0]!;

          animation.pause();
          animation.currentTime = elapsed;

          // Commit the held opacity before beginning its exit transition.
          return getComputedStyle(node).opacity;
        },
        frame.stage === 'grow' ? frame.elapsedMs : 450,
      );

      if (frame.stage === 'fade') {
        await button.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'mouse' });
        await ink.evaluate((node, elapsed) => {
          const transition = node
            .getAnimations()
            .find((animation) => 'transitionProperty' in animation && animation.transitionProperty === 'opacity')!;

          transition.pause();
          transition.currentTime = elapsed;
        }, frame.elapsedMs);
      }

      const path = testInfo.outputPath(`${scheme}-${frame.file}`);
      const actual = await host.screenshot({ path, animations: 'allow' });
      const expected = await readFile(new URL(`./fixtures/m3e-ripple/${frame.file}`, import.meta.url));
      const difference = await compareFrames(page, actual, expected);

      measurements.push({ file: frame.file, ...difference });
      await testInfo.attach(`${scheme}-${frame.file}`, { path, contentType: 'image/png' });
      expect(difference.pixels, frame.file).toBe(0);
    }

    // Compare the complete press feedback too: the reference keeps hover underneath ripple,
    // without a second solid pressed layer. Keep only the button's shape/text out of this scene.
    await button.evaluate((node) => {
      const isolatedHost = document.querySelector('[data-ripple-reference]')!;
      const surface = isolatedHost.firstElementChild!;

      surface.replaceChildren();
      node.prepend(surface);
      node.setAttribute('aria-label', 'Get started');
      node.querySelectorAll<HTMLElement>(':scope > span:not([aria-hidden])').forEach((label) => {
        label.style.setProperty('visibility', 'hidden');
      });
      Object.assign((node as HTMLElement).style, {
        position: 'fixed',
        left: '24px',
        top: '24px',
        inlineSize: '200px',
        blockSize: '100px',
        padding: '0px',
        border: '0px',
        borderRadius: '24px',
        boxShadow: 'none',
        background: '#f7f2fa',
        color: '#000',
        zIndex: '9999',
        transition: 'none',
      });
      (node as HTMLElement).style.setProperty('--_outline-width', '0px');
      isolatedHost.remove();
    });
    await page.mouse.move(44, 74);
    await expect.poll(() => button.evaluate((node) => getComputedStyle(node, '::before').opacity)).toBe('0.08');
    await page.mouse.down();

    const compositeInk = button.locator('[data-md3-ripple-ink]');

    await expect(compositeInk).toHaveCount(1);
    await compositeInk.evaluate((node, time) => {
      const animation = node.getAnimations()[0]!;

      animation.pause();
      animation.currentTime = time;
    }, reference.composite.elapsedMs);
    await expect.poll(() => button.evaluate((node) => getComputedStyle(node, '::before').opacity)).toBe('0.08');

    const compositePath = testInfo.outputPath(`${scheme}-${reference.composite.file}`);
    const compositeActual = await button.screenshot({ path: compositePath, animations: 'allow' });
    const compositeExpected = await readFile(
      new URL(`./fixtures/m3e-ripple/${reference.composite.file}`, import.meta.url),
    );
    const compositeDifference = await compareFrames(page, compositeActual, compositeExpected);

    measurements.push({ file: reference.composite.file, ...compositeDifference });
    await testInfo.attach(reference.composite.file, { path: compositePath, contentType: 'image/png' });
    // Opacity compositing and color-mix produce slightly different edge antialiasing:
    // locally two of 20,000 pixels differ by 2/255 at the lower-left rounded corner.
    expect(compositeDifference.maxChannelError, reference.composite.file).toBeLessThanOrEqual(2);
    expect(compositeDifference.pixels, reference.composite.file).toBeLessThanOrEqual(20);
    await page.mouse.up();

    await testInfo.attach(`${scheme}-ripple-comparison.json`, {
      body: JSON.stringify({ source: reference.source, measurements }, null, 2),
      contentType: 'application/json',
    });
  });
}
