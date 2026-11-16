import { expect, test } from '@playwright/test';

test('selectOnFocus selects existing text without mouse-up collapsing the selection', async ({ page }) => {
  await page.goto('/essentials');

  const input = page.getByRole('combobox', { name: 'Clearable destination', exact: true });

  await input.click();
  expect(
    await input.evaluate((node) => [
      (node as HTMLInputElement).selectionStart,
      (node as HTMLInputElement).selectionEnd,
    ]),
  ).toEqual([0, 4]);
  await input.press('p');
  await expect(input).toHaveValue('p');
});

test('Escape closes options first, then clears only when clearOnEscape is enabled', async ({ page }) => {
  await page.goto('/essentials');

  const input = page.getByRole('combobox', { name: 'Clearable destination', exact: true });

  await input.click();
  await expect(page.getByRole('listbox', { name: 'Clearable destination', exact: true })).toBeVisible();
  await input.press('Escape');
  await expect(input).toHaveValue('Rome');
  await input.press('Escape');
  await expect(input).toHaveValue('');
  await expect(page.getByTestId('autocomplete-clear-reason')).toHaveText('clear');

  const preserved = page.getByRole('combobox', { name: 'Preserved destination', exact: true });

  await preserved.focus();
  await preserved.press('Escape');
  await expect(preserved).toHaveValue('Rome');
});

test('a closed Autocomplete preserves selection and allows its parent Dialog to receive Escape', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Open autocomplete dialog', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Destination editor', exact: true });
  const input = dialog.getByRole('combobox', { name: 'Dialog preserved city', exact: true });

  await input.focus();
  await input.press('Escape');
  await expect(dialog).not.toBeVisible();
});
