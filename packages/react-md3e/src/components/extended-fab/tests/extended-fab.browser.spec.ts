import { expect, test } from '@playwright/test';

test('ExtendedFab uses current expressive typography, insets and icon gaps', async ({ page }) => {
  await page.goto('/fabs');

  for (const [size, height, font, inset, gap, icon] of [
    ['small', '56px', '16px', '16px', '8px', '24px'],
    ['medium', '80px', '22px', '26px', '12px', '28px'],
    ['large', '96px', '24px', '28px', '16px', '36px'],
  ]) {
    const fab = page.getByTestId(`extended-fab-${size}`);

    await expect(fab).toHaveCSS('height', height!);
    await expect(fab).toHaveCSS('font-size', font!);
    await expect(fab).toHaveCSS('padding-inline-start', inset!);
    await expect(fab).toHaveCSS('gap', gap!);
    await expect(fab.locator('svg')).toHaveCSS('width', icon!);

    const short = page.getByTestId(`extended-fab-short-${size}`);

    await expect(short).toHaveCSS('width', height!);
    await expect(short).toHaveCSS('justify-content', 'center');
  }

  await expect(page.getByTestId('text-extended-fab')).toHaveAccessibleName('Label only');
  await expect(page.getByTestId('text-extended-fab').locator('[data-md3-icon]')).toHaveCount(0);
});

test('collapsing preserves the icon and accessible label and animates back on expansion', async ({ page }) => {
  await page.goto('/fabs');

  const fab = page.getByTestId('collapsible-fab');
  const toggle = page.getByRole('button', { name: 'Toggle extended label' });
  const initial = await fab.boundingBox();

  await toggle.click();
  await expect(fab).toHaveAccessibleName('Compose message');
  await expect(fab).toHaveCSS('width', '56px');
  await expect(fab).toHaveCSS('height', '56px');
  await expect(fab.locator('svg')).toHaveCSS('width', '24px');

  const bounds = (await fab.boundingBox())!;
  const icon = (await fab.locator('svg').boundingBox())!;

  expect(icon.x + icon.width / 2).toBeCloseTo(bounds.x + bounds.width / 2, 1);
  expect(icon.y + icon.height / 2).toBeCloseTo(bounds.y + bounds.height / 2, 1);
  await expect(fab.locator('[data-md3-extended-fab-label]')).toHaveAttribute('aria-hidden', 'true');
  await toggle.click();
  await expect.poll(async () => (await fab.boundingBox())!.width).toBeCloseTo(initial!.width, 0);
  await expect(fab.locator('[data-md3-extended-fab-label]')).not.toHaveAttribute('aria-hidden');
});

test('Collapsible story centers text icons in every size and direction, including repeated collapse', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const [size, height, iconSize] of [
    ['small', 56, 24],
    ['medium', 80, 28],
    ['large', 96, 36],
  ] as const) {
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-extendedfab--collapsible&viewMode=story&args=size:${size}&globals=colorScheme:dark`,
    );

    const fab = page.getByRole('button', { name: 'Compose message', exact: true });
    const toggle = page.getByRole('button', { name: 'Toggle label', exact: true });

    for (const direction of ['ltr', 'rtl']) {
      await page.evaluate((dir) => {
        document.documentElement.dir = dir;
      }, direction);
      await toggle.click();
      await expect(fab).toHaveCSS('width', `${height}px`);
      await expect(fab.locator('[data-md3-icon="start"]')).toHaveCSS('font-size', `${iconSize}px`);

      const geometry = await fab.evaluate((element) => {
        const slot = element.querySelector('[data-md3-icon="start"]')!;
        const range = document.createRange();

        range.selectNodeContents(slot);

        const button = element.getBoundingClientRect();
        const glyph = range.getBoundingClientRect();
        const area = slot.getBoundingClientRect();

        return {
          glyphOffset: glyph.x + glyph.width / 2 - button.x - button.width / 2,
          startInset: area.x - button.x,
          endInset: button.right - area.right,
        };
      });

      expect(Math.abs(geometry.glyphOffset)).toBeLessThan(0.5);
      expect(geometry.startInset).toBeCloseTo(geometry.endInset, 1);
      await expect(fab).toHaveAccessibleName('Compose message');
      await toggle.click();
      await expect(fab).toHaveAttribute('data-extended', 'true');
    }
  }
});

test('reduced motion applies the collapsed width immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fabs');
  await page.getByRole('button', { name: 'Toggle extended label' }).click();

  const fab = page.getByTestId('collapsible-fab');

  await expect(fab).toHaveCSS('width', '56px');
  await expect(fab).toHaveCSS('transition-property', 'none');
  expect(await fab.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});
