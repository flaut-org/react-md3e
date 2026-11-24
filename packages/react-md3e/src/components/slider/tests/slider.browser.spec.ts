import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Locator } from '@playwright/test';

const control = (root: Locator) => root.locator('[data-md3-slider-control]');
const handle = (root: Locator) => root.locator('[data-md3-slider-handle]');
const activeTrack = (root: Locator) => root.locator('[data-md3-slider-segment][data-active="true"]');

test('all five Slider sizes render native accessible inputs, split tracks and 48px targets before JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/sliders');

    for (const [size, trackSize, handleSize] of [
      ['extraSmall', 16, 44],
      ['small', 24, 44],
      ['medium', 40, 52],
      ['large', 56, 68],
      ['extraLarge', 96, 108],
    ] as const) {
      const root = page.getByTestId(`size-${size}`);
      const input = root.getByRole('slider', { name: `${size} size`, exact: true });

      await expect(input).toHaveAttribute('aria-valuenow', '50');
      await expect(root.locator('[data-md3-slider-track]')).toHaveCSS('height', `${trackSize}px`);
      await expect(handle(root)).toHaveCSS('height', `${handleSize}px`);
      await expect(handle(root)).toHaveCSS('width', '4px');
      expect((await control(root).boundingBox())!.height).toBe(Math.max(48, handleSize));
      expect((await input.boundingBox())!.width).toBe(48);
    }

    const root = page.getByTestId('server-slider');
    const trackBox = (await control(root).boundingBox())!;
    const activeBox = (await activeTrack(root).boundingBox())!;
    const handleBox = (await handle(root).boundingBox())!;
    const inactive = (await root.locator('[data-part="after"]').boundingBox())!;

    expect(handleBox.x + handleBox.width / 2).toBeCloseTo(trackBox.x + trackBox.width * 0.25, 0);
    expect(handleBox.x - activeBox.x - activeBox.width).toBeCloseTo(6, 0);
    expect(inactive.x - handleBox.x - handleBox.width).toBeCloseTo(6, 0);

    for (const id of ['rtl-slider', 'inherited-rtl-slider']) {
      const rtl = page.getByTestId(id);
      const box = (await control(rtl).boundingBox())!;
      const thumb = (await handle(rtl).boundingBox())!;

      expect(thumb.x + thumb.width / 2).toBeCloseTo(box.x + box.width * 0.75, 0);
    }
  } finally {
    await context.close();
  }
});

test('keyboard changes, large steps, Home/End and commits preserve controlled values and accessible value text', async ({
  page,
}) => {
  await page.goto('/sliders');

  const root = page.getByTestId('controlled-slider');
  const input = root.getByRole('slider', { name: 'Volume', exact: true });

  await input.focus();
  await input.press('ArrowRight');
  await expect(input).toHaveAttribute('aria-valuenow', '41');
  await expect(input).toHaveAttribute('aria-valuetext', '41 percent');
  await expect(page.getByTestId('slider-changes')).toHaveText('1');
  await expect(page.getByTestId('slider-commits')).toHaveText('1:41');
  await expect(root.locator('[data-md3-slider-value-label]')).toHaveText('41%');
  await expect(root.locator('[data-md3-slider-value-label]')).toBeVisible();
  await expect(handle(root)).toHaveCSS('width', '2px');
  await expect(handle(root)).toHaveCSS('outline-width', '3px');
  await input.press('Shift+ArrowRight');
  await expect(input).toHaveAttribute('aria-valuenow', '51');
  await input.press('PageUp');
  await expect(input).toHaveAttribute('aria-valuenow', '61');
  await input.press('Home');
  await expect(input).toHaveAttribute('aria-valuenow', '0');
  await input.press('End');
  await expect(input).toHaveAttribute('aria-valuenow', '100');
  await input.press('ArrowRight');
  await expect(page.getByTestId('slider-commits')).toHaveText('5:100');
  await page.getByRole('button', { name: 'Set volume to 65' }).click();
  await expect(input).toHaveAttribute('aria-valuenow', '65');
  await page.getByRole('button', { name: 'Check slider refs' }).click();
  await expect(page.getByTestId('slider-refs')).toHaveText('true');
});

test('pointer dragging updates immediately, commits once on release and track presses jump to the chosen value', async ({
  page,
}) => {
  await page.goto('/sliders');

  const root = page.getByTestId('controlled-slider');

  await root.scrollIntoViewIfNeeded();

  const box = (await control(root).boundingBox())!;
  const thumb = (await handle(root).boundingBox())!;
  const input = root.getByRole('slider');

  await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2, { steps: 8 });
  await expect(input).toHaveAttribute('aria-valuenow', '70');
  await expect(page.getByTestId('slider-commits')).toHaveText('0:40');
  await expect(root).toHaveAttribute('data-dragging');
  await page.mouse.up();
  await expect(page.getByTestId('slider-commits')).toHaveText('1:70');
  await expect(root).not.toHaveAttribute('data-dragging');
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
  await expect(input).toHaveAttribute('aria-valuenow', '25');
  await expect(page.getByTestId('slider-commits')).toHaveText('2:25');
});

