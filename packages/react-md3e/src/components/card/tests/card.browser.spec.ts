import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-org/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('Card composes Surface colors, corners, media and actions for all three MD3 variants', async ({ page }) => {
  await page.goto('/surfaces');

  for (const [variant, color] of [
    ['filled', 'surfaceContainerHighest'],
    ['elevated', 'surfaceContainerLow'],
    ['outlined', 'surface'],
  ] as const) {
    const card = page.getByTestId(`server-card-${variant}`);

    await expect(card).toHaveAttribute('data-md3-surface', '');
    await expect(card).toHaveCSS('background-color', rgb(forest.schemes.light[color]));
    await expect(card).toHaveCSS('border-radius', '18px');
    await expect(card).toHaveCSS('overflow', 'hidden');
    await expect(card.locator('[data-md3-card-content]')).toHaveCSS('padding-inline-start', '16px');
    await expect(card.locator('[data-md3-card-actions]')).toHaveCSS('gap', '8px');
    await expect(card.getByRole('img')).toHaveCSS('object-fit', 'cover');
    await expect(card).not.toHaveAttribute('tabindex');
  }

  await expect(page.getByTestId('server-card-elevated')).not.toHaveCSS('box-shadow', 'none');
  await expect(page.getByTestId('server-card-filled')).toHaveCSS('box-shadow', 'none');
  await expect(page.getByTestId('server-card-outlined')).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('server-card-outlined')).toHaveCSS(
    'border-top-color',
    rgb(forest.schemes.light.outlineVariant),
  );
  await expect(page.getByTestId('surfaces-dark').locator('[data-md3-card]')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.surfaceContainerLow),
  );
});

test('primary keyboard actions, independent buttons, form defaults and native selection keep their own behavior', async ({
  page,
}) => {
  await page.goto('/surfaces');

  const count = page.getByTestId('surface-action-count');
  const primary = page.getByRole('button', { name: /^Mountain escape/ });

  await primary.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(count).toHaveText('Opened: 2; Saved: 0; Submitted: 0');
  await page.getByRole('button', { name: 'Save trip', exact: true }).click();
  await expect(count).toHaveText('Opened: 2; Saved: 1; Submitted: 0');
  await page.getByRole('button', { name: 'Submit booking', exact: true }).click();
  await expect(count).toHaveText('Opened: 2; Saved: 1; Submitted: 1');
  await page.getByRole('checkbox', { name: 'Include breakfast' }).check();
  await expect(page.getByRole('checkbox', { name: 'Include breakfast' })).toBeChecked();
  expect(await primary.locator('button, a, input').count()).toBe(0);
  await page.getByRole('button', { name: 'Check surface refs', exact: true }).click();

  for (const node of [
    page.getByTestId('surface-ref'),
    page.getByTestId('shape-ref'),
    page.getByTestId('action-card'),
    primary,
    page.getByRole('link', { name: 'Read mountain guide', exact: true }),
  ]) {
    await expect(node).toHaveAttribute('data-ref-checked', 'true');
  }
});

test('only enabled primary actions receive hover elevation, focus and press ripple', async ({ page }) => {
  await page.goto('/surfaces');

  const primary = page.getByRole('button', { name: /^Mountain escape/ });
  const card = page.getByTestId('action-card');
  const resting = await card.evaluate((node) => getComputedStyle(node).boxShadow);
  const styles = await page.locator('style').count();

  await primary.hover();
  await expect(card).not.toHaveCSS('box-shadow', resting);
  await page.keyboard.press('Tab');
  await primary.focus();
  await expect(primary).toHaveCSS('outline-width', '3px');

  const box = (await primary.boundingBox())!;

  await page.mouse.move(box.x + 30, box.y + 30);
  await page.mouse.down();
  await expect(primary.locator('[data-md3-ripple-ink]')).toHaveCount(1);
  await expect(card).toHaveCSS('box-shadow', resting);
  await page.mouse.up();
  await expect(primary.locator('[data-md3-ripple-ink]')).toHaveCount(0);

  const disabled = page.getByRole('button', { name: 'Unavailable journey', exact: true });

  await expect(disabled).toBeDisabled();
  await disabled.evaluate((node) => (node as HTMLButtonElement).click());
  await expect(disabled.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await page.getByRole('button', { name: 'No ripple journey', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'No ripple journey', exact: true }).locator('[data-md3-ripple-ink]'),
  ).toHaveCount(0);
  expect(await page.locator('style').count()).toBe(styles);
});

test('link action areas retain native navigation and disabled links suppress pointer/programmatic activation', async ({
  page,
}) => {
  await page.goto('/surfaces');

  const link = page.getByRole('link', { name: 'Read mountain guide', exact: true });
  const disabled = page.getByRole('link', { name: 'Unavailable guide', exact: true });

  await expect(link).toHaveJSProperty('tagName', 'A');
  await link.focus();
  await page.keyboard.press('Space');
  await expect(page).not.toHaveURL(/#booking-details$/);
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#booking-details$/);
  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect(disabled).toHaveAttribute('tabindex', '-1');
  await expect(disabled).not.toHaveAttribute('href');
  await disabled.evaluate((node) => (node as HTMLAnchorElement).click());
  await expect(page).toHaveURL(/#booking-details$/);
  await expect(page.getByTestId('surface-action-count')).toHaveText('Opened: 0; Saved: 0; Submitted: 0');
});

test('mobile/RTL, controlled dragging, reduced motion, forced colors and accessible composition work together', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/surfaces');
  await page.getByRole('button', { name: 'Toggle drag appearance', exact: true }).click();
  await expect(page.getByTestId('action-card')).toHaveAttribute('data-dragged', 'true');
  await expect(page.getByTestId('action-card')).toHaveCSS('transition-duration', '0s');

  const rtl = page.getByTestId('rtl-card');

  await expect(rtl.locator('[data-md3-card]')).toHaveCSS('direction', 'rtl');

  const first = (await rtl.getByRole('button', { name: 'إلغاء' }).boundingBox())!;
  const last = (await rtl.getByRole('button', { name: 'حجز' }).boundingBox())!;

  expect(first.x).toBeGreaterThan(last.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await page.getByRole('button', { name: /^Mountain escape/ }).focus();
  await expect(page.getByTestId('action-card')).toHaveCSS('box-shadow', 'none');
  await expect(page.getByTestId('server-card-outlined')).toHaveCSS('border-top-width', '1px');
});

test('Storybook primary/secondary actions work in a precomputed dark theme', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-card--primary-action&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await expect(page.locator('[data-md3-card]')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.surfaceContainerLow),
  );
  await page.getByRole('button', { name: /^Mountain escape/ }).click();
  await page.getByRole('button', { name: 'Save trip', exact: true }).click();
  await expect(page.getByText('Opened: 1; Saved: 1', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
