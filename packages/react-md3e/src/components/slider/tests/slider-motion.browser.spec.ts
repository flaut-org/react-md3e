import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

const label = (root: Locator) => root.locator('[data-md3-slider-value-label]');
const handle = (root: Locator) => root.locator('[data-md3-slider-handle]');

async function finishMotion(indicator: Locator) {
  await indicator.evaluate((element) =>
    Promise.all(
      element.getAnimations().map((animation) => {
        if (animation.playState === 'finished') {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          animation.addEventListener('finish', () => resolve(), { once: true });
          animation.finish();
        });
      }),
    ),
  );
}

async function sampleMotion(indicator: Locator, elapsed?: number) {
  return indicator.evaluate((element, time) => {
    // Flush the new interaction state, then inspect the extracted animation at a known playhead.
    element.getBoundingClientRect();

    const animations = element.getAnimations();

    for (const animation of animations) {
      animation.pause();

      if (time !== undefined) {
        animation.currentTime = time;
      }
    }

    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      bottom: box.bottom,
      center: box.x + box.width / 2,
      visibility: style.visibility,
      opacity: Number(style.opacity),
      transform: style.transform,
      origin: style.transformOrigin,
      animations: animations.length,
      playhead: Number(animations[0]?.currentTime ?? 0),
    };
  }, elapsed);
}

test('handle-facing track corners stay unchanged at both bounds in every size and variant', async ({ page }) => {
  await page.goto('/sliders');

  for (const size of ['extraSmall', 'small', 'medium', 'large', 'extraLarge']) {
    const root = page.getByTestId(`size-${size}`);
    const active = root.locator('[data-part="active"]');

    await expect(active).toHaveCSS('border-start-end-radius', '2px');
    await root.getByRole('slider').press('End');
    await expect(active).toHaveCSS('border-start-end-radius', '2px');
    await root.getByRole('slider').press('Home');
    await expect(root.locator('[data-part="after"]')).toHaveCSS('border-start-start-radius', '2px');
    expect(await active.evaluate((element) => getComputedStyle(element).transitionProperty)).not.toContain(
      'border-radius',
    );
  }

  const range = page.getByTestId('range-slider');

  await range.getByRole('slider', { name: 'Minimum price' }).press('Home');
  await range.getByRole('slider', { name: 'Maximum price' }).press('End');
  await expect(range.locator('[data-part="active"]')).toHaveCSS('border-start-start-radius', '2px');
  await expect(range.locator('[data-part="active"]')).toHaveCSS('border-start-end-radius', '2px');

  const centered = page.getByTestId('server-centered');

  await centered.getByRole('slider').press('Home');
  await expect(centered.locator('[data-part="active"]')).toHaveCSS('border-start-start-radius', '2px');
  await centered.getByRole('slider').press('End');
  await expect(centered.locator('[data-part="active"]')).toHaveCSS('border-start-end-radius', '2px');

  const vertical = page.getByTestId('vertical-slider');

  await vertical.getByRole('slider').press('End');
  await expect(vertical.locator('[data-part="active"]')).toHaveCSS('border-top-left-radius', '2px');
});

test('every press of an already-focused handle restores its value label and pressed shape', async ({ page }) => {
  await page.goto('/sliders');

  const root = page.getByTestId('icon-slider');

  await root.scrollIntoViewIfNeeded();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const box = (await handle(root).boundingBox())!;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(label(root)).toHaveCSS('opacity', '1');
    await expect(label(root)).toBeVisible();
    await expect(handle(root)).toHaveCSS('width', '2px');
    await page.mouse.up();
    await expect(root.getByRole('slider')).toBeFocused();
    await expect(label(root)).toHaveCSS('visibility', 'hidden');
  }

  const range = page.getByTestId('range-slider');

  await range.scrollIntoViewIfNeeded();

  for (const index of [0, 1]) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const thumb = range.locator('[data-md3-slider-thumb]').nth(index);
      const box = (await handle(thumb).boundingBox())!;

      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await expect(label(thumb)).toHaveCSS('opacity', '1');
      await expect(range.locator('[data-md3-slider-value-label]:visible')).toHaveCount(1);
      await page.mouse.up();
      await expect(label(thumb)).toHaveCSS('visibility', 'hidden');
    }
  }
});

