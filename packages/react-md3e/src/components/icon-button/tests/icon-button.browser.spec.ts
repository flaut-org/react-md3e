import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });

const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

const container = '[data-md3-icon-button-container]';

const inkSelector = '[data-md3-ripple-ink]';

test('IconButton uses theme roles, expressive dimensions, widths, and minimum interaction targets', async ({
  page,
}) => {
  await page.goto('/components');

  await expect(page.getByTestId('icon-filled').locator(container)).toHaveCSS(
    'background-color',
    rgb(forest.schemes.light.primary),
  );
  await expect(page.getByTestId('icon-tonal').locator(container)).toHaveCSS(
    'background-color',
    rgb(forest.schemes.light.secondaryContainer),
  );
  await expect(page.getByTestId('icon-outlined')).toHaveCSS('color', rgb(forest.schemes.light.onSurfaceVariant));
  await expect(page.getByTestId('icon-outlined').locator(container)).toHaveCSS(
    'border-top-color',
    rgb(forest.schemes.light.outlineVariant),
  );
  await expect(page.getByTestId('icons-dark').getByRole('button').locator(container)).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.primary),
  );

  for (const [size, height, icon] of [
    ['extraSmall', 32, 20],
    ['small', 40, 24],
    ['medium', 56, 24],
    ['large', 96, 32],
    ['extraLarge', 136, 40],
  ] as const) {
    const button = page.getByTestId(`icon-${size}`);

    await expect(button.locator(container)).toHaveCSS('height', `${height}px`);
    await expect(button.locator('svg')).toHaveCSS('width', `${icon}px`);
    await expect(button).toHaveCSS('height', `${Math.max(48, height)}px`);
    expect((await button.boundingBox())!.width).toBeGreaterThanOrEqual(48);
  }

  for (const [width, pixels] of [
    ['narrow', 48],
    ['default', 56],
    ['wide', 72],
  ] as const) {
    await expect(page.getByTestId(`icon-width-${width}`).locator(container)).toHaveCSS('width', `${pixels}px`);
  }
});

test('IconButton retains keyboard, toggle, ref, disabled and form semantics without generating styles', async ({
  page,
}) => {
  await page.goto('/components');

  const styles = await page.locator('style').count();
  const clicker = page.getByRole('button', { name: 'Count icon clicks', exact: true });

  await clicker.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(page.getByTestId('icon-click-count')).toHaveText('2');
  await page
    .getByRole('button', { name: 'Disabled icon action' })
    .evaluate((element) => (element as HTMLButtonElement).click());
  await expect(page.getByTestId('icon-click-count')).toHaveText('2');

  const toggle = page.getByRole('button', { name: 'Toggle favorite' });

  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle.locator(container)).toHaveCSS('border-radius', '18px');
  await expect(toggle.locator(container)).toHaveCSS('background-color', rgb(forest.schemes.light.secondary));
  await page.getByRole('button', { name: 'Focus first icon' }).click();
  await expect(clicker).toBeFocused();
  await page.getByRole('button', { name: 'Normal icon button', exact: true }).click();
  await expect(page.getByTestId('icon-submission-count')).toHaveText('0');
  await page.getByRole('button', { name: 'Submit icon form' }).click();
  await expect(page.getByTestId('icon-submission-count')).toHaveText('1');
  expect(await page.locator('style').count()).toBe(styles);
});

test('IconButton clips ripple to the visual container, preserves pointer geometry and respects opt-outs', async ({
  page,
}) => {
  await page.goto('/components');

  const button = page.getByRole('button', { name: 'Count icon clicks', exact: true });
  const visual = button.locator(container);
  const ink = button.locator(inkSelector);

  await button.scrollIntoViewIfNeeded();

  const box = (await visual.boundingBox())!;

  await page.mouse.move(box.x + 8, box.y + 16);
  await page.mouse.down();
  await expect(ink).toHaveCount(1);

  const geometry = await ink.evaluate((element) => ({
    x: parseFloat((element as HTMLElement).style.getPropertyValue('--_ripple-start-x')),
    size: parseFloat((element as HTMLElement).style.getPropertyValue('--_ripple-size')),
  }));

  expect(geometry.x + geometry.size / 2).toBeCloseTo(8, 0);
  await expect(ink.locator('..')).toHaveCSS('overflow', 'hidden');
  await expect(visual).toHaveCSS('border-radius', '8px');
  await page.mouse.up();
  await expect(ink).toHaveCount(0);
  await page.getByRole('button', { name: 'Without icon ripple' }).click();
  await expect(page.getByRole('button', { name: 'Without icon ripple' }).locator(inkSelector)).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.click();
  await expect(ink).toHaveCount(0);
  await expect(visual).toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' });
  await button.focus();
  await page.keyboard.press('Space');
  await expect(visual).toHaveCSS('outline-style', 'solid');
  await expect(ink).toHaveCount(0);
});
