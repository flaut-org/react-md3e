import { expect, test } from '@playwright/test';

test('static list renders expressive line sizes, typography, media and segmented outer/inner corners', async ({
  page,
}) => {
  await page.goto('/lists');

  const list = page.getByTestId('static-list');
  const rows = list.getByRole('listitem');

  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toHaveCSS('height', '56px');
  await expect(rows.nth(1)).toHaveCSS('height', '72px');
  await expect(rows.nth(2)).toHaveCSS('height', '88px');
  await expect(rows.nth(0)).toHaveCSS('border-top-left-radius', '20px');
  await expect(rows.nth(1)).toHaveCSS('border-top-left-radius', '4px');
  await expect(rows.nth(2)).toHaveCSS('border-bottom-left-radius', '20px');
  await expect(rows.nth(1).locator('[data-leading-kind="avatar"]')).toHaveCSS('width', '40px');
  await expect(rows.nth(0).locator('[data-md3-list-primary]')).toHaveCSS('font-size', '16px');
  await expect(rows.nth(0).locator('[data-md3-list-primary]')).toHaveCSS('font-family', 'Arial, sans-serif');
  await expect(page.getByTestId('standard-list').getByRole('listitem').first()).toHaveCSS('border-radius', '0px');
  await expect(list.getByRole('button')).toHaveCount(0);
});
