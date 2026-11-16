import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('Surface uses the full theme corner scale, paired colors, outline, clipping and six elevation levels', async ({
  page,
}) => {
  await page.goto('/surfaces');

  for (const [shape, radius] of [
    ['none', 0],
    ['extraSmall', 4],
    ['small', 8],
    ['medium', 18],
    ['large', 16],
    ['largeIncreased', 24],
    ['extraLarge', 28],
    ['extraLargeIncreased', 32],
    ['extraExtraLarge', 48],
    ['full', 9999],
  ] as const) {
    await expect(page.getByTestId(`surface-${shape}`)).toHaveCSS('border-radius', `${radius}px`);
  }

  await expect(page.getByTestId('surface-medium')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.light.secondaryContainer),
  );
  await expect(page.getByTestId('surface-medium')).toHaveCSS('color', rgb(forest.schemes.light.onSecondaryContainer));
  await expect(page.getByTestId('surface-medium')).toHaveCSS('font-family', 'Arial, sans-serif');
  await expect(page.getByTestId('accent-surface')).toHaveCSS('background-color', rgb(forest.schemes.light.primary));
  await expect(page.getByTestId('accent-surface')).toHaveCSS('color', rgb(forest.schemes.light.onPrimary));
  await expect(page.getByTestId('outlined-surface')).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('outlined-surface')).toHaveCSS(
    'border-top-color',
    rgb(forest.schemes.light.outlineVariant),
  );
  await expect(page.getByTestId('outlined-surface')).toHaveCSS('overflow', 'visible');
  await expect(page.getByTestId('clipped-surface')).toHaveCSS('overflow', 'hidden');
  await expect(page.getByTestId('elevation-0')).toHaveCSS('box-shadow', 'none');

  const shadows = await page
    .getByTestId('surface-elevations')
    .locator('[data-md3-surface]')
    .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).boxShadow));

  expect(new Set(shadows).size).toBe(6);
  await expect(page.getByTestId('surfaces-dark').locator('[data-md3-surface]').first()).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.tertiaryContainer),
  );
});

test('Surface and composed surfaces render styled server HTML without JavaScript and stream after Suspense', async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/surfaces');
    await expect(server.getByTestId('surface-medium')).toHaveCSS('border-radius', '18px');
    await expect(server.getByTestId('server-card-filled')).toHaveCSS(
      'background-color',
      rgb(forest.schemes.light.surfaceContainerHighest),
    );
    await expect(server.getByTestId('server-card-filled')).toHaveJSProperty('tagName', 'ARTICLE');
    await expect(server.getByTestId('shape-gallery').locator('[data-md3-shape]')).toHaveCount(35);
    await expect(server.getByTestId('named-shape')).toHaveCSS('clip-path', /^polygon\(/);
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByTestId('streamed-surface')).toHaveCSS('border-radius', '12px');
  await expect(page.getByTestId('streamed-card')).toContainText('Streamed card content');
  await expect(page.getByRole('img', { name: 'Streamed illustration' })).toHaveCSS('clip-path', /^polygon\(/);
});

test('Surface Storybook uses precomputed dark themes and forced colors retain surface boundaries', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-surface--playground&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await expect(page.locator('[data-md3-surface]')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.surfaceContainerLow),
  );
  await page.goto('/surfaces');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('accent-surface')).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('elevation-5')).toHaveCSS('box-shadow', 'none');
});
