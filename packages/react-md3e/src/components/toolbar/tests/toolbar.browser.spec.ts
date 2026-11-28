import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme();
const dynamic = createTheme({ sourceColor: '#156f52', contrastLevel: 0.5 });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;
const controls = (root: Locator) => root.locator('[data-md3-toolbar-controls]');
const surface = (root: Locator) => root.locator('[data-md3-toolbar-surface]');

async function openToolbarFixture(page: Page) {
  await page.goto('/toolbars');
  await expect(page.getByTestId('toolbar-demo-ready')).toHaveAttribute('data-ready', 'true');
}

test('server markup loads extracted CSS before JavaScript for docked and both floating orientations', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('/toolbars');
    await expect(surface(page.getByTestId('server-docked'))).toHaveCSS('height', '64px');
    await expect(surface(page.getByTestId('server-standard'))).toHaveCSS('height', '64px');
    await expect(surface(page.getByTestId('server-standard'))).toHaveCSS('width', '220px');
    await expect(surface(page.getByTestId('server-vertical'))).toHaveCSS('width', '64px');
    await expect(surface(page.getByTestId('server-vertical'))).toHaveCSS('height', '168px');
    await expect(surface(page.getByTestId('dense-toolbar'))).toHaveCSS('height', '48px');
    await expect(surface(page.getByTestId('flat-toolbar'))).toHaveCSS('box-shadow', 'none');
    await expect(page.getByTestId('server-standard')).toHaveCSS('margin-left', '16px');
    await page.goto('/toolbars/server');
    await expect(page.getByRole('group', { name: 'Static toolbar', exact: true })).toBeVisible();
    await expect(page.getByRole('toolbar')).toHaveCount(0);
    await expect(surface(page.getByTestId('passive-floating-toolbar'))).toHaveCSS('height', '64px');
  } finally {
    await context.close();
  }
});

test('standard and vibrant colors scope container, selected/unselected controls and filled actions', async ({
  page,
}) => {
  await openToolbarFixture(page);

  for (const color of ['standard', 'vibrant'] as const) {
    const root = page.getByTestId(`server-${color}`);
    const scheme = theme.schemes.light;

    await expect(surface(root)).toHaveCSS(
      'background-color',
      rgb(color === 'standard' ? scheme.surfaceContainer : scheme.primaryContainer),
    );
    await expect(root.getByRole('button', { name: `${color} undo`, exact: true })).toHaveCSS(
      'color',
      rgb(color === 'standard' ? scheme.primary : scheme.onPrimaryContainer),
    );
    await expect(
      root.getByRole('button', { name: `${color} selected`, exact: true }).locator('[data-md3-icon-button-container]'),
    ).toHaveCSS('background-color', rgb(color === 'standard' ? scheme.secondaryContainer : scheme.surfaceContainer));
    await expect(root.getByRole('button', { name: `${color} selected`, exact: true })).toHaveCSS(
      'color',
      rgb(color === 'standard' ? scheme.onSecondaryContainer : scheme.onSurface),
    );
    await expect(
      root.getByRole('button', { name: `${color} filled`, exact: true }).locator('[data-md3-icon-button-container]'),
    ).toHaveCSS('background-color', rgb(scheme.primary));
    await expect(
      root
        .getByRole('button', { name: `${color} unselected`, exact: true })
        .locator('[data-md3-icon-button-container]'),
    ).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }

  const selected = page.getByRole('button', { name: 'vibrant selected', exact: true });

  await selected.hover();
  await expect
    .poll(() =>
      selected
        .locator('[data-md3-icon-button-container]')
        .evaluate((element) => getComputedStyle(element, '::before').opacity),
    )
    .toBe('0.08');
});

