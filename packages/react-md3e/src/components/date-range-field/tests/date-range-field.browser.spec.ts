import { expect, test } from '@playwright/test';

test('single and multi fields retain partial/reversed ranges and recover without reordering', async ({ page }) => {
  await page.goto('/date-pickers');

  const single = page.getByLabel('Range field', { exact: true });

  await single.fill('02/29/2024 – ');
  await expect(single).toHaveValue('02/29/2024 – mm/dd/yyyy');
  await expect(single).toHaveAttribute('aria-invalid', 'true');
  await single.fill('03/01/2024 – 02/29/2024');
  await expect(single).toHaveValue('03/01/2024 – 02/29/2024');
  await expect(single).toHaveAttribute('aria-invalid', 'true');
  await single.fill('02/29/2024 – 02/29/2024');
  await expect(single).not.toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Start field', { exact: true }).fill('12/31/2024');
  await page.getByLabel('End field', { exact: true }).fill('01/01/2025');
  await expect(page.getByLabel('Start field', { exact: true })).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('End field', { exact: true })).toHaveValue('01/01/2025');
});
