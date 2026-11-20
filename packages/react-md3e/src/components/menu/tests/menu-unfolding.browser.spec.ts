import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function finishMotion(menu: Locator) {
  await menu.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
}

async function geometry(menu: Locator, seek?: number) {
  if (seek !== undefined) {
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
  }

  return menu.evaluate((element, time) => {
    if (time !== undefined) {
      const animation = element
        .getAnimations()
        .find(
          (candidate) => candidate instanceof CSSTransition && candidate.transitionProperty === '--md3e-menu-scale',
        );

      if (!animation) {
        throw new Error('Expected a menu unfolding transition.');
      }

      animation.pause();
      animation.currentTime = time;
    }

    const box = element.getBoundingClientRect();
    const bodies = [...element.querySelectorAll('[data-md3-menu-item-body]')].map((body) => {
      const bodyBox = body.getBoundingClientRect();
      const text = body.querySelector('[data-md3-list-primary] > span')!.getBoundingClientRect();
      const icon = body.querySelector('[data-leading-kind]')?.getBoundingClientRect();

      return {
        center: bodyBox.y + bodyBox.height / 2,
        textWidth: text.width,
        textHeight: text.height,
        iconHeight: icon?.height,
      };
    });

    return { height: box.height, width: box.width, bodies };
  }, seek);
}

test('Vertical menu with gap has separate surfaces, 2px transparent space and the reference corner hierarchy', async ({
  page,
}) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Vertical menu with gap', exact: true }).press('ArrowDown');

  const menu = page.getByTestId('gap-menu');
  const groups = menu.locator(':scope > [data-md3-menu-group]');

  await expect(menu.getByRole('menuitem', { name: 'Item 1', exact: true })).toBeFocused();
  await finishMotion(menu);
  await expect(menu).toHaveCSS('background-color', /^rgba\(\d+, \d+, \d+, 0\)$/);
  await expect(groups).toHaveCount(2);
  await expect(groups.first()).toHaveCSS('border-top-left-radius', '16px');
  await expect(groups.first()).toHaveCSS('border-bottom-left-radius', '8px');
  await expect(groups.last()).toHaveCSS('border-top-left-radius', '8px');
  await expect(groups.last()).toHaveCSS('border-bottom-left-radius', '16px');

  const first = (await groups.first().boundingBox())!;
  const last = (await groups.last().boundingBox())!;

  expect(last.y - first.y - first.height).toBeCloseTo(2, 2);
  expect(first.width).toBeCloseTo(last.width, 2);
  await expect(menu.getByRole('menuitem', { name: 'Item 3', exact: true }).locator('[data-leading-kind]')).toHaveText(
    '✎',
  );
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem', { name: 'Item 4', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Send to device', exact: true })).toBeFocused();
  await expect(page.getByTestId('gap-submenu')).toHaveAttribute('data-layout', 'standard');
  await page.getByRole('menuitem', { name: 'Send to device', exact: true }).click();
  await expect(menu).toBeHidden();
});

test('standard and grouped menus unfold their surfaces and row spacing without stretching text or icons', async ({
  page,
}) => {
  await page.goto('/menus');

  for (const [id, trigger] of [
    ['command-menu', 'Commands'],
    ['gap-menu', 'Vertical menu with gap'],
  ] as const) {
    const menu = page.getByTestId(id);
    const duration = await menu.evaluate((element) =>
      parseFloat(getComputedStyle(element).getPropertyValue('--md-sys-motion-spring-fast-spatial-duration')),
    );

    await menu.evaluate((element) => element.style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '5s'));
    await page.getByRole('button', { name: trigger, exact: true }).press('Enter');
    await expect(menu.getByRole('menuitem').first()).toBeFocused();

    const opening = await geometry(menu, 500);
    // Seek the point corresponding to 100ms of the original spring, independent of CI frame rate.
    const nearOpen = await geometry(menu, (100 / duration) * 5000);

    await finishMotion(menu);

    const full = await geometry(menu);

    expect(opening.height).toBeGreaterThan(0);
    expect(opening.height).toBeLessThan(full.height);
    expect(nearOpen.height).toBeGreaterThanOrEqual(full.height * 0.9);
    expect(nearOpen.height).toBeLessThanOrEqual(full.height * 1.05);
    expect(opening.width).toBeCloseTo(full.width, 2);
    expect(opening.bodies[1]!.center - opening.bodies[0]!.center).toBeLessThan(
      full.bodies[1]!.center - full.bodies[0]!.center,
    );

    for (let index = 0; index < full.bodies.length; index += 1) {
      expect(opening.bodies[index]!.textHeight).toBeCloseTo(full.bodies[index]!.textHeight, 1);
      expect(opening.bodies[index]!.textWidth).toBeCloseTo(full.bodies[index]!.textWidth, 1);
    }

    expect(opening.bodies[0]!.iconHeight).toBeCloseTo(full.bodies[0]!.iconHeight!, 1);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('data-ending-style', '');

    const closing = await geometry(menu, 500);

    expect(closing.height).toBeGreaterThan(0);
    expect(closing.height).toBeLessThan(full.height);
    expect(closing.bodies[0]!.textHeight).toBeCloseTo(full.bodies[0]!.textHeight, 1);
    expect(closing.bodies[0]!.iconHeight).toBeCloseTo(full.bodies[0]!.iconHeight!, 1);
    await finishMotion(menu);
    await expect(menu).toBeHidden();
  }
});

