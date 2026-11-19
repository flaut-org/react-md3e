import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Locator } from '@playwright/test';

const container = (segment: Locator) => segment.locator('[data-md3-segment-container]');
const check = (segment: Locator) => segment.locator('[data-md3-segment-check]');

test('SegmentedButton renders equal outlined segments and a 48px target from an RSC before JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/segmented-buttons');

    const group = page.getByRole('radiogroup', { name: 'Calendar view', exact: true });
    const segments = group.getByRole('radio');
    const widths = [];

    await expect(segments).toHaveCount(3);
    await expect(segments.nth(1)).toHaveAttribute('aria-checked', 'true');
    await expect(check(segments.nth(1))).toHaveCSS('opacity', '1');
    await expect(check(segments.nth(0))).toHaveCSS('opacity', '0');

    for (const segment of await segments.all()) {
      const box = (await segment.boundingBox())!;
      const visual = (await container(segment).boundingBox())!;

      widths.push(box.width);
      expect(box.height).toBe(48);
      expect(box.width).toBeGreaterThanOrEqual(48);
      expect(visual.height).toBe(40);
      expect(visual.y - box.y).toBe(4);
      await expect(segment).not.toHaveAttribute('aria-pressed');
      await expect(container(segment)).toHaveCSS('border-top-width', '1px');
    }

    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    await expect(container(segments.nth(0))).toHaveCSS('border-left-width', '1px');
    await expect(container(segments.nth(1))).toHaveCSS('border-left-width', '0px');
    await expect(container(segments.nth(2))).toHaveCSS('border-left-width', '0px');
    await expect(segments.nth(0)).toHaveCSS('border-top-left-radius', '9999px');
    await expect(segments.nth(1)).toHaveCSS('border-radius', '0px');
    await expect(segments.nth(2)).toHaveCSS('border-top-right-radius', '9999px');
  } finally {
    await context.close();
  }
});

test('single selection has one tab stop, wrapping navigation and one change per activation', async ({ page }) => {
  await page.goto('/segmented-buttons');
  await page.keyboard.press('Tab');

  const server = page.getByRole('radiogroup', { name: 'Calendar view', exact: true });

  await expect(server.getByRole('radio', { name: 'Day', exact: true })).toBeFocused();

  const group = page.getByRole('radiogroup', { name: 'Trip type', exact: true });
  const first = group.getByRole('radio', { name: 'Return', exact: true });
  const second = group.getByRole('radio', { name: 'One way', exact: true });

  await second.click();
  await expect(page.getByTestId('trip-changes')).toHaveText('1');
  await second.press('Space');
  await expect(second).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByTestId('trip-changes')).toHaveText('1');
  await second.press('ArrowRight');
  await expect(first).toBeFocused();
  await expect(second).toHaveAttribute('aria-checked', 'true');
  await first.press('Enter');
  await expect(page.getByTestId('trip-value')).toHaveText('return');
  await expect(page.getByTestId('trip-changes')).toHaveText('2');
  await first.press('End');
  await expect(second).toBeFocused();
  await second.press('Home');
  await expect(first).toBeFocused();
  await expect(group.locator('button[tabindex="0"]')).toHaveCount(1);
  await expect(group.getByRole('radio', { name: 'Multi-city', exact: true })).toBeDisabled();
});

test('multiple selection toggles independently with Space and Enter while replacing decorative icons', async ({
  page,
}) => {
  await page.goto('/segmented-buttons');

  const group = page.getByRole('group', { name: 'Amenities', exact: true });
  const wifi = group.getByRole('checkbox', { name: 'Wi-Fi', exact: true });
  const meal = group.getByRole('checkbox', { name: 'Meal', exact: true });
  const originalWidth = (await group.boundingBox())!.width;

  await wifi.press('Space');
  await expect(page.getByTestId('amenity-values')).toHaveText('wifi');
  await expect(check(wifi)).toHaveCSS('opacity', '1');
  await expect(wifi.locator('[data-md3-segment-icon]')).toHaveCSS('opacity', '0');
  await wifi.press('ArrowRight');
  await expect(meal).toBeFocused();
  await meal.press('Enter');
  await expect(page.getByTestId('amenity-values')).toHaveText('wifi,meal');
  await wifi.click();
  await expect(page.getByTestId('amenity-values')).toHaveText('meal');
  await meal.press('Space');
  await expect(group.getByRole('checkbox', { checked: true })).toHaveCount(0);
  await expect(wifi.locator('[data-md3-segment-icon]')).toHaveCSS('opacity', '1');
  expect((await group.boundingBox())!.width).toBeCloseTo(originalWidth);
  await expect(group.locator('button[tabindex="0"]')).toHaveCount(1);

  const alignment = page.getByRole('radiogroup', { name: 'Alignment', exact: true });
  const left = alignment.getByRole('radio', { name: 'Align left', exact: true });

  await expect(check(left)).toHaveCSS('opacity', '1');
  await expect(left.locator('[data-md3-segment-icon]')).toHaveCSS('opacity', '1');
  await expect(
    page.getByRole('radiogroup', { name: 'Hidden indicators' }).locator('[data-md3-segment-check]'),
  ).toHaveCount(0);
});

