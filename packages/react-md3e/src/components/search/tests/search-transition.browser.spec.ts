import { expect, test } from '@playwright/test';

test('the recorded Storybook search app bar has exactly one visible header on every handoff frame', async ({
  page,
}) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-appbar--search-app-bar&viewMode=story&globals=colorScheme:dark',
  );

  const input = page.getByRole('searchbox');

  await expect(input).toBeVisible();
  await page.evaluate(() => {
    const frames: { source: boolean; view: boolean }[] = [];
    const state = { frames, frame: 0 };
    const opaque = (node: Element | null) => {
      if (!node) {
        return false;
      }

      const style = getComputedStyle(node);

      return style.visibility === 'visible' && style.display !== 'none' && Number(style.opacity) === 1;
    };
    const record = () => {
      const popup = document.querySelector('[data-md3-search-view]');

      frames.push({
        source: opaque(document.querySelector('[data-md3-search-anchor] [data-md3-search-bar]')),
        view: opaque(popup) && opaque(popup?.querySelector('[data-md3-search-bar]') ?? null),
      });
      state.frame = requestAnimationFrame(record);
    };

    Reflect.set(window, '__md3eSearchHandoff', state);
    record();
  });
  await input.click();
  await expect(page.getByRole('dialog').getByRole('searchbox')).toBeFocused();
  await page.getByRole('dialog').getByRole('searchbox').fill('Query');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(input).toBeFocused();

  const frames = await page.evaluate(() => {
    const state = Reflect.get(window, '__md3eSearchHandoff') as {
      frame: number;
      frames: { source: boolean; view: boolean }[];
    };

    cancelAnimationFrame(state.frame);
    Reflect.deleteProperty(window, '__md3eSearchHandoff');

    return state.frames;
  });

  expect(frames.length).toBeGreaterThan(2);
  expect(frames.some((frame) => frame.source)).toBe(true);
  expect(frames.some((frame) => frame.view)).toBe(true);
  expect(frames.every((frame) => frame.source !== frame.view)).toBe(true);
});

for (const [name, width, barId] of [
  ['wide docked', 1280, 'bar-search'],
  ['dark docked', 1280, 'bar-search-dark'],
  ['compact full-screen', 390, 'bar-search'],
] as const) {
  test(`${name}: search header stays opaque and morphs between the actual bar rectangles`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/components');
    await page.locator('main').evaluate((node) => node.style.setProperty('max-width', 'none'));

    const bar = page.getByTestId(barId);
    const input = bar.getByRole('searchbox');
    const surface = bar.locator('[data-md3-search-bar]');

    await input.scrollIntoViewIfNeeded();

    const origin = (await surface.boundingBox())!;

    await bar.evaluate((node) => {
      const theme = node.closest<HTMLElement>('[data-md3-theme]')!;

      theme.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '1000ms');
      theme.style.setProperty('--md-sys-motion-spring-slow-spatial-duration', '1000ms');
    });
    await input.click();

    const view = page.getByRole('dialog');

    await expect(view).toBeVisible();
    await expect(view).not.toHaveAttribute('data-starting-style');

    const opening = await view.evaluate(async (node) => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const animations = node.getAnimations({ subtree: true });

      animations.forEach((animation) => animation.pause());

      const samples = [0, 25, 100, 500, 1000].map((time) => {
        for (const animation of animations) {
          animation.currentTime = time;
        }

        const header = node.querySelector<HTMLElement>('[data-md3-search-bar]')!;

        return {
          opacity: getComputedStyle(node).opacity,
          headerOpacity: getComputedStyle(header).opacity,
          rect: header.getBoundingClientRect().toJSON(),
          transform: getComputedStyle(header.parentElement!).transform,
        };
      });

      animations.forEach((animation) => animation.finish());

      return samples;
    });

    expect(opening[0]!.rect.x).toBeCloseTo(origin.x, 0);
    expect(opening[0]!.rect.y).toBeCloseTo(origin.y, 0);
    expect(opening[0]!.rect.width).toBeCloseTo(origin.width, 0);
    expect(opening[0]!.rect.height).toBeCloseTo(56, 0);

    for (const sample of opening) {
      expect(sample.opacity).toBe('1');
      expect(sample.headerOpacity).toBe('1');
      expect(sample.transform).toBe('none');
    }

    await page.keyboard.press('Escape');
    await expect(view).toHaveAttribute('data-ending-style');
    await expect(surface).toHaveCSS('visibility', 'hidden');

    const closing = await view.evaluate((node) => {
      const animations = node.getAnimations({ subtree: true });

      for (const animation of animations) {
        animation.pause();
        animation.currentTime = 1000;
      }

      const header = node.querySelector<HTMLElement>('[data-md3-search-bar]')!;
      const result = { opacity: getComputedStyle(node).opacity, rect: header.getBoundingClientRect().toJSON() };

      animations.forEach((animation) => animation.finish());

      return result;
    });

    expect(closing.opacity).toBe('1');
    expect(closing.rect.x).toBeCloseTo(origin.x, 0);
    expect(closing.rect.y).toBeCloseTo(origin.y, 0);
    expect(closing.rect.width).toBeCloseTo(origin.width, 0);
    expect(closing.rect.height).toBeCloseTo(56, 0);
    await expect(view).toHaveCount(0);
    await expect(surface).toHaveCSS('visibility', 'visible');
    await expect(input).toBeFocused();
  });
}
