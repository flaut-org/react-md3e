import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('variant changes interpolate the actual clip contour and preserve masked images without CSS insertion', async ({
  page,
}) => {
  await page.goto('/surfaces');

  const demo = page.getByTestId('shape-morph-demo');
  const shape = demo.getByTestId('morphing-shape');
  const image = demo.getByTestId('morphing-image');
  const styles = await page.locator('style').count();
  const start = await shape.evaluate((node) => {
    node.style.setProperty('--md3e-shape-morph-duration', '2s');

    return getComputedStyle(node).clipPath;
  });

  await demo.getByRole('button', { name: 'Flower', exact: true }).click();
  await expect(shape).toHaveAttribute('data-variant', 'flower');
  await expect.poll(() => shape.evaluate((node) => node.getAnimations().length)).toBeGreaterThan(0);

  const frames = await shape.evaluate((node) => {
    const animation = node
      .getAnimations()
      .find((item) => item instanceof CSSTransition && item.transitionProperty === 'clip-path')!;

    animation.pause();
    animation.currentTime = 0;

    const first = getComputedStyle(node).clipPath;

    animation.currentTime = 800;

    const middle = getComputedStyle(node).clipPath;

    animation.finish();

    return { first, middle, last: getComputedStyle(node).clipPath };
  });

  expect(frames.first).toBe(start);
  expect(frames.middle).not.toBe(frames.first);
  expect(frames.middle).not.toBe(frames.last);
  expect(frames.last).toMatch(/^polygon\(/);
  await expect(image).toHaveCSS('clip-path', frames.last);
  await expect(image.locator('img')).toHaveJSProperty('complete', true);
  expect(await page.locator('style').count()).toBe(styles);
});

test('a running morph retargets from its visible contour and scales with the shape box', async ({ page }) => {
  await page.goto('/surfaces');

  const demo = page.getByTestId('shape-morph-demo');
  const shape = demo.getByTestId('morphing-shape');

  await shape.evaluate((node) => node.style.setProperty('--md3e-shape-morph-duration', '2s'));
  await demo.getByRole('button', { name: 'Flower', exact: true }).click();
  await expect.poll(() => shape.evaluate((node) => node.getAnimations().length)).toBeGreaterThan(0);

  const interrupted = await shape.evaluate((node) => {
    const animation = node.getAnimations()[0]!;

    animation.pause();
    animation.currentTime = 700;

    return getComputedStyle(node).clipPath;
  });

  await demo.getByRole('button', { name: 'Heart', exact: true }).click();
  await expect(shape).toHaveAttribute('data-variant', 'heart');

  const frames = await shape.evaluate((node) => {
    const animation = node.getAnimations()[0]!;

    animation.pause();
    animation.currentTime = 0;

    const first = getComputedStyle(node).clipPath;

    animation.finish();

    return { first, last: getComputedStyle(node).clipPath };
  });

  expect(frames.first).toBe(interrupted);
  expect(frames.last).not.toBe(interrupted);
  await demo.getByRole('button', { name: 'Toggle shape size', exact: true }).click();
  await expect(shape).toHaveCSS('width', '40px');
  await expect(shape).toHaveCSS('clip-path', frames.last);
  await expect(demo.getByTestId('morphing-image')).toHaveCSS('width', '40px');
});

test('all catalog morph endpoints share topology and stay close to the original SVG silhouettes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/surfaces');

  const demo = page.getByTestId('shape-morph-demo');
  const select = demo.getByLabel('Shape target');
  const shape = demo.getByTestId('morphing-shape');
  const names = await select.locator('option').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('value')!));

  expect(names).toHaveLength(35);

  for (const name of names) {
    await select.selectOption(name);
    await expect(shape).toHaveAttribute('data-variant', name);

    const quality = await demo.evaluate(async (node) => {
      const animated = node.querySelector('[data-testid="morphing-shape"]')!;
      const exact = node.querySelector('[data-testid="morph-target"]')!;
      const clip = getComputedStyle(animated).clipPath;
      const values = clip.match(/-?[0-9]+(?:\.[0-9]+)?/g)!.map(Number);
      const polygon = document.createElement('canvas');
      const svg = document.createElement('canvas');

      polygon.width = 120;
      polygon.height = 120;
      svg.width = 120;
      svg.height = 120;

      const polygonContext = polygon.getContext('2d')!;
      const svgContext = svg.getContext('2d')!;

      polygonContext.beginPath();
      polygonContext.moveTo(values[0]! * 1.2, values[1]! * 1.2);

      for (let index = 2; index < values.length; index += 2) {
        polygonContext.lineTo(values[index]! * 1.2, values[index + 1]! * 1.2);
      }

      polygonContext.closePath();
      polygonContext.fill();

      const image = new Image();

      image.src = getComputedStyle(exact).maskImage.slice(5, -2);
      await image.decode();
      svgContext.drawImage(image, 0, 0, 120, 120);

      const approximated = polygonContext.getImageData(0, 0, 120, 120).data;
      const original = svgContext.getImageData(0, 0, 120, 120).data;
      let error = 0;

      for (let index = 3; index < original.length; index += 4) {
        error += Math.abs(approximated[index]! - original[index]!);
      }

      return {
        points: values.length / 2,
        error: error / (120 * 120 * 255),
        minimum: Math.min(...values),
        maximum: Math.max(...values),
      };
    });

    expect(quality.points, name).toBe(256);
    expect(quality.minimum, name).toBeGreaterThanOrEqual(0);
    expect(quality.maximum, name).toBeLessThanOrEqual(100);
    expect(quality.error, `${name} rasterized endpoint difference`).toBeLessThan(0.015);
  }
});

