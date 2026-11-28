import { test, expect } from '../../../../tests/browser/ui-quality/storybook';

test('[DP-008] date entry, focus and calendar themes', async ({ page, story }) => {
  await story('qa-datepicker--empty');
  await expect(page).toHaveScreenshot('date-empty.png');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox')).toBeFocused();
  await expect(page).toHaveScreenshot('date-focused.png');
  await page.getByRole('button', { name: /Choose date/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(page).toHaveScreenshot('date-calendar.png');
});

test('[DP-014] RTL localized calendar in forest theme', async ({ page, story }) => {
  await story('components-datepicker--right-to-left', { brand: 'forest', motionScheme: 'standard' });
  await page.getByRole('button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(page).toHaveScreenshot('date-rtl-forest.png');
});
