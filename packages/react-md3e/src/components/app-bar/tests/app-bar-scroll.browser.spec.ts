import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('flexible app bars collapse inside their nearest scroller, preserve one title and expand at the start', async ({
  page,
}) => {
  await page.goto('/app-bar-scroll');

  for (const [variant, expanded, titleSize] of [
    ['mediumFlexible', 136, '28px'],
    ['largeFlexible', 152, '36px'],
  ] as const) {
    const panel = page.getByTestId(`scroll-${variant}`);
    const bar = page.getByTestId(`scroll-bar-${variant}`);
    const title = bar.locator('[data-md3-app-bar-title]');

    await expect(bar).toHaveAttribute('data-scroll-ready', 'true');
    await expect(bar).toHaveCSS('height', `${expanded}px`);
    await expect(title).toHaveCSS('font-size', titleSize);
    await title.evaluate((node) => node.setAttribute('data-original-title', 'true'));
    await panel.evaluate((node) => {
      node.scrollTo({ top: 240 });
    });
    await expect(bar).toHaveCSS('height', '64px');
    await expect(bar).toHaveAttribute('data-scrolled', 'true');
    await expect(title).toHaveCSS('font-size', '22px');
    await expect(bar.locator('[data-md3-app-bar-subtitle]')).toHaveCSS('font-size', '12px');
    await expect(title).toHaveAttribute('data-original-title', 'true');
    await expect(page.locator(`#scroll-title-${variant}`)).toHaveCount(1);
    await expect(bar.locator('..')).toHaveCSS('height', `${expanded}px`);
    await panel.evaluate((node) => {
      node.scrollTo({ top: 180 });
    });
    await expect(bar).toHaveCSS('height', '64px');
    await panel.evaluate((node) => {
      node.scrollTo({ top: 0 });
    });
    await expect(bar).toHaveCSS('height', `${expanded}px`);
    await expect(bar).toHaveAttribute('data-scrolled', 'false');
    await expect(title).toHaveCSS('font-size', titleSize);
  }
});

test('scroll progress directly drives geometry and partial gestures settle with the theme spring', async ({ page }) => {
  await page.goto('/app-bar-scroll');

  const panel = page.getByTestId('scroll-largeFlexible');
  const bar = page.getByTestId('scroll-bar-largeFlexible');

  await expect(bar).toHaveAttribute('data-scroll-ready', 'true');

  const during = await panel.evaluate((node) => {
    node.scrollTo({ top: 24 });
    node.dispatchEvent(new Event('scroll'));

    return node.querySelector<HTMLElement>('[data-md3-app-bar]')!.getBoundingClientRect().height;
  });

  expect(during).toBeCloseTo(128, 0);
  await expect(bar).toHaveAttribute('data-settling', 'true');

  const spring = await bar.evaluate((node) => {
    const animation = node
      .getAnimations()
      .find(
        (player) => player instanceof CSSTransition && ['height', 'block-size'].includes(player.transitionProperty),
      );

    if (!animation) {
      return null;
    }

    animation.pause();
    animation.currentTime = 50;

    const sample = node.getBoundingClientRect().height;
    const easing = animation.effect?.getTiming().easing;

    animation.finish();

    return { sample, easing };
  });

  expect(spring?.sample).toBeGreaterThan(128);
  expect(spring?.sample).toBeLessThan(152);
  expect(spring?.easing).toContain('linear(');
  await expect(bar).toHaveCSS('height', '152px');
  await panel.evaluate((node) => {
    node.scrollTo({ top: 100 });
    node.dispatchEvent(new Event('scroll'));
  });
  await expect(bar).toHaveCSS('height', '64px');
});

test('enterAlways hides small and flexible app bars and returns them on upward scroll', async ({ page }) => {
  await page.goto('/app-bar-scroll');

  for (const [panelId, barId, expanded] of [
    ['scroll-enter', 'enter-bar', 64],
    ['scroll-enter-large', 'enter-large-bar', 152],
  ] as const) {
    const panel = page.getByTestId(panelId);
    const bar = page.getByTestId(barId);

    await expect(bar).toHaveAttribute('data-scroll-ready', 'true');
    await panel.evaluate((node) => {
      node.scrollTo({ top: 300 });
    });
    await expect(bar).toHaveAttribute('data-hidden', 'true');
    await expect(bar).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -64)');
    await panel.evaluate((node) => {
      node.scrollTo({ top: 100 });
    });
    await expect(bar).toHaveAttribute('data-hidden', 'false');
    await expect(bar).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect(bar).toHaveCSS('height', `${expanded}px`);
  }

  await expect(page.getByTestId('window-scroll-bar')).toHaveAttribute('data-scrolled', 'false');
});

test('quick return reveals keyboard focus and preserves the existing Search modal and query', async ({ page }) => {
  await page.goto('/app-bar-scroll');

  const panel = page.getByTestId('scroll-search');
  const bar = page.getByTestId('scroll-search-bar');

  await expect(bar).toHaveAttribute('data-scroll-ready', 'true');
  await panel.evaluate((node) => {
    node.scrollTo({ top: 300 });
  });
  await expect(bar).toHaveAttribute('data-hidden', 'true');
  await bar.getByRole('searchbox').focus();
  await expect(bar).toHaveAttribute('data-hidden', 'false');

  const dialog = page.getByRole('dialog', { name: 'Search scrolling collection', exact: true });

  await expect(dialog.getByRole('searchbox')).toBeFocused();
  await dialog.getByRole('searchbox').fill('Saved query');
  await page.keyboard.press('Escape');
  await expect(bar.getByRole('searchbox')).toBeFocused();
  await expect(bar.getByRole('searchbox')).toHaveValue('Saved query');
  await panel.evaluate((node) => {
    node.scrollTo({ top: 450 });
  });
  await expect(bar).toHaveAttribute('data-hidden', 'false');
});

