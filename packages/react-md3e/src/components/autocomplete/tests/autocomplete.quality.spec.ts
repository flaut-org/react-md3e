import { test, expect } from '../../../../tests/browser/ui-quality/storybook';

test('[AC-001] multiple autocomplete keeps wrapping tags and its floating label', async ({ page, story }, testInfo) => {
  await story('components-autocomplete--multiple');

  const container = page.locator('[data-md3-field-container]');

  await expect(container).toHaveCSS('display', 'flex');
  await expect(container).toHaveCSS('flex-wrap', 'wrap');
  await expect(page.locator('[data-md3-field-label]')).toHaveCSS('inset-inline-start', '16px');
  await page.getByRole('combobox').fill('Ky');
  await page.getByRole('option', { name: 'Kyiv', exact: true }).click();
  await expect(page.getByRole('button', { name: /Clear Kyiv/ })).toBeVisible();
  await testInfo.attach('multiple-autocomplete.png', { body: await page.screenshot(), contentType: 'image/png' });
});
