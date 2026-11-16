import { expect, test } from '@playwright/test';

test('BottomSheet traps focus, restores its trigger and retains form state after close', async ({ page }) => {
  await page.goto('/essentials');

  const trigger = page.getByRole('button', { name: 'Open passengers', exact: true });

  await trigger.click();

  const sheet = page.getByRole('dialog', { name: 'Passengers', exact: true });
  const note = sheet.getByLabel('Passenger note', { exact: true });

  await expect(sheet).toHaveAttribute('aria-modal', 'true');
  await expect(note).toBeFocused();
  await note.fill('Retained edit');
  await sheet.getByRole('button', { name: 'Done passengers', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect.poll(() => sheet.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(sheet).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByTestId('sheet-reason')).toHaveText('escapeKeyDown');
  await trigger.click();
  await expect(note).toHaveValue('Retained edit');
  await sheet.getByRole('button', { name: 'Close sheet', exact: true }).click();
  await expect(sheet).not.toBeVisible();
  await expect(page.getByTestId('sheet-reason')).toHaveText('closeButtonClick');
});

test('BottomSheet composes nested panels and returns focus to the parent without dismissing it', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Open passengers', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Passengers', exact: true })
    .getByRole('button', { name: 'Nested settings', exact: true })
    .click();

  const nested = page.getByRole('dialog', { name: 'Nested settings', exact: true });

  await expect(nested).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(nested).not.toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Passengers', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nested settings', exact: true })).toBeFocused();
});

test('BottomSheet vetoes Escape/backdrop close, supports custom portals and compact viewports', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Protected passengers', exact: true }).click();

  const protectedSheet = page.getByRole('dialog', { name: 'Protected passengers', exact: true });

  await page.keyboard.press('Escape');
  await expect(protectedSheet).toBeVisible();
  await page
    .locator('[data-md3-sheet-backdrop]')
    .last()
    .click({ position: { x: 5, y: 5 }, force: true });
  await expect(protectedSheet).toBeVisible();
  await protectedSheet.getByRole('button', { name: 'Allow dismissal', exact: true }).click();
  await page
    .locator('[data-md3-sheet-backdrop]')
    .last()
    .click({ position: { x: 5, y: 5 }, force: true });
  await expect(protectedSheet).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Custom sheet', exact: true }).click();

  const sheet = page.getByTestId('sheet-custom-container').getByRole('dialog', { name: 'Custom sheet', exact: true });

  await expect(sheet).toBeVisible();
  await expect.poll(() => sheet.evaluate((node) => node.getBoundingClientRect().width)).toBe(390);
  await expect(sheet.locator('[data-md3-sheet-handle] > span')).toHaveCSS('width', '32px');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(sheet).toHaveCSS('transition-duration', '0s');
});

test('a drag on the BottomSheet handle dismisses with the swipe reason', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Open passengers', exact: true }).click();

  const sheet = page.getByRole('dialog', { name: 'Passengers', exact: true });
  const handle = sheet.locator('[data-md3-sheet-handle]');

  await expect(sheet).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  const box = (await handle.boundingBox())!;

  await page.mouse.move(box.x + box.width / 2, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, Math.min(840, box.y + 400), { steps: 12 });
  await page.mouse.up();
  await expect(sheet).not.toBeVisible();
  await expect(page.getByTestId('sheet-reason')).toHaveText('swipe');
});