test('morph opt-out and reduced motion switch immediately while retaining accessible illustrations', async ({
  page,
}) => {
  await page.goto('/surfaces');

  const demo = page.getByTestId('shape-morph-demo');
  const shape = demo.getByTestId('morphing-shape');

  await demo.getByRole('button', { name: 'Disable morphing', exact: true }).click();
  await demo.getByRole('button', { name: 'Flower', exact: true }).click();
  await expect(shape).toHaveCSS('mask-image', /data:image\/svg\+xml/);
  await expect(shape).toHaveCSS('clip-path', 'none');
  expect(await shape.evaluate((node) => node.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await demo.getByRole('button', { name: 'Enable morphing', exact: true }).click();
  await demo.getByRole('button', { name: 'Heart', exact: true }).click();
  await expect(shape).toHaveCSS('transition-duration', '0s');
  await expect(shape).toHaveCSS('clip-path', /^polygon\(/);
  expect(await shape.evaluate((node) => node.getAnimations().length)).toBe(0);

  const result = await new AxeBuilder({ page })
    .include('[data-testid="shape-morph-demo"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(result.violations).toEqual([]);
});

test('morph styles arrive without JavaScript and the Storybook demo morphs with the built package', async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/surfaces');
    await expect(server.getByTestId('morphing-shape')).toHaveCSS('clip-path', /^polygon\(/);
    await expect(server.getByTestId('morphing-shape')).toHaveCSS('transition-duration', '0.4s');
    await expect(server.getByTestId('server-card-filled')).toHaveAttribute('data-md3-surface', '');
  } finally {
    await context.close();
  }

  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-shape--morphing&viewMode=story');

  const shape = page.getByTestId('morphing-shape');

  await page.getByRole('button', { name: 'Pixel triangle', exact: true }).click();
  await expect(shape).toHaveAttribute('data-variant', 'pixelTriangle');
  await expect(shape).toHaveCSS('clip-path', /^polygon\(/);
  await expect(page.getByRole('img', { name: 'Morphing landscape' })).toBeVisible();
  expect(errors).toEqual([]);
});