test('controlled updates, native refs, optional selection and event vetoes preserve group state', async ({ page }) => {
  await page.goto('/segmented-buttons');
  await page.getByRole('button', { name: 'Set one way', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'One way', exact: true })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByTestId('trip-changes')).toHaveText('0');
  await page.getByRole('button', { name: 'Check segment refs' }).click();
  await expect(page.getByTestId('segment-refs')).toHaveText('true');

  const optional = page.getByRole('radiogroup', { name: 'Optional choice', exact: true });

  await optional.getByRole('radio', { name: 'Optional one', exact: true }).click();
  await expect(optional.getByRole('radio', { checked: true })).toHaveCount(0);

  for (const name of ['Vetoed choice', 'Prevented choice', 'Prevented segment']) {
    const group = page.getByRole('radiogroup', { name, exact: true });

    await group.getByRole('radio').nth(1).click();
    await expect(group.getByRole('radio').nth(0)).toHaveAttribute('aria-checked', 'true');
    await expect(group.getByRole('radio').nth(1)).toHaveAttribute('aria-checked', 'false');
    await group.getByRole('radio').nth(1).press('Enter');
    await expect(group.getByRole('radio').nth(0)).toHaveAttribute('aria-checked', 'true');
  }

  const vetoed = page.getByRole('group', { name: 'Vetoed filters', exact: true });

  await vetoed.getByRole('checkbox').nth(1).click();
  await expect(vetoed.getByRole('checkbox').nth(1)).toHaveAttribute('aria-checked', 'false');
});

test('read-only groups retain navigation and disabled groups reject pointer and keyboard selection', async ({
  page,
}) => {
  await page.goto('/segmented-buttons');

  const readOnly = page.getByRole('radiogroup', { name: 'Read only choice', exact: true });
  const first = readOnly.getByRole('radio').nth(0);
  const second = readOnly.getByRole('radio').nth(1);

  await first.focus();
  await first.press('ArrowRight');
  await expect(second).toBeFocused();
  await second.press('Space');
  await second.click();
  await expect(first).toHaveAttribute('aria-checked', 'true');
  await expect(second).toHaveAttribute('aria-checked', 'false');

  const filters = page.getByRole('group', { name: 'Read only filters', exact: true });

  await filters.getByRole('checkbox').nth(1).press('Enter');
  await expect(filters.getByRole('checkbox').nth(0)).toHaveAttribute('aria-checked', 'true');
  await expect(filters.getByRole('checkbox').nth(1)).toHaveAttribute('aria-checked', 'false');

  const disabled = page.getByRole('radiogroup', { name: 'Disabled choice', exact: true });

  await expect(disabled).toHaveAttribute('aria-disabled', 'true');

  for (const segment of await disabled.getByRole('radio').all()) {
    await expect(segment).toBeDisabled();
    await segment.dispatchEvent('click');
  }

  await expect(disabled.getByRole('radio').nth(0)).toHaveAttribute('aria-checked', 'true');
  await expect(disabled.getByRole('radio').nth(1)).toHaveAttribute('aria-checked', 'false');
});

test('inherited RTL mirrors outer corners and skips disabled segments in the visual arrow direction', async ({
  page,
}) => {
  await page.goto('/segmented-buttons');

  const group = page.getByRole('radiogroup', { name: 'Inherited RTL', exact: true });
  const first = group.getByRole('radio', { name: 'RTL one', exact: true });
  const last = group.getByRole('radio', { name: 'RTL two', exact: true });

  await first.focus();
  await first.press('ArrowLeft');
  await expect(last).toBeFocused();
  await last.press('Space');
  await expect(last).toHaveAttribute('aria-checked', 'true');
  await expect(first).toHaveCSS('border-top-right-radius', '9999px');
  await expect(first).toHaveCSS('border-top-left-radius', '0px');
  await expect(last).toHaveCSS('border-top-left-radius', '9999px');
  await expect(container(first)).toHaveCSS('border-right-width', '1px');
  await expect(container(last)).toHaveCSS('border-right-width', '0px');
});