test('a mixed toolbar has one remembered tab stop, skips disabled controls and preserves native semantics', async ({
  page,
}) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('editor-toolbar');

  await page.getByTestId('before-toolbar').focus();
  await page.keyboard.press('Tab');
  await expect(root.getByRole('button', { name: 'Undo', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(root.getByRole('button', { name: 'Bold', exact: true })).toBeFocused();
  await expect(root.getByRole('button', { name: 'Bold', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(root.getByRole('checkbox', { name: 'Show marks' })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(root.getByRole('checkbox', { name: 'Show marks' })).toBeChecked();
  await page.keyboard.press('ArrowRight');
  await expect(root.getByRole('switch', { name: 'Live preview' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('after-toolbar')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(root.getByRole('switch', { name: 'Live preview' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(root.getByRole('button', { name: 'Undo', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(root.getByRole('textbox', { name: 'Editor search' })).toBeFocused();
});

test('text editing retains arrows, Home and End inside the toolbar', async ({ page }) => {
  await openToolbarFixture(page);

  const input = page.getByRole('textbox', { name: 'Editor search' });

  await input.focus();
  await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(0, 0));
  await page.keyboard.press('ArrowLeft');
  await expect(input).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(1);
  await page.keyboard.press('End');
  await expect(input).toBeFocused();
  await page.keyboard.press('Home');
  await expect(input).toBeFocused();
});

test('vertical and inherited RTL navigation use the appropriate axis and Home/End', async ({ page }) => {
  await openToolbarFixture(page);

  const vertical = page.getByTestId('server-vertical');

  await expect(controls(vertical)).toHaveAttribute('aria-orientation', 'vertical');
  await vertical.getByRole('button', { name: 'Vertical undo' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(vertical.getByRole('button', { name: 'Vertical redo' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(vertical.getByRole('button', { name: 'Vertical save' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(vertical.getByRole('button', { name: 'Vertical undo' })).toBeFocused();
  await page.getByRole('button', { name: 'First RTL', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('button', { name: 'Second RTL', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'First RTL', exact: true })).toBeFocused();
});

test('controlled collapse moves focus to the primary action and removes secondary controls from interaction', async ({
  page,
}) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('controlled-toolbar');

  await root.getByRole('button', { name: 'Edit', exact: true }).focus();
  await page.getByTestId('toggle-expanded').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(controls(root)).toHaveAttribute('data-expanded', 'false');
  await expect(root.getByRole('button', { name: 'Toggle tools', exact: true })).toBeFocused();
  await expect(root.getByRole('button', { name: 'Edit', exact: true })).toHaveCount(0);
  await expect(root.locator('[data-md3-toolbar-region="leading"]')).toHaveAttribute('inert', '');
  await page.keyboard.press('Space');
  await expect(controls(root)).toHaveAttribute('data-expanded', 'true');
  await expect(root.getByRole('button', { name: 'Edit', exact: true })).toBeVisible();
});

test('FAB remains independent and grows from 56 to 80px while adjacent surfaces collapse', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('fab-toolbar');
  const fab = root.getByRole('button', { name: 'Create document' });

  await expect(fab).toHaveCSS('width', '56px');
  await expect(fab).toHaveCSS('box-shadow', /0px 2px 6px 2px/);
  await expect(controls(root)).toHaveCSS('gap', '8px');
  await fab.click();
  await expect(page.getByTestId('toolbar-count')).toHaveText('Actions: 1');
  await page.getByTestId('toggle-expanded').click();
  await expect(fab).toHaveCSS('width', '80px');
  await expect(root.getByRole('button')).toHaveCount(1);
  await expect(surface(root)).toHaveCSS('width', '0px');
  await fab.click();
  await expect(page.getByTestId('toolbar-count')).toHaveText('Actions: 2');
  await expect(page.getByTestId('vertical-fab-toolbar').getByRole('button', { name: 'Add page' })).toHaveCSS(
    'height',
    '80px',
  );
});

test('overflow exposes each action once and menu activation invokes the authored handler', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('overflow-toolbar');
  const hidden = root.locator('[data-overflowed="true"]');

  await expect.poll(() => hidden.count()).toBeGreaterThan(0);
  await root.getByRole('button', { name: 'More tools' }).click();
  await expect(page.getByRole('menu')).toBeVisible();

  for (const name of ['Copy', 'Share', 'Download', 'Archive']) {
    const count =
      (await root.getByRole('button', { name, exact: true }).count()) +
      (await page.getByRole('menuitem', { name, exact: true }).count());

    expect(count).toBe(1);
  }

  await page.getByRole('menuitem', { name: 'Archive', exact: true }).click();
  await expect(page.getByTestId('toolbar-count')).toHaveText('Actions: 1');
  await expect(root.getByRole('button', { name: 'More tools' })).toBeFocused();
});

test('parent resize restores actions without a viewport event and content changes redistribute them', async ({
  page,
}) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('overflow-toolbar');
  const hidden = root.locator('[data-overflowed="true"]');

  await expect.poll(() => hidden.count()).toBeGreaterThan(0);
  await page.getByTestId('resize-toolbar').click();
  await expect(hidden).toHaveCount(0);
  await expect(root.getByRole('button', { name: 'Archive', exact: true })).toBeVisible();
  await page.getByTestId('change-actions').click();
  await expect(root.locator('[data-md3-toolbar-overflow-action]')).toHaveCount(3);
  await page.getByTestId('resize-toolbar').click();
  await page.getByTestId('change-label').click();
  await expect.poll(() => hidden.count()).toBeGreaterThan(0);
  await root.getByRole('button', { name: 'More tools' }).click();
  await expect(page.getByRole('menuitem', { name: 'Share', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Archive', exact: true })).toHaveCount(0);
});

test('removing a focused dynamic action restores focus within the toolbar', async ({ page }) => {
  await openToolbarFixture(page);
  await page.getByTestId('resize-toolbar').click();

  const root = page.getByTestId('overflow-toolbar');

  await root.getByRole('button', { name: 'Archive', exact: true }).focus();
  await page.getByTestId('change-actions').evaluate((element) => (element as HTMLButtonElement).click());
  await expect.poll(() => root.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await expect(root.getByRole('button', { name: 'Download', exact: true })).toBeFocused();
});

test('resizing while focused transfers focus between a hidden action and its overflow representation', async ({
  page,
}) => {
  await openToolbarFixture(page);
  await page.getByTestId('resize-toolbar').click();

  const root = page.getByTestId('overflow-toolbar');

  await root.getByRole('button', { name: 'Archive', exact: true }).focus();
  await page.getByTestId('resize-toolbar').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(root.getByRole('button', { name: 'More tools' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('menuitem', { name: 'Archive', exact: true }).focus();
  await page.getByTestId('resize-toolbar').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(root.getByRole('button', { name: 'Archive', exact: true })).toBeFocused();
});

test('vertical overflow respects parent height, 24px margins and menu keyboard behavior', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('vertical-overflow-toolbar');

  await expect(root).toHaveCSS('margin-left', '24px');
  await expect(root.locator('[data-overflowed="true"]')).not.toHaveCount(0);
  await root.getByRole('button', { name: 'More vertical tools' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Archive', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(root.getByRole('button', { name: 'More vertical tools' })).toBeFocused();
});

test('native scrolling reveals oversized custom composition locally and non-looping navigation clamps', async ({
  page,
}) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('native-scroll-toolbar');

  await root.getByRole('button', { name: 'Command 1', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(root.getByRole('button', { name: 'Command 1', exact: true })).toBeFocused();

  const initialScroll = await page.evaluate(() => window.scrollY);

  await page.keyboard.press('End');
  await expect(root.getByRole('button', { name: 'Command 7', exact: true })).toBeFocused();

  const bounds = (await surface(root).boundingBox())!;
  const item = (await root.getByRole('button', { name: 'Command 7', exact: true }).boundingBox())!;

  expect(item.x + item.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
  expect(await page.evaluate(() => window.scrollY)).toBe(initialScroll);
  await page.keyboard.press('ArrowRight');
  await expect(root.getByRole('button', { name: 'Command 7', exact: true })).toBeFocused();
});

test('native select and slider retain their editing keys in mixed composition', async ({ page }) => {
  await openToolbarFixture(page);

  const select = page.getByRole('combobox', { name: 'Font family' });
  const slider = page.getByRole('slider', { name: 'Editor zoom' });

  await select.focus();
  await page.keyboard.press('ArrowDown');
  await expect(select).toBeFocused();
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toBeFocused();
  await expect(slider).toHaveValue('51');
});

test('controlled scroll requests can update or veto expansion without also hiding the panel', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('controlled-toolbar');
  const scroll = page.getByTestId('collapse-scroll');

  await scroll.evaluate((element) => element.scrollTo({ top: 100 }));
  await expect(controls(root)).toHaveAttribute('data-expanded', 'false');
  await expect(page.getByTestId('controlled-scroll-change')).toHaveText('collapse');
  await expect(controls(root)).toHaveAttribute('data-hidden', 'false');
  await scroll.evaluate((element) => element.scrollTo({ top: 0 }));
  await expect(controls(root)).toHaveAttribute('data-expanded', 'true');
  await page.getByTestId('veto-scroll').click();
  await scroll.evaluate((element) => element.scrollTo({ top: 100 }));
  await expect(page.getByTestId('controlled-scroll-change')).toHaveText('collapse');
  await expect(controls(root)).toHaveAttribute('data-expanded', 'true');
});

test('the primary docked action stays centered with unequal edge groups', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByRole('toolbar', { name: 'Document commands' });
  const panel = (await root.boundingBox())!;
  const primary = (await root.getByRole('button', { name: 'Publish', exact: true }).boundingBox())!;

  expect(Math.abs(primary.x + primary.width / 2 - panel.x - panel.width / 2)).toBeLessThan(1);
  await root.getByRole('button', { name: 'Left', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(root.getByRole('button', { name: 'Center', exact: true })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(root.locator('[tabindex="0"]')).toHaveCount(1);
});

test('uncontrolled nested scroll collapse has a direction threshold and reveals on reverse scrolling', async ({
  page,
}) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('collapse-toolbar');
  const scroll = page.getByTestId('collapse-scroll');

  await scroll.evaluate((element) => {
    element.scrollTo({ top: 20 });
  });
  await expect(controls(root)).toHaveAttribute('data-expanded', 'true');
  await scroll.evaluate((element) => {
    element.scrollTo({ top: 90 });
  });
  await expect(controls(root)).toHaveAttribute('data-expanded', 'false');
  await scroll.evaluate((element) => {
    element.scrollTo({ top: 85 });
  });
  await expect(controls(root)).toHaveAttribute('data-expanded', 'false');
  await scroll.evaluate((element) => {
    element.scrollTo({ top: 20 });
  });
  await expect(controls(root)).toHaveAttribute('data-expanded', 'true');
});

test('keyboard focus reveals secondary actions after uncontrolled scroll collapse', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('collapse-toolbar');

  await page.getByTestId('collapse-scroll').evaluate((element) => element.scrollTo({ top: 100 }));
  await expect(controls(root)).toHaveAttribute('data-expanded', 'false');
  await root.getByRole('button', { name: 'Scroll create' }).focus();
  await expect(controls(root)).toHaveAttribute('data-expanded', 'true');
  await page.keyboard.press('Home');
  await expect(root.getByRole('button', { name: 'Scroll edit', exact: true })).toBeFocused();
});

test('hide on scroll preserves layout and never hides a focused toolbar', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('hide-toolbar');
  const scroll = page.getByTestId('hide-scroll');
  const before = await root.boundingBox();

  await root.getByRole('button', { name: 'Save scroll' }).focus();
  // Consume the focused scroll before moving focus; an unchanged attribute cannot synchronize it.
  await scroll.evaluate(
    (element) =>
      new Promise<void>((resolve) => {
        element.addEventListener('scroll', () => resolve(), { once: true });
        element.scrollTo({ top: 100 });
      }),
  );
  await expect(root.getByRole('button', { name: 'Save scroll' })).toBeFocused();
  await expect(controls(root)).toHaveAttribute('data-hidden', 'false');
  await page.getByTestId('resize-toolbar').focus();
  await scroll.evaluate((element) => {
    element.scrollTo({ top: 200 });
  });
  await expect(controls(root)).toHaveAttribute('data-hidden', 'true');
  await expect(controls(root)).toHaveAttribute('inert', '');
  expect((await root.boundingBox())?.height).toBe(before?.height);
  await scroll.evaluate((element) => {
    element.scrollTo({ top: 100 });
  });
  await expect(controls(root)).toHaveAttribute('data-hidden', 'false');
});

test('a collapsed FAB pointer action stays in place and activates independently', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('collapse-toolbar');

  await page.getByTestId('collapse-scroll').evaluate((element) => element.scrollTo({ top: 100 }));
  await expect(controls(root)).toHaveAttribute('data-expanded', 'false');
  await root.getByRole('button', { name: 'Scroll create' }).click();
  await expect(page.getByTestId('toolbar-count')).toHaveText('Actions: 1');
  await expect(controls(root)).toHaveAttribute('data-expanded', 'false');
});

test('document scrolling uses the same hide/reveal behavior', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('document-scroll-toolbar');

  await page.evaluate(() => window.scrollTo(0, 250));
  await expect(controls(root)).toHaveAttribute('data-hidden', 'true');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(controls(root)).toHaveAttribute('data-hidden', 'false');
});

test('dynamic dark/contrast themes retain scoped FAB roles and standalone component defaults', async ({ page }) => {
  await openToolbarFixture(page);

  const root = page.getByTestId('dynamic-toolbar');

  await expect(surface(root)).toHaveCSS('background-color', rgb(dynamic.schemes.dark.primaryContainer));
  await expect(root.getByRole('button', { name: 'Dynamic undo' })).toHaveCSS(
    'color',
    rgb(dynamic.schemes.dark.onPrimaryContainer),
  );
  await expect(root.getByRole('button', { name: 'Dynamic create' })).toHaveCSS(
    'background-color',
    rgb(dynamic.schemes.dark.tertiaryContainer),
  );
  await expect(page.getByTestId('outside-toolbar')).toHaveCSS(
    'background-color',
    rgb(dynamic.schemes.dark.secondaryContainer),
  );
  await expect(root.getByRole('button', { name: 'Disabled dynamic' })).toBeDisabled();
  await expect(page.getByTestId('fab-toolbar').getByRole('button', { name: 'Create document' })).toHaveCSS(
    'background-color',
    rgb(theme.schemes.light.secondaryContainer),
  );
});

test('reduced motion, forced colors and mobile bounds preserve usable controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 740 });
  await openToolbarFixture(page);

  const root = page.getByTestId('server-standard');

  await expect(controls(root)).toHaveCSS('transition-duration', '0s');
  await expect(surface(root)).toHaveCSS('transition-duration', '0s');
  expect((await root.boundingBox())!.x).toBeGreaterThanOrEqual(16);
  expect((await root.boundingBox())!.width).toBeLessThanOrEqual(328);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(surface(root)).toHaveCSS('outline-style', 'solid');
  await root.getByRole('button', { name: 'standard undo', exact: true }).focus();
  await expect(
    root.getByRole('button', { name: 'standard undo', exact: true }).locator('[data-md3-icon-button-container]'),
  ).toHaveCSS('outline-width', '3px');
});

test('streamed toolbars hydrate without errors and expose accessible named groups', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/streaming');
  await expect(page.getByTestId('streamed-toolbar').getByRole('toolbar', { name: 'Streamed tools' })).toBeVisible();
  await openToolbarFixture(page);
  await expect(page.getByRole('toolbar', { name: 'Editor tools' })).toBeVisible();

  const audit = await new AxeBuilder({ page })
    .include('[data-testid="editor-toolbar"]')
    .include('[data-testid="server-standard"]')
    .include('[data-testid="dynamic-toolbar"]')
    .analyze();

  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('visual review artifacts cover light, vibrant, vertical and collapsed FAB configurations', async ({
  page,
}, testInfo) => {
  await openToolbarFixture(page);

  for (const name of ['server-standard', 'server-vibrant', 'server-vertical', 'vertical-fab-toolbar']) {
    await page.getByTestId(name).screenshot({ path: testInfo.outputPath(`${name}.png`), animations: 'disabled' });
  }

  await page.getByTestId('toggle-expanded').click();
  await expect(page.getByTestId('fab-toolbar').getByRole('button', { name: 'Create document' })).toHaveCSS(
    'width',
    '80px',
  );
  await page
    .getByTestId('fab-toolbar')
    .screenshot({ path: testInfo.outputPath('collapsed-fab.png'), animations: 'disabled' });
});
