import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

test('a direct page load receives automatic styles before JavaScript runs', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, ...(baseURL ? { baseURL } : {}) });
  const page = await context.newPage();
  const css: string[] = [];

  page.on('response', (response) => {
    if (response.request().resourceType() === 'stylesheet') {
      css.push(response.url());
    }
  });

  await page.goto('/');

  const button = page.getByTestId('server-button');

  await expect(button).toHaveCSS('border-radius', '18px');

  const channels = createTheme({ sourceColor: '#386a20' })
    .schemes.light.primary.slice(1)
    .match(/.{2}/g)!
    .map((value) => Number.parseInt(value, 16));

  await expect(button).toHaveCSS('background-color', `rgb(${channels.join(', ')})`);

  const styles = await Promise.all(css.map(async (url) => (await context.request.get(url)).text()));

  expect(styles.join('\n')).not.toContain('data-morph');
  await context.close();
});

for (const route of [
  '/automatic-css',
  '/automatic-css/subpath',
  'http://127.0.0.1:3200/root/',
  'http://127.0.0.1:3200/subpath/',
]) {
  for (const javaScriptEnabled of [false, true]) {
    test(`${route} loads only Button/Checkbox styles (JavaScript ${javaScriptEnabled})`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled, ...(baseURL ? { baseURL } : {}) });
      const page = await context.newPage();
      const errors: string[] = [];

      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(route);

      await expect(page.getByTestId('automatic-button')).toHaveCSS('border-radius', '20px');
      await expect(page.getByTestId('automatic-button')).toHaveCSS('height', '40px');
      await expect(page.locator('[data-md3-theme]')).toHaveCSS('color-scheme', 'light');
      await expect(page.locator('[data-indicator="checkbox"]')).toHaveCSS('width', '18px');
      await expect(page.locator('[data-indicator="checkbox"]')).toHaveCSS('background-color', 'rgb(101, 87, 137)');
      await expect(page.locator('[data-md3-button-loading]')).toHaveCSS('display', 'grid');

      if (javaScriptEnabled) {
        const before = await page.locator('style').count();

        await page.getByRole('checkbox').uncheck();
        await expect(page.getByRole('checkbox')).not.toBeChecked();
        await expect(page.locator('style')).toHaveCount(before);
        expect(errors).toEqual([]);

        const rules = await page.evaluate(() =>
          Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText)),
        );

        expect(rules.filter((rule, i) => rules.indexOf(rule) !== i)).toEqual([]);
      }

      await context.close();
    });
  }
}

test('a Vite dynamic component receives its stylesheet before rendering', async ({ page }) => {
  await page.goto('http://127.0.0.1:3200/lazy/');
  await expect(page.getByTestId('automatic-button')).toHaveCSS('height', '40px');
});

test('server-only components receive automatic CSS with browser JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, ...(baseURL ? { baseURL } : {}) });
  const page = await context.newPage();

  await page.goto('/automatic-css/server');
  await expect(page.getByTestId('automatic-surface')).toHaveCSS('border-radius', '12px');
  await expect(page.getByTestId('automatic-typography')).toHaveCSS('font-size', '22px');
  await expect(page.locator('[data-md3-theme]')).toHaveCSS('color-scheme', 'light');
  await context.close();
});

test('a single root import loads its CSS and token fallbacks without ThemeProvider', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:3200/button/');
  await expect(page.getByTestId('automatic-button')).toHaveCSS('height', '40px');
  await expect(page.getByTestId('automatic-button')).toHaveCSS('background-color', 'rgb(101, 87, 137)');
  await context.close();
});
