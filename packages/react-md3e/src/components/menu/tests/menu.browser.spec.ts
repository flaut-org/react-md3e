import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('server composition exposes a styled button before hydration and streams an interactive menu', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const serverPage = await context.newPage();

    await serverPage.goto('http://127.0.0.1:3100/menus');
    await expect(serverPage.getByRole('button', { name: 'Server menu', exact: true })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
    await expect(serverPage.getByRole('button', { name: 'Server menu', exact: true })).toHaveCSS('height', '40px');
    await expect(serverPage.getByRole('menu')).toHaveCount(0);
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await page.getByRole('button', { name: 'Streamed menu', exact: true }).click();
  await expect(page.getByTestId('streamed-menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Streamed command', exact: true })).toHaveCSS('min-height', '48px');
});

test('keyboard opening, disabled focus, looping, Home/End and typeahead preserve command semantics', async ({
  page,
}) => {
  await page.goto('/menus');

  const trigger = page.getByRole('button', { name: 'Commands', exact: true });
  const menu = page.getByTestId('command-menu');

  await trigger.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'New document', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Archived document' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();
  await expect(page.getByTestId('menu-action')).toHaveText('none');
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem', { name: 'Navigate', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'New document', exact: true })).toBeFocused();
  await page.keyboard.press('i');
  await expect(menu.getByRole('menuitem', { name: 'Inspect without closing' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('menu-action')).toHaveText('inspect');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('menu-action')).toHaveText('new');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('ArrowUp');
  await expect(menu.getByRole('menuitem', { name: 'Navigate', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('pointer commands and native links preserve refs and use only the primary text as the accessible name', async ({
  page,
}) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Commands', exact: true }).click();

  const item = page.getByRole('menuitem', { name: 'New document', exact: true });

  await expect(item).toHaveAccessibleDescription('Start with an empty document');
  await item.click();
  await expect(page.getByTestId('menu-action')).toHaveText('new');
  await page.getByRole('button', { name: 'Check menu refs' }).click();
  await expect(page.getByTestId('menu-refs')).toHaveText('true');
  await page.getByRole('button', { name: 'Commands', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Navigate', exact: true }).click();
  await expect(page).toHaveURL(/#destination$/);
  await expect(page.getByTestId('command-menu')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Disabled menu', exact: true })).toBeDisabled();
});

test('click cancellation, controlled changes and close vetoes retain the intended menu state', async ({ page }) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Commands', exact: true }).click();

  const menu = page.getByTestId('command-menu');

  await menu.getByRole('menuitem', { name: 'Prevented command' }).click();
  await expect(menu).toBeVisible();
  await menu.getByRole('menuitem', { name: 'Vetoed command' }).click();
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Controlled menu', exact: true }).press('Enter');
  await expect(page.getByTestId('controlled-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('menu-reason')).toHaveText('escapeKeyDown');
  await expect(page.getByTestId('controlled-menu')).toBeHidden();
  await page.getByRole('button', { name: 'Controlled menu', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Run controlled action' }).click();
  await expect(page.getByTestId('menu-reason')).toHaveText('itemClick');
  await expect(page.getByTestId('menu-action')).toHaveText('controlled');
  await page.getByRole('button', { name: 'Close veto menu' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('veto-menu')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Keep open' }).click();
  await expect(page.getByTestId('veto-menu')).toBeVisible();
});

test('checkboxes stay open, radio items close, and controlled/uncontrolled selections persist across openings', async ({
  page,
}) => {
  await page.goto('/menus');

  const trigger = page.getByRole('button', { name: 'Selection menu', exact: true });
  const menu = page.getByTestId('selection-menu');

  await trigger.click();
  await expect(menu.getByRole('group', { name: 'Formatting' })).toBeVisible();
  await menu.getByRole('menuitemcheckbox', { name: 'Bold', exact: true }).click();
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Bold', exact: true })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Bold', exact: true })).toHaveCSS('border-radius', '12px');
  await menu.getByRole('menuitemcheckbox', { name: 'Italic', exact: true }).click();
  await menu.getByRole('menuitemcheckbox', { name: 'Locked preference' }).click();
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Locked preference' })).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitemradio', { name: 'Second locked' })).toHaveAttribute('aria-disabled', 'true');
  await menu.getByRole('menuitemradio', { name: 'Name', exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(page.getByTestId('menu-selection')).toHaveText('true:name');
  await trigger.click();
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Italic', exact: true })).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await expect(menu.getByRole('menuitemradio', { name: 'Name', exact: true })).toHaveAttribute('aria-checked', 'true');
  await expect(menu).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: 'Uncontrolled radio menu' }).click();
  await page.getByRole('menuitemradio', { name: 'Second', exact: true }).click();
  await page.getByRole('button', { name: 'Uncontrolled radio menu' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Second', exact: true })).toHaveAttribute(
    'aria-checked',
    'true',
  );
});

test('outside press and Tab dismiss menus while preserving the next focus destination', async ({ page }) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Controlled menu', exact: true }).click();
  await expect(page.getByTestId('controlled-menu')).toBeFocused();
  await page.mouse.click(2, 2);
  await expect(page.getByTestId('controlled-menu')).toBeHidden();
  await expect(page.getByTestId('menu-reason')).toHaveText('clickAway');
  await page.getByRole('button', { name: 'Nonmodal menu', exact: true }).press('Enter');
  await expect(page.getByRole('menuitem', { name: 'Nonmodal command', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('nonmodal-menu')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu dialog', exact: true })).toBeFocused();
});

test('submenus open with arrows, close one level with Escape, and commands close the entire tree', async ({ page }) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Nested menu', exact: true }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Share', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('share-menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Copy link', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Export', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('export-menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'PDF document', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('export-menu')).toBeHidden();
  await expect(page.getByTestId('share-menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Export', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'PDF document', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('menu-action')).toHaveText('pdf');
  await expect(page.getByTestId('nested-menu')).toBeHidden();
  await expect(page.getByTestId('share-menu')).toBeHidden();
  await expect(page.getByTestId('export-menu')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Nested menu', exact: true })).toBeFocused();
});

test('pointer navigation enters a submenu across its gap and inactive parent corners become smaller', async ({
  page,
}) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Nested menu', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Share', exact: true }).hover();
  await expect(page.getByTestId('share-menu')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Copy link', exact: true }).hover();
  await expect(page.getByTestId('nested-menu')).toHaveCSS('border-radius', '8px');
  await page.getByRole('menuitem', { name: 'Copy link', exact: true }).click();
  await expect(page.getByTestId('menu-action')).toHaveText('link');
});

test('inherited RTL reverses submenu arrows and placement while retaining labels', async ({ page }) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'RTL menu', exact: true }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'خيارات', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowLeft');

  const submenu = page.getByTestId('rtl-submenu');

  await expect(submenu).toBeVisible();
  await expect(submenu).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('menuitem', { name: 'نسخ' })).toBeFocused();
  await expect(page.getByTestId('rtl-menu').locator('[data-md3-menu-arrow]')).toHaveCSS(
    'transform',
    'matrix(-1, 0, 0, 1, 0, 0)',
  );
  await page.keyboard.press('ArrowRight');
  await expect(submenu).toBeHidden();
  await expect(page.getByRole('menuitem', { name: 'خيارات', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('rtl-menu')).toBeHidden();
  await page.getByRole('button', { name: 'LTR override menu', exact: true }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Options', exact: true })).toBeFocused();
  await expect(page.getByTestId('ltr-override-menu').locator('[data-md3-menu-arrow]')).toHaveCSS('transform', 'none');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Copy in LTR', exact: true })).toBeFocused();
});

test('density, narrow viewport collisions and internal scrolling keep targets and items reachable', async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 360, height: 720 });
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Edge menu', exact: true }).click();

  const edge = page.getByTestId('edge-menu');

  await expect(edge).toBeVisible();
  await expect(edge).toHaveAttribute('data-side', 'top');

  const box = (await edge.boundingBox())!;

  expect(box.x).toBeGreaterThanOrEqual(8 - 1e-6);
  expect(box.x + box.width).toBeLessThanOrEqual(352 + 1e-6);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Scrollable menu', exact: true }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Command 1', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Command 30', exact: true })).toBeFocused();
  expect(await page.getByTestId('scroll-menu').evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Density -3', exact: true }).click();
  await expect(page.getByTestId('density--3').getByRole('menuitem').first()).toHaveCSS('min-height', '36px');

  const context = await browser.newContext({ hasTouch: true, isMobile: true });

  try {
    const touchPage = await context.newPage();

    await touchPage.goto('http://127.0.0.1:3100/menus');
    await touchPage.getByRole('button', { name: 'Density -3', exact: true }).tap();
    await expect(touchPage.getByTestId('density--3').getByRole('menuitem').first()).toHaveCSS('min-height', '48px');
  } finally {
    await context.close();
  }
});

test('modal focus stays inside its dialog and Escape dismisses the active menu first', async ({ page }) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Open menu dialog' }).click();
  await page.getByRole('button', { name: 'Dialog menu', exact: true }).press('Enter');
  await expect(page.getByTestId('dialog-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('dialog-menu')).toBeHidden();
  await expect(page.getByRole('alertdialog', { name: 'Menu inside dialog' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Dialog menu', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('alertdialog', { name: 'Menu inside dialog' })).toBeHidden();
});

test('dark portals, reduced motion, forced colors and accessibility work without stylesheet insertion', async ({
  page,
}) => {
  await page.goto('/menus');

  const styleCount = await page.locator('style').count();

  await page.getByRole('button', { name: 'Dark menu', exact: true }).press('Enter');

  const menu = page.getByTestId('dark-menu');

  await expect(menu).toBeVisible();
  expect(await menu.evaluate((element) => Boolean(element.closest('[data-testid="menu-dark-theme"]')))).toBe(true);
  await expect(menu).toHaveCSS('color-scheme', 'dark');
  expect((await new AxeBuilder({ page }).include('[data-testid="dark-menu"]').analyze()).violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(menu).toHaveCSS('transition-duration', '0s');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.getByRole('button', { name: 'Selection menu', exact: true }).press('Enter');
  await expect(page.getByTestId('selection-menu')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Bold', exact: true })).toHaveCSS('outline-width', '3px');
  expect(await page.locator('style').count()).toBe(styleCount);
});

test('Storybook renders vibrant selection and cascading menu examples from the built package', async ({ page }) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-menu--selection&viewMode=story');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await expect(page.getByRole('menu')).toHaveAttribute('data-variant', 'vibrant');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Bold', exact: true })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-menu--submenus&viewMode=story');
  await page.getByRole('button', { name: 'Open menu', exact: true }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Share', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Copy link', exact: true })).toBeFocused();
});

test('menus interpolate anchor-based expansion and retain their content until the closing transition finishes', async ({
  page,
}) => {
  await page.goto('/menus');

  const menu = page.getByTestId('command-menu');

  // Slow the inherited token so inspection is independent of machine speed, then seek the native transition.
  await menu.evaluate((element) => element.style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '5s'));
  await page.getByRole('button', { name: 'Commands', exact: true }).press('Enter');
  await expect(menu.getByRole('menuitem').first()).toBeFocused();
  await expect(menu).toBeVisible();
  await expect
    .poll(() =>
      menu.evaluate((element) =>
        element
          .getAnimations()
          .some(
            (animation) => animation instanceof CSSTransition && animation.transitionProperty === '--md3e-menu-scale',
          ),
      ),
    )
    .toBe(true);

  const sample = async () =>
    menu.evaluate((element) => {
      const animation = element
        .getAnimations()
        .find(
          (candidate) => candidate instanceof CSSTransition && candidate.transitionProperty === '--md3e-menu-scale',
        );

      if (!animation) {
        throw new Error('Expected the extracted menu scale transition.');
      }

      animation.pause();
      animation.currentTime = 500;

      return {
        scale: Number(getComputedStyle(element).getPropertyValue('--md3e-menu-scale')),
        visibility: getComputedStyle(element).visibility,
      };
    });
  const opening = await sample();

  expect(opening.scale).toBeGreaterThan(0);
  expect(opening.scale).toBeLessThan(1);
  await menu.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('data-ending-style', '');

  const closing = await sample();

  expect(closing.scale).toBeGreaterThan(0);
  expect(closing.scale).toBeLessThan(1);
  expect(closing.visibility).toBe('visible');
  await menu.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
  await expect(menu).toBeHidden();
  await expect(menu).toHaveCount(1);
});
