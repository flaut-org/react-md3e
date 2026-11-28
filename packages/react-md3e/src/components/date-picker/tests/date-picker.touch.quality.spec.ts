import { test, expect } from '../../../../tests/browser/ui-quality/storybook';
import { expectUsableOverlay } from '../../../../tests/browser/ui-quality/assertions';

test('[DP-011] touch opens, selects, accepts and restores the picker', async ({ page, story }) => {
  await story('components-datepicker--responsive');
  await page.getByRole('button', { name: /Choose date/ }).tap();

  const popup = page.getByRole('dialog');
  const day = popup.locator('[data-calendar-current] button[data-date="2024-02-29"]');

  await expectUsableOverlay(popup, day);
  await day.tap();
  await popup.getByRole('button', { name: 'OK', exact: true }).tap();
  await expect(popup).toBeHidden();
  await expect(page.getByRole('textbox')).toHaveValue('02/29/2024');
});
