import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import linearReference from './linear-motion.reference.json' with { type: 'json' };

test('flat/wavy linear and circular indicators expose real values and their MD3 dimensions in server HTML', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/indicators');
    await expect(page.getByTestId('flat-linear')).toHaveAttribute('aria-valuenow', '35');
    await expect(page.getByTestId('flat-linear')).toHaveCSS('height', '4px');
    await expect(page.getByTestId('wavy-linear')).toHaveCSS('height', '10px');
    await expect(page.getByTestId('flat-circular')).toHaveCSS('width', '40px');
    await expect(page.getByTestId('wavy-circular')).toHaveCSS('width', '48px');
    await expect(page.getByTestId('flat-linear-indeterminate')).not.toHaveAttribute('aria-valuenow');
    await expect(page.getByTestId('wavy-linear-indeterminate')).toHaveCSS('height', '14px');
    await expect(page.getByTestId('custom-range')).toHaveAttribute('aria-valuemin', '10');
    await expect(page.getByTestId('custom-range')).toHaveAttribute('aria-valuemax', '50');
    await expect(page.getByTestId('custom-range')).toHaveAttribute('aria-valuenow', '25');
    await expect(page.getByTestId('empty-progress').locator('[data-md3-progress-active]')).toHaveCSS(
      'visibility',
      'hidden',
    );
    await expect(page.getByTestId('complete-progress').locator('[data-md3-progress-track]')).toHaveCSS(
      'visibility',
      'hidden',
    );
    await expect(page.getByTestId('complete-progress').locator('[data-md3-progress-stop]')).toHaveCSS(
      'display',
      'none',
    );
  } finally {
    await context.close();
  }
});

test('controlled values update visible dash ranges and completion without generated rules', async ({ page }) => {
  await page.goto('/indicators');

  const linear = page.getByTestId('controlled-linear');
  const count = await page.locator('style').count();

  await expect(linear).toHaveAttribute('aria-valuenow', '40');
  await page.getByRole('button', { name: 'Complete operation' }).click();
  await expect(linear).toHaveAttribute('aria-valuenow', '100');
  await expect
    .poll(async () => {
      const root = (await linear.boundingBox())!;
      const active = (await linear.locator('[data-md3-progress-active]').boundingBox())!;

      return Math.abs(root.width - active.width);
    })
    .toBeLessThan(0.5);
  await expect(page.getByTestId('controlled-circular')).toHaveAttribute('data-complete', 'true');
  await page.getByLabel('Unknown duration').check();
  await expect(linear).not.toHaveAttribute('aria-valuenow');
  await page.getByLabel('Unknown duration').uncheck();
  await expect(linear).toHaveAttribute('aria-valuenow', '100');
  expect(await page.locator('style').count()).toBe(count);
});

test('wavy paths change phase, circular unknown progress rotates, and RTL reverses linear progress', async ({
  page,
}) => {
  await page.goto('/indicators');
  await expect(page.getByTestId('rtl-progress').locator('svg')).toHaveCSS('transform', 'matrix(-1, 0, 0, 1, 0, 0)');

  const paths = await page
    .getByTestId('wavy-circular')
    .locator('[data-md3-progress-active]')
    .evaluate((node) => {
      const animation = node.getAnimations()[0]!;

      animation.pause();
      animation.currentTime = 0;

      const first = getComputedStyle(node).getPropertyValue('d');

      animation.currentTime = 250;

      return [first, getComputedStyle(node).getPropertyValue('d')];
    });

  expect(paths[0]).not.toBe(paths[1]);
  await expect(page.getByTestId('flat-circular-indeterminate').locator('svg')).toHaveCSS(
    'animation-name',
    /^md3-circular-turn/,
  );
});

test('reduced motion freezes unknown progress without hiding it; forced colors and accessibility remain usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/indicators');

  const indeterminate = page.getByTestId('wavy-linear-indeterminate');

  expect(
    await indeterminate.evaluate(
      (node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0);
  expect(
    await indeterminate
      .locator('[data-md3-progress-active]')
      .first()
      .evaluate((node) => node.getBoundingClientRect().width),
  ).toBeGreaterThan(10);
  await expect(indeterminate).not.toHaveAttribute('aria-valuenow');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('flat-linear').locator('[data-md3-progress-active]')).toHaveCSS('fill', /rgb/);
});

