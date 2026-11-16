import { expect, test } from '@playwright/test';

test('radio group arrows select and skip disabled items while Space never clears selection', async ({ page }) => {
  await page.goto('/selection-controls');

  const group = page.getByRole('radiogroup', { name: 'Cabin', exact: true });
  const economy = group.getByRole('radio', { name: 'Economy' });
  const business = group.getByRole('radio', { name: 'Business' });

  await economy.focus();
  await page.keyboard.press('ArrowDown');
  await expect(business).toBeFocused();
  await expect(business).toBeChecked();
  await expect(economy).not.toBeChecked();
  await page.keyboard.press('Space');
  await expect(business).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(economy).toBeFocused();
  await expect(economy).toBeChecked();
  await expect(group.getByRole('radio', { name: 'First class' })).toBeDisabled();
  await expect(page.getByTestId('control-state')).toHaveText('false / economy');
});
test('group-level disabled/readOnly prevent both selection and ripple; enabled radios show ripple', async ({
  page,
}) => {
  await page.goto('/selection-controls');

  const disabled = page.getByRole('radio', { name: 'Disabled B' });
  const locked = page.getByRole('radio', { name: 'Read-only B' });

  await expect(disabled).toBeDisabled();
  await disabled.evaluate((node) => (node as HTMLElement).click());
  await locked.click();
  await locked.focus();
  await page.keyboard.press('Space');
  await expect(disabled).not.toBeChecked();
  await expect(locked).not.toBeChecked();
  await expect(locked.locator('[data-md3-ripple-ink]')).toHaveCount(0);

  const radio = page.getByRole('radio', { name: 'Business', exact: true });

  await radio.scrollIntoViewIfNeeded();

  const box = (await radio.boundingBox())!;

  await page.mouse.move(box.x + 24, box.y + 24);
  await page.mouse.down();
  await expect(radio.locator('[data-md3-ripple-ink]')).toHaveCount(1);
  await page.mouse.up();
  await expect(radio.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await radio.click();
  await expect(radio).toBeChecked();
  await expect(radio.locator('[data-md3-ripple-ink]')).toHaveCount(0);
});
