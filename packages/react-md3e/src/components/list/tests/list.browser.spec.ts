import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });

const storyForest = createTheme({ sourceColor: '#386a20', keyColors: { secondary: '#5d6355', tertiary: '#386568' } });

const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('single-selection listbox enters the selected option and supports arrows, Home/End, typeahead, Space and Enter', async ({
  page,
}) => {
  await page.goto('/lists');
  await page.getByRole('button', { name: 'Before language list', exact: true }).click();
  await page.keyboard.press('Tab');

  const list = page.getByTestId('radio-list');
  const french = list.getByRole('option', { name: 'Français' });
  const spanish = list.getByRole('option', { name: 'Español' });

  await expect(french).toBeFocused();
  await expect(list).toHaveAttribute('role', 'listbox');
  await expect(french).not.toHaveAttribute('aria-pressed');
  await page.keyboard.press('ArrowUp');
  await expect(spanish).toBeFocused();
  await expect(french).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(french).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Space');
  await expect(spanish).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Enter');
  await expect(spanish).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(french).toBeFocused();
  await page.keyboard.press('Home');
  await expect(list.getByRole('option', { name: 'English' })).toBeFocused();
  await page.keyboard.press('f');
  await expect(french).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(french).toHaveAttribute('aria-selected', 'true');
  await expect(list.getByRole('option', { name: 'Deutsch' })).toBeDisabled();
});

test('multiple selection toggles checkbox visuals independently with one roving tab stop', async ({ page }) => {
  await page.goto('/lists');

  const list = page.getByRole('listbox', { name: 'Interests', exact: true });
  const nature = list.getByRole('option', { name: 'Nature', exact: true });
  const food = list.getByRole('option', { name: 'Food', exact: true });

  await expect(list).toHaveAttribute('aria-multiselectable', 'true');
  await nature.focus();
  await page.keyboard.press('ArrowDown');
  await expect(food).toBeFocused();
  await page.keyboard.press('Space');
  await expect(food).toHaveAttribute('aria-selected', 'true');
  await expect(nature).toHaveAttribute('aria-selected', 'true');
  await expect(food.locator('[data-indicator="checkbox"] svg')).toHaveCSS('opacity', '1');
  await page.keyboard.press('Enter');
  await expect(food).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByTestId('selected-interests')).toHaveText('nature');
  await page.keyboard.press('End');
  await expect(list.getByRole('option', { name: 'Museums' })).toBeFocused();
  await expect(list.locator('[data-md3-list-item-control][tabindex="0"]')).toHaveCount(1);
});

