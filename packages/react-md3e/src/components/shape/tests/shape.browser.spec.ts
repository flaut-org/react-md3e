import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-org/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('all 35 compiled SVG masks decode, rasterize nonempty contours and retain normalized bounds', async ({ page }) => {
  await page.goto('/surfaces');

  const shapes = page.getByTestId('shape-gallery').locator('[data-md3-shape]');

  await expect(shapes).toHaveCount(35);

  const rasterized = await shapes.evaluateAll(async (nodes) =>
    Promise.all(
      nodes.map(async (node) => {
        const mask = getComputedStyle(node).maskImage;
        const source = mask.slice(5, -2);
        const svg = new DOMParser().parseFromString(
          decodeURIComponent(source.slice(source.indexOf(',') + 1)),
          'image/svg+xml',
        );
        const path = svg.querySelector('path')!.getAttribute('d')!;
        const coordinates = path.match(/-?[0-9]+(?:\.[0-9]+)?/g)!.map(Number);
        const image = new Image();

        image.src = source;
        await image.decode();

        const canvas = document.createElement('canvas');

        canvas.width = 64;
        canvas.height = 64;

        const context = canvas.getContext('2d')!;

        context.drawImage(image, 0, 0, 64, 64);

        const pixels = context.getImageData(0, 0, 64, 64).data;
        const filled = Array.from({ length: 64 * 64 }, (_value, index) => pixels[index * 4 + 3]!).filter(
          (alpha) => alpha > 0,
        ).length;

        return {
          name: node.getAttribute('data-variant'),
          filled,
          source,
          minimum: Math.min(...coordinates),
          maximum: Math.max(...coordinates),
        };
      }),
    ),
  );

  expect(new Set(rasterized.map(({ source }) => source)).size).toBe(35);

  for (const shape of rasterized) {
    expect(shape.minimum, `${shape.name} fits its normalized box`).toBeGreaterThanOrEqual(-0.00001);
    expect(shape.maximum, `${shape.name} fits its normalized box`).toBeLessThanOrEqual(1.00001);
    expect(shape.filled, `${shape.name} has a visible contour`).toBeGreaterThan(64 * 64 * 0.15);
    expect(shape.filled, `${shape.name} leaves transparent corners`).toBeLessThan(64 * 64);
  }
});

test('Shape is decorative unless named and inherits matched theme colors without hiding named imagery', async ({
  page,
}) => {
  await page.goto('/surfaces');

  const decorative = page.getByTestId('shape-gallery').locator('[data-md3-shape]').first();
  const named = page.getByRole('img', { name: 'Favorite illustration', exact: true });
  const image = page.getByRole('img', { name: 'Scenic illustration', exact: true });

  await expect(decorative).toHaveAttribute('aria-hidden', 'true');
  await expect(named).not.toHaveAttribute('aria-hidden');
  await expect(named).toHaveCSS('width', '80px');
  await expect(decorative).toHaveCSS('width', '120px');
  await expect(named).toHaveCSS('background-color', rgb(forest.schemes.light.primaryContainer));
  await expect(named).toHaveCSS('color', rgb(forest.schemes.light.onPrimaryContainer));
  await expect(image.locator('img')).toHaveJSProperty('complete', true);
  await expect(image.locator('img')).toHaveCSS('object-fit', 'cover');
  await expect(page.getByRole('img', { name: 'Dark heart', exact: true })).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.primaryContainer),
  );
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await expect(named).toHaveCSS('forced-color-adjust', 'none');
  await expect(named).toHaveCSS('clip-path', /^polygon\(/);
});

test('the shape gallery works in Storybook and keeps its geometry in narrow viewports', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-shape--gallery&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await expect(page.locator('[data-md3-shape]')).toHaveCount(35);
  await expect(page.locator('[data-md3-shape]').first()).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.primaryContainer),
  );
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/surfaces');

  const styles = await page.locator('style').count();
  const boxes = await page
    .getByTestId('shape-gallery')
    .locator('[data-md3-shape]')
    .evaluateAll((nodes) =>
      nodes.map((node) => ({ x: node.getBoundingClientRect().x, right: node.getBoundingClientRect().right })),
    );

  expect(boxes.every(({ x, right }) => x >= 0 && right <= 320)).toBe(true);
  await page.getByRole('button', { name: 'Toggle drag appearance' }).click();
  expect(await page.locator('style').count()).toBe(styles);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
