import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('keyboard filtering supports accents, virtual focus, disabled options, Enter and Escape', async ({ page }) => {
  await page.goto('/fields');

  const input = page.getByRole('combobox', { name: 'Destination', exact: true });

  await input.fill('sao');
  await expect(page.getByRole('option', { name: 'São Paulo', exact: true })).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('ArrowDown');
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('aria-activedescendant', /.+/);
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('São Paulo');
  await expect(page.getByTestId('selected-city')).toHaveText('SPO');
  await expect(page.getByTestId('selection-reason')).toHaveText('selectOption');
  await input.fill('');
  await input.click();
  await expect(page.getByRole('option', { name: 'Tokyo', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByRole('option', { name: 'Tokyo', exact: true })).toHaveCSS('color', /0\.38/);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  await page.keyboard.press('Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toBeFocused();
});

test('pointer selection, custom renderInput, equality, programmatic values and clearing preserve selection reasons', async ({
  page,
}) => {
  await page.goto('/fields');

  const root = page.getByTestId('object-autocomplete');
  const input = root.getByRole('combobox', { name: 'Destination', exact: true });

  await expect(input.locator('..')).toContainText('✈');
  await expect(input).toHaveAccessibleDescription('Search for a destination');
  await page.getByRole('button', { name: 'Choose Rome from code' }).click();
  await expect(input).toHaveValue('Rome');
  await input.click();
  await expect(page.getByRole('option', { name: 'Rome', exact: true })).toHaveAttribute('aria-selected', 'true');

  const popupBox = (await page.locator('[data-md3-autocomplete-popup]').boundingBox())!;
  const firstOptionBox = (await page.getByRole('option').first().boundingBox())!;

  expect(firstOptionBox.y - popupBox.y).toBeLessThanOrEqual(12);
  await page.getByRole('option', { name: 'Paris', exact: true }).click();
  await expect(page.getByTestId('selected-city')).toHaveText('PAR');
  await root.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(input).toHaveValue('');
  await expect(page.getByTestId('selected-city')).toHaveText('none');
  await expect(page.getByTestId('selection-reason')).toHaveText('clear');
});

test('controlled input text and selected values remain independent', async ({ page }) => {
  await page.goto('/fields');

  // Exercise updates while the closing animation still owns a mounted popup.
  await page.addStyleTag({ content: '[data-md3-autocomplete-popup] { transition-duration: 1s !important; }' });

  const input = page.getByRole('combobox', { name: 'City query' });

  await input.fill('Ro');
  await expect(page.getByTestId('query-value')).toHaveText('Ro');
  await expect(page.getByRole('option', { name: 'Rome', exact: true })).toBeVisible();
  await expect(page.locator('[data-md3-autocomplete-popup]')).toHaveCSS('opacity', '1');
  await page.keyboard.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', /.+/);
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Rome');
  await page.getByRole('button', { name: 'Set query from code' }).click();
  await expect(input).toHaveValue('Ky');
  await expect(page.locator('[data-md3-autocomplete-popup]')).toHaveCount(0);
  await expect(input).toHaveValue('Ky');
  await expect(page.getByTestId('query-value')).toHaveText('Ky');
  await input.click();
  await expect(page.getByRole('option', { name: 'Kyiv', exact: true })).toBeVisible();
});

test('multiple choice hides selected options, retains the popup and removes chips by pointer and keyboard', async ({
  page,
}) => {
  await page.goto('/fields');

  const root = page.getByTestId('multiple-autocomplete');
  const input = root.getByRole('combobox', { name: 'Visited cities', exact: true });

  await input.click();
  await expect(page.getByRole('option', { name: 'Paris', exact: true })).toHaveCount(0);
  await page.getByRole('option', { name: 'Rome', exact: true }).click();
  await expect(page.getByTestId('selected-cities')).toHaveText('Paris,Rome');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await root.getByRole('button', { name: 'Clear Paris' }).click();
  await expect(page.getByTestId('selected-cities')).toHaveText('Rome');
  await input.focus();
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await expect(page.getByTestId('selected-cities')).toHaveText('');
  await expect(page.getByTestId('selection-reason')).toHaveText('removeOption');
});

test('disabled/readOnly/clearability and openOnFocus restrictions are honored', async ({ page }) => {
  await page.goto('/fields');

  const disabled = page.getByRole('combobox', { name: 'Disabled destination' });
  const locked = page.getByRole('combobox', { name: 'Locked destination' });

  await expect(disabled).toBeDisabled();
  await locked.click();
  await page.keyboard.type('ignored');
  await expect(locked).toHaveValue('Paris');
  await expect(locked).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('combobox', { name: 'Locked choices' }).locator('..').getByRole('button')).toHaveCount(1);

  const fixed = page.getByRole('combobox', { name: 'Fixed destination' });

  await expect(fixed.locator('..').getByRole('button', { name: 'Clear', exact: true })).toHaveCount(0);

  const focus = page.getByRole('combobox', { name: 'Focus destination' });

  await focus.focus();
  await expect(focus).toHaveAttribute('aria-expanded', 'true');
  await focus.fill('Pa');
  await expect(focus).toHaveAttribute('aria-activedescendant', /.+/);
  await page.keyboard.press('Enter');
  await expect(focus).toHaveValue('Paris');
});

test('externally filtered/loading/empty results update without discarding component state', async ({ page }) => {
  await page.goto('/fields');

  const input = page.getByRole('combobox', { name: 'Remote destination' });

  await input.fill('server query');
  await expect(page.getByText('Finding destinations…')).toBeVisible();
  await page.getByText('Resolve suggestions', { exact: true }).click();
  await input.click();
  await expect(page.getByRole('option', { name: 'Remote Paris' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Remote Rome' })).toBeVisible();
  await expect(input).toHaveValue('server query');
  await page.getByText('Return empty suggestions', { exact: true }).click();
  await input.click();
  await expect(page.getByText('No destinations found')).toBeVisible();
});

test('required selection validates the selected value rather than typed query and submits serialized objects', async ({
  page,
}) => {
  await page.goto('/fields');

  const input = page.getByRole('combobox', { name: 'Booking city' });

  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('alex@example.com');
  await input.fill('Paris');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Submit booking' }).click();
  await expect(page.getByTestId('booking-values')).toHaveText('');
  await input.click();
  await page.getByRole('option', { name: 'Paris', exact: true }).click();
  await page.getByRole('button', { name: 'Submit booking' }).click();
  await expect(page.getByTestId('booking-values')).toHaveText(
    '{"email":"alex@example.com","notes":"Window seat","city":"PAR"}',
  );
});

test('portals preserve nested themes and dialog focus; Escape closes suggestions before the dialog', async ({
  page,
}) => {
  await page.goto('/fields');
  await page.getByRole('combobox', { name: 'Dark destination' }).click();
  await expect(page.locator('[data-md3-autocomplete-popup]')).toHaveCSS(
    'background-color',
    rgb(forest.schemes.dark.surfaceContainer),
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open destination dialog' }).click();

  const dialog = page.getByRole('dialog', { name: 'Destination picker' });
  const input = dialog.getByRole('combobox', { name: 'Dialog destination' });

  await input.fill('Nested');
  await expect(page.getByRole('option', { name: 'Nested Paris' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('Autocomplete server defaults, streaming and Storybook work with precompiled styles', async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/fields');
    await expect(server.getByRole('combobox', { name: 'Server destination' })).toHaveValue('Paris');
    await expect(server.getByRole('combobox', { name: 'Server destination' }).locator('..')).toHaveCSS(
      'height',
      '56px',
    );
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('combobox', { name: 'Streamed destination' })).toHaveValue('Rome');
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-autocomplete--controlled&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await page.getByRole('combobox', { name: 'Destination' }).fill('Ky');
  await page.getByRole('option', { name: 'Kyiv', exact: true }).click();
  await expect(page.getByText('Selected: Kyiv')).toBeVisible();
});

test('mobile, RTL, forced colors, reduced motion and accessibility retain usable popup geometry without style insertion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/fields');

  const closedResult = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(closedResult.violations).toEqual([]);

  const count = await page.locator('style').count();

  await page.getByRole('combobox', { name: 'RTL destination' }).click();
  await expect(page.locator('[data-md3-autocomplete-popup]')).toHaveCSS('direction', 'rtl');

  const popup = (await page.locator('[data-md3-autocomplete-popup]').boundingBox())!;

  expect(popup.x).toBeGreaterThanOrEqual(0);
  expect(popup.x + popup.width).toBeLessThanOrEqual(390);

  await expect(page.locator('[data-md3-autocomplete-popup]')).toHaveCSS('opacity', '1');

  const result = await new AxeBuilder({ page })
    .include('[data-md3-autocomplete-popup]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await expect(page.locator('[data-md3-autocomplete-popup]')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('[data-md3-autocomplete-popup]')).toHaveCSS('border-top-width', '1px');
  await page.getByRole('option', { name: 'عمان' }).click();
  expect(await page.locator('style').count()).toBe(count);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
