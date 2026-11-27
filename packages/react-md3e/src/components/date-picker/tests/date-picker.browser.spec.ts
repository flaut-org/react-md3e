import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('docked selection accepts, dismisses, restores focus and supports controlled opening', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/date-pickers');

  const example = page.getByRole('region', { name: 'Docked example', exact: true });
  const opener = example.getByRole('button', { name: /Choose date/ });

  await opener.click();

  const popup = page.getByRole('dialog', { name: 'Select date', exact: true });

  await expect(popup.locator('button[data-date="2024-02-28"][data-outside="false"]')).toBeFocused();
  await popup.locator('[data-calendar-current] button[data-date="2024-02-29"]').click();
  await expect(popup).toBeHidden();
  await expect(example.getByRole('textbox')).toHaveValue('02/29/2024');
  await expect(page.getByTestId('accepted-date')).toHaveText('2024-02-29');
  await expect(opener).toBeFocused();
  await example.getByRole('textbox').press('Alt+ArrowDown');
  await expect(popup).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await page.getByRole('button', { name: 'Open controlled picker', exact: true }).click();
  await expect(popup).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  expect(errors).toEqual([]);
});

test('modal draft cancels, accepts and clears independently of its saved value', async ({ page }) => {
  await page.goto('/date-pickers');

  const input = page.getByLabel('Modal date', { exact: true });
  const root = input.locator('xpath=ancestor::*[@data-md3-date-entry][1]');

  await root.getByRole('button', { name: /Choose date/ }).click();

  const modal = page.getByRole('dialog', { name: 'Select date', exact: true });

  await modal.locator('[data-calendar-current] button[data-date="2024-02-29"]').click();
  await expect(input).toHaveValue('02/29/2024');
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(input).toHaveValue('02/28/2024');
  await root.getByRole('button', { name: /Choose date/ }).click();
  await modal.locator('[data-calendar-current] button[data-date="2024-02-29"]').click();
  await modal.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(input).toHaveValue('02/29/2024');
  await expect(page.getByTestId('accepted-date')).toHaveText('2024-02-29');
  await root.getByRole('button', { name: /Choose date/ }).click();
  await modal.getByRole('button', { name: 'Clear', exact: true }).click();
  await modal.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(input).toHaveValue('');
});

