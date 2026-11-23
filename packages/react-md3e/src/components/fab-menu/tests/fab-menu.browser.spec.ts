import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

async function finishMotion(element: Locator) {
  await element.evaluate((root) => root.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
}

test('RSC menu actions retain web Menu focus, typeahead, activation and repeated opening', async ({ page }) => {
  await page.goto('/fabs');

  const trigger = page.getByTestId('server-fab-menu').getByRole('button');
  const menu = page.getByRole('menu', { name: 'Server create actions', exact: true });

  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Server document', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Server folder', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await page.keyboard.type('Server f');
  await expect(page.getByRole('menuitem', { name: 'Server folder', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(menu).toBeFocused();
  await page.getByRole('menuitem', { name: 'Server folder', exact: true }).click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await expect(menu).toBeVisible();
});

test('controlled dismissal and canceled actions use the existing Menu event contract', async ({ page }) => {
  await page.goto('/fabs');
  await page.getByLabel('Prevent Escape dismissal').check();

  const trigger = page.getByTestId('create-fab-menu').getByRole('button');
  const menu = page.getByRole('menu', { name: 'Create item', exact: true });

  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Document', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByTestId('fab-menu-reason')).toHaveText('escapeKeyDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Folder', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Upload file', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();
  await expect(page.getByTestId('fab-menu-action')).toHaveText('None');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Keep menu open', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAccessibleName('Close create actions');
  await trigger.click();
  await expect(menu).toBeHidden();
  await expect(page.getByTestId('fab-menu-reason')).toHaveText('triggerClick');
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Document', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('fab-menu-action')).toHaveText('Document');
  await expect(menu).toBeHidden();
  await expect(trigger).toHaveAccessibleName('Create item');
  await expect(page.getByRole('button', { name: 'Unavailable create menu', exact: true })).toBeDisabled();
});

test('large toggle keeps its top trailing anchor while shrinking and items retain pill geometry', async ({ page }) => {
  await page.goto('/fabs');

  const group = page.getByTestId('create-fab-menu');
  const trigger = group.getByRole('button');

  await trigger.scrollIntoViewIfNeeded();

  const closed = (await trigger.boundingBox())!;

  await trigger.click();

  const menu = page.getByRole('menu', { name: 'Create item', exact: true });

  await expect(menu).toBeFocused();
  await finishMotion(trigger);
  await finishMotion(menu);

  const expanded = (await trigger.boundingBox())!;

  expect(expanded.width).toBe(56);
  expect(expanded.height).toBe(56);
  await expect(trigger).toHaveCSS('border-radius', '28px');
  expect(expanded.y).toBeCloseTo(closed.y, 0);
  expect(expanded.x + expanded.width).toBeCloseTo(closed.x + closed.width, 0);
  await expect(group).toHaveCSS('height', '96px');
  await expect(trigger.locator('[data-fab-menu-icon="close"]')).toHaveCSS('width', '20px');
  await expect(menu).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(menu).toHaveCSS('gap', '4px');

  const items = menu.getByRole('menuitem');

  for (const item of await items.all()) {
    await expect(item).toHaveCSS('height', '56px');
    await expect(item).toHaveCSS('border-radius', '9999px');
    await expect(item.locator('[data-md3-menu-item-body]')).toHaveCSS('padding-inline-start', '24px');
    await expect(item.locator('[data-md3-menu-item-body]')).toHaveCSS('gap', '8px');
    await expect(item.locator('svg')).toHaveCSS('width', '24px');
    await expect(item.locator('[data-md3-list-primary]')).toHaveCSS('font-size', '16px');
  }

  const box = (await menu.boundingBox())!;

  expect(expanded.y - box.y - box.height).toBeCloseTo(8, 0);
  expect(box.x + box.width).toBeCloseTo(expanded.x + expanded.width, 0);
});

for (const motionScheme of ['expressive', 'standard'] as const) {
  test(`item widths animate without scaling glyphs and exits finish before hiding (${motionScheme})`, async ({
    page,
  }) => {
    await page.goto('/fabs');

    const trigger = page.getByTestId('six-fab-menu').getByRole('button');

    await trigger.scrollIntoViewIfNeeded();
    await trigger.evaluate((element, variables) => {
      const scope = element.closest<HTMLElement>('[data-md3-theme]')!;

      for (const [name, value] of Object.entries(variables)) {
        if (name.startsWith('--md-sys-motion-spring-')) {
          scope.style.setProperty(name, value);
        }
      }

      scope.style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '2s');
      scope.style.setProperty('--md-sys-motion-spring-fast-effects-duration', '2s');
    }, createTheme({ motionScheme }).cssVariables);
    await trigger.press('ArrowDown');

    const menu = page.getByRole('menu', { name: 'Six create actions', exact: true });
    const items = menu.getByRole('menuitem');

    await expect(items.first()).toBeFocused();
    await expect
      .poll(() =>
        items
          .first()
          .evaluate((element) =>
            element
              .getAnimations()
              .some((animation) => animation instanceof CSSTransition && animation.transitionProperty === 'width'),
          ),
      )
      .toBe(true);

    const motion = await menu.evaluate((element) => {
      const rows = [...element.querySelectorAll<HTMLElement>('[data-md3-fab-menu-item]')];

      return rows.map((row) => {
        const animation = row
          .getAnimations()
          .find((entry) => entry instanceof CSSTransition && entry.transitionProperty === 'width')!;

        animation.pause();
        animation.currentTime = 250;

        return {
          width: row.getBoundingClientRect().width,
          naturalWidth: row.querySelector('[data-md3-menu-item-body]')!.getBoundingClientRect().width,
          bodyTransform: getComputedStyle(row.querySelector('[data-md3-menu-item-body]')!).transform,
          iconWidth: row.querySelector('svg')!.getBoundingClientRect().width,
          delay: parseFloat(getComputedStyle(row).transitionDelay),
        };
      });
    });

    expect(motion[0]!.delay).toBeGreaterThan(motion[5]!.delay);
    expect(motion[0]!.width).toBeGreaterThan(0);
    expect(motion[0]!.width).toBeLessThan(motion[0]!.naturalWidth);

    for (const row of motion) {
      expect(row.bodyTransform).toBe('none');
      expect(row.iconWidth).toBe(24);
    }

    await finishMotion(menu);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('data-ending-style');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveCSS('pointer-events', 'none');
    await expect
      .poll(() =>
        items
          .last()
          .evaluate((element) =>
            element
              .getAnimations()
              .some((animation) => animation instanceof CSSTransition && animation.transitionProperty === 'width'),
          ),
      )
      .toBe(true);

    const closeDelays = await items.evaluateAll((rows) =>
      rows.map((row) => parseFloat(getComputedStyle(row).transitionDelay)),
    );

    expect(closeDelays[0]).toBeLessThan(closeDelays[5]!);
    await finishMotion(menu);
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

test('rapid dismissal and reopening retarget the same items and restore their intrinsic widths', async ({ page }) => {
  await page.goto('/fabs');

  const trigger = page.getByTestId('server-fab-menu').getByRole('button');

  await trigger.evaluate((element) => {
    element
      .closest<HTMLElement>('[data-md3-theme]')!
      .style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '2s');
  });
  await trigger.press('ArrowDown');

  const menu = page.getByRole('menu', { name: 'Server create actions', exact: true });

  await expect(menu.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('data-ending-style');
  await expect(trigger).toBeFocused();
  await trigger.press('ArrowDown');
  await expect(menu).not.toHaveAttribute('data-ending-style');
  await expect(menu.getByRole('menuitem').first()).toBeFocused();
  await finishMotion(menu);
  await finishMotion(trigger);

  for (const item of await menu.getByRole('menuitem').all()) {
    await expect(item).toHaveCSS('opacity', '1');

    const row = (await item.boundingBox())!;
    const body = (await item.locator('[data-md3-menu-item-body]').boundingBox())!;

    expect(row.width).toBeCloseTo(body.width, 0);
  }
});

test('RTL mirrors the anchor and icon order, and portals inherit dark theme colors', async ({ page }) => {
  await page.goto('/fabs');

  const trigger = page.getByTestId('rtl-fab-menu').getByRole('button');

  await trigger.scrollIntoViewIfNeeded();

  const closed = (await trigger.boundingBox())!;

  await trigger.press('ArrowDown');

  const menu = page.getByRole('menu', { name: 'إنشاء عنصر', exact: true });

  await expect(menu.getByRole('menuitem').first()).toBeFocused();
  await finishMotion(menu);
  await finishMotion(trigger);
  await expect(menu).toHaveAttribute('dir', 'rtl');

  const expanded = (await trigger.boundingBox())!;
  const box = (await menu.boundingBox())!;
  const item = menu.getByRole('menuitem').first();
  const icon = (await item.locator('svg').boundingBox())!;
  const text = (await item.locator('[data-md3-list-primary]').boundingBox())!;

  expect(expanded.x).toBeCloseTo(closed.x, 0);
  expect(box.x).toBeCloseTo(expanded.x, 0);
  expect(icon.x).toBeGreaterThan(text.x);
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  const dark = page.getByTestId('dark-fab-menu').getByRole('button');

  await dark.press('ArrowDown');

  const darkMenu = page.getByRole('menu', { name: 'Dark create actions', exact: true });

  await expect(darkMenu.getByRole('menuitem').first()).toBeFocused();
  expect(
    await darkMenu.evaluate((element) => element.closest('[data-md3-theme]')?.getAttribute('data-color-scheme')),
  ).toBe('dark');
});

test('a short viewport scrolls actions while keeping the close button unobstructed', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 250 });
  await page.goto('/fabs');

  const group = page.getByTestId('six-fab-menu');
  const trigger = group.getByRole('button');

  await group.evaluate((element) => {
    Object.assign(element.style, { position: 'fixed', insetInlineEnd: '16px', insetBlockEnd: '16px' });
  });
  await trigger.press('ArrowDown');

  const menu = page.getByRole('menu', { name: 'Six create actions', exact: true });

  await expect(menu.getByRole('menuitem').first()).toBeFocused();
  await finishMotion(menu);
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem').last()).toBeFocused();
  expect(await menu.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(trigger).toBeInViewport();
  await trigger.click();
  await expect(menu).toBeHidden();
});

test('reduced motion, forced colors and accessibility retain usable floating actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/fabs');

  const trigger = page.getByTestId('server-fab-menu').getByRole('button');

  await trigger.press('ArrowDown');

  const menu = page.getByRole('menu', { name: 'Server create actions', exact: true });
  const item = menu.getByRole('menuitem').first();

  await expect(item).toBeFocused();
  await expect(item).toHaveCSS('transition-property', 'none');
  await expect(item).toHaveCSS('outline-style', 'solid');
  expect(await menu.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'none' });
  // Base UI's visually hidden focus sentinels redirect Tab immediately; they are not action content.
  expect((await new AxeBuilder({ page }).exclude('[data-base-ui-focus-guard]').analyze()).violations).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(menu).toBeHidden();
});

test('Storybook ships the same composed FAB menu with extracted CSS', async ({ page }) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-fabmenu--playground&viewMode=story');
  await page.getByRole('button', { name: 'Create', exact: true }).press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Document', exact: true })).toBeFocused();
  await expect(page.getByRole('menuitem', { name: 'Document', exact: true })).toHaveCSS('height', '56px');
});
