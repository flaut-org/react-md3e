import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const expressive = createTheme();
const standard = createTheme({ motionScheme: 'standard' });
const seconds = (value: number) => `${value / 1000}s`;

test('static and inline motion themes style server HTML before hydration', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/motion');
    await expect(page.getByTestId('static-motion-button')).toHaveCSS(
      'transition-duration',
      `${seconds(standard.motion.fast.spatial.duration)}, ${seconds(standard.motion.fast.effects.duration)}`,
    );
    await expect(page.getByTestId('motion-button')).toHaveCSS(
      'transition-duration',
      `${seconds(expressive.motion.fast.spatial.duration)}, ${seconds(expressive.motion.fast.effects.duration)}`,
    );
    await expect(page.getByTestId('motion-scope')).toHaveCSS('--md-sys-motion-spring-fast-spatial-stiffness', '800');
  } finally {
    await context.close();
  }
});

test('switching ThemeProvider motion changes components and portals, preserves nested defaults, and inserts no rules', async ({
  page,
}) => {
  await page.goto('/motion');

  const styleCount = await page.locator('style').count();
  const scope = page.getByTestId('motion-scope');
  const primary = await scope.evaluate((node) => getComputedStyle(node).getPropertyValue('--md-sys-color-primary'));

  for (const scheme of ['standard', 'expressive'] as const) {
    const theme = scheme === 'standard' ? standard : expressive;

    await page.getByLabel('Motion scheme', { exact: true }).selectOption(scheme);
    await expect(page.getByTestId('motion-button')).toHaveCSS(
      'transition-duration',
      `${seconds(theme.motion.fast.spatial.duration)}, ${seconds(theme.motion.fast.effects.duration)}`,
    );
    await expect(page.getByTestId('motion-shape')).toHaveCSS(
      'transition-duration',
      seconds(theme.motion.default.spatial.duration),
    );
    await expect(page.getByTestId('nested-motion-button')).toHaveCSS(
      'transition-duration',
      `${seconds(expressive.motion.fast.spatial.duration)}, ${seconds(expressive.motion.fast.effects.duration)}`,
    );
    expect(await scope.evaluate((node) => getComputedStyle(node).getPropertyValue('--md-sys-color-primary'))).toBe(
      primary,
    );
    await page.getByRole('button', { name: 'Open motion dialog', exact: true }).click();

    const dialog = page.getByRole('alertdialog', { name: 'Themed motion dialog' });

    await expect(dialog).toHaveCSS(
      'transition-duration',
      `${seconds(theme.motion.fast.effects.duration)}, ${seconds(theme.motion.default.spatial.duration)}`,
    );
    await expect(dialog).toHaveCSS(
      '--md-sys-motion-spring-default-spatial-stiffness',
      String(theme.motion.default.spatial.stiffness),
    );
    await dialog.getByRole('button', { name: 'Close motion dialog', exact: true }).click();
    await expect(dialog).toHaveCount(0);
  }

  expect(await page.locator('style').count()).toBe(styleCount);
});

test('expressive CSS motion overshoots while standard remains restrained', async ({ page }) => {
  const peaks: number[] = [];

  for (const scheme of ['expressive', 'standard']) {
    await page.goto('/motion');
    await page.getByLabel('Motion scheme', { exact: true }).selectOption(scheme);
    await page.getByTestId('motion-button').click();

    const peak = await page.getByTestId('motion-sample').evaluate((node) => {
      const animation = node.getAnimations()[0];

      if (!animation?.effect) {
        throw new Error('The CSS transition did not start.');
      }

      animation.pause();

      const duration = Number(animation.effect.getTiming().duration);
      const positions = Array.from({ length: 41 }, (_, index) => {
        animation.currentTime = (duration * index) / 40;

        return new DOMMatrixReadOnly(getComputedStyle(node).transform).m41;
      });

      animation.finish();

      return Math.max(...positions);
    });

    peaks.push(peak);
  }

  expect(peaks[0]).toBeGreaterThan(180 * 1.05);
  expect(peaks[1]).toBeLessThan(180 * 1.01);
});

test('CSS token overrides and reduced motion take precedence for both schemes', async ({ page }) => {
  await page.goto('/motion');
  await page
    .getByTestId('motion-scope')
    .evaluate((node) => node.style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '900ms'));
  await expect(page.getByTestId('motion-button')).toHaveCSS(
    'transition-duration',
    `0.9s, ${seconds(expressive.motion.fast.effects.duration)}`,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const scheme of ['standard', 'expressive']) {
    await page.getByLabel('Motion scheme', { exact: true }).selectOption(scheme);
    await expect(page.getByTestId('motion-button')).toHaveCSS('transition-duration', '0s');
    await expect(page.getByTestId('motion-shape')).toHaveCSS('transition-duration', '0s');
    await expect(page.getByTestId('motion-sample')).toHaveCSS('transition-duration', '0s');
    await page.getByRole('button', { name: 'Open motion dialog', exact: true }).click();
    await expect(page.getByRole('alertdialog')).toHaveCSS('transition-duration', '0s');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
  }
});

test('Storybook offers motion schemes independently of its brand and color scheme', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-button--playground&viewMode=story&globals=brand:forest;colorScheme:dark;motionScheme:standard',
  );
  await expect(page.getByRole('button', { name: 'Get started', exact: true })).toHaveCSS(
    'transition-duration',
    `${seconds(standard.motion.fast.spatial.duration)}, ${seconds(standard.motion.fast.effects.duration)}`,
  );
  await expect(page.locator('[data-md3-theme]').first()).toHaveCSS('color-scheme', 'dark');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=foundations-motion--schemes&viewMode=story');
  await page.getByLabel('Motion scheme', { exact: true }).selectOption('standard');
  await expect(page.getByTestId('motion-scope')).toHaveCSS('--md-sys-motion-spring-fast-spatial-stiffness', '1400');
});