test('range handles keep their names, order, separation and one automatic value label', async ({ page }) => {
  await page.goto('/sliders');

  const range = page.getByTestId('range-slider');
  const minimum = range.getByRole('slider', { name: 'Minimum price', exact: true });
  const maximum = range.getByRole('slider', { name: 'Maximum price', exact: true });

  await minimum.focus();
  await minimum.press('ArrowRight');
  await expect(page.getByTestId('slider-range')).toHaveText('21,80:0');
  await minimum.press('Tab');
  await expect(maximum).toBeFocused();
  await expect(range.locator('[data-md3-slider-value-label][data-open="true"]')).toHaveCount(1);
  await maximum.press('ArrowLeft');
  await expect(page.getByTestId('slider-range')).toHaveText('21,79:1');
  await minimum.press('End');
  await expect(minimum).toHaveAttribute('aria-valuenow', '79');
  await minimum.press('ArrowRight');
  await expect(minimum).toHaveAttribute('aria-valuenow', '79');

  const separated = page.getByTestId('separated-slider');
  const lower = separated.getByRole('slider', { name: 'Separated minimum' });

  await lower.press('End');
  await expect(lower).toHaveAttribute('aria-valuenow', '60');

  await separated.scrollIntoViewIfNeeded();
  await lower.press('ArrowRight');
  await expect(lower).toHaveAttribute('aria-valuenow', '60');

  const track = (await control(separated).boundingBox())!;
  const lowerThumb = (await handle(separated).nth(0).boundingBox())!;

  await page.mouse.move(lowerThumb.x + lowerThumb.width / 2, lowerThumb.y + lowerThumb.height / 2);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width * 0.95, track.y + track.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(lower).toHaveAttribute('aria-valuenow', '60');
  await expect(separated.getByRole('slider', { name: 'Separated maximum' })).toHaveAttribute('aria-valuenow', '80');
});

test('centered tracks grow from the midpoint on either side and collapse at the center', async ({ page }) => {
  await page.goto('/sliders');

  const root = page.getByTestId('server-centered');
  const track = (await control(root).boundingBox())!;
  const left = (await activeTrack(root).boundingBox())!;

  expect(left.x + left.width).toBeCloseTo(track.x + track.width / 2, 0);
  await root.getByRole('slider').press('End');

  const right = (await activeTrack(root).boundingBox())!;

  expect(right.x).toBeCloseTo(track.x + track.width / 2, 0);
  await root.getByRole('slider').press('Home');

  for (let index = 0; index < 10; index += 1) {
    await root.getByRole('slider').press('PageUp');
  }

  await expect(activeTrack(root)).toHaveCSS('width', '0px');
});

test('step marks, custom labels and decimal increments reflect the actual value scale', async ({ page }) => {
  await page.goto('/sliders');

  const stepped = page.getByTestId('stepped-slider');

  await expect(stepped.locator('[data-md3-slider-stop]')).toHaveCount(11);
  await stepped.getByRole('slider').press('ArrowRight');
  await expect(stepped.getByRole('slider')).toHaveAttribute('aria-valuenow', '40');
  await expect(page.getByTestId('labeled-slider').locator('[data-md3-slider-mark-label]')).toHaveText([
    'Low',
    'Medium',
    'High',
  ]);

  const decimals = page.getByTestId('decimal-slider');

  await decimals.getByRole('slider').press('ArrowRight');
  await expect(decimals.getByRole('slider')).toHaveAttribute('aria-valuenow', '0.3');
  await decimals.getByRole('slider').press('Shift+ArrowUp');
  await expect(decimals.getByRole('slider')).toHaveAttribute('aria-valuenow', '0.5');
  await expect(decimals.locator('[data-md3-slider-stop]')).toHaveCount(5);
});

test('disabled controls and callback vetoes prevent pointer/keyboard changes and commits', async ({ page }) => {
  await page.goto('/sliders');

  for (const id of ['vetoed-slider', 'prevented-slider']) {
    const root = page.getByTestId(id);

    await root.getByRole('slider').press('End');
    await root.scrollIntoViewIfNeeded();

    const box = (await control(root).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.8, box.y + box.height / 2);
    await expect(root.getByRole('slider')).toHaveAttribute('aria-valuenow', '35');
  }

  await expect(page.getByTestId('slider-commits')).toHaveText('0:40');

  const disabled = page.getByTestId('disabled-slider');

  await disabled.scrollIntoViewIfNeeded();

  const box = (await control(disabled).boundingBox())!;

  await expect(disabled.getByRole('slider')).toBeDisabled();
  await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
  await expect(disabled.getByRole('slider')).toHaveAttribute('aria-valuenow', '60');

  for (const input of await page.getByTestId('disabled-range').getByRole('slider').all()) {
    await expect(input).toBeDisabled();
  }
});

