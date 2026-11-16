import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-org/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });

const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

const container = '[data-md3-icon-button-container]';

test('AppBar and IconButton render styled HTML before JavaScript and work in streamed content', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const serverPage = await context.newPage();

    await serverPage.goto('http://127.0.0.1:3100/components');
    await expect(serverPage.getByTestId('server-app-bar')).toHaveCSS('height', '64px');
    await expect(serverPage.getByTestId('icon-filled').locator(container)).toHaveCSS(
      'background-color',
      rgb(forest.schemes.light.primary),
    );
  } finally {
    await context.close();
  }

  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/streaming', { waitUntil: 'commit' });
  await expect(page.getByTestId('streaming-app-bar')).toHaveCSS('height', '64px');
  await expect(page.getByRole('button', { name: 'Streamed icon' }).locator(container)).toHaveCSS('height', '40px');
  await page.goto('/components');
  await page.getByRole('link', { name: 'Check request-time streaming' }).click();
  await expect(page.getByRole('button', { name: 'Streamed icon' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('Storybook exposes themed IconButton, toggle and sticky AppBar examples', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-iconbutton--playground&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await expect(page.getByRole('button', { name: 'Favorite' }).locator(container)).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.primary),
  );
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-iconbutton--toggle&viewMode=story');
  await page.getByRole('button', { name: 'Favorite' }).click();
  await expect(page.getByRole('button', { name: 'Favorite' })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-appbar--sticky&viewMode=story');

  const bar = page.locator('[data-md3-app-bar]');

  await expect(bar).toHaveCSS('position', 'sticky');
  await page.locator('.story-scroll').evaluate((element) => {
    element.scrollTo({ top: 100 });
  });
  await expect(bar).toHaveAttribute('data-scrolled', 'true');
});

test('new component examples have accessible names and pass automated accessibility checks', async ({ page }) => {
  await page.goto('/components');
  await expect(page.getByRole('button', { name: 'Externally named icon' })).toBeVisible();

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
});
