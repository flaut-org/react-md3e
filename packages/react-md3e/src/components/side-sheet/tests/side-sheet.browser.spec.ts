import { expect, test } from '@playwright/test';

test('SideSheet preserves theme, forwards refs and lets Autocomplete consume its first Escape', async ({ page }) => {
  await page.goto('/essentials');

  const trigger = page.getByRole('button', { name: 'Open settings', exact: true });

  await trigger.click();

  const sheet = page.getByRole('dialog', { name: 'Travel settings', exact: true });

  await expect(sheet).toHaveCSS('width', '360px');
  await sheet.getByRole('button', { name: 'Check sheet ref', exact: true }).click();
  await expect(sheet).toHaveAttribute('data-ref-checked', 'true');

  const input = sheet.getByRole('combobox', { name: 'Settings destination', exact: true });

  await input.click();
  await expect(page.getByRole('listbox', { name: 'Settings destination', exact: true })).toBeVisible();
  await input.press('Escape');
  await expect(page.getByRole('listbox', { name: 'Settings destination', exact: true })).not.toBeVisible();
  await expect(sheet).toBeVisible();
  await input.press('Escape');
  await expect(sheet).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('logical side placement follows RTL, and portal scopes inherit dark colors', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'RTL settings', exact: true }).click();

  const rtl = page.getByRole('dialog', { name: 'RTL settings', exact: true });

  await expect(rtl).toHaveAttribute('data-edge', 'left');
  await expect(rtl).toHaveCSS('direction', 'rtl');
  await expect.poll(() => rtl.evaluate((node) => Math.round(node.getBoundingClientRect().left))).toBe(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Dark settings', exact: true }).click();

  const dark = page.getByTestId('dark-sheet-theme').getByRole('dialog', { name: 'Dark settings', exact: true });

  await expect(dark).toBeVisible();
  await expect(dark).toHaveCSS('color-scheme', 'dark');
});

test('standard SideSheet stays in layout without trapping focus or dismissing on outside interaction', async ({
  page,
}) => {
  await page.goto('/essentials');

  const sheet = page.getByRole('complementary', { name: 'Inline settings', exact: true });

  await expect(sheet).toBeVisible();
  await expect(sheet).not.toHaveAttribute('aria-modal', 'true');
  await expect(sheet).toHaveCSS('position', 'relative');
  expect(await sheet.evaluate((node) => node.closest('section')?.querySelector('h2')?.textContent)).toBe(
    'Standard sheet',
  );
  expect(await sheet.evaluate((node) => node.closest('[data-md3-theme]') !== null)).toBe(true);
  await page.getByRole('button', { name: 'Outside standard sheet', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Outside standard sheet', exact: true })).toBeFocused();
  await expect(sheet).toBeVisible();
  await sheet.getByRole('button', { name: 'Close sheet', exact: true }).click();
  await expect(sheet).not.toBeVisible();
});

test('standard sheet keyboard focus enters and leaves in document order', async ({ page }) => {
  await page.goto('/essentials');

  const outside = page.getByRole('button', { name: 'Outside standard sheet', exact: true });
  const field = page.getByLabel('Inline setting', { exact: true });

  await outside.focus();
  await outside.press('Shift+Tab');
  await expect(field).toBeFocused();
  await field.press('Tab');
  await expect(outside).toBeFocused();
});

test('standard sheets stay within their parent width on compact screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/essentials');

  const sheet = page.getByRole('complementary', { name: 'Inline settings', exact: true });

  await expect(sheet).toBeVisible();
  expect(
    await sheet.evaluate(
      (node) => node.getBoundingClientRect().width <= node.closest('section')!.getBoundingClientRect().width,
    ),
  ).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
