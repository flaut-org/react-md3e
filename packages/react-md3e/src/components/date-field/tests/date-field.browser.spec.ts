import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/date-pickers');
});

test('invalid and incomplete raw entry survives controlled synchronization and deletion', async ({ page }) => {
  const field = page.getByRole('textbox', { name: 'Leap date', exact: true });

  for (const value of ['02/31/2024', '02/29/2023', '12/32/2024', '13/01/2024', '02/2']) {
    await field.fill(value);
    await expect(field).toHaveValue(value === '02/2' ? '02/2/yyyy' : value);
    await expect(field).toHaveAttribute('aria-invalid', 'true');
  }

  await field.fill('02/29/2024');
  await expect(field).not.toHaveAttribute('aria-invalid', 'true');
  await field.fill('');
  await expect(field).toHaveValue('mm/dd/yyyy');
  await page.getByRole('heading', { name: 'Material date pickers' }).click();
  await expect(field).toHaveValue('');
  await expect(field).not.toHaveAttribute('aria-invalid', 'true');
});

test('locale, explicit formats, bounds and coarse/custom restrictions validate text', async ({ page }) => {
  const bounded = page.getByRole('textbox', { name: 'Bounded date', exact: true });

  for (const value of ['02/09/2024', '03/21/2024', '02/24/2024']) {
    await bounded.fill(value);
    await expect(bounded).toHaveAttribute('aria-invalid', 'true');
  }

  await bounded.fill('02/29/2024');
  await expect(bounded).not.toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Past restriction', { exact: true }).fill('02/28/2024');
  await expect(page.getByLabel('Past restriction', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Future restriction', { exact: true }).fill('03/01/2024');
  await expect(page.getByLabel('Future restriction', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Ukrainian date')).toHaveValue('29.02.2024');
  await page.getByLabel('Ukrainian date').fill('31.02.2024');
  await expect(page.getByText('Введіть коректну дату. DD.MM.YYYY')).toBeVisible();
  await page.getByLabel('ISO format').fill('2024-02-29');
  await expect(page.getByLabel('ISO format')).not.toHaveAttribute('aria-invalid', 'true');
});

test('section arrows edit valid dates and native paste/replacement remains available', async ({ page, context }) => {
  const field = page.getByLabel('Leap date', { exact: true });

  await field.focus();
  await field.evaluate((node: HTMLInputElement) => node.setSelectionRange(3, 5));
  await field.press('ArrowUp');
  await expect(field).toHaveValue('02/30/2024');
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await field.evaluate((node: HTMLInputElement) => node.setSelectionRange(3, 5));
  await field.press('ArrowDown');
  await expect(field).toHaveValue('02/29/2024');
  await field.evaluate((node: HTMLInputElement) => node.setSelectionRange(6, 10));
  await field.press('ArrowUp');
  await expect(field).toHaveValue('02/29/2025');
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate(() => navigator.clipboard.writeText('02/29/2024'));
  await field.press('ControlOrMeta+A');
  await field.press('ControlOrMeta+V');
  await expect(field).toHaveValue('02/29/2024');
  await expect(field).not.toHaveAttribute('aria-invalid', 'true');
});

test('native form submission uses ISO names, blocks invalid entry, and reset restores defaults', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit dates' }).click();
  await expect(page.getByTestId('date-form-result')).toHaveText(
    '{"departure":"2024-02-29","trip.start":"2024-02-29","trip.end":"2024-03-10","birthday":"2024-02-29"}',
  );
  await page.getByRole('textbox', { name: 'Form field', exact: true }).fill('02/31/2024');
  expect(
    await page
      .getByRole('textbox', { name: 'Form field', exact: true })
      .evaluate((node: HTMLInputElement) => node.checkValidity()),
  ).toBe(false);
  await page.getByRole('textbox', { name: 'Form date', exact: true }).fill('03/01/2024');
  await page.getByRole('button', { name: 'Reset dates' }).click();
  await expect(page.getByRole('textbox', { name: 'Form date', exact: true })).toHaveValue('02/29/2024');
  await expect(page.getByRole('textbox', { name: 'Form field', exact: true })).toHaveValue('02/29/2024');
});
