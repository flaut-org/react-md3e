import { expect, test } from '@playwright/test';

test('docked range selects across months, accepts endpoints and edits an existing range', async ({ page }) => {
  await page.goto('/date-pickers');
  await page
    .getByLabel('Docked range', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button', { name: /Choose date range/ })
    .click();

  const popup = page.getByRole('dialog');

  await popup.locator('[data-calendar-current] button[data-date="2024-02-29"][data-outside="false"]').click();
  await expect(popup).toBeVisible();
  await popup.locator('[data-calendar-current] button[data-date="2024-03-10"][data-outside="false"]').click();
  await expect(popup).toBeHidden();
  await expect(page.getByLabel('Docked range', { exact: true })).toHaveValue('02/29/2024 – 03/10/2024');
  await expect(page.getByTestId('range-accepted')).toHaveText('2024-02-29/2024-03-10');
});

test('modal range input validates reversed/incomplete dates and preserves the last accepted range on cancel', async ({
  page,
}) => {
  await page.goto('/date-pickers');

  const input = page.getByLabel('Modal range', { exact: true });
  const opener = input
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button', { name: /Choose date range/ });

  await opener.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Switch to text input', exact: true }).click();

  const modal = page.getByRole('dialog');

  // The mode switch deliberately hands focus to the first field on the next animation frame.
  await expect(modal.getByLabel('Start date', { exact: true })).toBeFocused();
  await modal.getByLabel('Start date', { exact: true }).fill('12/31/2024');
  await modal.getByLabel('End date', { exact: true }).fill('12/30/2024');
  await expect(modal.getByLabel('Start date', { exact: true })).toHaveValue('12/31/2024');
  await expect(modal.getByLabel('End date', { exact: true })).toHaveValue('12/30/2024');
  await expect(modal.getByRole('button', { name: 'OK', exact: true })).toBeDisabled();
  await modal.getByLabel('End date', { exact: true }).fill('01/01/2025');
  await expect(modal.getByRole('button', { name: 'OK', exact: true })).toBeEnabled();
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(input).toHaveValue('02/27/2024 – 03/04/2024');
  await opener.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Switch to text input', exact: true }).click();
  await expect(modal.getByLabel('Start date', { exact: true })).toBeFocused();
  await page.getByRole('dialog').getByLabel('Start date', { exact: true }).fill('12/31/2024');
  await page.getByRole('dialog').getByLabel('End date', { exact: true }).fill('01/01/2025');
  await expect(modal.getByLabel('Start date', { exact: true })).toHaveValue('12/31/2024');
  await expect(modal.getByLabel('End date', { exact: true })).toHaveValue('01/01/2025');
  await expect(modal.getByRole('button', { name: 'OK', exact: true })).toBeEnabled();
  await page.getByRole('dialog').getByRole('button', { name: 'OK', exact: true }).click();
  await expect(input).toHaveValue('12/31/2024 – 01/01/2025');
  await expect(page.getByTestId('range-accepted')).toHaveText('2024-12-31/2025-01-01');
});

test('compact modal range fills the viewport with scrollable months and persistent actions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await page.goto('/date-pickers');
  await page
    .getByLabel('Modal range', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button', { name: /Choose date range/ })
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toHaveAttribute('data-full-screen', 'true');
  await expect(modal.getByRole('grid')).toHaveCount(3);
  await expect(modal.getByRole('button', { name: 'OK', exact: true })).toBeInViewport();
  await modal.locator('[data-calendar-current] button[data-date="2024-02-27"]').focus();
  await page.keyboard.press('PageDown');
  await expect(modal.locator('[data-calendar-current] button[data-date="2024-03-27"]')).toBeFocused();
  await expect(modal.locator('[data-calendar-current] button[data-date="2024-03-27"]')).toBeInViewport();
  await modal.locator('[data-picker-content]').evaluate((node) => {
    node.scrollTo({ top: node.scrollHeight });
  });
  await expect(modal.getByRole('grid').last()).toBeInViewport();
  await expect(modal.getByRole('button', { name: 'Cancel', exact: true })).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
});

test('modal month windows clamp out-of-bounds references and report actual navigation', async ({ page }) => {
  await page.goto('/date-pickers');
  await page
    .getByLabel('Bounded range', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal.getByRole('grid').first()).toHaveAccessibleName('February 2024');
  await expect(modal.getByRole('button', { name: 'Next months', exact: true })).toBeDisabled();
  await modal.getByRole('button', { name: 'Previous months', exact: true }).click();
  await expect(modal.getByRole('grid').first()).toHaveAccessibleName('January 2024');
  await expect(modal.getByRole('button', { name: 'Previous months', exact: true })).toBeDisabled();
  await expect(page.getByTestId('range-month')).toHaveText('2024-01-01');
});