test('modal entry keeps invalid text, disables acceptance and synchronizes mode changes', async ({ page }) => {
  await page.goto('/date-pickers');
  await page
    .getByRole('textbox', { name: 'Modal input date', exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button', { name: /Choose date/ })
    .click();

  const modal = page.getByRole('dialog', { name: 'Enter date', exact: true });
  const field = modal.getByRole('textbox');

  await expect(field).toBeFocused();
  await field.fill('02/31/2024');
  await expect(field).toHaveValue('02/31/2024');
  await expect(modal.getByRole('button', { name: 'OK', exact: true })).toBeDisabled();
  await modal.getByRole('button', { name: 'Switch to calendar', exact: true }).click();
  await expect(
    page.getByRole('dialog').locator('[data-calendar-current] button[data-date="2024-02-28"]'),
  ).toHaveAttribute('data-selected', 'true');
  await page.getByRole('dialog').getByRole('button', { name: 'Switch to text input', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('textbox')).toHaveValue('02/31/2024');
  await page.getByRole('dialog').getByRole('textbox').fill('03/10/2024');
  await page.getByRole('dialog').getByRole('button', { name: 'Switch to calendar', exact: true }).click();
  await expect(
    page.getByRole('dialog').locator('[data-calendar-current] button[data-date="2024-03-10"]'),
  ).toHaveAttribute('data-selected', 'true');
  await page.getByRole('dialog').getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Modal input date', exact: true })).toHaveValue('03/10/2024');
});

test('controlled field raw text survives invalid values and Escape rolls back its draft', async ({ page }) => {
  await page.goto('/date-pickers');

  const example = page.getByRole('region', { name: 'Docked example', exact: true });
  const input = example.getByRole('textbox');

  await input.fill('02/3');
  await expect(input).toHaveValue('02/3/yyyy');
  await input.fill('02/29/2024');
  await example.getByRole('button', { name: /Choose date/ }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Choose year/ })
    .click();
  await page.getByRole('dialog').getByRole('radio', { name: '2025', exact: true }).click();
  await expect(page.getByTestId('draft-date')).toHaveText('2025-02-28');
  await page.keyboard.press('Escape');
  await expect(input).toHaveValue('02/29/2024');
  await expect(page.getByTestId('date-source')).toHaveText('cancel');
});

test('responsive behavior uses capabilities/viewport and nested overlays dismiss in order', async ({ page }) => {
  await page.goto('/date-pickers');
  await page
    .getByLabel('Responsive date', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();
  await expect(page.getByRole('dialog')).toHaveAttribute('data-picker-modal', 'false');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 740 });
  await page
    .getByLabel('Responsive date', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();
  await expect(page.getByRole('dialog')).toHaveAttribute('data-picker-modal', 'true');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open parent dialog' }).click();
  await page
    .getByRole('dialog', { name: 'Booking', exact: true })
    .getByRole('button', { name: /Choose date/ })
    .click();
  await expect(page.getByRole('dialog', { name: 'Select date', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Select date', exact: true })).toBeHidden();
  await expect(page.getByRole('dialog', { name: 'Booking', exact: true })).toBeVisible();
});

test('popup positioning follows scrolling and stays in the viewport; read-only and disabled states hold', async ({
  page,
}) => {
  await page.goto('/date-pickers');
  await expect(page.getByLabel('Disabled date', { exact: true })).toBeDisabled();
  await expect(page.getByLabel('Read only date', { exact: true })).toHaveAttribute('readonly', '');
  await page
    .getByLabel('Read only date', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();
  await page.getByRole('dialog').locator('[data-calendar-current] button[data-date="2024-02-28"]').click();
  await expect(page.getByLabel('Read only date', { exact: true })).toHaveValue('02/29/2024');
  await page.keyboard.press('Escape');
  await page
    .getByLabel('Scroll date', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();

  const popup = page.getByRole('dialog');

  await page.getByRole('region', { name: 'Scrollable picker' }).evaluate((node) => {
    node.scrollTo({ top: 40 });
  });
  await page.setViewportSize({ width: 420, height: 600 });
  await expect(popup).toBeVisible();

  await expect
    .poll(async () => {
      const box = (await popup.boundingBox())!;

      return box.x >= 0 && box.x + box.width <= 420 && box.y + box.height <= 600;
    })
    .toBe(true);
});

test('modal accessibility, reduced motion, dark inheritance and server rendering remain intact', async ({
  page,
  browser,
}) => {
  await page.goto('/date-pickers');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page
    .getByLabel('Dark date', { exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toHaveCSS('transition-duration', '0s');
  await expect(modal).toHaveCSS('color-scheme', 'dark');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(results.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.goto('/streaming');
  await expect(page.getByLabel('Streamed date picker', { exact: true })).toHaveValue('02/29/2024');

  const context = await browser.newContext({ javaScriptEnabled: false, timezoneId: 'Pacific/Kiritimati' });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/date-pickers');
    await expect(server.getByLabel('Server date', { exact: true })).toHaveValue('02/29/2024');
    await expect(server.getByLabel('Server date', { exact: true })).toHaveCSS('font-size', '16px');
  } finally {
    await context.close();
  }
});

test('light, dark, dynamic theme and RTL picker layouts produce local screenshot evidence', async ({
  page,
}, testInfo) => {
  for (const globals of ['colorScheme:light', 'brand:forest;colorScheme:dark', 'brand:expressive;colorScheme:light']) {
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-datepicker--modal&viewMode=story&globals=${globals}`,
    );
    await page.getByRole('button', { name: 'Choose date', exact: true }).click();

    const modal = page.getByRole('dialog');

    await expect(modal).toHaveCSS('width', '360px');
    await expect(modal).toHaveCSS('border-radius', '28px');
    await expect(modal.getByRole('grid')).toBeVisible();
    await modal.screenshot({
      path: testInfo.outputPath(`${globals.replaceAll(':', '-').replaceAll(';', '-')}.png`),
      animations: 'disabled',
    });
  }

  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-datepicker--right-to-left&viewMode=story');
  await page.getByRole('button', { name: /Choose date/ }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('direction', 'rtl');
  await page.getByRole('dialog').screenshot({ path: testInfo.outputPath('rtl.png'), animations: 'disabled' });
});
