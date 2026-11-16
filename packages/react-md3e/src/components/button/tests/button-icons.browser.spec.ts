import { expect, test } from '@playwright/test';

test('both decorative icons retain logical order, dimensions, and the accessible label in RTL', async ({ page }) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: 'Count clicks', exact: true });
  const start = button.locator('[data-md3-icon="start"]');
  const end = button.locator('[data-md3-icon="end"]');

  await expect(start).toHaveAttribute('aria-hidden', 'true');
  await expect(end).toHaveAttribute('aria-hidden', 'true');
  await expect(start).toHaveCSS('width', '20px');
  await expect(end).toHaveCSS('width', '20px');
  expect((await start.boundingBox())!.x).toBeLessThan((await end.boundingBox())!.x);
  await button.evaluate((element) => element.setAttribute('dir', 'rtl'));
  expect((await start.boundingBox())!.x).toBeGreaterThan((await end.boundingBox())!.x);
  await end.click();
  await expect(page.getByTestId('click-count')).toHaveText('1');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-button--trailing-icon&viewMode=story');
  await expect(
    page.getByRole('button', { name: 'Continue', exact: true }).locator('[data-md3-icon="end"]'),
  ).toBeVisible();
});