test('the last submenu highlight follows the bottom group corners despite nonvisual portal siblings', async ({
  page,
}) => {
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Vertical menu with gap', exact: true }).click();

  const menu = page.getByTestId('gap-menu');
  const item = menu.getByRole('menuitem', { name: 'Item 4', exact: true });

  await expect(menu).not.toHaveAttribute('data-starting-style', '');
  await finishMotion(menu);
  await expect(item).toHaveCSS('border-bottom-left-radius', '12px');
  await item.hover();
  await expect(page.getByTestId('gap-submenu')).toBeVisible();
  await expect(item).toHaveCSS('border-top-left-radius', '4px');
  await expect(item).toHaveCSS('border-top-right-radius', '4px');
  await expect(item).toHaveCSS('border-bottom-left-radius', '12px');
  await expect(item).toHaveCSS('border-bottom-right-radius', '12px');
  await expect
    .poll(() => item.evaluate((element) => getComputedStyle(element, '::before').borderBottomLeftRadius))
    .toBe('12px');
  await expect(menu.getByRole('menuitem', { name: 'Item 3', exact: true })).toHaveCSS('border-radius', '12px');
});

test('vibrant grouped menus preserve selection, accessibility, forced colors and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/menus');
  await page.getByRole('button', { name: 'Vibrant menu with gap', exact: true }).press('Enter');

  const menu = page.getByTestId('vibrant-gap-menu');
  const checkbox = menu.getByRole('menuitemcheckbox', { name: 'Show details' });

  await expect(checkbox).toBeFocused();
  await expect(menu).toHaveCSS('transition-duration', '0s');
  await expect(menu).toHaveCSS('background-color', /^rgba\(\d+, \d+, \d+, 0\)$/);
  await checkbox.press('Space');
  await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  expect((await new AxeBuilder({ page }).include('[data-testid="vibrant-gap-menu"]').analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.getByRole('button', { name: 'Vibrant menu with gap', exact: true }).press('Enter');
  await expect(checkbox).toBeFocused();
  await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  await expect(menu.locator(':scope > [data-md3-menu-group]').first()).toHaveCSS('outline-width', '1px');
  await expect(menu).toHaveCSS('background-color', /^rgba\(\d+, \d+, \d+, 0\)$/);
});

test('Storybook exposes Vertical menu with gap, including vibrant and RTL examples', async ({ page }) => {
  for (const id of ['vertical-menu-with-gap', 'vibrant-menu-with-gap', 'right-to-left-with-gap']) {
    await page.goto(`http://127.0.0.1:6106/iframe.html?id=components-menu--${id}&viewMode=story`);
    await page.getByRole('button', { name: 'Vertical menu with gap', exact: true }).press('Enter');

    const menu = page.getByRole('menu', { name: 'Vertical menu with gap', exact: true });

    await expect(menu.getByRole('menuitem', { name: 'Item 1', exact: true })).toBeFocused();
    await expect(menu).toHaveAttribute('data-layout', 'grouped');
    await expect(menu.locator(':scope > [data-md3-menu-group]')).toHaveCount(2);
    await page.keyboard.press('End');
    await expect(menu.getByRole('menuitem', { name: 'Item 4', exact: true })).toBeFocused();
    await page.keyboard.press(id === 'right-to-left-with-gap' ? 'ArrowLeft' : 'ArrowRight');
    await expect(page.getByRole('menuitem', { name: 'Send to device', exact: true })).toBeFocused();
  }
});