test('controlled values, filtering, refs and theme roles stay consistent without CSS rule insertion', async ({
  page,
}) => {
  await page.goto('/lists');

  const styles = await page.locator('style').count();
  const list = page.getByRole('listbox', { name: 'Currency', exact: true });
  const euro = list.getByRole('option', { name: 'Euro EUR', exact: true });

  await expect(euro.locator('..')).toHaveCSS('background-color', rgb(forest.schemes.light.secondaryContainer));
  await expect(euro.locator('..')).toHaveCSS('border-radius', '20px');
  await page.getByRole('button', { name: 'Select USD from code' }).click();
  await page.getByLabel('Filter currency').focus();
  await page.keyboard.press('Tab');
  await expect(list.getByRole('option', { name: 'US dollar USD', exact: true })).toBeFocused();
  await expect(list.getByRole('option', { name: 'US dollar USD', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByLabel('Filter currency').fill('Euro');
  await expect(list.getByRole('option')).toHaveCount(1);
  await expect(page.getByTestId('selected-currency')).toHaveText('USD');
  await euro.click();
  await expect(page.getByTestId('selected-currency')).toHaveText('EUR');
  await page.getByLabel('Filter currency').fill('');
  await page.getByRole('button', { name: 'Check list refs' }).click();
  await expect(list).toHaveAttribute('data-ref-checked', 'true');
  await expect(euro.locator('..')).toHaveAttribute('data-ref-checked', 'true');
  await expect(
    page.getByTestId('list-dark-theme').getByRole('option', { name: 'Dark selected row' }).locator('..'),
  ).toHaveCSS('background-color', rgb(forest.schemes.dark.secondaryContainer));
  expect(await page.locator('style').count()).toBe(styles);
});

test('readOnly and disabled states reject selection while preserving announced state', async ({ page }) => {
  await page.goto('/lists');

  const list = page.getByRole('listbox', { name: 'Read-only language' });
  const english = list.getByRole('option', { name: 'English' });

  await expect(list).toHaveAttribute('aria-readonly', 'true');
  await english.evaluate((node) => (node as HTMLButtonElement).click());
  await english.focus();
  await page.keyboard.press('Space');
  await expect(english).toHaveAttribute('aria-selected', 'false');
  await expect(list.getByRole('option', { name: 'Français' })).toHaveAttribute('aria-selected', 'true');
  await expect(english.locator('[data-md3-ripple-ink]')).toHaveCount(0);

  const disabled = page.getByRole('listbox', { name: 'Disabled group' });

  await expect(disabled.getByRole('option').first()).toBeDisabled();
  await disabled
    .getByRole('option')
    .last()
    .evaluate((node) => (node as HTMLButtonElement).click());
  await expect(disabled.getByRole('option').last()).toHaveAttribute('aria-selected', 'false');
});

test('list press ripple uses compiled geometry and opt-outs retain keyboard focus feedback', async ({ page }) => {
  await page.goto('/lists');

  const option = page.getByTestId('radio-list').getByRole('option', { name: 'English' });

  await option.scrollIntoViewIfNeeded();

  const box = (await option.boundingBox())!;

  await page.mouse.move(box.x + 16, box.y + 20);
  await page.mouse.down();
  await expect(option.locator('[data-md3-ripple-ink]')).toHaveCount(1);
  await page.mouse.up();
  await expect(option.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await option.click();
  await expect(option.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await expect(option.locator('..')).toHaveCSS('transition-duration', '0s');
  await page.getByRole('option', { name: 'Without ripple' }).click();
  await expect(page.getByRole('option', { name: 'Without ripple' }).locator('[data-md3-ripple-ink]')).toHaveCount(0);
});

test('language/currency dialog filters options and preserves two independent choices', async ({ page }) => {
  await page.goto('/lists');
  await page.getByRole('button', { name: 'Choose language and currency' }).click();

  const dialog = page.getByRole('dialog', { name: 'Language and currency' });

  await dialog
    .getByRole('listbox', { name: 'Language', exact: true })
    .getByRole('option', { name: 'Français' })
    .click();
  await dialog.getByLabel('Find currency').fill('UAH');
  await dialog
    .getByRole('listbox', { name: 'Currency', exact: true })
    .getByRole('option', { name: 'Ukrainian hryvnia UAH' })
    .click();
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('locale-selection')).toHaveText('fr / UAH');
});

test('lists remain styled before JavaScript, stream from RSC, and render in Storybook', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/lists');
    await expect(server.getByTestId('static-list').getByRole('listitem').first()).toHaveCSS('height', '56px');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByTestId('streamed-list').getByRole('listitem')).toHaveCSS('height', '72px');
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-list--single-select&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await expect(page.getByRole('option', { name: 'English' }).locator('..')).toHaveCSS(
    'background-color',
    rgb(storyForest.schemes.dark.secondaryContainer),
  );
  await page.getByRole('option', { name: 'Français' }).click();
  await expect(page.getByRole('option', { name: 'Français' })).toHaveAttribute('aria-selected', 'true');
});

test('lists and dialog selection pass accessibility checks at a narrow viewport and respect RTL/forced colors', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lists');

  const rtl = page.getByTestId('rtl-list');

  await expect(rtl).toHaveCSS('direction', 'rtl');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  // Accessibility is evaluated at the visual endpoint, including on slower CI runners.
  await page.addStyleTag({ content: '[data-md3-dialog] { transition-duration: 1s !important; }' });
  await page.getByRole('button', { name: 'Choose language and currency' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-md3-dialog-backdrop]')).toHaveCSS('opacity', '1');

  const modalResult = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(modalResult.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(rtl.getByRole('option', { name: 'العربية' })).toBeVisible();
});