test('pinned scrolling changes the surface without changing height; explicit targets and overrides work', async ({
  page,
}) => {
  await page.goto('/app-bar-scroll');

  const pinned = page.getByTestId('pinned-bar');
  const external = page.getByTestId('external-scroll-bar');

  await expect(pinned).toHaveAttribute('data-scroll-ready', 'true');
  await page.getByTestId('scroll-pinned').evaluate((node) => {
    node.scrollTo({ top: 300 });
  });
  await expect(pinned).toHaveCSS('height', '112px');
  await expect(pinned).toHaveAttribute('data-scrolled', 'true');
  await expect(external).toHaveAttribute('data-scroll-ready', 'true');
  await page.getByTestId('external-scroll-target').evaluate((node) => {
    node.scrollTo({ top: 220 });
  });
  await expect(external).toHaveCSS('height', '64px');
  await expect(external).toHaveAttribute('data-scrolled', 'true');
  await page.getByRole('button', { name: 'Toggle surface override' }).click();
  await expect(external).toHaveAttribute('data-scrolled', 'false');
  await page.getByRole('button', { name: 'Toggle surface override' }).click();
  await expect(external).toHaveAttribute('data-scrolled', 'true');
  await page.getByRole('button', { name: 'Check header ref' }).click();
  await expect(external).toHaveAttribute('data-ref-checked', 'true');
});

test('disabling and re-enabling scroll subscriptions preserves the header DOM and child state', async ({ page }) => {
  await page.goto('/app-bar-scroll');

  const bar = page.getByTestId('external-scroll-bar');
  const panel = page.getByTestId('external-scroll-target');

  await expect(bar).toHaveAttribute('data-scroll-ready', 'true');
  await bar.evaluate((node) => node.setAttribute('data-original-header', 'true'));
  await bar.getByRole('button', { name: 'Count 0' }).click();
  await page.getByRole('button', { name: 'Toggle scroll behavior' }).click();
  await expect(bar).not.toHaveAttribute('data-scroll-ready');
  await expect(bar).toHaveAttribute('data-original-header', 'true');
  await expect(bar.getByRole('button', { name: 'Count 1' })).toBeVisible();
  await panel.evaluate((node) => {
    node.scrollTo({ top: 240 });
  });
  await expect(bar).toHaveCSS('height', '112px');
  await expect(bar).toHaveAttribute('data-scrolled', 'false');
  await page.getByRole('button', { name: 'Toggle scroll behavior' }).click();
  await expect(bar).toHaveAttribute('data-scroll-ready', 'true');
  await expect(bar).toHaveCSS('height', '64px');
  await expect(bar).toHaveAttribute('data-original-header', 'true');
});

test('window scrolling, resize, wrapped RTL labels, reduced motion and forced colors remain usable', async ({
  page,
}) => {
  await page.goto('/app-bar-scroll');

  const windowBar = page.getByTestId('window-scroll-bar');

  await expect(windowBar).toHaveAttribute('data-scroll-ready', 'true');
  await page.evaluate(() => window.scrollTo(0, 350));
  await expect(windowBar).toHaveCSS('height', '64px');
  await page.reload();
  await expect(windowBar).toHaveAttribute('data-scroll-ready', 'true');
  await expect(windowBar).toHaveCSS('height', '64px');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(windowBar).toHaveCSS('height', '152px');
  await page.setViewportSize({ width: 390, height: 844 });

  const bar = page.getByTestId('centered-scroll-bar');

  await page.getByTestId('scroll-centered').evaluate((node) => {
    node.scrollTo({ top: 400 });
  });
  await expect(bar).toHaveAttribute('data-collapsed', 'true');
  await expect(bar.locator('[data-md3-app-bar-title]')).toHaveCSS('font-size', '22px');

  const titleBox = (await bar.locator('[data-md3-app-bar-label]').boundingBox())!;
  const box = (await bar.boundingBox())!;

  expect(titleBox.y).toBeGreaterThanOrEqual(box.y - 1);
  expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(box.y + box.height + 1);
  expect(titleBox.x + titleBox.width / 2).toBeCloseTo(box.x + box.width / 2, 0);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.getByTestId('scroll-centered').evaluate((node) => {
    node.scrollTo({ top: 0 });
  });
  await expect(bar).toHaveCSS('transition-duration', '0s');
  await expect(bar).toHaveCSS('border-bottom-style', 'solid');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('scrolling AppBar renders expanded server HTML without JavaScript and Storybook uses the same behavior', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/app-bar-scroll');
    await expect(server.getByTestId('window-scroll-bar')).toHaveCSS('height', '152px');
    await expect(server.getByTestId('scroll-bar-mediumFlexible')).toHaveCSS('height', '136px');
    await expect(server.getByTestId('scroll-bar-mediumFlexible').getByRole('heading')).toHaveCount(1);
    await expect(server.getByTestId('window-scroll-bar')).not.toHaveAttribute('data-scroll-ready');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByTestId('streamed-auto-app-bar')).toHaveAttribute('data-scroll-ready', 'true');
  await expect(page.getByTestId('streamed-auto-app-bar')).toHaveCSS('height', '112px');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-appbar--collapsing&viewMode=story');
  await expect(page.locator('[data-md3-app-bar]')).toHaveAttribute('data-scroll-ready', 'true');
  await page.locator('.story-scroll').evaluate((node) => {
    node.scrollTo({ top: 240 });
  });
  await expect(page.locator('[data-md3-app-bar]')).toHaveCSS('height', '64px');
});
