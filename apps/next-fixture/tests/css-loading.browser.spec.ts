import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

test('a direct page load receives only its declared styles before JavaScript runs', async ({ browser, baseURL }) => {
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
