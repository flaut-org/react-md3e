import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

async function unfoldingGeometry(popup: Locator, time?: number) {
  if (time !== undefined) {
    await expect
      .poll(() =>
        popup.evaluate((element) =>
          element
            .getAnimations()
            .some(
              (animation) => animation instanceof CSSTransition && animation.transitionProperty === '--md3e-menu-scale',
            ),
        ),
      )
      .toBe(true);
  }

  return popup.evaluate((element, seek) => {
    if (seek !== undefined) {
      const animation = element
        .getAnimations()
        .find(
          (candidate) => candidate instanceof CSSTransition && candidate.transitionProperty === '--md3e-menu-scale',
        )!;

      animation.pause();
      animation.currentTime = seek;
    }

    const body = element.querySelector('[data-md3-menu-item-body]')!;
    const range = document.createRange();

    range.selectNodeContents(body);

    return {
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      textHeight: range.getBoundingClientRect().height,
      textWidth: range.getBoundingClientRect().width,
    };
  }, time);
}

test('Autocomplete shares Expressive Menu geometry and selection while retaining virtual combobox focus', async ({
  page,
}) => {
  await page.goto('/fields');

  const input = page.getByRole('combobox', { name: 'Server destination', exact: true });

  await input.click();

  const popup = page.locator('[data-md3-autocomplete-popup]');
  const selected = page.getByRole('option', { name: 'Paris', exact: true });

  await expect(popup).toHaveAttribute('data-md3-menu-surface', '');
  await expect(popup).toHaveCSS('border-radius', '16px');
  await expect(popup).toHaveCSS('padding', '4px');
  await expect(popup).toHaveCSS('background-color', rgb(forest.schemes.light.surfaceContainerLow));
  await expect(selected).toHaveCSS('font-size', '14px');
  await expect(selected).toHaveCSS('line-height', '20px');
  await expect(selected).toHaveCSS('min-height', '48px');
  await expect(selected).toHaveCSS('border-radius', '12px');
  await expect(selected).toHaveCSS('background-color', rgb(forest.schemes.light.tertiaryContainer));
  await expect(selected.locator('[data-leading-kind] [data-indicator="checkmark"]')).toHaveCount(1);
  await expect(page.getByRole('listbox')).toHaveCSS('gap', '2px');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(input).toBeFocused();
  await input.press('ArrowDown');

  const activeId = await input.getAttribute('aria-activedescendant');

  await expect(page.locator(`[id="${activeId}"]`)).toHaveCSS('outline-width', '3px');
  await expect(input).toHaveValue('Paris');
  await input.press('Escape');
  await input.click();
  await expect(selected).toHaveAttribute('aria-selected', 'true');
});

test('Autocomplete unfolds and closes through Menu motion without stretching default or custom option content', async ({
  page,
}) => {
  await page.goto('/fields');

  for (const name of ['Server destination', 'Destination']) {
    const input = page.getByRole('combobox', { name, exact: true });

    await input.evaluate((element) =>
      element
        .closest<HTMLElement>('[data-md3-theme]')!
        .style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '5s'),
    );
    await input.click();

    const popup = page.locator('[data-md3-autocomplete-popup]');
    const opening = await unfoldingGeometry(popup, 500);
    const nearOpen = await unfoldingGeometry(popup, (100 / forest.motion.fast.spatial.duration) * 5000);

    await popup.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));

    const full = await unfoldingGeometry(popup);

    expect(opening.height).toBeGreaterThan(0);
    expect(opening.height).toBeLessThan(full.height);
    expect(opening.width).toBeCloseTo(full.width, 2);
    expect(opening.textHeight).toBeCloseTo(full.textHeight, 1);
    expect(opening.textWidth).toBeCloseTo(full.textWidth, 1);
    expect(nearOpen.height).toBeGreaterThanOrEqual(full.height * 0.9);
    await expect(input).toBeFocused();
    await input.press('Escape');
    await expect(popup).toHaveAttribute('data-ending-style', '');

    const closing = await unfoldingGeometry(popup, 500);

    expect(closing.height).toBeGreaterThan(0);
    expect(closing.height).toBeLessThan(full.height);
    expect(closing.textHeight).toBeCloseTo(full.textHeight, 1);
    await expect(input).toBeFocused();
    await popup.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
    await expect(popup).toHaveCount(0);
  }
});

