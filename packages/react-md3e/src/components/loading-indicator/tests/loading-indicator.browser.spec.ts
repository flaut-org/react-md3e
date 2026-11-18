import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import reference from './loading-motion.reference.json' with { type: 'json' };

const theme = createTheme({ sourceColor: '#9a91e0' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('LoadingIndicator has named server-rendered progress semantics, 48/38 geometry and scoped colors without hydration', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/indicators');

    const loading = page.getByRole('progressbar', { name: 'Loading results', exact: true });

    await expect(loading).not.toHaveAttribute('aria-valuenow');
    await expect(loading).toHaveCSS('width', '48px');
    await expect(loading).toHaveCSS('color', rgb(theme.schemes.light.primary));
    await expect(loading.locator('[data-md3-loading-rotor]')).toHaveCSS('width', '38px');
    await expect(loading.locator('[data-md3-loading-shape]')).toHaveCSS('clip-path', /^polygon\(/);
    await expect(page.getByTestId('contained-loading')).toHaveCSS(
      'background-color',
      rgb(theme.schemes.light.primaryContainer),
    );
    await expect(page.getByTestId('contained-loading')).toHaveCSS('color', rgb(theme.schemes.light.onPrimaryContainer));
    await expect(page.getByTestId('dark-loading')).toHaveCSS(
      'background-color',
      rgb(theme.schemes.dark.primaryContainer),
    );
    await expect(page.getByRole('progressbar').and(page.getByTestId('decorative-loading'))).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('the indeterminate loader morphs different precompiled silhouettes while CSS owns the timeline', async ({
  page,
}) => {
  await page.goto('/indicators');

  const shapes = await page
    .getByTestId('server-loading')
    .locator('[data-md3-loading-shape]')
    .evaluate((node) => {
      const animation = node.getAnimations()[0]!;

      animation.pause();
      animation.currentTime = 0;

      const first = getComputedStyle(node).clipPath;

      animation.currentTime = 650;

      const second = getComputedStyle(node).clipPath;

      animation.currentTime = 1300;

      return [first, second, getComputedStyle(node).clipPath];
    });

  expect(new Set(shapes).size).toBe(3);
});

test('controlled loading switches between morph progress and the loop without style insertion', async ({ page }) => {
  await page.goto('/indicators');

  const loading = page.getByTestId('controlled-loading');
  const shape = loading.locator('[data-md3-loading-shape]');
  const count = await page.locator('style').count();
  const before = await shape.evaluate((node) => getComputedStyle(node).clipPath);

  await page.getByRole('slider', { name: 'Operation progress' }).press('End');
  await expect(loading).toHaveAttribute('aria-valuenow', '100');
  expect(await shape.evaluate((node) => getComputedStyle(node).clipPath)).not.toBe(before);
  await page.getByLabel('Unknown duration').check();
  await expect(loading).not.toHaveAttribute('aria-valuenow');
  await expect(shape).toHaveCSS('animation-play-state', 'running');
  await page.getByLabel('Unknown duration').uncheck();
  await expect(loading).toHaveAttribute('aria-valuenow', '100');
  await expect(shape).toHaveCSS('animation-play-state', 'paused');
  expect(await page.locator('style').count()).toBe(count);
});

test('loading styles work in streamed content, Storybook, reduced motion and forced colors', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/streaming', { waitUntil: 'commit' });
  await expect(page.getByTestId('streaming-loading-indicator')).toHaveCSS('width', '48px');
  await expect(page.getByTestId('streamed-loading-indicator')).toHaveCSS('width', '48px');
  expect(
    await page
      .getByTestId('streamed-loading-indicator')
      .evaluate(
        (node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
      ),
  ).toBe(0);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('streamed-loading-indicator')).toHaveCSS('border-top-width', '1px');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-loadingindicator--contained&viewMode=story');
  await expect(page.getByRole('progressbar', { name: 'Loading results' })).toBeVisible();
});

test('loading turns forward across every shape and loop boundary, independently of overshooting theme springs', async ({
  page,
}) => {
  await page.goto('/indicators');

  const shape = page.getByTestId('server-loading').locator('[data-md3-loading-shape]');
  const sample = async (easing: string) =>
    shape.evaluate((node, nextEasing) => {
      node
        .closest<HTMLElement>('[data-testid="indicator-theme"]')!
        .style.setProperty('--md-sys-motion-spring-fast-spatial-easing', nextEasing);

      const rotor = node.parentElement!;
      const inner = node.getAnimations()[0]!;
      const outer = rotor.getAnimations()[0]!;
      const duration = Number(inner.effect!.getTiming().duration);

      inner.pause();
      outer.pause();

      let previous = 0;
      let angle = 0;
      const angles: number[] = [];

      for (let index = 0; index <= 1120; index += 1) {
        inner.currentTime = (index / 560) * duration;
        outer.currentTime = inner.currentTime;

        const matrix = new DOMMatrix(getComputedStyle(rotor).transform).multiply(
          new DOMMatrix(getComputedStyle(node).transform),
        );
        const current = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
        const delta = current - previous;

        angle += delta - 360 * Math.round(delta / 360);
        angles.push(angle);
        previous = current;
      }

      return angles;
    }, easing);
  const expressive = await sample(createTheme({ motionScheme: 'expressive' }).motion.fast.spatial.easing);
  const standard = await sample(createTheme({ motionScheme: 'standard' }).motion.fast.spatial.easing);
  const deltas = expressive.slice(1).map((angle, index) => angle - expressive[index]!);

  expect(Math.min(...deltas)).toBeGreaterThan(0);
  expect(Math.max(...deltas)).toBeLessThan(12);
  expect(expressive.at(-1)).toBeCloseTo(2880, 1);
  expect(Math.max(...expressive.map((angle, index) => Math.abs(angle - standard[index]!)))).toBeLessThan(0.001);
  await expect(page.getByTestId('determinate-loading').locator('[data-md3-loading-shape]')).toHaveCSS(
    'transform',
    'none',
  );
});

test('loading acceleration and deceleration follow measured rotation in the supplied recording', async ({ page }) => {
  await page.goto('/indicators');

  for (const group of reference.groups) {
    const angles = await page
      .getByTestId('server-loading')
      .locator('[data-md3-loading-shape]')
      .evaluate(
        (node, data) => {
          const rotor = node.parentElement!;
          const inner = node.getAnimations()[0]!;
          const outer = rotor.getAnimations()[0]!;

          inner.pause();
          outer.pause();

          let previous: number | undefined;
          let angle = 0;

          return data.frames.map((frame) => {
            inner.currentTime = data.phaseMs + frame.timeMs;
            outer.currentTime = data.outerPhaseMs + frame.timeMs;

            const matrix = new DOMMatrix(getComputedStyle(rotor).transform).multiply(
              new DOMMatrix(getComputedStyle(node).transform),
            );
            const current = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;

            if (previous !== undefined) {
              const delta = current - previous;

              angle += delta - 360 * Math.round(delta / 360);
            }

            previous = current;

            return angle;
          });
        },
        { ...group, phaseMs: reference.phaseMs, outerPhaseMs: reference.outerPhaseMs },
      );

    for (const [index, frame] of group.frames.entries()) {
      expect(Math.abs(angles[index]! - frame.angle), `${group.name} at ${frame.timeMs}ms`).toBeLessThan(1);
    }
  }
});

test('loading contour morphs follow recorded silhouettes at the measured motion phases', async ({ page }) => {
  await page.goto('/indicators');

  const errors = await page.getByTestId('server-loading').evaluate((root, data) => {
    root.style.setProperty('inline-size', `${data.frameSize}px`);
    root.style.setProperty('block-size', `${data.frameSize}px`);

    const shape = root.querySelector<HTMLElement>('[data-md3-loading-shape]')!;
    const rotor = shape.parentElement!;
    const inner = shape.getAnimations()[0]!;
    const outer = rotor.getAnimations()[0]!;
    const canvas = document.createElement('canvas');

    inner.pause();
    outer.pause();
    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext('2d')!;

    return data.frames.map((frame) => {
      inner.currentTime = data.phaseMs + frame.timeMs;
      outer.currentTime = data.outerPhaseMs + frame.timeMs;

      const style = getComputedStyle(shape);
      const coordinates = style.clipPath.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)!.map(Number);
      const matrix = new DOMMatrix(getComputedStyle(rotor).transform).multiply(new DOMMatrix(style.transform));

      context.resetTransform();
      context.clearRect(0, 0, 256, 256);
      context.translate(128, 128);
      context.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
      context.scale(parseFloat(style.width), parseFloat(style.height));
      context.beginPath();

      for (let index = 0; index < coordinates.length; index += 2) {
        const x = coordinates[index]! / 100 - 0.5;
        const y = coordinates[index + 1]! / 100 - 0.5;

        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.closePath();
      context.fill();

      const pixels = context.getImageData(0, 0, 256, 256).data;
      const profile = Array<number>(360).fill(0);

      for (let y = 0; y < 256; y += 1) {
        for (let x = 0; x < 256; x += 1) {
          if (pixels[(y * 256 + x) * 4 + 3]! > 127) {
            const dx = x - 127.5;
            const dy = y - 127.5;
            const bin = Math.floor(((Math.atan2(dy, dx) + Math.PI) * 180) / Math.PI) % 360;

            profile[bin] = Math.max(profile[bin]!, Math.hypot(dx, dy));
          }
        }
      }

      const expected = [...atob(frame.radii)].map((character) => character.charCodeAt(0) / 2);
      const differences = expected.map((radius, index) => Math.abs(radius - profile[index * 2]!));

      return { timeMs: frame.timeMs, mean: differences.reduce((sum, value) => sum + value, 0) / differences.length };
    });
  }, reference);

  for (const frame of errors) {
    expect.soft(frame.mean, `contour at ${frame.timeMs}ms`).toBeLessThan(2);
  }
});
