import { expect, test } from '@playwright/test';

test('Collapsible exposes disclosure semantics and retains mounted state without closed focus targets', async ({
  page,
}) => {
  await page.goto('/essentials');

  const trigger = page.getByRole('button', { name: 'Travel details', exact: true });
  const note = page.getByLabel('Retained travel note', { exact: true });

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(note).not.toBeVisible();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: 'Travel details' })).toBeVisible();
  await note.fill('Remembered note');
  await trigger.click();
  await expect(note).not.toBeVisible();
  await trigger.press('Tab');
  await expect(note).not.toBeFocused();
  await trigger.click();
  await expect(note).toHaveValue('Remembered note');
});

test('Collapsible measures its content, animates height and reduces motion', async ({ page }) => {
  await page.goto('/essentials');

  const root = page.locator('[data-md3-collapsible]').first();
  const panel = root.locator('[data-md3-collapsible-panel]');

  await page.getByRole('button', { name: 'Travel details', exact: true }).click();
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS('transition-duration', '0.4s, 0.15s');
  await expect.poll(() => panel.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThan(80);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(panel).toHaveCSS('transition-duration', '0s');
});

test('controlled disclosure changes can be vetoed and disabled triggers cannot expand', async ({ page }) => {
  await page.goto('/essentials');

  const locked = page.getByRole('button', { name: 'Locked disclosure', exact: true });

  await locked.click();
  await expect(locked).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Protected details', { exact: true })).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Disabled disclosure', exact: true })).toBeDisabled();
});
