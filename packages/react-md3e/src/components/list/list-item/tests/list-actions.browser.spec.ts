import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({ sourceColor: '#386a20', shape: { large: 20 } });
const rgb = (hex: string) => {
  const channels = hex
    .slice(1)
    .match(/../g)!
    .map((value) => Number.parseInt(value, 16));

  return `rgb(${channels.join(', ')})`;
};

test('primary button actions use the whole row and never become selected', async ({ page }) => {
  await page.goto('/lists');

  const list = page.getByTestId('single-action-list');
  const action = list.getByRole('button', { name: 'Open journey A primary action without selection' });

  await action.click({ position: { x: 10, y: 10 } });
  await expect(page.getByTestId('primary-actions')).toHaveText('1');
  await expect(action).not.toHaveAttribute('aria-selected');
  await expect(action).not.toHaveAttribute('aria-pressed');
  await expect(list).not.toHaveAttribute('role', 'listbox');
  await page.getByRole('button', { name: 'Check action refs' }).click();
  await expect(action.locator('..').locator('..')).toHaveAttribute('data-ref-checked', 'true');
  await expect(page.getByTestId('radio-list').getByRole('option', { name: 'Français' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('single-action keyboard navigation loops, skips disabled rows and resets the entry after filtering', async ({
  page,
}) => {
  await page.goto('/lists');
  await page.getByTestId('before-action-list').click();
  await page.keyboard.press('Tab');

  const list = page.getByTestId('single-action-list');
  const first = list.getByRole('button').first();
  const last = list.getByRole('button', { name: 'Action without ripple' });

  await expect(first).toBeFocused();
  await expect(list.locator('[data-md3-list-action][tabindex="0"]:not(:disabled)')).toHaveCount(1);
  await page.keyboard.press('ArrowUp');
  await expect(last).toBeFocused();
  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(page.getByTestId('primary-actions')).toHaveText('2');
  await page.keyboard.press('End');
  await expect(last).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('after-action-list')).toBeFocused();
  await page.getByRole('button', { name: 'Toggle first action', exact: true }).click();
  await page.getByTestId('before-action-list').click();
  await page.keyboard.press('Tab');
  await expect(list.getByRole('button', { name: 'Another journey' })).toBeFocused();
});

test('native action links navigate with pointer, Enter and Space while disabled links have no destination', async ({
  page,
}) => {
  await page.goto('/lists');

  const list = page.getByTestId('action-links');
  const link = list.getByRole('link', { name: 'Navigation destination', exact: true });
  const disabled = list.getByRole('link', { name: 'Unavailable destination' });

  await expect(link).toHaveAttribute('href', '#list-destination');
  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect(disabled).not.toHaveAttribute('href');
  await link.click();
  await expect(page).toHaveURL(/#list-destination$/);

  for (const key of ['Space', 'Enter']) {
    // Start a fresh document: native hash navigation may still be restoring target focus.
    await page.goto('/lists');
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press(key);
    await expect(page).toHaveURL(/#list-destination$/);
  }

  await disabled.evaluate((element) => (element as HTMLAnchorElement).click());
  await expect(page).toHaveURL(/#list-destination$/);
});

test('supplemental controls have sibling DOM and perform independent actions without activating the row', async ({
  page,
}) => {
  await page.goto('/lists');

  const list = page.getByTestId('multi-action-list');
  const bookmark = list.getByRole('button', { name: 'Bookmark journey' });

  const actionHeight = (await bookmark.boundingBox())!.height;
  const rowHeight = (await bookmark.locator('..').locator('..').boundingBox())!.height;

  expect(actionHeight).toBe(rowHeight);
  await bookmark.click();
  await expect(page.getByTestId('supplementary-actions')).toHaveText('1');
  await expect(page).toHaveURL(/\/lists$/);
  await list.getByRole('checkbox', { name: 'Save guide offline' }).click();
  await expect(page.getByTestId('offline-value')).toHaveText('true');
  await list.getByRole('switch', { name: 'Journey notifications' }).click();
  await expect(list.getByRole('switch')).toBeChecked();
  await expect(page.getByTestId('primary-actions')).toHaveText('0');
  await expect(list.locator('button button, a button, button a, a a')).toHaveCount(0);
  await expect(
    list.locator('[aria-hidden="true"] [role="checkbox"], [aria-hidden="true"] [role="switch"]'),
  ).toHaveCount(0);
  await list.getByRole('button', { name: 'Download guide', exact: true }).click();
  await expect(page.getByTestId('primary-actions')).toHaveText('1');
  await expect(list.getByRole('checkbox')).toBeChecked();
  await expect(list.locator('[aria-selected], [role="option"]')).toHaveCount(0);
  await expect(list.locator('[inert] button')).toBeDisabled();

  const disabledArea = (await list.locator('[inert]').boundingBox())!;

  await page.mouse.click(disabledArea.x + disabledArea.width / 2, disabledArea.y + disabledArea.height / 2);
  await expect(page.getByTestId('primary-actions')).toHaveText('1');
  await expect(page.getByTestId('supplementary-actions')).toHaveText('1');
});

for (const direction of ['ltr', 'rtl']) {
  test(`supplemental action targets are centered between the primary action and row edge (${direction})`, async ({
    page,
  }) => {
    await page.goto('/lists');

    const list = page.getByTestId('multi-action-list');

    await list.evaluate((element, dir) => element.setAttribute('dir', dir), direction);

    const slots = await list
      .locator('[data-action-position]:not([inert]):has([data-md3-icon-button], [data-md3-checkbox])')
      .evaluateAll((elements) =>
        elements.map((slot) => {
          const bounds = slot.getBoundingClientRect();
          const control = slot.firstElementChild!;
          const target = control.getBoundingClientRect();
          const visual = control.querySelector('[data-md3-icon-button-container]');
          const layer = getComputedStyle(visual ?? control, visual ? undefined : '::before');
          const container = (visual ?? control).getBoundingClientRect();
          const left = container.left + (visual ? 0 : Number.parseFloat(layer.left));
          const right = container.right - (visual ? 0 : Number.parseFloat(layer.right));

          return {
            left: target.left - bounds.left,
            right: bounds.right - target.right,
            layerLeft: left - bounds.left,
            layerRight: bounds.right - right,
            targetWidth: target.width,
            targetHeight: target.height,
          };
        }),
      );

    expect(slots.length).toBeGreaterThan(0);

    for (const slot of slots) {
      expect(slot.left).toBe(slot.right);
      expect(slot.layerLeft).toBe(slot.layerRight);
      expect(slot.targetWidth).toBeGreaterThanOrEqual(48);
      expect(slot.targetHeight).toBeGreaterThanOrEqual(48);
    }

    const primary = list.getByRole('link', { name: 'Journey details' });
    const bookmark = list.getByRole('button', { name: 'Bookmark journey' });
    const checkbox = list.getByRole('checkbox', { name: 'Save guide offline' });

    await primary.hover();
    await expect.poll(() => primary.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0.08');
    await expect
      .poll(() =>
        bookmark
          .locator('[data-md3-icon-button-container]')
          .evaluate((element) => getComputedStyle(element, '::before').opacity),
      )
      .toBe('0');
    await bookmark.hover();
    await expect.poll(() => primary.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0');
    await expect
      .poll(() =>
        bookmark
          .locator('[data-md3-icon-button-container]')
          .evaluate((element) => getComputedStyle(element, '::before').opacity),
      )
      .toBe('0.08');
    await checkbox.hover();
    await expect.poll(() => checkbox.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0.08');
    await expect(page.getByTestId('primary-actions')).toHaveText('0');
    await expect(page.getByTestId('supplementary-actions')).toHaveText('0');
  });
}

test('all four arrows traverse multi-action controls in DOM order and Tab leaves the list', async ({ page }) => {
  await page.goto('/lists');
  await page.getByTestId('before-multi-list').click();
  await page.keyboard.press('Tab');

  const list = page.getByTestId('multi-action-list');
  const primary = list.getByRole('link', { name: 'Journey details' });
  const bookmark = list.getByRole('button', { name: 'Bookmark journey' });
  const checkbox = list.getByRole('checkbox');
  const notifications = list.getByRole('switch');

  await expect(primary).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(bookmark).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(checkbox).toBeFocused();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await page.keyboard.press('ArrowLeft');
  await expect(bookmark).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(primary).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(notifications).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('after-multi-list')).toBeFocused();
  await expect(page.getByTestId('primary-actions')).toHaveText('0');
});

test('radio controls retain RadioGroup behavior and never become selectable list options', async ({ page }) => {
  await page.goto('/lists');

  const list = page.getByTestId('radio-actions');
  const email = list.getByRole('radio', { name: 'Send by email' });
  const sms = list.getByRole('radio', { name: 'Send by SMS' });

  await email.focus();
  await page.keyboard.press('ArrowDown');
  await expect(sms).toBeFocused();
  await expect(sms).toBeChecked();
  await expect(email).not.toBeChecked();
  await expect(page.getByTestId('primary-actions')).toHaveText('0');
  await expect(list.locator('[aria-selected], [role="option"]')).toHaveCount(0);
});

test('uncontrolled expansion supports multiple open folders and suppresses hidden and closing focus targets', async ({
  page,
}) => {
  await page.goto('/lists');

  const list = page.getByTestId('expandable-list');
  const saved = list.getByRole('button', { name: 'Saved trips', exact: true });
  const recent = list.getByRole('button', { name: 'Recent trips', exact: true });
  const panelId = await saved.getAttribute('aria-controls');
  const panel = page.locator(`[id="${panelId}"]`);

  await expect(saved).toHaveAttribute('aria-expanded', 'false');
  await expect(recent).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toHaveAttribute('inert');
  await saved.focus();
  await page.keyboard.press('Space');
  await expect(saved).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).not.toHaveAttribute('inert');
  await expect(panel.getByRole('button', { name: 'Manage saved trips' })).toBeVisible();
  await expect(recent).toHaveAttribute('aria-expanded', 'true');
  await saved.click();
  await expect(saved).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toHaveAttribute('inert');
  await expect(panel).toHaveAttribute('aria-hidden', 'true');
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { includeHidden: true })).not.toBeFocused();
  await expect(list.getByRole('button', { name: 'Unavailable folder' })).toBeDisabled();
});

test('controlled expansion reports changes, accepts external updates, cancellation and disabled transitions', async ({
  page,
}) => {
  await page.goto('/lists');

  const trigger = page.getByTestId('controlled-expansion').getByRole('button', { name: 'Controlled folder' });

  await trigger.click();
  await expect(page.getByTestId('controlled-open')).toHaveText('true');
  await expect(page.getByTestId('expansion-changes')).toHaveText('1');
  await page.getByRole('textbox', { name: 'Folder note' }).fill('Remember this');
  await page.getByRole('button', { name: 'Toggle controlled folder', exact: true }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('expansion-changes')).toHaveText('1');
  await page.getByRole('button', { name: 'Toggle expansion prevention' }).click();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('expansion-changes')).toHaveText('2');
  await page.getByRole('button', { name: 'Toggle expansion prevention' }).click();
  await page.getByRole('button', { name: 'Toggle expansion disabled' }).click();
  await expect(trigger).toBeDisabled();
  await trigger.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(page.getByTestId('expansion-changes')).toHaveText('2');
  await page.getByRole('button', { name: 'Toggle controlled folder', exact: true }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('textbox', { name: 'Folder note' })).toHaveValue('Remember this');
});

test('nested expansion has independent IDs, state and navigation and can be reopened', async ({ page }) => {
  await page.goto('/lists');

  const list = page.getByTestId('nested-expansion');
  const europe = list.getByRole('button', { name: 'Europe', exact: true });
  const portugal = list.getByRole('button', { name: 'Portugal', exact: true });
  const france = list.getByRole('button', { name: 'France', exact: true });

  expect(await europe.getAttribute('aria-controls')).not.toBe(await portugal.getAttribute('aria-controls'));
  await portugal.click();
  await expect(list.getByRole('link', { name: 'Lisbon city' })).toBeVisible();
  await expect(europe).toHaveAttribute('aria-expanded', 'true');
  await expect(france).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowDown');
  await expect(france).toBeFocused();
  await europe.click();
  await expect(list.getByRole('link')).toHaveCount(0);
  await expect(list.locator(':scope > li > [data-md3-list-expand-panel]')).toHaveCount(0);
  await europe.click();
  await expect(portugal).toHaveAttribute('aria-expanded', 'false');
});

test('state layers, ripple, expansion colors, shapes and reduced motion use compiled theme styles', async ({
  page,
}) => {
  await page.goto('/lists');

  const styleCount = await page.locator('style').count();
  const action = page.getByTestId('single-action-list').getByRole('button').first();

  await action.hover();
  await expect.poll(() => action.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0.08');
  await page.mouse.down();
  await expect(action.locator('[data-md3-ripple-ink]')).toHaveCount(1);
  await page.mouse.up();
  await expect(action.locator('[data-md3-ripple-ink]')).toHaveCount(0);

  const folder = page.getByTestId('expandable-list').getByRole('button', { name: 'Saved trips', exact: true });
  const icon = folder.locator('[data-md3-list-expand-icon]');
  const item = folder.locator('..').locator('..');

  await expect(icon).toHaveCSS('background-color', rgb(theme.schemes.light.surface));
  await folder.click();
  await expect(item).toHaveCSS('border-radius', '20px');
  await expect(icon).toHaveCSS('background-color', rgb(theme.schemes.light.surfaceContainer));
  await expect(item).toHaveCSS('background-color', rgb(theme.schemes.light.surface));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await folder.click();
  await expect(icon).toHaveCSS('transition-duration', '0s');
  await expect(item).toHaveCSS('transition-duration', '0s');
  await expect(item.locator('[data-md3-list-expand-panel]')).toHaveCSS('transition-duration', '0s');
  await action.focus();
  await page.keyboard.press('Space');
  await expect(action.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await expect(action).toHaveCSS('outline-style', 'solid');
  expect(await page.locator('style').count()).toBe(styleCount);
});

test('SSR action and expansion content is styled without JavaScript and hydrates without errors', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('/lists');
    await expect(server.getByTestId('single-action-list').getByRole('button').first()).toHaveCSS('min-height', '72px');
    await expect(server.getByText('Recently visited destinations')).toBeVisible();
    await expect(server.getByRole('button', { name: 'Manage saved trips' })).toHaveCount(0);
    await expect(server.getByTestId('action-links').getByRole('link').first()).toHaveAttribute(
      'href',
      '#list-destination',
    );
  } finally {
    await context.close();
  }

  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/lists');
  await page.getByTestId('expandable-list').getByRole('button', { name: 'Saved trips', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Manage saved trips' })).toBeVisible();
  expect(errors).toEqual([]);

  await page.goto('/streaming');

  const streamed = page.getByTestId('streamed-list-actions');
  const trigger = streamed.getByRole('button', { name: 'Streamed list folder' });

  await expect(streamed.getByRole('link')).toHaveCSS('display', 'flex');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowUp');
  await expect(streamed.getByRole('link')).toBeFocused();
  expect(errors).toEqual([]);
});

test('new states remain accessible on narrow RTL layouts and forced colors', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lists');
  await page.getByTestId('multi-action-list').evaluate((element) => element.setAttribute('dir', 'rtl'));
  await page.getByTestId('expandable-list').getByRole('button', { name: 'Saved trips', exact: true }).click();

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);

  const multiActionScreenshot = testInfo.outputPath('multi-action-rtl.png');
  const expansionScreenshot = testInfo.outputPath('expanded-list.png');

  await page.getByTestId('multi-action-list').screenshot({ path: multiActionScreenshot });
  await page.getByTestId('expandable-list').screenshot({ path: expansionScreenshot });
  await testInfo.attach('multi-action-rtl', { path: multiActionScreenshot, contentType: 'image/png' });
  await testInfo.attach('expanded-list', { path: expansionScreenshot, contentType: 'image/png' });
  await page.emulateMedia({ forcedColors: 'active' });

  const highlight = await page.evaluate(() => {
    const probe = document.createElement('span');

    probe.style.color = 'Highlight';
    document.body.append(probe);

    const value = getComputedStyle(probe).color;

    probe.remove();

    return value;
  });

  await page.getByTestId('single-action-list').getByRole('button').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByTestId('single-action-list').getByRole('button', { name: 'Another journey' })).toHaveCSS(
    'outline-color',
    highlight,
  );
});

test('Storybook exposes each new interactive List example', async ({ page }) => {
  for (const story of [
    'single-action',
    'single-action-navigation',
    'multi-action',
    'expandable',
    'nested-expandable',
    'controlled-expansion',
  ]) {
    await page.goto(`http://127.0.0.1:6106/iframe.html?id=components-list--${story}&viewMode=story`);
    await expect(page.locator('[data-md3-list]')).not.toHaveCount(0);
    await expect(page.locator('[data-md3-list-action]').first()).toBeVisible();
  }
});
