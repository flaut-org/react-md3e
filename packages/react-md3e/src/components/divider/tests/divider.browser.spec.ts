import { expect, test } from '@playwright/test';

test('Divider exposes its axis, one-pixel boundary and MD3 middle insets', async ({ page }) => {
  await page.goto('/essentials');

  const horizontal = page.getByTestId('horizontal-divider');
  const vertical = page.getByTestId('vertical-divider');

  await expect(horizontal).toHaveAttribute('role', 'separator');
  await expect(horizontal).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(horizontal).toHaveCSS('height', '1px');
  await expect(horizontal).toHaveCSS('margin-inline-start', '16px');
  await expect(horizontal).toHaveCSS('margin-inline-end', '16px');
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
  await expect(vertical).toHaveCSS('width', '1px');
  expect((await vertical.boundingBox())!.height).toBeGreaterThan(15);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(vertical).toBeVisible();
});
