import { test, expect } from '../../../../tests/browser/ui-quality/storybook';

test('[BTN-001] default, disabled, hover and keyboard focus states', async ({ page, story }) => {
  await story('qa-datepicker--button-states', { brand: 'expressive' });
  await expect(page).toHaveScreenshot('button-states.png');
  await page.getByRole('button', { name: 'Continue', exact: true }).hover();
  await expect(page).toHaveScreenshot('button-hover.png');
  await page.mouse.move(0, 0);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeFocused();
  await expect(page).toHaveScreenshot('button-focus.png');
  await page.getByRole('button', { name: 'Continue', exact: true }).hover();
  await page.mouse.down();
  await expect(page).toHaveScreenshot('button-pressed.png');
  await page.mouse.up();
});
