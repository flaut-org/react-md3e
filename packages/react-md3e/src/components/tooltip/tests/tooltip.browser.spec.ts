import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

test('plain Tooltip describes a focused control, keeps focus, and dismisses on Escape', async ({ page }) => {
  await page.goto('/essentials');

  const action = page.getByRole('button', { name: 'Tooltip action', exact: true });

  await action.focus();

  const tip = page.getByRole('tooltip');

  await expect(tip).toHaveText('Switch appearance');
  await expect(action).toBeFocused();
  await expect(action).toHaveAccessibleDescription('Switch appearance');

  const theme = createTheme({ sourceColor: '#386a20' });
  const hex = theme.schemes.light.inverseSurface;
  const rgb = `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

  await expect(tip).toHaveCSS('background-color', rgb);
  await action.press('Escape');
  await expect(tip).not.toBeVisible();
  await expect(action).toBeFocused();
});

test('Tooltip remains hoverable and supports disabled controls through a focusable wrapper', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Tooltip action', exact: true }).hover();

  const tip = page.getByRole('tooltip');

  await expect(tip).toBeVisible();
  await tip.hover();
  await expect(tip).toBeVisible();
  await page.getByRole('heading', { level: 1 }).hover();
  await expect(tip).not.toBeVisible();
  await page.getByRole('button', { name: 'Unavailable action', exact: true }).focus();
  await expect(page.getByRole('tooltip')).toHaveText('Passenger limit reached');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('tooltip')).toHaveCSS('transition-duration', '0s');
});
