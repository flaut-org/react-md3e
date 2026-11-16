import { expect, test } from '@playwright/test';

test('placeholders are decorative, size preserving and remove descendants from focus', async ({ page }) => {
  await page.goto('/essentials');

  const all = page.getByTestId('skeletons').locator('[data-md3-skeleton]');

  await expect(all).toHaveCount(4);
  await expect(all.nth(0)).toHaveCSS('width', '200px');
  await expect(all.nth(1)).toHaveCSS('border-radius', '12px');
  await expect(all.nth(2)).toHaveCSS('border-radius', '50%');
  await expect(all.nth(2)).toHaveCSS('animation-name', 'none');

  for (const skeleton of await all.all()) {
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  }

  await expect(page.getByTestId('inert-skeleton')).toHaveAttribute('inert', '');
  await page
    .getByTestId('inert-skeleton')
    .locator('button')
    .evaluate((node) => node.focus());
  await expect(page.getByTestId('inert-skeleton').locator('button')).not.toBeFocused();
});

test('Skeleton arrives styled without JavaScript and honors reduced motion and forced colors', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/essentials');
    await expect(server.getByTestId('skeletons').locator('[data-variant="rounded"]')).toHaveCSS('height', '80px');
  } finally {
    await context.close();
  }

  await page.goto('/essentials');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByTestId('skeletons').locator('[data-animation="pulse"]').first()).toHaveCSS(
    'animation-name',
    'none',
  );
  expect(
    await page
      .getByTestId('skeletons')
      .locator('[data-animation="wave"]')
      .evaluate((node) => getComputedStyle(node, '::after').animationName),
  ).toBe('none');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('skeletons').locator('[data-md3-skeleton]').first()).toHaveCSS('outline-width', '1px');
});