test('progress is styled after streaming and in the Storybook wavy circular and linear indeterminate examples', async ({
  page,
}) => {
  await page.goto('/streaming');
  await expect(page.getByTestId('streamed-progress-indicator')).toHaveAttribute('aria-valuenow', '65');
  await expect(page.getByTestId('streamed-progress-indicator')).toHaveCSS('height', '10px');
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-progressindicator--wavy-circular&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await expect(page.getByRole('progressbar', { name: 'Operation progress' })).toHaveCSS('width', '48px');
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-progressindicator--wavy-linear-indeterminate&viewMode=story',
  );

  const wavy = page.getByRole('progressbar', { name: 'Operation progress' });
  const active = wavy.locator('[data-md3-progress-active]');

  await expect(wavy).toHaveAttribute('data-type', 'linear');
  await expect(wavy).not.toHaveAttribute('aria-valuenow');
  await expect(wavy).toHaveCSS('height', '10px');
  await expect(active).toHaveCount(2);
  await expect(active.first()).toHaveCSS('mask-image', /data:image\/svg\+xml/);
  await expect(active.first()).toHaveCSS('animation-play-state', 'running');
});

test('linear fill stays proportional at different widths and keeps the physical track gap', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/indicators');

  const linear = page.getByTestId('flat-linear');

  for (const width of [240, 600]) {
    await linear.evaluate((node, nextWidth) => {
      node.style.setProperty('inline-size', `${nextWidth}px`);
    }, width);

    const frame = (await linear.boundingBox())!;
    const active = (await linear.locator('[data-md3-progress-active]').boundingBox())!;
    const track = (await linear.locator('[data-md3-progress-track]').boundingBox())!;

    expect(active.width / frame.width).toBeCloseTo(0.35, 2);
    expect(track.x - active.x - active.width).toBeCloseTo(4, 1);
  }
});

test('indeterminate circular indicators wind up and rebound independently of continuous rotation', async ({ page }) => {
  await page.goto('/indicators');

  for (const appearance of ['flat', 'wavy']) {
    const orbit = page.getByTestId(`${appearance}-circular-indeterminate`).locator('[data-md3-progress-orbit]');
    const sample = async (easing: string) =>
      orbit.evaluate((node, nextEasing) => {
        node
          .closest<HTMLElement>('[data-testid="indicator-theme"]')!
          .style.setProperty('--md-sys-motion-spring-fast-spatial-easing', nextEasing);

        const animation = node.getAnimations()[0]!;
        const step = Number(animation.effect!.getTiming().duration) / 8;

        animation.pause();

        return [0.4, 0.9, 1].map((fraction) => {
          animation.currentTime = step * fraction;

          const matrix = new DOMMatrix(getComputedStyle(node).transform);

          return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
        });
      }, easing);
    const expressive = await sample(createTheme({ motionScheme: 'expressive' }).motion.fast.spatial.easing);
    const standard = await sample(createTheme({ motionScheme: 'standard' }).motion.fast.spatial.easing);

    expect(expressive[2]).toBeCloseTo(135, 1);
    expect(expressive[0]).toBeGreaterThan(140);
    expect(Math.abs(expressive[1]! - 135)).toBeLessThan(1);
    expect(standard[0]).toBeLessThan(135);
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });

  expect(
    await page
      .getByTestId('wavy-circular-indeterminate')
      .evaluate(
        (node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
      ),
  ).toBe(0);
});

test('flat and wavy indeterminate segment edges follow the native MUI reference timeline', async ({ page }) => {
  await page.goto('/indicators');

  const styleCount = await page.locator('style').count();

  for (const appearance of ['flat', 'wavy']) {
    const indicator = page.getByTestId(`${appearance}-linear-indeterminate`);
    const samples = await indicator.evaluate((node, frames) => {
      const svg = node.querySelector('svg')!;
      const animations = svg.getAnimations();
      const segments = [...svg.querySelectorAll<SVGRectElement>('[data-md3-progress-active]')];
      const { width } = node.getBoundingClientRect();

      animations.forEach((animation) => animation.pause());

      return frames.map((frame) => {
        for (const animation of animations) {
          animation.currentTime = frame.timeMs;
        }

        return segments.map((segment) => {
          const box = segment.getBBox();

          return { tail: box.x / width, head: (box.x + box.width) / width };
        });
      });
    }, linearReference.frames);

    for (const [index, frame] of linearReference.frames.entries()) {
      expect(samples[index]).toHaveLength(2);

      for (const [segment, expected] of frame.segments.entries()) {
        const actual = samples[index]![segment]!;

        if (expected.head <= 0.000001 || expected.tail >= 0.999999) {
          // An exact iteration boundary may resolve to either offscreen endpoint.
          expect(actual.head <= 0.000001 || actual.tail >= 0.999999).toBe(true);
        } else {
          expect(Math.abs(actual.tail - expected.tail), `${appearance} tail at ${frame.timeMs}ms`).toBeLessThan(0.0001);
          expect(Math.abs(actual.head - expected.head), `${appearance} head at ${frame.timeMs}ms`).toBeLessThan(0.0001);
        }
      }
    }

    await expect(indicator).not.toHaveAttribute('aria-valuenow');
  }

  expect(await page.locator('style').count()).toBe(styleCount);
});