test('a full-width Autocomplete menu follows the field and scrolls keyboard-highlighted results into view', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-autocomplete--long-options&viewMode=story');

  const input = page.getByRole('combobox', { name: 'Destination', exact: true });

  await input.click();

  const popup = page.locator('[data-md3-autocomplete-popup]');

  await expect(popup).not.toHaveAttribute('data-starting-style', '');
  await popup.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));

  const fieldBox = (await input.locator('..').boundingBox())!;
  const popupBox = (await popup.boundingBox())!;

  expect(popupBox.width).toBeGreaterThan(280);
  expect(popupBox.width).toBeCloseTo(fieldBox.width, 1);
  expect(popupBox.height).toBeLessThanOrEqual(480);

  for (let index = 0; index < 40; index += 1) {
    await input.press('ArrowDown');
  }

  const last = page.getByRole('option', { name: 'Destination 40', exact: true });

  await expect(input).toHaveAttribute('aria-activedescendant', (await last.getAttribute('id'))!);
  await expect.poll(() => popup.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  const lastBox = (await last.boundingBox())!;

  expect(lastBox.y).toBeGreaterThanOrEqual(popupBox.y);
  expect(lastBox.y + lastBox.height).toBeLessThanOrEqual(popupBox.y + popupBox.height + 1);
  await input.press('Enter');
  await expect(input).toHaveValue('Destination 40');
});

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

test('Autocomplete uses public input Chips while retaining Combobox navigation and removal focus', async ({ page }) => {
  await page.goto('/fields');

  const field = page.getByTestId('multiple-autocomplete');
  const input = field.getByRole('combobox', { name: 'Visited cities' });
  const chips = field.locator('[data-md3-chip][data-kind="input"]');

  await expect(chips).toHaveCount(1);
  await expect(chips.first()).toHaveCSS('height', '32px');
  await expect(chips.first()).toHaveCSS('border-radius', '8px');
  await expect(chips.first()).toHaveCSS('border-top-width', '1px');
  await expect(chips.first().locator('[data-md3-chip-delete] svg')).toHaveCSS('width', '18px');
  await input.click();
  await page.getByRole('option', { name: 'Rome', exact: true }).click();
  await input.press('Escape');
  await expect(chips).toHaveCount(2);
  await input.press('ArrowLeft');
  await expect(chips.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(chips.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(chips.nth(1)).toBeFocused();
  await page.keyboard.press('Delete');
  await expect(page.getByTestId('selected-cities')).toHaveText('Paris');
  await field.getByRole('button', { name: 'Clear Paris', exact: true }).press('Enter');
  await expect(chips).toHaveCount(0);
  await expect(input).toBeFocused();

  const locked = page.getByRole('combobox', { name: 'Locked choices' }).locator('..').locator('[data-md3-chip]');

  await expect(locked).toHaveAttribute('data-read-only', 'true');
  await expect(locked.getByRole('button')).toHaveCount(0);

  const disabled = page.getByRole('combobox', { name: 'Disabled choices' }).locator('..').locator('[data-md3-chip]');
  const remove = disabled.getByRole('button');

  await expect(disabled).toHaveAttribute('data-disabled', 'true');
  await remove.hover();
  await expect(remove).toHaveCSS('cursor', 'default');
  await expect.poll(() => remove.evaluate((button) => getComputedStyle(button, '::before').opacity)).toBe('0');
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
    rgb(forest.schemes.dark.surfaceContainerLow),
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
