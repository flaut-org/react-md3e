import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-org/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('keyboard activation, passenger controls and radio selection keep a nonmodal panel usable', async ({ page }) => {
  await page.goto('/popovers');

  const trigger = page.getByRole('button', { name: /^Passengers:/ });

  await trigger.focus();
  await page.keyboard.press('Enter');

  const popup = page.getByRole('dialog', { name: 'Passengers and cabin', exact: true });

  await expect(popup).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger).toHaveAttribute('aria-controls', (await popup.getAttribute('id'))!);
  await expect(popup).not.toHaveAttribute('aria-modal');
  await expect(popup.getByRole('button', { name: 'Increase adults', exact: true })).toBeFocused();
  await expect(popup.getByRole('button', { name: 'Decrease adults', exact: true })).toBeDisabled();
  await popup.getByRole('button', { name: 'Increase children', exact: true }).click();
  await expect(popup.getByRole('status', { name: 'Children count' })).toHaveText('1');
  await popup.getByRole('radio', { name: 'Business', exact: true }).click();
  await expect(popup.getByRole('radio', { name: 'Business', exact: true })).toBeChecked();
  await expect(popup).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).not.toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(popup).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveText('Passengers: 2 · Business');
  await trigger.click();
  await popup.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(page.getByTestId('passenger-selection')).toHaveText('2 / Business');
});

