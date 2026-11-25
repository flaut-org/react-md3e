import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });

const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('AppBar follows theme typography, expressive heights, scrolled elevation, RTL, and wrapping', async ({ page }) => {
  await page.goto('/components');

  const bar = page.getByTestId('server-app-bar');

  await expect(bar).toHaveCSS('background-color', rgb(forest.schemes.light.surface));
  await expect(bar).toHaveCSS('position', 'static');
  await expect(bar.getByRole('button', { name: 'Navigation' })).toHaveCSS('color', rgb(forest.schemes.light.onSurface));
  await expect(bar.getByRole('button', { name: 'More', exact: true })).toHaveCSS(
    'color',
    rgb(forest.schemes.light.onSurfaceVariant),
  );

  for (const [id, height] of [
    ['small', 64],
    ['small-subtitle', 64],
    ['mediumFlexible', 112],
    ['mediumFlexible-subtitle', 136],
    ['largeFlexible', 120],
    ['largeFlexible-subtitle', 152],
  ] as const) {
    await expect(page.getByTestId(`bar-${id}`)).toHaveCSS('height', `${height}px`);
  }

  await expect(page.getByTestId('bar-mediumFlexible').locator('[data-md3-app-bar-title]')).toHaveCSS(
    'font-family',
    'Georgia, serif',
  );
  await expect(page.getByTestId('bar-mediumFlexible').locator('[data-md3-app-bar-title]')).toHaveCSS(
    'font-size',
    '28px',
  );
  await expect(page.getByTestId('scrolled-bar')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.light.surfaceContainer),
  );
  await expect(page.getByTestId('scrolled-bar')).not.toHaveCSS('box-shadow', 'none');

  const centered = page.getByTestId('centered-bar');
  const centeredBox = (await centered.boundingBox())!;
  const titleBox = (await centered.locator('[data-md3-app-bar-title]').boundingBox())!;

  expect(titleBox.x + titleBox.width / 2).toBeCloseTo(centeredBox.x + centeredBox.width / 2, 0);

  const rtl = page.getByTestId('rtl-bar');

  expect((await rtl.getByRole('button', { name: 'Navigation' }).boundingBox())!.x).toBeGreaterThan(
    (await rtl.getByRole('button', { name: 'More', exact: true }).boundingBox())!.x,
  );
  await page.setViewportSize({ width: 320, height: 800 });

  const wrapping = page.getByTestId('wrapping-bar');
  const wrappingBox = (await wrapping.boundingBox())!;
  const wrappingTitle = (await wrapping.locator('[data-md3-app-bar-title]').boundingBox())!;

  expect(wrappingBox.height).toBeGreaterThan(120);
  expect(wrappingTitle.y + wrappingTitle.height).toBeLessThanOrEqual(wrappingBox.y + wrappingBox.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test('search app bars fill their row with MD3 spacing, alignment, colors and RTL placement', async ({ page }) => {
  await page.goto('/components');
  await page.mouse.move(0, 0);

  const bar = page.getByTestId('bar-search');
  const field = bar.locator('[data-md3-search-bar]');
  const barBox = (await bar.boundingBox())!;
  const fieldBox = (await field.boundingBox())!;
  const navBox = (await bar.getByRole('button', { name: 'Navigation' }).boundingBox())!;
  const actionBox = (await bar.getByRole('button', { name: 'Save', exact: true }).boundingBox())!;

  await expect(bar).toHaveCSS('height', '64px');
  await expect(field).toHaveCSS('height', '56px');
  expect(fieldBox.y - barBox.y).toBe(4);
  expect(fieldBox.x - navBox.x - navBox.width).toBe(8);
  expect(actionBox.x - fieldBox.x - fieldBox.width).toBe(8);
  await expect(field).toHaveCSS('background-color', rgb(forest.schemes.light.surfaceContainer));
  await expect(bar.getByRole('button', { name: 'Navigation' })).toHaveCSS(
    'color',
    rgb(forest.schemes.light.onSurfaceVariant),
  );
  await expect(page.getByTestId('bar-search-centered').getByRole('searchbox')).toHaveCSS('text-align', 'center');
  await expect(page.getByTestId('bar-search-scrolled')).toHaveCSS('box-shadow', 'none');
  await expect(page.getByTestId('bar-search-scrolled').locator('[data-md3-search-bar]')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.light.surfaceContainerHighest),
  );
  await expect(page.getByTestId('bar-search-dark').locator('[data-md3-search-bar]')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.surfaceContainer),
  );

  const rtl = page.getByTestId('bar-search-rtl');

  expect((await rtl.getByRole('button', { name: 'Navigation' }).boundingBox())!.x).toBeGreaterThan(
    (await rtl.getByRole('button', { name: 'More', exact: true }).boundingBox())!.x,
  );
  await page.setViewportSize({ width: 320, height: 800 });

  const narrowField = (await field.boundingBox())!;
  const narrowBar = (await bar.boundingBox())!;

  expect(narrowField.width).toBeGreaterThan(0);
  expect(narrowField.x).toBeGreaterThanOrEqual(narrowBar.x);
  expect(narrowField.x + narrowField.width).toBeLessThanOrEqual(narrowBar.x + narrowBar.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test('search app bar reuses Search keyboard, query, responsive view and focus restoration', async ({ page }) => {
  await page.goto('/components');

  const field = page.getByTestId('bar-search').getByRole('searchbox');
  const view = page.getByRole('dialog', { name: 'Search collection', exact: true });

  await field.focus();
  await expect(view.getByRole('searchbox')).toBeFocused();
  await expect(view.getByRole('searchbox')).toHaveValue('Saved query');
  await view.getByRole('searchbox').fill('New query');
  await view.getByRole('searchbox').press('ArrowDown');
  await expect(view.getByRole('link', { name: 'Search app bar result' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await expect(field).toBeFocused();
  await expect(field).toHaveValue('New query');
  await field.click();
  await view.getByRole('button', { name: 'Clear search' }).click();
  await expect(view.getByRole('searchbox')).toHaveValue('');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(view).toHaveCSS('width', '390px');
  await expect(view).toHaveCSS('height', '844px');
  await expect(view.getByRole('searchbox')).toBeFocused();
  await expect(view.locator('[data-md3-search-bar]')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.light.surfaceContainerHigh),
  );
  await expect(view.locator('[data-md3-search-results]')).toHaveCSS('opacity', '1');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await view.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(view).toHaveCount(0);
  await expect(field).not.toBeFocused();
});

test('search app bars support server HTML, streaming and the Storybook composition', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/components');
    await expect(server.getByTestId('bar-search')).toHaveCSS('height', '64px');
    await expect(server.getByTestId('bar-search').getByRole('searchbox')).toHaveValue('Saved query');
    await expect(server.getByTestId('bar-search').locator('[data-md3-search-bar]')).toHaveCSS('height', '56px');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByTestId('streamed-search-app-bar')).toHaveCSS('height', '64px');
  await page.getByTestId('streamed-search-app-bar').getByRole('searchbox').click();
  await expect(page.getByRole('dialog').getByText('Streamed app bar results')).toBeVisible();
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-appbar--centered-search&viewMode=story');
  await expect(page.getByRole('searchbox')).toHaveCSS('text-align', 'center');
  await page.getByRole('searchbox').click();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Explore collection' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('searchbox')).toHaveCSS('text-align', 'start');
});

test('search app bar retains system colors and disables transitions for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/components');

  const bar = page.getByTestId('bar-search');

  await expect(bar).toHaveCSS('transition-duration', '0s');
  await expect(bar.locator('[data-md3-search-bar]')).toHaveCSS('transition-duration', '0s');
  await expect(bar.locator('[data-md3-search-bar]')).toHaveCSS('border-style', 'solid');
  await bar.getByRole('searchbox').click();

  const view = page.getByRole('dialog', { name: 'Search collection', exact: true });

  await expect(view).toBeVisible();
  await expect(view).toHaveCSS('transition-duration', '0s');
  await page.keyboard.press('Escape');
  await expect(bar.getByRole('searchbox')).toBeFocused();
});
