import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import type { FabColor } from '@flaut-travel/react-md3e/fab';

const sizes = [
  { size: 'regular', height: 56, radius: '16px', icon: '24px' },
  { size: 'medium', height: 80, radius: '20px', icon: '28px' },
  { size: 'large', height: 96, radius: '28px', icon: '36px' },
] as const;
const colors: readonly FabColor[] = [
  'primaryContainer',
  'secondaryContainer',
  'tertiaryContainer',
  'primary',
  'secondary',
  'tertiary',
  'surface',
];
const theme = createTheme({ sourceColor: '#6750a4' });

function rgb(hex: string) {
  return `rgb(${hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => parseInt(channel, 16))
    .join(', ')})`;
}

test('floating actions render styled in RSC without JavaScript and in streamed content', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/fabs');
    await expect(server.getByTestId('server-fab')).toHaveCSS('width', '56px');
    await expect(server.getByTestId('server-fab')).toHaveCSS('border-radius', '16px');
    await expect(server.getByTestId('server-extended-fab')).toHaveCSS('height', '56px');
    await expect(server.getByTestId('server-fab-menu').getByRole('button')).toHaveAttribute('aria-haspopup', 'menu');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('button', { name: 'Streamed floating action', exact: true })).toHaveCSS('width', '56px');
  await expect(page.getByRole('button', { name: 'Streamed extended action', exact: true })).toHaveCSS('height', '56px');
  await page.getByRole('button', { name: 'Streamed create actions', exact: true }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Streamed document', exact: true })).toBeFocused();
});

test('FAB follows current size, icon, shape and explicit MD3 color roles', async ({ page }) => {
  await page.goto('/fabs');

  for (const color of colors) {
    for (const { size, height, radius, icon } of sizes) {
      const fab = page.getByTestId(`fab-${color}-${size}`);
      const role = color === 'surface' ? 'surfaceContainerHigh' : color;

      await expect(fab).toHaveCSS('width', `${height}px`);
      await expect(fab).toHaveCSS('height', `${height}px`);
      await expect(fab).toHaveCSS('border-radius', radius);
      await expect(fab.locator('svg')).toHaveCSS('width', icon);
      await expect(fab).toHaveCSS('background-color', rgb(theme.schemes.light[role]));
    }
  }

  const small = page.getByTestId('legacy-small-fab');

  await expect(small).toHaveCSS('width', '40px');
  await expect(small).toHaveCSS('border-radius', '12px');
  expect(await small.evaluate((element) => getComputedStyle(element, '::after').left)).toBe('-4px');
  expect(await small.evaluate((element) => getComputedStyle(element, '::after').top)).toBe('-4px');
});

test('native submit buttons, links, disabled links and forwarded refs retain Button behavior', async ({ page }) => {
  await page.goto('/fabs');
  await page.getByRole('button', { name: 'Submit floating action', exact: true }).click();
  await expect(page.getByTestId('fab-submission')).toHaveText('fab');
  await page.getByRole('button', { name: 'Submit extended action', exact: true }).click();
  await expect(page.getByTestId('fab-submission')).toHaveText('extended');
  await page.getByRole('button', { name: 'Focus floating action', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Submit floating action', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Focus extended action', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Submit extended action', exact: true })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Open floating destination' })).toHaveAttribute(
    'href',
    '/fabs?from=fab#fab-form',
  );
  await expect(page.getByRole('link', { name: 'Open extended destination' })).toHaveAttribute(
    'href',
    '/fabs?from=extended#fab-form',
  );

  const disabled = page.getByRole('link', { name: 'Unavailable floating destination' });

  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect(disabled).not.toHaveAttribute('href');
  await expect(disabled).toHaveAttribute('tabindex', '-1');
});

test('elevation responds to hover while the FAB shape stays stable on press', async ({ page }) => {
  await page.goto('/fabs');

  const fab = page.getByTestId('fab-primaryContainer-regular');
  const lowered = page.getByTestId('lowered-fab');
  const restingShadow = await fab.evaluate((element) => getComputedStyle(element).boxShadow);
  const loweredShadow = await lowered.evaluate((element) => getComputedStyle(element).boxShadow);

  expect(restingShadow).not.toBe(loweredShadow);
  await fab.hover();
  await expect.poll(() => fab.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(restingShadow);
  await page.mouse.down();
  await expect(fab).toHaveCSS('border-radius', '16px');
  await page.mouse.up();
  await lowered.hover();
  await expect.poll(() => lowered.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(loweredShadow);
});

test('floating action gallery has accessible names and visible focus in forced colors', async ({ page }) => {
  await page.goto('/fabs');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });

  const fab = page.getByTestId('server-fab');

  await fab.focus();
  await expect(fab).toHaveCSS('outline-style', 'solid');
  await expect(fab).toHaveCSS('outline-width', '3px');
});
