import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const material = createTheme();
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((value) => parseInt(value, 16))
    .join(', ')})`;

test('server and static themes control Button color, typography, shape, size, and system mode', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');

  const button = page.getByTestId('server-button');

  await expect(button).toHaveCSS('background-color', rgb(forest.schemes.light.primary));
  await expect(button).toHaveCSS('font-family', 'Arial, sans-serif');
  await expect(button).toHaveCSS('border-radius', '18px');
  await expect(page.getByTestId('custom-dark').getByRole('button')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.primary),
  );
  await expect(page.getByTestId('nested-dark').getByRole('button')).toHaveCSS(
    'background-color',
    rgb(material.schemes.dark.primary),
  );
  await expect(page.getByTestId('static-theme').getByRole('button')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.light.primary),
  );

  for (const [size, height] of [
    ['extraSmall', 32],
    ['small', 40],
    ['medium', 56],
    ['large', 96],
    ['extraLarge', 136],
  ] as const) {
    await expect(page.getByTestId('size-examples').getByRole('button', { name: size, exact: true })).toHaveCSS(
      'height',
      `${height}px`,
    );
  }

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.getByTestId('system-theme').getByRole('button')).toHaveCSS(
    'background-color',
    rgb(material.schemes.dark.primary),
  );
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.getByTestId('system-theme').getByRole('button')).toHaveCSS(
    'background-color',
    rgb(material.schemes.light.primary),
  );
  expect(errors).toEqual([]);
});

test('native keyboard, disabled, toggle, and form semantics work without inserting styles', async ({ page }) => {
  await page.goto('/');

  const styles = await page.locator('style').count();
  const clicker = page.getByRole('button', { name: 'Count clicks' });

  await clicker.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(page.getByTestId('click-count')).toHaveText('2');

  const disabled = page.getByRole('button', { name: 'Disabled action' });

  await expect(disabled).toBeDisabled();
  await disabled.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(page.getByTestId('click-count')).toHaveText('2');

  const toggle = page.getByRole('button', { name: 'Favorite' });

  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveCSS('border-radius', '12px');
  await page.getByRole('button', { name: 'Normal button' }).click();
  await expect(page.getByTestId('submission-count')).toHaveText('0');
  await page.getByRole('button', { name: 'Submit form' }).click();
  await expect(page.getByTestId('submission-count')).toHaveText('1');
  await page.getByRole('button', { name: 'Change color scheme' }).click();
  await expect(clicker).toHaveCSS('background-color', rgb(material.schemes.dark.primary));
  expect(await page.locator('style').count()).toBe(styles);
});

test('compiled styles are available in streamed fallback and after client navigation', async ({ page }) => {
  await page.goto('/streaming', { waitUntil: 'commit' });
  await expect(page.locator('[data-fixture="streaming-loading"]').getByRole('button')).toHaveCSS('height', '40px');
  await expect(page.getByRole('button', { name: 'Streamed action' })).toHaveCSS(
    'background-color',
    rgb(material.schemes.dark.primary),
  );
  await page.goto('/');
  await page.getByRole('link', { name: 'Check request-time streaming' }).click();
  await expect(page.getByRole('button', { name: 'Streamed action' })).toHaveCSS('height', '40px');
});

test('Storybook renders built Button with precomputed theme globals', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-button--playground&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await expect(page.getByRole('button', { name: 'Get started' })).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.primary),
  );
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-button--toggle&viewMode=story');
  await page.getByRole('button', { name: 'Favorite' }).click();
  await expect(page.getByRole('button', { name: 'Favorite' })).toHaveAttribute('aria-pressed', 'true');
});

test('Button demonstrations pass accessibility checks and respect reduced motion', async ({ page }) => {
  await page.goto('/');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByTestId('server-button')).toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('server-button')).toBeVisible();
});
