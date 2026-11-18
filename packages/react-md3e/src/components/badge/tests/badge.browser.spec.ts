import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Locator } from '@playwright/test';

const indicator = (root: Locator) => root.locator('[data-md3-badge-indicator]');

test('Badge renders styled server HTML, fixed icon offsets and RTL mirroring before JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/badges');

    for (const prefix of ['', 'rtl-']) {
      for (const [variant, size, overlap] of [
        ['small', 6, 6],
        ['large', 16, 12],
      ] as const) {
        const root = page.getByTestId(`${prefix}${variant}-badge`);
        const badge = indicator(root);
        const anchorBox = (await root.boundingBox())!;
        const badgeBox = (await badge.boundingBox())!;

        expect(anchorBox.width).toBe(24);
        expect(anchorBox.height).toBe(24);
        expect(badgeBox.width).toBeCloseTo(size);
        expect(badgeBox.height).toBeCloseTo(size);
        expect(badgeBox.y - anchorBox.y).toBeCloseTo(variant === 'large' ? -2 : 0);

        if (prefix) {
          expect(badgeBox.x + badgeBox.width - anchorBox.x).toBeCloseTo(overlap);
        } else {
          expect(anchorBox.x + anchorBox.width - badgeBox.x).toBeCloseTo(overlap);
        }

        await expect(badge).toHaveAttribute('aria-hidden', 'true');
        await expect(root).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      }
    }

    await expect(indicator(page.getByTestId('overflow-badge'))).toHaveText('999+');
    await expect(indicator(page.getByTestId('hidden-zero'))).toHaveCSS('opacity', '0');
    await expect(indicator(page.getByTestId('visible-zero'))).toHaveText('0');
    await expect(indicator(page.getByTestId('visible-zero'))).toHaveCSS('opacity', '1');
    await expect(indicator(page.getByTestId('text-badge'))).toHaveText('New');

    const standalone = page.getByTestId('standalone-badge');

    expect((await standalone.boundingBox())!.width).toBeGreaterThanOrEqual(16);
    expect((await standalone.boundingBox())!.height).toBe(16);
    await page.goto('http://127.0.0.1:3100/streaming');
    await expect(indicator(page.getByTestId('streamed-badge'))).toHaveText('12');
    await expect(indicator(page.getByTestId('streamed-badge'))).toHaveCSS('min-height', '16px');
  } finally {
    await context.close();
  }
});

test('controlled counts, visibility, refs and keyboard activation preserve the destination and its size', async ({
  page,
}) => {
  await page.goto('/badges');

  const root = page.getByTestId('changing-badge');
  const badge = indicator(root);
  const destination = page.getByRole('button').filter({ has: root });
  const originalBox = (await root.boundingBox())!;
  const styles = await page.locator('style').count();

  await page.getByRole('button', { name: 'Check refs' }).click();
  await expect(page.getByTestId('badge-refs')).toHaveText('Refs connected');
  await expect(badge).toHaveAttribute('title', 'Unread messages');
  await page.getByRole('button', { name: 'Add messages' }).click();
  await expect(badge).toHaveText('999+');
  await expect(destination).toHaveAccessibleName('Inbox, 999+ unread messages');
  await expect(destination).toHaveAccessibleDescription('1005 unread messages in total');
  await page.getByRole('button', { name: 'Toggle badge' }).click();
  await expect(badge).toHaveCSS('opacity', '0');
  await expect(destination).toBeVisible();
  await page.getByRole('button', { name: 'Toggle badge' }).click();
  await expect(badge).toHaveCSS('opacity', '1');
  await destination.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Inbox, 0 unread messages', exact: true })).toBeFocused();
  await expect(badge).toHaveCSS('opacity', '0');

  const finalBox = (await root.boundingBox())!;

  expect(finalBox.width).toBe(originalBox.width);
  expect(finalBox.height).toBe(originalBox.height);
  expect(await page.locator('style').count()).toBe(styles);
});

test('Badge inherits theme colors, spring motion and accessibility preferences', async ({ page }) => {
  await page.goto('/badges');

  const light = indicator(page.getByTestId('large-badge'));
  const dark = indicator(page.getByTestId('rtl-large-badge'));
  const lightColor = await light.evaluate((node) => getComputedStyle(node).backgroundColor);
  const darkColor = await dark.evaluate((node) => getComputedStyle(node).backgroundColor);

  expect(darkColor).not.toBe(lightColor);
  await expect(light).not.toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(light).toHaveCSS('transition-duration', '0s');
  await expect(dark).toHaveCSS('transition-duration', '0s');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(light).toHaveCSS('outline-width', '1px');
  await expect(light).toHaveCSS('opacity', '1');
  await expect(indicator(page.getByTestId('small-badge'))).toHaveCSS('outline-width', '1px');
});

test('Storybook exposes Material badge variants and accessible IconButton composition', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-badge--counts&viewMode=story&globals=brand:forest;colorScheme:dark;a11y.manual:!true',
  );
  await expect(page.getByRole('button')).toHaveCount(4);

  const overflow = page.getByRole('button', { name: 'Inbox, 999+ unread messages' });

  await expect(overflow).toContainText('999+');
  await expect(overflow).toHaveAccessibleDescription('1000 unread messages in total');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-badge--small&viewMode=story');
  await expect(page.locator('[data-md3-badge-indicator]')).toHaveCSS('width', '6px');
});
