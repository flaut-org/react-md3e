import { expect, test } from '@playwright/test';

test('Snackbar announces without taking focus, supports actions and close reasons', async ({ page }) => {
  await page.goto('/essentials');

  const trigger = page.getByRole('button', { name: 'Show notification', exact: true });

  await trigger.click();

  const notice = page.locator('[data-md3-snackbar]').filter({ hasText: 'Travel preferences saved' });

  await expect(notice).toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(
    page.getByRole('region', { name: 'Notifications', exact: true }).filter({ has: notice }),
  ).toHaveAttribute('aria-live', 'polite');
  await notice.getByRole('button', { name: 'Close notification', exact: true }).click();
  await expect(notice).not.toBeVisible();
  await expect(page.getByTestId('notice-reason')).toHaveText('closeButtonClick');
  await trigger.click();
  await notice.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(notice).not.toBeVisible();
});

test('Snackbar pauses its remaining timeout on hover and focus, then reports timeout', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Show timed notification', exact: true }).click();

  const notice = page.locator('[data-md3-snackbar]').filter({ hasText: 'Timed notification' });

  await expect(notice).toBeVisible();
  await notice.hover();
  await page.waitForTimeout(1400);
  await expect(notice).toBeVisible();
  await notice.getByRole('button', { name: 'Close notification', exact: true }).focus();
  await page.getByRole('heading', { level: 1 }).hover();
  await page.waitForTimeout(1400);
  await expect(notice).toBeVisible();
  await page.getByRole('button', { name: 'Show notification', exact: true }).focus();
  await expect(notice).not.toBeVisible({ timeout: 3000 });
  await expect(page.getByTestId('notice-reason')).toHaveText('timeout');
});

test('Snackbar Escape and close actions respect controlled dismissal vetoes', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Show protected notification', exact: true }).click();

  const notice = page.locator('[data-md3-snackbar]').filter({ hasText: 'Protected notification' });
  const close = notice.getByRole('button', { name: 'Close notification', exact: true });

  await close.click();
  await expect(notice).toBeVisible();
  await close.press('Escape');
  await expect(notice).toBeVisible();
  await page.getByRole('button', { name: 'Hide protected notification', exact: true }).click();
  await expect(notice).not.toBeVisible();
  await page.getByRole('button', { name: 'Show notification', exact: true }).click();

  const ordinary = page.locator('[data-md3-snackbar]').filter({ hasText: 'Travel preferences saved' });

  await ordinary.getByRole('button', { name: 'Close notification', exact: true }).press('Escape');
  await expect(ordinary).not.toBeVisible();
  await expect(page.getByTestId('notice-reason')).toHaveText('escapeKeyDown');
});