test('indeterminate passes never reverse or stop visibly, and each reset happens outside the track', async ({
  page,
}) => {
  await page.goto('/indicators');

  for (const appearance of ['flat', 'wavy']) {
    const samples = await page.getByTestId(`${appearance}-linear-indeterminate`).evaluate((node) => {
      node.style.setProperty('--md-sys-motion-spring-default-spatial-easing', 'linear(0, 2, -1, 1)');

      const svg = node.querySelector('svg')!;
      const animations = svg.getAnimations();
      const segments = [...svg.querySelectorAll<SVGRectElement>('[data-md3-progress-active]')];
      const { width } = node.getBoundingClientRect();

      animations.forEach((animation) => animation.pause());

      return Array.from({ length: 721 }, (_, index) => {
        for (const animation of animations) {
          animation.currentTime = (index * 2100) / 240;
        }

        return segments.map((segment) => {
          const box = segment.getBBox();

          return { tail: box.x / width, head: (box.x + box.width) / width };
        });
      });
    });
    let resets = 0;

    for (let index = 1; index < samples.length; index += 1) {
      for (let segment = 0; segment < 2; segment += 1) {
        const before = samples[index - 1]![segment]!;
        const after = samples[index]![segment]!;

        if (after.tail < before.tail - 0.01) {
          resets += 1;
          expect(before.tail).toBeGreaterThanOrEqual(1);
          expect(after.tail).toBeLessThan(0);
          expect(after.head).toBeLessThan(0.05);
        } else if (before.head > 0 && before.tail < 1 && after.head > 0 && after.tail < 1) {
          expect(after.tail).toBeGreaterThanOrEqual(before.tail - 0.000001);
          expect(after.head).toBeGreaterThanOrEqual(before.head - 0.000001);
          expect(after.head - before.head + after.tail - before.tail).toBeGreaterThan(0.000001);
        }
      }
    }

    expect(resets).toBe(6);
  }

  const rtl = page.getByTestId('flat-linear-indeterminate');

  await rtl.evaluate((node) => node.setAttribute('dir', 'rtl'));
  await expect(rtl.locator('svg')).toHaveCSS('transform', 'matrix(-1, 0, 0, 1, 0, 0)');
});

test('the remaining track masks both moving segments with physical gaps, including overlapping passes', async ({
  page,
}) => {
  await page.goto('/indicators');

  for (const appearance of ['flat', 'wavy']) {
    const mismatches = await page.getByTestId(`${appearance}-linear-indeterminate`).evaluate(async (node) => {
      const svg = node.querySelector('svg')!;
      const animations = svg.getAnimations();
      const track = svg.querySelector<SVGRectElement>('[data-md3-progress-track]')!;
      const segments = [...svg.querySelectorAll<SVGRectElement>('[data-md3-progress-active]')];
      const failures: { width: number; time: number; x: number; alpha: number; expected: boolean }[] = [];

      animations.forEach((animation) => animation.pause());

      for (const width of [240, 600]) {
        node.style.setProperty('inline-size', `${width}px`);

        for (const time of [0, 250, 750, 1050, 1150, 1300, 1700, 2099]) {
          for (const animation of animations) {
            animation.currentTime = time;
          }

          const boxes = segments.map((segment) => segment.getBBox());
          const holes = boxes
            .filter((box) => box.x < width && box.x + box.width > 0)
            .map((box) => [box.x - 4, box.x + box.width + 4] as const);
          const clone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          const canvas = document.createElement('canvas');

          clone.setAttribute('width', String(width));
          clone.setAttribute('height', '8');
          rectangle.setAttribute('width', String(width));
          rectangle.setAttribute('height', '8');
          rectangle.setAttribute('fill', 'white');
          rectangle.style.maskImage = getComputedStyle(track).maskImage;
          rectangle.style.maskComposite = getComputedStyle(track).maskComposite;
          clone.appendChild(rectangle);
          canvas.width = width;
          canvas.height = 8;

          const image = new Image();

          image.src = `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
          await image.decode();

          const context = canvas.getContext('2d')!;

          context.drawImage(image, 0, 0);

          const pixels = context.getImageData(0, 4, width, 1).data;

          for (let x = 1; x < width - 1; x += 1) {
            const center = x + 0.5;
            const nearEdge = holes.some(([start, end]) => Math.abs(center - start) < 1 || Math.abs(center - end) < 1);
            const expected = !holes.some(([start, end]) => center > start && center < end);
            const alpha = pixels[x * 4 + 3]!;

            if (!nearEdge && (expected ? alpha < 245 : alpha > 10)) {
              failures.push({ width, time, x, alpha, expected });
            }
          }
        }
      }

      return failures.slice(0, 10);
    });

    expect(mismatches, appearance).toEqual([]);
  }
});