test('RTL reverses horizontal arrows and pointer mapping while vertical values increase upward', async ({ page }) => {
  await page.goto('/sliders');

  for (const id of ['rtl-slider', 'inherited-rtl-slider']) {
    const root = page.getByTestId(id);
    const input = root.getByRole('slider');

    await root.scrollIntoViewIfNeeded();

    const box = (await control(root).boundingBox())!;

    await input.press('ArrowRight');
    await expect(input).toHaveAttribute('aria-valuenow', '24');
    await input.press('ArrowLeft');
    await expect(input).toHaveAttribute('aria-valuenow', '25');
    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
    await expect(input).toHaveAttribute('aria-valuenow', '75');
  }

  const vertical = page.getByTestId('vertical-slider');

  await vertical.scrollIntoViewIfNeeded();

  const box = (await control(vertical).boundingBox())!;

  await expect(vertical.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical');
  await expect(vertical.locator('[data-md3-slider-track]')).toHaveCSS('width', '40px');
  expect(box.height).toBeGreaterThan(100);
  await vertical.getByRole('slider').press('ArrowUp');
  await expect(vertical.getByRole('slider')).toHaveAttribute('aria-valuenow', '31');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.25);
  await expect(vertical.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
});

test('inset icons move between tracks with CSS and explicit form ownership preserves native values', async ({
  page,
}) => {
  await page.goto('/sliders');

  const icon = page.getByTestId('icon-slider');

  await expect(icon.locator('[data-md3-slider-icon][data-placement="inactive"]')).toBeVisible();
  await expect(icon.locator('[data-md3-slider-icon][data-placement="active"]')).toBeHidden();
  await page.getByRole('button', { name: 'Set icon slider to 80' }).click();
  await expect(icon.locator('[data-md3-slider-icon][data-placement="active"]')).toBeVisible();
  await expect(icon.locator('[data-md3-slider-icon][data-placement="inactive"]')).toBeHidden();
  await page.getByRole('button', { name: 'Set volume to 65' }).click();
  await page.getByRole('slider', { name: 'Maximum price', exact: true }).press('End');
  await page.getByRole('button', { name: 'Submit sliders' }).click();
  await expect(page.getByTestId('slider-form-values')).toHaveText(
    '{"volume":"65","bounds":["20","100"],"disabled":null}',
  );
  await page.getByRole('button', { name: 'Reset sliders' }).click();
  await expect(page.getByRole('slider', { name: 'Volume', exact: true })).toHaveAttribute('aria-valuenow', '40');
  await expect(page.getByRole('slider', { name: 'Maximum price', exact: true })).toHaveAttribute('aria-valuenow', '80');
});

test('touch dragging updates a narrow slider without adding style rules', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/sliders');

    const root = page.getByTestId('controlled-slider');

    await root.scrollIntoViewIfNeeded();

    const box = (await control(root).boundingBox())!;
    const session = await context.newCDPSession(page);
    const styles = await page.locator('style').count();

    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: box.x + box.width * 0.4, y: box.y + box.height / 2 }],
    });

    for (const fraction of [0.45, 0.5, 0.6, 0.7]) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: box.x + box.width * fraction, y: box.y + box.height / 2 }],
      });
    }

    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(root.getByRole('slider')).toHaveAttribute('aria-valuenow', '70');
    await expect(root).not.toHaveAttribute('data-dragging');
    expect(await page.locator('style').count()).toBe(styles);
  } finally {
    await context.close();
  }
});

test('themes, reduced motion, forced colors and accessible names use extracted CSS', async ({ page }) => {
  await page.goto('/sliders');

  const light = page.getByTestId('server-slider');
  const dark = page.getByTestId('dark-slider');

  expect(await activeTrack(light).evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe(
    await activeTrack(dark).evaluate((node) => getComputedStyle(node).backgroundColor),
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(handle(light)).toHaveCSS('transition-duration', '0s');
  await expect(activeTrack(light)).toHaveCSS('transition-duration', '0s');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(activeTrack(light)).toHaveCSS('outline-width', '1px');
  await expect(handle(light)).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('streamed and Storybook sliders retain styling, labels, range behavior and themes', async ({ page }) => {
  await page.goto('/streaming');
  await expect(page.getByRole('slider', { name: 'Streamed volume', exact: true })).toHaveAttribute(
    'aria-valuenow',
    '35',
  );
  await expect(handle(page.getByTestId('streamed-slider'))).toHaveCSS('height', '44px');
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-slider--range&viewMode=story&globals=brand:forest;colorScheme:dark;a11y.manual:!true',
  );

  const minimum = page.getByRole('slider', { name: 'Minimum price', exact: true });

  await minimum.press('ArrowRight');
  await expect(minimum).toHaveAttribute('aria-valuenow', '21');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
});
