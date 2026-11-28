import { test, expect } from '../../../../tests/browser/ui-quality/storybook';

test('[DP-005] range preview dashes across adjacent days and fractional cell widths', async ({ page, story }) => {
  await page.setViewportSize({ width: 1000, height: 720 });
  await story('qa-datepicker--range-preview');
  await page.getByRole('button', { name: /Choose date range/ }).click();

  const popup = page.getByRole('dialog');

  await popup.locator('[data-calendar-current] button[data-date="2024-02-02"]').click();

  for (const width of [360, 335, 320]) {
    await popup
      .locator('[data-md3-calendar]')
      .evaluate((node, size) => node.style.setProperty('inline-size', `${size}px`), width);
    await popup.locator('[data-calendar-current] button[data-date="2024-02-18"]').hover();
    await expect(popup.locator('[data-calendar-current] button[data-date="2024-02-14"]')).toHaveAttribute(
      'data-preview',
      'true',
    );
    await expect(popup, 'DP-005:dash-continuity').toHaveScreenshot(`range-preview-${width}.png`);
  }
});