test('native and externally associated forms submit enabled values and reset only uncontrolled selection', async ({
  page,
}) => {
  await page.goto('/segmented-buttons');
  await page.getByRole('radio', { name: 'Business', exact: true }).press('Enter');
  await expect(page.getByTestId('submitted-segments')).toHaveText('');
  await page.getByRole('checkbox', { name: 'Baggage', exact: true }).click();
  await page.getByRole('button', { name: 'Submit segments', exact: true }).click();
  await expect(page.getByTestId('submitted-segments')).toHaveText(
    '{"cabin":"business","filters":["direct","baggage"]}',
  );
  await page.getByRole('button', { name: 'Set one way', exact: true }).click();
  await page
    .locator('#segment-form')
    .evaluate((form) => form.addEventListener('reset', (event) => event.preventDefault(), { once: true }));
  await page.getByRole('button', { name: 'Reset segments', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Business', exact: true })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('button', { name: 'Reset segments', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Economy', exact: true })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('checkbox', { name: 'Direct', exact: true })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('checkbox', { name: 'Baggage', exact: true })).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('radio', { name: 'One way', exact: true })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('button', { name: 'Submit segments', exact: true }).click();
  await expect(page.getByTestId('submitted-segments')).toHaveText('{"cabin":"economy","filters":["direct"]}');
});

test('full-width segments remain equal and on one row in a narrow viewport without resizing on selection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/segmented-buttons');

  const group = page.getByRole('radiogroup', { name: 'Full width', exact: true });
  const boxes = await Promise.all((await group.getByRole('radio').all()).map((segment) => segment.boundingBox()));
  const before = (await group.boundingBox())!.width;

  expect(Math.max(...boxes.map((box) => box!.width)) - Math.min(...boxes.map((box) => box!.width))).toBeLessThan(1);
  expect(new Set(boxes.map((box) => box!.y)).size).toBe(1);
  expect(before).toBeLessThanOrEqual(375);
  await group.getByRole('radio', { name: 'A longer label', exact: true }).click();
  expect((await group.boundingBox())!.width).toBeCloseTo(before);
});

test('themes, ripple, focus and accessibility preferences use precompiled styles', async ({ page }) => {
  await page.goto('/segmented-buttons');

  const light = page.getByRole('radio', { name: 'Return', exact: true });
  const dark = page.getByRole('radio', { name: 'Dark one', exact: true });
  const originalStyles = await page.locator('style').count();

  expect(await container(light).evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe(
    await container(dark).evaluate((node) => getComputedStyle(node).backgroundColor),
  );
  await light.focus();
  await light.press('Space');
  await expect(container(light)).toHaveCSS('outline-width', '3px');
  await light.hover();
  await page.mouse.down();

  try {
    await expect(light.locator('[data-md3-segment-container] > [aria-hidden] > span')).toHaveCount(1);
  } finally {
    await page.mouse.up();
  }

  const noRipple = page.getByRole('radio', { name: 'Last', exact: true });

  await noRipple.hover();
  await page.mouse.down();

  try {
    await expect(noRipple.locator('[data-md3-segment-container] > [aria-hidden] > span')).toHaveCount(0);
  } finally {
    await page.mouse.up();
  }

  expect(await page.locator('style').count()).toBe(originalStyles);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(container(light)).toHaveCSS('transition-duration', '0s');
  await expect(check(light)).toHaveCSS('transition-duration', '0s');
  await expect(light.locator('[data-md3-segment-content]')).toHaveCSS('transition-duration', '0s');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(check(light)).toHaveCSS('opacity', '1');
  await expect(container(light)).toHaveCSS('border-top-width', '1px');
  expect(await container(light).evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe(
    await container(page.getByRole('radio', { name: 'One way', exact: true })).evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    ),
  );
});

test('Storybook exposes multiple selection, custom indicators and explicit RTL composition', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-segmentedbutton--multiple&viewMode=story&globals=brand:forest;colorScheme:dark',
  );

  const group = page.getByRole('group', { name: 'Calendar view', exact: true });

  await expect(group.getByRole('checkbox', { checked: true })).toHaveCount(2);
  await group.getByRole('checkbox', { name: 'Month', exact: true }).press('Enter');
  await expect(group.getByRole('checkbox', { checked: true })).toHaveCount(3);

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-segmentedbutton--custom-indicator&viewMode=story');
  await expect(check(page.getByRole('radio', { name: 'Week', exact: true }))).toHaveText('◆');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-segmentedbutton--right-to-left&viewMode=story');
  await page.getByRole('radio', { name: 'Day', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: 'Week', exact: true })).toBeFocused();
});
