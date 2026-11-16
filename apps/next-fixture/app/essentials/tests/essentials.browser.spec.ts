import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage essentials render through streamed server/client boundaries without style insertion', async ({
  page,
}) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/streaming');
  await expect(page.getByTestId('streamed-skeleton')).toHaveCSS('width', '160px');
  await expect(page.getByTestId('streamed-divider')).toHaveAttribute('role', 'separator');

  const styles = await page.locator('style').count();

  await page.getByRole('button', { name: 'Streamed disclosure', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Streamed disclosure' })).toHaveText('Streamed details');
  await page.getByRole('button', { name: 'Streamed bottom sheet', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Streamed bottom sheet', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Streamed side sheet', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Streamed side sheet', exact: true })).toBeVisible();
  expect(await page.locator('style').count()).toBe(styles);
  expect(errors).toEqual([]);
});

test('essentials and open overlays pass accessibility checks with narrow and forced-color layouts', async ({
  page,
}) => {
  await page.goto('/essentials');
  expect(
    (
      await new AxeBuilder({ page })
        // Base UI's empty tab guards redirect focus; keyboard tests cover their behavior.
        .exclude('[data-base-ui-focus-guard]')
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole('button', { name: 'Open passengers', exact: true }).click();
  expect(
    (
      await new AxeBuilder({ page })
        // Base UI's empty tab guards redirect focus; keyboard tests cover their behavior.
        .exclude('[data-base-ui-focus-guard]')
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Show notification', exact: true }).click();
  await expect(page.locator('[data-md3-snackbar]')).toHaveCSS('border-top-width', '1px');
  expect(
    (
      await new AxeBuilder({ page })
        // Base UI's empty tab guards redirect focus; keyboard tests cover their behavior.
        .exclude('[data-base-ui-focus-guard]')
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('all new component stories render from the built package', async ({ page }) => {
  const examples = [
    ['skeleton', '[data-md3-skeleton]'],
    ['divider', '[data-md3-divider]'],
    ['tooltip', '[data-md3-button]'],
    ['button-group', '[data-md3-button-group]'],
    ['collapsible', '[data-md3-collapsible]'],
    ['bottom-sheet', '[data-md3-button]'],
    ['side-sheet', '[data-md3-button]'],
    ['snackbar', '[data-md3-button]'],
  ];

  for (const [name, selector] of examples) {
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-${name!.replaceAll('-', '')}--playground&viewMode=story&globals=brand:forest;colorScheme:dark`,
    );
    await expect(page.locator(selector!).first()).toBeVisible();
  }

  await page.getByRole('button', { name: 'Show notification', exact: true }).click();
  await expect(page.locator('[data-md3-snackbar]')).toBeVisible();
  await expect(page.locator('[data-md3-snackbar]')).toHaveCSS('color-scheme', 'dark');
  // Contrast is meaningful after the entry fade reaches its fully opaque surface.
  await expect(page.locator('[data-md3-snackbar]')).toHaveCSS('opacity', '1');
  expect(
    (
      await new AxeBuilder({ page })
        // Base UI's empty tab guards redirect focus; keyboard tests cover their behavior.
        .exclude('[data-base-ui-focus-guard]')
        .analyze()
    ).violations,
  ).toEqual([]);
});
