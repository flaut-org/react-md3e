import { expect, test } from '@playwright/test';
import type { CDPSession } from '@playwright/test';

async function swipeLeft(client: CDPSession) {
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 300, y: 400 }] });

  for (const x of [260, 220, 180, 120, 50, 10]) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 400 }] });
  }

  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

test.describe('navigation drawer touch dismissal', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('touch drag dismisses from the content and reports swipe', async ({ page }) => {
    await page.goto('/navigation');
    await page.getByRole('button', { name: 'Open navigation drawer', exact: true }).click();

    const dialog = page.getByRole('dialog', { name: 'Modal destinations', exact: true });
    const client = await page.context().newCDPSession(page);

    await expect(dialog).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await swipeLeft(client);
    await expect(dialog).not.toBeVisible();
    await expect(page.getByTestId('drawer-close-reason')).toHaveText('swipe');
    await client.detach();
  });

  test('disableSwipe preserves the panel while keyboard dismissal still works', async ({ page }) => {
    await page.goto('/navigation');
    await page.getByLabel('Disable drawer swipe', { exact: true }).check();
    await page.getByRole('button', { name: 'Open navigation drawer', exact: true }).click();

    const dialog = page.getByRole('dialog', { name: 'Modal destinations', exact: true });
    const client = await page.context().newCDPSession(page);

    await expect(dialog).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await swipeLeft(client);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect(page.getByTestId('drawer-close-reason')).toHaveText('none');
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await client.detach();
  });
});
