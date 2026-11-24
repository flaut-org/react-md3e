import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('horizontal RTL navigation and a single group tab stop are preserved', async ({ page }) => {
  await page.goto('/selection-controls');

  const group = page.getByRole('radiogroup', { name: 'RTL radios' });
  const first = group.getByRole('radio', { name: 'RTL A' });
  const second = group.getByRole('radio', { name: 'RTL B' });

  await expect(group).toHaveCSS('direction', 'rtl');
  await expect(group).toHaveCSS('flex-direction', 'row');
  await first.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(second).toBeFocused();
  await expect(second).toBeChecked();
  await expect(group.locator('[role="radio"][tabindex="0"]')).toHaveCount(1);
});
test('radio controls arrive in server/streaming HTML and Storybook provides working controlled groups', async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/selection-controls');
    await expect(server.getByRole('radio', { name: 'Server first' })).toBeChecked();
    await expect(server.getByRole('radio', { name: 'Server first' }).locator('[data-indicator]')).toHaveCSS(
      'width',
      '20px',
    );
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('radio', { name: 'Streamed radio' })).toBeChecked();
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-radiogroup--controlled&viewMode=story&globals=colorScheme:dark;a11y.manual:!true',
  );
  await page.getByRole('radio', { name: 'Business' }).click();
  await expect(page.getByText('Selected: business')).toBeVisible();

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-radio--playground&viewMode=story');
  await expect(page.getByRole('radio', { name: 'Economy' })).toBeChecked();
});
