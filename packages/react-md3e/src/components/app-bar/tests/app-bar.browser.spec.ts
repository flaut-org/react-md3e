import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-org/react-md3e/theme';

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