test('controlled opening, public refs and custom IDs preserve ARIA and dismissal reasons', async ({ page }) => {
  await page.goto('/popovers');

  const trigger = page.getByRole('button', { name: 'Controlled popover', exact: true });
  const popup = page.getByRole('dialog', { name: 'Controlled options', exact: true });
  const reason = page.getByTestId('popover-reason');

  await page.getByRole('button', { name: 'Open from code', exact: true }).click();
  await expect(popup).toBeVisible();
  await expect(popup).toHaveAttribute('id', 'controlled-options');
  await expect(trigger).toHaveAttribute('aria-controls', 'controlled-options');
  await popup.getByRole('button', { name: 'Check popover refs' }).click();
  await expect(popup).toHaveAttribute('data-ref-checked', 'true');
  await expect(trigger).toHaveAttribute('data-ref-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(popup).toHaveCount(0);
  await expect(reason).toHaveText('escapeKeyDown');
  await trigger.click();
  await trigger.click();
  await expect(popup).toHaveCount(0);
  await expect(reason).toHaveText('triggerClick');
  await trigger.click();
  await popup.getByRole('button', { name: 'Close controlled', exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(reason).toHaveText('closeButtonClick');
  await trigger.click();
  await page.getByRole('heading', { name: 'Dismissal policy', exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(reason).toHaveText('clickAway');
  await trigger.click();
  await popup.getByRole('button', { name: 'Close controlled', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(popup).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open from code', exact: true })).toBeFocused();
  await expect(reason).toHaveText('focusOut');
});

test('Escape suppression and preventDefault veto work without blocking explicit close actions', async ({ page }) => {
  await page.goto('/popovers');
  await page.getByRole('button', { name: 'Protected popover', exact: true }).click();

  const popup = page.getByRole('dialog', { name: 'Protected options', exact: true });
  const outside = page.getByRole('button', { name: 'Outside action', exact: true });

  await page.keyboard.press('Escape');
  await expect(popup).toBeVisible();
  await page.getByRole('heading', { name: 'Dismissal policy', exact: true }).click();
  await expect(popup).toBeVisible();
  await outside.click();
  await expect(popup).toBeVisible();
  await popup.getByRole('button', { name: 'Allow outside close', exact: true }).click();
  await outside.click();
  await expect(popup).toHaveCount(0);
  await page.getByRole('button', { name: 'Protected popover', exact: true }).click();
  await popup.getByRole('button', { name: 'Close protected', exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Disabled popover', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Disabled child popover', exact: true })).toBeDisabled();
});

test('keepMounted retains input state and explicit initial/final focus targets work', async ({ page }) => {
  await page.goto('/popovers');

  const trigger = page.getByRole('button', { name: 'Retained popover', exact: true });
  const popup = page.locator('[data-md3-popover][aria-label="Retained options"]');

  await trigger.click();
  await expect(popup.getByRole('textbox', { name: 'Retained note' })).toBeFocused();
  await popup.getByRole('textbox', { name: 'Retained note' }).fill('Keep my note');
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await expect(popup).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Final focus target' })).toBeFocused();
  await trigger.click();
  await expect(popup.getByRole('textbox', { name: 'Retained note' })).toHaveValue('Keep my note');
  await popup.getByRole('button', { name: 'Toggle note', exact: true }).click();
  await expect(popup.getByRole('textbox')).toHaveCount(0);
  await expect(popup.getByRole('button', { name: 'Toggle note', exact: true })).toBeFocused();
  await popup.getByRole('button', { name: 'Close retained', exact: true }).click();
  await expect(popup).toBeHidden();
  await expect(page.getByRole('button', { name: 'Final focus target' })).toBeFocused();
});

test('placement flips at viewport edges, matches anchor width and resolves custom anchors/containers', async ({
  page,
}) => {
  await page.goto('/popovers');
  await page.getByRole('button', { name: 'Flip popover', exact: true }).click();

  const flipped = page.getByRole('dialog', { name: 'Flipped options', exact: true });

  await expect(flipped).toHaveAttribute('data-side', 'top');
  await expect(flipped).toHaveCSS('opacity', '1');

  const triggerBox = (await page.getByRole('button', { name: 'Flip popover', exact: true }).boundingBox())!;
  const flippedBox = (await flipped.boundingBox())!;

  expect(flippedBox.y + flippedBox.height).toBeLessThanOrEqual(triggerBox.y - 7);
  expect(flippedBox.x + flippedBox.width).toBeLessThanOrEqual(1280 - 8);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Matched popover', exact: true }).click();

  const matched = page.getByRole('dialog', { name: 'Matched options', exact: true });

  await expect(matched).toHaveCSS('width', '280px');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Custom anchor popover', exact: true }).click();

  const custom = page.getByRole('dialog', { name: 'Custom anchor options', exact: true });

  await expect(custom).toHaveCSS('opacity', '1');

  const anchorBox = (await page.getByText('Separate positioning anchor', { exact: true }).boundingBox())!;
  const customBox = (await custom.boundingBox())!;

  expect(customBox.x).toBeCloseTo(anchorBox.x + anchorBox.width + 8, 0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Custom container popover', exact: true }).click();
  await expect(
    page.getByTestId('popover-custom-container').getByRole('dialog', { name: 'Custom container options' }),
  ).toBeVisible();
});

test('portals inherit light/dark themes and typed shape/font tokens without inserting style elements', async ({
  page,
}) => {
  await page.goto('/popovers');

  const styles = await page.locator('style').count();

  await page.getByRole('button', { name: 'Server popover', exact: true }).click();

  const popup = page.getByRole('dialog', { name: 'Server options', exact: true });

  await expect(popup).toHaveCSS('background-color', rgb(forest.schemes.light.surfaceContainerHigh));
  await expect(popup).toHaveCSS('border-radius', '20px');
  await expect(popup).toHaveCSS('font-family', 'Arial, sans-serif');
  await expect(popup.getByRole('textbox', { name: 'Server note' })).toHaveValue('Server-created content');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Dark popover', exact: true }).click();

  const dark = page.getByTestId('popover-dark-theme').getByRole('dialog', { name: 'Dark options', exact: true });

  await expect(dark).toHaveCSS('background-color', rgb(forest.schemes.dark.surfaceContainerHigh));
  await page.keyboard.press('Escape');
  expect(await page.locator('style').count()).toBe(styles);
});

test('nested popovers, Autocomplete and parent Dialog dismiss only the active layer', async ({ page }) => {
  await page.goto('/popovers');
  await page.getByRole('button', { name: 'Nested popover', exact: true }).click();

  const outer = page.getByRole('dialog', { name: 'Outer options', exact: true });
  const innerTrigger = outer.getByRole('button', { name: 'Inner popover', exact: true });

  await innerTrigger.click();

  const inner = page.getByRole('dialog', { name: 'Inner options', exact: true });

  await expect(inner.getByRole('textbox', { name: 'Inner note' })).toBeFocused();
  await inner.getByRole('textbox', { name: 'Inner note' }).fill('Nested content');
  await page.keyboard.press('Escape');
  await expect(inner).toHaveCount(0);
  await expect(outer).toBeVisible();
  await expect(innerTrigger).toBeFocused();
  await outer.getByRole('combobox', { name: 'Popover destination' }).click();
  await expect(page.getByRole('option', { name: 'Paris', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('option')).toHaveCount(0);
  await expect(outer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(outer).toHaveCount(0);
  await page.getByRole('button', { name: 'Open parent dialog', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Parent dialog', exact: true });

  await dialog.getByRole('button', { name: 'Dialog popover', exact: true }).click();

  const child = page.getByRole('dialog', { name: 'Dialog popover options', exact: true });

  await expect(child.getByRole('textbox', { name: 'Dialog popover note' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(child).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Dialog popover', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('optional modal popovers contain focus, lock scrolling, and expose an accessible close action', async ({
  page,
}) => {
  await page.goto('/popovers');

  const trigger = page.getByRole('button', { name: 'Modal popover', exact: true });

  await trigger.click();

  const popup = page.getByRole('dialog', { name: 'Modal options', exact: true });
  const note = popup.getByRole('textbox', { name: 'Modal note' });
  const dismiss = popup.getByRole('button', { name: 'Close popover', exact: true });

  await expect(popup).toHaveAttribute('aria-modal', 'true');
  await expect(note).toBeFocused();
  expect(
    await page.evaluate(() =>
      [document.body, document.documentElement].some((node) => getComputedStyle(node).overflowY === 'hidden'),
    ),
  ).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect(dismiss).toBeFocused();
  await expect(dismiss).toHaveCSS('min-height', '48px');
  await page.keyboard.press('Tab');
  await expect(note).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(popup).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('mobile RTL, reduced motion, forced colors and passenger content retain accessible viewport bounds', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/popovers');

  const closed = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(closed.violations).toEqual([]);
  await page.getByRole('button', { name: 'Passengers: 1 · Economy', exact: true }).click();

  const passengers = page.getByRole('dialog', { name: 'Passengers and cabin', exact: true });
  const passengerBox = (await passengers.boundingBox())!;

  expect(passengerBox.x).toBeGreaterThanOrEqual(8);
  expect(passengerBox.x + passengerBox.width).toBeLessThanOrEqual(312);
  expect(passengerBox.height).toBeLessThanOrEqual(640);
  await expect(passengers).toHaveCSS('transition-duration', '0s');

  const opened = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(opened.violations).toEqual([]);
  await passengers.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'RTL popover', exact: true }).click();

  const rtl = page.getByRole('dialog', { name: 'RTL options', exact: true });

  await expect(rtl).toHaveCSS('direction', 'rtl');
  await expect(rtl.getByRole('textbox', { name: 'الاسم' })).toBeFocused();
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(rtl).toHaveCSS('border-top-width', '1px');
  await expect(rtl.getByRole('button', { name: 'إغلاق' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test('server-composed triggers render without JS and request-time streamed content opens after hydration', async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/popovers');
    await expect(server.getByRole('button', { name: 'Server popover', exact: true })).toBeVisible();
    await expect(server.getByRole('button', { name: 'Server popover', exact: true })).toHaveCSS('height', '40px');
    await expect(server.locator('[data-md3-popover]')).toHaveCount(0);
  } finally {
    await context.close();
  }

  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/streaming');
  await page.getByRole('button', { name: 'Streamed popover', exact: true }).click();

  const popup = page.getByRole('dialog', { name: 'Streamed options', exact: true });

  await expect(popup.getByRole('textbox', { name: 'Streamed popover note' })).toBeFocused();
  await popup.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(popup).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Storybook supports controlled state, dark theme switching and passenger composition', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-popover--controlled&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await page.getByRole('button', { name: 'Controlled popover', exact: true }).click();

  const popup = page.getByRole('dialog', { name: 'Controlled options', exact: true });

  await expect(popup).toHaveCSS('background-color', rgb(forest.schemes.dark.surfaceContainerHigh));
  await expect(page.getByText('Open: true', { exact: true })).toBeVisible();
  await popup.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByText('Open: false', { exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-popover--passengers&viewMode=story');
  await page.getByRole('button', { name: 'Passengers: 1 · Economy', exact: true }).click();

  const passengers = page.getByRole('dialog', { name: 'Passengers and cabin', exact: true });

  await passengers.getByRole('button', { name: 'Increase adults', exact: true }).click();
  await passengers.getByRole('radio', { name: 'First class', exact: true }).click();
  await passengers.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Passengers: 2 · First class', exact: true })).toBeVisible();
});
