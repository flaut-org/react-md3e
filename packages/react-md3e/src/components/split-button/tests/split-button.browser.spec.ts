import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const sizes = [
  { size: 'extraSmall', height: 32, iconSize: 22, inner: 4, offset: -1, padding: 13, interactive: 8 },
  { size: 'small', height: 40, iconSize: 22, inner: 4, offset: -1, padding: 13, interactive: 12 },
  { size: 'medium', height: 56, iconSize: 26, inner: 4, offset: -2, padding: 15, interactive: 12 },
  { size: 'large', height: 96, iconSize: 38, inner: 8, offset: -3, padding: 29, interactive: 20 },
  { size: 'extraLarge', height: 136, iconSize: 50, inner: 12, offset: -6, padding: 43, interactive: 20 },
] as const;

async function finishMotion(element: Locator) {
  await element.evaluate((root) => root.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
}

async function geometry(group: Locator) {
  return group.evaluate((element) => {
    const [action, trigger] = [...element.querySelectorAll('button')];
    const a = action!.getBoundingClientRect();
    const t = trigger!.getBoundingClientRect();
    const style = getComputedStyle(trigger!);
    const icon = trigger!.querySelector('svg')!;
    const transform = new DOMMatrix(getComputedStyle(icon).transform);

    return {
      actionHeight: a.height,
      actionWidth: a.width,
      triggerHeight: t.height,
      triggerWidth: t.width,
      gap: t.left - a.right,
      inner: parseFloat(style.borderStartStartRadius),
      outer: parseFloat(style.borderStartEndRadius),
      iconSize: parseFloat(getComputedStyle(icon).width),
      offset: transform.e,
      background: style.backgroundColor,
    };
  });
}

test('SplitButton renders two styled buttons before hydration and works in streamed server composition', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/split-buttons');

    const group = server.getByTestId('server-split');

    await expect(group).toHaveAttribute('role', 'group');
    await expect(group.getByRole('button')).toHaveCount(2);
    await expect(group.getByRole('button', { name: 'Save', exact: true })).toHaveCSS('height', '40px');
    await expect(group.getByRole('button', { name: 'More save options' })).toHaveAttribute('aria-expanded', 'false');
    await expect(group.getByRole('button', { name: 'More save options' })).toHaveAttribute('aria-haspopup', 'menu');
    await expect(group).toHaveCSS('gap', '2px');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await page.getByRole('button', { name: 'More streamed options' }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Streamed split action' })).toBeFocused();
});

test('primary action, menu selection, checkbox persistence and submenus remain independent', async ({ page }) => {
  await page.goto('/split-buttons');

  const group = page.getByTestId('action-split');
  const trigger = group.getByRole('button', { name: 'More send options' });

  await group.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByTestId('primary-count')).toHaveText('1');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await page.getByRole('menuitem', { name: 'Schedule send' }).click();
  await expect(page.getByTestId('last-split-action')).toHaveText('schedule');
  await expect(page.getByTestId('primary-count')).toHaveText('1');
  await expect(page.getByRole('menu', { name: 'Send actions', exact: true })).toBeHidden();
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Schedule send' })).toBeFocused();
  await page.getByRole('menuitemcheckbox', { name: 'Request receipt' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Send actions', exact: true })).toBeHidden();
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Schedule send' })).toBeFocused();
  await expect(page.getByRole('menuitemcheckbox', { name: 'Request receipt' })).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Plain text', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('last-split-action')).toHaveText('plain');
  await expect(trigger).toBeFocused();
  await expect(page.getByTestId('primary-count')).toHaveText('1');
});

test('Tab reaches both buttons; Enter, Space and arrow opening preserve Menu focus restoration', async ({ page }) => {
  await page.goto('/split-buttons');

  const group = page.getByTestId('action-split');
  const primary = group.getByRole('button', { name: 'Send', exact: true });
  const trigger = group.getByRole('button', { name: 'More send options' });

  await page.getByRole('button', { name: 'Before split button', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(primary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('primary-count')).toHaveText('1');
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('menuitem', { name: 'Schedule send' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Send actions', exact: true })).toBeHidden();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Send format' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Send actions', exact: true })).toBeHidden();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After split button', exact: true })).toBeFocused();
});

test('four color styles and all five sizes retain 2px spacing, source geometry and stable widths when open', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.goto('/split-buttons');

  for (const variant of ['filled', 'tonal', 'outlined', 'elevated']) {
    for (const { size, height, iconSize, inner, offset, padding } of sizes) {
      await page.mouse.move(0, 0);

      const group = page.getByTestId(`split-${variant}-${size}`);
      const closed = await geometry(group);
      const trigger = group.locator('[data-md3-split-menu-button]');

      expect(closed.actionHeight).toBe(height);
      expect(closed.triggerHeight).toBe(height);
      expect(closed.triggerWidth).toBe(iconSize + padding * 2);
      expect(closed.iconSize).toBe(iconSize);
      expect(closed.gap).toBeCloseTo(2, 3);
      expect(closed.inner).toBe(inner);
      expect(closed.outer).toBe(height / 2);
      expect(closed.offset).toBe(offset);
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');

      const opened = await geometry(group);

      expect(opened.inner).toBe(height / 2);
      expect(opened.outer).toBe(height / 2);
      expect(opened.actionWidth).toBeCloseTo(closed.actionWidth, 3);
      expect(opened.triggerWidth).toBe(closed.triggerWidth);
      expect(opened.offset).toBe(0);
      expect(opened.background).toBe(closed.background);
      await expect(trigger).not.toHaveAttribute('aria-pressed');
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
  }
});

test('disabled, loading and individually disabled buttons reject only their unavailable actions', async ({ page }) => {
  await page.goto('/split-buttons');

  for (const button of await page.getByRole('group', { name: 'Disabled', exact: true }).getByRole('button').all()) {
    await expect(button).toBeDisabled();
  }

  await expect(page.getByRole('button', { name: 'Loading', exact: true })).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('button', { name: 'Loading options', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Unavailable primary', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Available alternatives', exact: true }).click();
  await expect(page.getByRole('menuitem', { name: 'Alternative action', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Available primary', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Unavailable alternatives', exact: true })).toBeDisabled();
});

test('hover, keyboard focus and press morph inner corners while preserving the outer pill', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/split-buttons');

  for (const { size, height, interactive } of sizes) {
    const group = page.getByTestId(`split-filled-${size}`);
    const action = group.locator('[data-md3-split-action]');
    const trigger = group.locator('[data-md3-split-menu-button]');

    await action.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(action).toHaveCSS('border-start-end-radius', `${interactive}px`);
    await expect(action).toHaveCSS('border-start-start-radius', `${height / 2}px`);
    await page.keyboard.down('Space');
    await expect(action).toHaveCSS('border-start-start-radius', `${height / 2}px`);
    await page.keyboard.up('Space');
    await action.evaluate((element) => element.blur());
    await trigger.hover();
    await expect(trigger).toHaveCSS('border-start-start-radius', `${interactive}px`);
    await expect(trigger).toHaveCSS('border-start-end-radius', `${height / 2}px`);
    await page.mouse.down();
    await expect(trigger).toHaveCSS('border-start-end-radius', `${height / 2}px`);
    await page.mouse.up();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
  }
});

test('controlled state and native Menu cancellation apply without a separate SplitButton state store', async ({
  page,
}) => {
  await page.goto('/split-buttons');

  const trigger = page.getByRole('button', { name: 'More export options', exact: true });

  await page.getByLabel('Prevent menu opening', { exact: true }).check();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.getByLabel('Prevent menu opening', { exact: true }).uncheck();
  await page.getByLabel('Prevent menu closing', { exact: true }).check();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByTestId('export-close-reason')).toHaveText('escapeKeyDown');
  await page.getByLabel('Prevent menu closing', { exact: true }).uncheck();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('export-open')).toHaveText('false');
  await page.getByRole('button', { name: 'Toggle export from code' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('native submit attributes and group, button and Menu refs survive composition', async ({ page }) => {
  await page.goto('/split-buttons');
  await page.getByRole('button', { name: 'More publish options', exact: true }).click();
  await expect(page.getByRole('menu', { name: 'More publish options', exact: true })).toBeFocused();
  await expect(page.getByTestId('split-form-value')).toHaveText('');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'More publish options', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Check split refs' }).click();
  await expect(page.getByRole('group', { name: 'Publish', exact: true })).toHaveAttribute(
    'data-refs',
    'DIV,BUTTON,BUTTON,DIV',
  );
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(page.getByTestId('split-form-value')).toHaveText('{"intent":"publish"}');
});

test('chevron uses standard motion in both schemes and animates inward on enter and exit, mirrored in RTL', async ({
  page,
}) => {
  const standard = createTheme({ sourceColor: '#6750a4', motionScheme: 'standard' }).motion.fast.spatial;

  for (const direction of ['ltr', 'rtl']) {
    for (const scheme of ['expressive', 'standard']) {
      await page.goto(
        `http://127.0.0.1:6106/iframe.html?id=components-splitbutton--${direction === 'rtl' ? 'right-to-left' : 'playground'}&viewMode=story&globals=motionScheme:${scheme}`,
      );

      const trigger = page.locator('[data-md3-split-menu-button]');
      const icon = trigger.locator('svg');

      await expect(icon).toHaveCSS('transition-duration', `${standard.duration / 1000}s`);
      await icon.evaluate((element) =>
        (element as SVGElement).style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '5s'),
      );
      await trigger.press('Enter');

      const sample = async () => {
        await expect
          .poll(() =>
            icon.evaluate((element) =>
              element
                .getAnimations()
                .some(
                  (animation) => animation instanceof CSSTransition && animation.transitionProperty === 'transform',
                ),
            ),
          )
          .toBe(true);

        return icon.evaluate((element) => {
          const animation = element
            .getAnimations()
            .find((candidate) => candidate instanceof CSSTransition && candidate.transitionProperty === 'transform')!;

          animation.pause();
          animation.currentTime = 500;

          return new DOMMatrix(getComputedStyle(element).transform).b;
        });
      };
      const opening = await sample();

      expect(opening * (direction === 'rtl' ? -1 : 1)).toBeGreaterThan(0);
      await finishMotion(trigger);
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');

      const closing = await sample();

      expect(closing * (direction === 'rtl' ? -1 : 1)).toBeGreaterThan(0);
      await finishMotion(trigger);
      await expect(icon).toHaveCSS('transform', `matrix(1, 0, 0, 1, ${direction === 'rtl' ? 1 : -1}, 0)`);
    }
  }
});

test('grouped Menu, dark scoped portals, inherited RTL, Dialog Escape and accessibility preferences remain intact', async ({
  page,
}) => {
  await page.goto('/split-buttons');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'More organize options' }).press('Enter');

  const grouped = page.getByRole('menu', { name: 'More organize options', exact: true });

  await expect(grouped).toHaveAttribute('data-layout', 'grouped');
  await expect(grouped.locator(':scope > [data-md3-menu-group]')).toHaveCount(2);
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Archive folder' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem', { name: 'Move to', exact: true })).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Move to', exact: true })).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(grouped).toBeHidden();
  await page.getByRole('button', { name: 'More dark options' }).click();

  const dark = createTheme({ sourceColor: '#6750a4' }).schemes.dark.surfaceContainerLow;
  const darkRgb = `rgb(${dark
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

  const darkMenu = page.getByRole('menu', { name: 'More dark options', exact: true });

  await expect(darkMenu).toHaveCSS('background-color', darkRgb);
  await expect(darkMenu.locator('[data-md3-menu-item]').first()).toHaveCSS('font-size', '14px');
  await page.keyboard.press('Escape');
  await expect(darkMenu).toBeHidden();

  const rtl = page.getByTestId('rtl-split');
  const first = (await rtl.locator('[data-md3-split-action]').boundingBox())!;
  const last = (await rtl.locator('[data-md3-split-menu-button]').boundingBox())!;

  expect(last.x + last.width).toBeCloseTo(first.x - 2, 2);
  await page.getByRole('button', { name: 'Open split dialog' }).click();

  const dialog = page.getByRole('alertdialog', { name: 'Document actions', exact: true });
  const trigger = dialog.getByRole('button', { name: 'More document options' });

  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Duplicate document' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('menu', { name: 'More document options', exact: true })).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.getByRole('button', { name: 'More save options' }).press('Enter');
  await expect(page.getByTestId('server-split').locator('svg')).toHaveCSS('transition-duration', '0s');
  await expect(page.getByRole('menu')).toHaveCSS('transition-duration', '0s');
  expect((await new AxeBuilder({ page }).include('[data-md3-menu][data-open]').analyze()).violations).toEqual([]);
});

test('a full-width split button remains within a small viewport and opening inserts no style rules', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-splitbutton--full-width&viewMode=story');

  const count = await page.locator('style').count();
  const group = page.getByRole('group', { name: 'Send', exact: true });
  const box = (await group.boundingBox())!;

  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await group.getByRole('button', { name: 'More send options' }).click();
  await expect(page.getByRole('menuitem', { name: 'Schedule send' })).toBeVisible();
  expect(await page.locator('style').count()).toBe(count);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