test('value labels grow from a point below their bottom center and remain visible while shrinking', async ({
  page,
}) => {
  await page.goto('/sliders');

  const root = page.getByTestId('icon-slider');

  await root.scrollIntoViewIfNeeded();

  const box = (await handle(root).boundingBox())!;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(label(root)).toHaveCSS('visibility', 'visible');

  const growing = await sampleMotion(label(root), 30);

  expect(growing.animations).toBeGreaterThan(0);
  expect(growing.visibility).toBe('visible');
  await finishMotion(label(root));

  const full = await label(root).boundingBox();

  expect(growing.height).toBeGreaterThan(0);
  expect(growing.height).toBeLessThan(full!.height);
  expect(growing.center).toBeCloseTo(full!.x + full!.width / 2, 0);
  expect(growing.bottom + 6 * (growing.height / full!.height)).toBeCloseTo(full!.y + full!.height + 6, 0);
  await page.mouse.up();

  const shrinking = await sampleMotion(label(root), 30);

  expect(shrinking.visibility).toBe('visible');
  expect(shrinking.height).toBeGreaterThan(0);
  expect(shrinking.height).toBeLessThan(full!.height);
  expect(shrinking.opacity).toBe(1);
  expect(shrinking.bottom + 6 * (shrinking.height / full!.height)).toBeCloseTo(full!.y + full!.height + 6, 0);
  await finishMotion(label(root));
  await expect(label(root)).toHaveCSS('visibility', 'hidden');
});

test('a press during closing reverses from the current scale without a jump or a delayed hide', async ({ page }) => {
  await page.goto('/sliders');

  const root = page.getByTestId('icon-slider');

  await root.scrollIntoViewIfNeeded();

  const box = (await handle(root).boundingBox())!;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(label(root)).toHaveCSS('visibility', 'visible');
  await finishMotion(label(root));

  const full = (await label(root).boundingBox())!;

  await page.mouse.up();

  const closing = await sampleMotion(label(root), 30);

  await page.mouse.down();

  const reopening = await sampleMotion(label(root));

  expect(reopening.visibility).toBe('visible');
  expect(reopening.height).toBeGreaterThan(0);
  expect(reopening.height).toBeLessThan(full.height);
  // Native animation timestamps can round slightly below the held millisecond value on reversal.
  expect(reopening.playhead).toBeGreaterThanOrEqual(closing.playhead - 1e-6);
  expect(reopening.playhead).toBeLessThan(closing.playhead + 80);
  await finishMotion(label(root));
  await expect(label(root)).toHaveCSS('opacity', '1');
  await expect(label(root)).toBeVisible();
  await page.mouse.up();
  await expect(label(root)).toHaveCSS('visibility', 'hidden');
});

test('keyboard focus, vertical origins, disabled state and reduced motion preserve the label lifecycle', async ({
  page,
}) => {
  await page.goto('/sliders');

  for (const [id, rtl] of [
    ['vertical-slider', false],
    ['vertical-rtl-slider', true],
  ] as const) {
    const root = page.getByTestId(id);

    await root.getByRole('slider').press('ArrowUp');
    await expect(label(root)).toHaveCSS('visibility', 'visible');
    await finishMotion(label(root));

    const origin = await label(root).evaluate((element) => {
      const values = getComputedStyle(element).transformOrigin.split(' ').map(Number.parseFloat);

      return {
        x: values[0],
        y: values[1],
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
      };
    });

    expect(origin.x).toBe(rtl ? origin.width + 6 : -6);
    expect(origin.y).toBe(origin.height / 2);
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });

  const root = page.getByTestId('icon-slider');

  await root.scrollIntoViewIfNeeded();

  const box = (await handle(root).boundingBox())!;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(label(root)).toHaveCSS('visibility', 'visible');
    await expect(label(root)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await page.mouse.up();
    await expect(label(root)).toHaveCSS('visibility', 'hidden');
  }

  expect(await label(root).evaluate((element) => element.getAnimations().length)).toBe(0);
});

test('changing reduced-motion preference during interaction settles without leaving a stale animation', async ({
  page,
}) => {
  await page.goto('/sliders');

  const root = page.getByTestId('icon-slider');

  await root.scrollIntoViewIfNeeded();

  const box = (await handle(root).boundingBox())!;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(label(root)).toHaveCSS('visibility', 'visible');
  await sampleMotion(label(root), 30);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(label(root)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  expect(await label(root).evaluate((element) => element.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(label(root)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.mouse.up();
  await expect(label(root)).toHaveCSS('visibility', 'hidden');
  await page.mouse.down();
  await expect(label(root)).toHaveCSS('visibility', 'visible');
  await page.mouse.up();
  await expect(label(root)).toHaveCSS('visibility', 'hidden');
});
