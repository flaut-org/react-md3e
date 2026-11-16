import { expect, test } from '@playwright/test';

test('breakpoints are CSS tokens in server HTML before JavaScript and nested scopes reset defaults', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:3100/breakpoints');
  await expect(page.getByTestId('custom-breakpoints')).toHaveCSS('--md-breakpoint-md', '1000px');
  await expect(page.getByTestId('default-breakpoints')).toHaveCSS('--md-breakpoint-md', '900px');
  await expect(page.getByTestId('css-breakpoints')).toHaveCSS('--md-breakpoint-md', '1080px');
  await context.close();
});

test('Dialog maxWidth follows every named theme breakpoint and preserves the MD3 default', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/breakpoints');

  const styleCount = await page.locator('style').count();

  for (const [name, widths] of [
    ['Default', { default: 560, xs: 444, sm: 600, md: 900, lg: 1200, xl: 1536, false: 1808 }],
    ['Custom', { default: 560, xs: 480, sm: 640, md: 1000, lg: 1280, xl: 1600, false: 1808 }],
    ['CSS', { sm: 720, md: 1080 }],
  ] as const) {
    for (const [width, expected] of Object.entries(widths)) {
      await page.getByLabel(`${name} maximum width`, { exact: true }).selectOption(width);
      await page.getByRole('button', { name: `Open ${name} width dialog`, exact: true }).click();

      const dialog = page.getByRole('alertdialog', { name: `${name} width dialog`, exact: true });

      await expect(dialog).toHaveCSS('opacity', '1');
      await expect(dialog).toHaveCSS('width', `${expected}px`);
      await dialog.getByRole('button', { name: 'Close width dialog' }).click();
      await expect(dialog).toHaveCount(0);
    }
  }

  expect(await page.locator('style').count()).toBe(styleCount);
});

test('CSS changes resize an open portalled Dialog; fullWidth, fullScreen and small viewports remain bounded', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('/breakpoints');
  await page.getByLabel('Custom maximum width', { exact: true }).selectOption('md');
  await page.getByRole('button', { name: 'Open Custom width dialog', exact: true }).click();

  const dialog = page.getByRole('alertdialog', { name: 'Custom width dialog', exact: true });

  await expect(dialog).toHaveCSS('width', '1000px');
  await page
    .getByTestId('custom-breakpoints')
    .evaluate((element) => element.style.setProperty('--md-breakpoint-md', '880px'));
  await expect(dialog).toHaveCSS('width', '880px');
  await page
    .getByTestId('custom-breakpoints')
    .evaluate((element) => element.style.setProperty('--md-breakpoint-md', '160px'));
  await expect(dialog).toHaveCSS('width', '160px');
  await page
    .getByTestId('custom-breakpoints')
    .evaluate((element) => element.style.setProperty('--md-breakpoint-md', '880px'));
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog).toHaveCSS('width', '342px');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await page.getByLabel('Custom full screen', { exact: true }).check();
  await page.getByRole('button', { name: 'Open Custom width dialog', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Custom width dialog' })).toHaveCSS('width', '390px');
  await page.keyboard.press('Escape');
  await page.getByLabel('Custom full screen', { exact: true }).uncheck();
  await page.getByLabel('Custom full width', { exact: true }).uncheck();
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.getByRole('button', { name: 'Open Custom width dialog', exact: true }).click();
  await expect(dialog).toHaveCSS('opacity', '1');
  expect((await dialog.boundingBox())!.width).toBeLessThan(880);
});
