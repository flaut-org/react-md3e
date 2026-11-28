import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { pauseMotionOnAttributeChange } from '../../../../tests/browser/pause-motion';

const theme = createTheme();
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;
const root = (action: Locator) => action.locator('..');

test('all four MD3 chip types render with automatic CSS before browser JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/chips');

    for (const kind of ['assist', 'filter', 'input', 'suggestion']) {
      const chip = page.getByTestId(`server-${kind}`);

      await expect(chip).toHaveCSS('height', '32px');
      await expect(chip).toHaveCSS('border-radius', '8px');
      await expect(chip).toHaveCSS('font-size', '14px');
      await expect(chip).toHaveCSS('line-height', '20px');
      await expect(chip).toHaveCSS('font-weight', '500');
    }

    await expect(page.getByTestId('server-assist').locator('[data-md3-chip-leading]')).toHaveCSS('width', '18px');
    await expect(page.getByTestId('server-input').locator('[data-md3-chip-avatar]')).toHaveCSS('width', '24px');
    await expect(page.getByTestId('server-input').getByRole('button')).toHaveCount(0);
    await expect(page.getByTestId('server-filter')).toHaveCSS(
      'background-color',
      rgb(theme.schemes.light.secondaryContainer),
    );
    await expect(page.getByTestId('server-filter').locator('[data-md3-chip-check]')).toHaveCSS('opacity', '1');
    await expect(page.getByTestId('server-assist')).toHaveCSS('color', rgb(theme.schemes.light.onSurface));
    await expect(page.getByTestId('server-suggestion')).toHaveCSS('color', rgb(theme.schemes.light.onSurfaceVariant));
    await expect(page.getByTestId('server-suggestion')).toHaveCSS(
      'border-top-color',
      rgb(theme.schemes.light.outlineVariant),
    );

    const remove = page.getByRole('button', { name: 'Remove Remove-only token', exact: true });
    const surface = remove.locator('[data-md3-chip-delete-surface]');

    await expect(surface).toHaveCSS('width', '24px');
    await expect(surface).toHaveCSS('height', '24px');
    await remove.hover();
    await expect.poll(() => surface.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0.08');
  } finally {
    await context.close();
  }
});

test('passive input chips keep server presentation and selected Expressive shapes without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/chips/server');
    await expect(page.locator('[data-md3-chip]')).toHaveCount(3);
    await expect(page.getByRole('button')).toHaveCount(0);
    await expect(page.getByTestId('passive-chip')).toHaveCSS('height', '32px');
    await expect(page.locator('[data-selected="true"]')).toHaveCSS('border-radius', '16px');
    await expect(page.locator('[data-selected="true"]')).toHaveCSS(
      'background-color',
      rgb(theme.schemes.light.secondaryContainer),
    );
  } finally {
    await context.close();
  }
});

test('assist and suggestion chips activate once by pointer, Enter and Space with one tab stop per set', async ({
  page,
}) => {
  await page.goto('/chips');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Add to calendar', exact: true })).toBeFocused();

  const group = page.getByRole('toolbar', { name: 'Travel actions' });
  const reminder = group.getByRole('button', { name: 'Set reminder', exact: true });
  const suggestion = group.getByRole('button', { name: 'Explore flights', exact: true });

  await reminder.click();
  await expect(page.getByTestId('chip-actions')).toHaveText('1');
  await reminder.press('Enter');
  await expect(page.getByTestId('chip-actions')).toHaveText('2');
  await reminder.press('Space');
  await expect(page.getByTestId('chip-actions')).toHaveText('3');
  await reminder.press('ArrowRight');
  await expect(suggestion).toBeFocused();
  await suggestion.press('Enter');
  await expect(page.getByTestId('chip-actions')).toHaveText('4');
  await suggestion.press('ArrowRight');
  await expect(reminder).toBeFocused();
  await reminder.press('End');
  await expect(suggestion).toBeFocused();
  await suggestion.press('Home');
  await expect(reminder).toBeFocused();
  await expect(group.locator('button[tabindex="0"]')).toHaveCount(1);
  await expect(reminder).not.toHaveAttribute('aria-pressed');
});

test('controlled and uncontrolled filter selection replaces the icon, while navigation leaves selection intact', async ({
  page,
}) => {
  await page.goto('/chips');

  const group = page.getByRole('toolbar', { name: 'Fare filters' });
  const baggage = group.getByRole('button', { name: 'Include baggage', exact: true });
  const flexible = group.getByRole('button', { name: 'Flexible dates', exact: true });
  const { width } = (await baggage.boundingBox())!;

  await expect(baggage).toHaveAttribute('aria-pressed', 'false');
  await baggage.click();
  await expect(page.getByTestId('chip-changes')).toHaveText('1');
  await expect(baggage).toHaveAttribute('aria-pressed', 'true');
  await expect(baggage.locator('[data-md3-chip-original-icon]')).toHaveCSS('opacity', '0');
  await expect(baggage.locator('[data-md3-chip-check]')).toHaveCSS('opacity', '1');
  expect((await baggage.boundingBox())!.width).toBeCloseTo(width);
  await baggage.press('Space');
  await expect(page.getByTestId('chip-changes')).toHaveText('2');
  await expect(baggage).toHaveAttribute('aria-pressed', 'false');
  await baggage.press('ArrowRight');
  await expect(flexible).toBeFocused();
  await expect(flexible).toHaveAttribute('aria-pressed', 'false');
  await flexible.press('Enter');
  await expect(flexible).toHaveAttribute('aria-pressed', 'true');
  await flexible.press('Space');
  await expect(flexible).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Toggle selected externally' }).click();
  await expect(baggage).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('chip-changes')).toHaveText('2');
  await page.getByRole('button', { name: 'Check chip refs' }).click();
  await expect(page.getByTestId('chip-refs')).toHaveText('true');
});

test('selection callbacks and primary click handlers can veto state changes', async ({ page }) => {
  await page.goto('/chips');

  for (const label of ['Veto selection', 'Prevent selection', 'Prevent click', 'Prevent slot click']) {
    const chip = page.getByRole('button', { name: label, exact: true });

    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.press('Enter');
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.press('Space');
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
  }

  await page.getByRole('button', { name: 'Activate slot action', exact: true }).click();
  await expect(page.getByTestId('chip-actions')).toHaveText('1');
});

test('input removal uses independent buttons and restores focus past disabled neighbors', async ({ page }) => {
  await page.goto('/chips');

  const set = page.getByRole('toolbar', { name: 'Recipients', exact: true });

  await expect(set.locator('button button')).toHaveCount(0);
  await set.getByRole('button', { name: 'Remove Alex', exact: true }).click();
  await expect(set.getByRole('group', { name: 'Alex', exact: true })).toHaveCount(0);
  await expect(set.getByRole('button', { name: 'Sam', exact: true })).toBeFocused();
  await expect(page.getByTestId('chip-actions')).toHaveText('0');
  await set.getByRole('button', { name: 'Sam', exact: true }).press('Delete');
  await expect(set.getByRole('button', { name: 'Robin', exact: true })).toBeFocused();
  await set.getByRole('button', { name: 'Remove Robin', exact: true }).press('Backspace');
  await expect(set).toBeFocused();
  await expect(set.locator('[data-md3-chip]')).toHaveCount(1);
  await expect(set.getByRole('button', { name: 'Remove Disabled recipient' })).toBeDisabled();
  await page.getByRole('button', { name: 'Reset recipients' }).click();
  await set.getByRole('button', { name: 'Remove Robin', exact: true }).press('Space');
  await expect(set.getByRole('button', { name: 'Sam', exact: true })).toBeFocused();
});

test('filter deletion does not toggle selection and passive input tokens expose only removal', async ({ page }) => {
  await page.goto('/chips');

  const applied = page.getByRole('toolbar', { name: 'Applied filters', exact: true });

  await applied.getByRole('button', { name: 'Remove Nonstop', exact: true }).press('Enter');
  await expect(applied.getByRole('button', { name: 'Baggage', exact: true })).toBeFocused();
  await expect(applied.getByRole('button', { name: 'Baggage', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await applied.getByRole('button', { name: 'Baggage', exact: true }).press('Backspace');
  await expect(applied).toBeFocused();
  await expect(page.getByRole('button', { name: 'Remove-only token', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove Remove-only token', exact: true }).click();
  await expect(page.getByTestId('chip-actions')).toHaveText('1');
  await expect(page.getByRole('button', { name: 'Remove Locked token', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Locked token', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove Protected token', exact: true }).press('Delete');
  await expect(page.getByText('Protected token', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Protected by slot', exact: true }).click();
  await expect(page.getByTestId('chip-actions')).toHaveText('1');
  await expect(page.getByRole('button', { name: 'Remove complex recipient', exact: true })).toBeVisible();

  const selectable = page.getByRole('button', { name: 'Selectable input', exact: true });

  await selectable.press('Space');
  await expect(selectable).toHaveAttribute('aria-pressed', 'true');
});

test('disabled chips and disabled sets block interaction and expose MD3 disabled colors', async ({ page }) => {
  await page.goto('/chips');

  const disabled = page.getByRole('toolbar', { name: 'Disabled chips', exact: true });

  for (const button of await disabled.getByRole('button').all()) {
    await expect(button).toBeDisabled();
    await button.dispatchEvent('click');
  }

  await expect(page.getByTestId('chip-actions')).toHaveText('0');
  await expect(disabled.locator('[data-md3-chip-avatar]')).toHaveCSS('opacity', '0.38');
  await expect(disabled.locator('[data-kind="suggestion"]')).toHaveCSS('box-shadow', 'none');
  await expect(page.getByRole('button', { name: 'Disabled by set', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Disabled set action', exact: true })).toBeDisabled();
  await expect(root(page.getByRole('button', { name: 'Disabled by set', exact: true }))).toHaveCSS(
    'box-shadow',
    'none',
  );
});

test('logical padding, avatar, trailing icons, truncation and the vertical touch target match MD3', async ({
  page,
}) => {
  await page.goto('/chips');

  const assist = page.getByTestId('server-assist');
  const input = page.getByTestId('server-input');
  const geometries = await assist.evaluate((chip) => {
    const action = chip.querySelector('button')!;
    const box = chip.getBoundingClientRect();
    const icon = chip.querySelector('[data-md3-chip-leading]')!.getBoundingClientRect();
    const label = chip.querySelector('[data-md3-chip-label]')!.getBoundingClientRect();
    const touch = getComputedStyle(action, '::after');

    return {
      start: icon.left - box.left,
      gap: label.left - icon.right,
      targetHeight: action.getBoundingClientRect().height - parseFloat(touch.top) - parseFloat(touch.bottom),
    };
  });

  expect(geometries).toEqual({ start: 8, gap: 8, targetHeight: 48 });
  expect(
    await page
      .getByTestId('server-suggestion')
      .evaluate(
        (chip) =>
          chip.querySelector('[data-md3-chip-label]')!.getBoundingClientRect().left - chip.getBoundingClientRect().left,
      ),
  ).toBe(16);
  expect(
    await input.evaluate(
      (chip) =>
        chip.querySelector('[data-md3-chip-avatar]')!.getBoundingClientRect().left - chip.getBoundingClientRect().left,
    ),
  ).toBe(4);

  for (const icon of await page.getByRole('button', { name: 'Stops', exact: true }).locator('svg').all()) {
    await expect(icon).toHaveCSS('width', '18px');
  }

  const longLabel = page.getByText('A long recipient name', { exact: false });

  await expect(longLabel).toHaveCSS('text-overflow', 'ellipsis');
  expect((await root(root(longLabel)).boundingBox())!.width).toBe(180);
});

test('Input Chip delete actions use a 24px circle around the 18px icon, away from text in light, dark and RTL', async ({
  page,
}, testInfo) => {
  await page.goto('/chips');

  for (const label of ['Remove-only token', 'Dark recipient', 'RTL recipient']) {
    const chip = page.getByRole('group', { name: label, exact: true });
    const remove = chip.getByRole('button', { name: `Remove ${label}`, exact: true });
    const surface = remove.locator('[data-md3-chip-delete-surface]');
    const geometry = await remove.evaluate((button) => {
      const owner = button.closest('[data-md3-chip]')!;
      const box = owner.getBoundingClientRect();
      const face = button.querySelector('[data-md3-chip-delete-surface]')!.getBoundingClientRect();
      const icon = button.querySelector('svg')!.getBoundingClientRect();
      const text = owner.querySelector('[data-md3-chip-label]')!.getBoundingClientRect();
      const touch = getComputedStyle(button, '::after');
      const rtl = getComputedStyle(button).direction === 'rtl';

      return {
        height: box.height,
        faceWidth: face.width,
        faceHeight: face.height,
        iconWidth: icon.width,
        iconHeight: icon.height,
        centerX: face.x + face.width / 2 - icon.x - icon.width / 2,
        centerY: face.y + face.height / 2 - icon.y - icon.height / 2,
        labelGap: rtl ? text.left - face.right : face.left - text.right,
        edgeGap: rtl ? face.left - box.left : box.right - face.right,
        targetHeight: button.getBoundingClientRect().height - parseFloat(touch.top) - parseFloat(touch.bottom),
      };
    });

    expect(geometry).toEqual({
      height: 32,
      faceWidth: 24,
      faceHeight: 24,
      iconWidth: 18,
      iconHeight: 18,
      centerX: 0,
      centerY: 0,
      labelGap: 5,
      edgeGap: 5,
      targetHeight: 48,
    });
    await expect(surface).toHaveCSS('border-radius', '50%');
    await expect.poll(() => remove.evaluate((button) => getComputedStyle(button, '::before').display)).toBe('none');
    await remove.hover();
    await expect.poll(() => surface.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0.08');
    await expect.poll(() => chip.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0');
    await chip.screenshot({ path: testInfo.outputPath(`${label}-hover.png`) });
    await page.mouse.down();

    const ripple = surface.locator('[data-md3-chip-ripple-surface]');

    await expect(ripple.locator('[data-md3-ripple-ink]')).toHaveCount(1);
    await expect(ripple).toHaveCSS('width', '24px');
    await expect(ripple).toHaveCSS('height', '24px');
    await expect(ripple).toHaveCSS('border-radius', '50%');
    await page.mouse.up();
    await page.keyboard.press('Tab');
    await remove.focus();
    await expect(remove).toHaveCSS('outline-style', 'none');
    await expect(surface).toHaveCSS('outline-width', '3px');
    await expect(surface).toHaveCSS('outline-offset', '0px');
    await expect(chip).toHaveCSS('outline-style', 'none');
    await expect.poll(() => chip.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0.1');
    await chip.screenshot({ path: testInfo.outputPath(`${label}-focus.png`) });
    await remove.evaluate((button) => (button as HTMLElement).blur());
    await page.mouse.move(0, 0);
  }
});

test('primary Input Chip actions highlight the whole container while removal stays independent', async ({ page }) => {
  await page.goto('/chips');

  for (const label of ['Alex', 'RTL recipient']) {
    const chip = page.getByRole('group', { name: label, exact: true });
    const action = chip.getByRole('button', { name: label, exact: true });

    await action.hover();
    await expect.poll(() => action.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0.08');

    const geometry = await action.locator('[data-md3-chip-ripple-surface]').evaluate((surface) => {
      const owner = surface.closest('[data-md3-chip]')!;
      const bounds = owner.getBoundingClientRect();
      const ripple = surface.getBoundingClientRect();

      return {
        x: ripple.x - bounds.x,
        y: ripple.y - bounds.y,
        width: ripple.width - bounds.width,
        height: ripple.height - bounds.height,
      };
    });

    expect(geometry).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    await page.keyboard.press('Tab');
    await action.focus();
    await expect(chip).toHaveCSS('outline-width', '3px');
    await expect(chip).toHaveCSS('outline-offset', '2px');
    await expect(action).toHaveCSS('outline-style', 'none');

    const direction = await chip.evaluate((element) => getComputedStyle(element).direction);

    await action.press(direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
    await expect(chip.getByRole('button', { name: `Remove ${label}`, exact: true })).toBeFocused();
    await expect(chip).toHaveCSS('outline-style', 'none');
  }
});

test('Expressive selection and press shapes use spring CSS without scaling label text', async ({ page }) => {
  await page.goto('/chips');

  const chip = page.getByTestId('expressive-filter');
  const action = chip.getByRole('button');

  await expect(chip).toHaveCSS('border-radius', '12px');
  await pauseMotionOnAttributeChange(chip, 'data-selected', { value: 'true' });
  await action.evaluate((button) => (button as HTMLButtonElement).click());

  const frames = await chip.evaluate((element) => {
    const animation = element
      .getAnimations()
      .find((entry) => entry instanceof CSSTransition && entry.transitionProperty === 'border-top-left-radius')!;
    const duration = Number(animation.effect!.getComputedTiming().duration);

    return [0, duration / 2, duration].map((time) => {
      for (const motion of element.getAnimations({ subtree: true })) {
        motion.currentTime = time;
      }

      const style = getComputedStyle(element);
      const label = element.querySelector('[data-md3-chip-label]')!;

      return {
        radius: parseFloat(style.borderTopLeftRadius),
        height: element.getBoundingClientRect().height,
        fontSize: getComputedStyle(label).fontSize,
        transform: getComputedStyle(label).transform,
      };
    });
  });

  expect(frames[0]!.radius).toBeCloseTo(12);
  expect(frames[1]!.radius).toBeGreaterThan(12);
  expect(frames[2]!.radius).toBeCloseTo(16);
  expect(frames.every((frame) => frame.height === 32 && frame.fontSize === '14px' && frame.transform === 'none')).toBe(
    true,
  );
  await chip.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await action.hover();
  await page.mouse.down();
  await expect(chip).toHaveCSS('border-radius', '8px');
  await page.mouse.up();
  await expect(chip).toHaveCSS('border-radius', '12px');
});

test('elevation, dark colors, focus indicators and state layers use theme tokens', async ({ page }) => {
  await page.goto('/chips');

  const assist = page.getByRole('button', { name: 'Elevated assist', exact: true });
  const before = await root(assist).evaluate((chip) => getComputedStyle(chip).boxShadow);

  await expect(root(assist)).toHaveCSS('background-color', rgb(theme.schemes.light.surfaceContainerLow));
  await assist.hover();
  await expect.poll(() => root(assist).evaluate((chip) => getComputedStyle(chip).boxShadow)).not.toBe(before);
  await expect.poll(() => assist.evaluate((button) => getComputedStyle(button, '::before').opacity)).toBe('0.08');
  await page.keyboard.press('Tab');
  await assist.focus();
  await expect(root(assist)).toHaveCSS('outline-width', '3px');
  await expect(root(assist)).toHaveCSS('outline-color', rgb(theme.schemes.light.secondary));
  await expect(root(page.getByRole('button', { name: 'Dark assist', exact: true }))).toHaveCSS(
    'background-color',
    rgb(theme.schemes.dark.surfaceContainerLow),
  );
  await expect(root(page.getByRole('button', { name: 'Dark selected', exact: true }))).toHaveCSS(
    'background-color',
    rgb(theme.schemes.dark.secondaryContainer),
  );
  await expect(root(page.getByRole('button', { name: 'Dragged assist', exact: true }))).not.toHaveCSS(
    'box-shadow',
    'none',
  );
});

test('RTL and vertical roving focus skip disabled chips and honor non-wrapping sets', async ({ page }) => {
  await page.goto('/chips');

  const rtl = page.getByRole('toolbar', { name: 'Inherited RTL chips' });
  const first = rtl.getByRole('button', { name: 'RTL first', exact: true });
  const last = rtl.getByRole('button', { name: 'RTL last', exact: true });

  await first.focus();
  await first.press('ArrowLeft');
  await expect(last).toBeFocused();
  await last.press('ArrowRight');
  await expect(first).toBeFocused();
  await expect(rtl).toHaveCSS('direction', 'rtl');
  expect(
    await first.evaluate(
      (button) =>
        button.querySelector('[data-md3-chip-leading]')!.getBoundingClientRect().left >
        button.querySelector('[data-md3-chip-label]')!.getBoundingClientRect().right,
    ),
  ).toBe(true);

  const vertical = page.getByRole('toolbar', { name: 'Vertical chips' });
  const top = vertical.getByRole('button', { name: 'Vertical first', exact: true });
  const bottom = vertical.getByRole('button', { name: 'Vertical last', exact: true });

  await top.focus();
  await top.press('ArrowDown');
  await expect(bottom).toBeFocused();
  await bottom.press('ArrowDown');
  await expect(bottom).toBeFocused();
  await bottom.press('Home');
  await expect(top).toBeFocused();
});

test('native submit actions work inside and outside a form', async ({ page }) => {
  await page.goto('/chips');
  await page.getByRole('button', { name: 'Submit reminder', exact: true }).press('Enter');
  await expect(page.getByTestId('chip-submitted')).toHaveText('reminder');
  await page.getByRole('button', { name: 'Submit external', exact: true }).click();
  await expect(page.getByTestId('chip-submitted')).toHaveText('external');
});

test('ripple reuses compiled styles and respects disabled, reduced-motion and forced-color settings', async ({
  page,
}) => {
  await page.goto('/chips');

  const styles = await page.locator('style').count();
  const action = page.getByRole('button', { name: 'No ripple chip', exact: true });

  await action.hover();
  await page.mouse.down();
  await expect(action.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await page.mouse.up();

  const filter = page.getByTestId('expressive-filter');

  await filter.getByRole('button').hover();
  await page.mouse.down();
  await expect(filter.locator('[data-md3-ripple-ink]')).toHaveCount(1);
  await page.mouse.up();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(filter).toHaveCSS('transition-duration', '0s');
  await filter.getByRole('button').click();
  await expect(filter.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(filter).toHaveCSS('forced-color-adjust', 'none');
  await filter.getByRole('button').click();
  await expect
    .poll(() => filter.evaluate((element) => getComputedStyle(element).getPropertyValue('--_chip-bg').trim()))
    .toBe('Highlight');
  await expect(filter.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await expect(page.locator('style')).toHaveCount(styles);
});

test('Vite root and subpath imports load Chip CSS and hydrate selection without manual imports', async ({ page }) => {
  for (const route of ['chip', 'chip-subpath', 'chip-autocomplete']) {
    await page.goto(`http://127.0.0.1:3200/${route}/`);
    await expect(page.locator('[data-md3-chip]').first()).toHaveCSS('height', '32px');

    if (route !== 'chip-autocomplete') {
      const filter = page.getByRole('button', { name: 'Nonstop', exact: true });

      await expect(filter).toHaveAttribute('aria-pressed', 'true');
      await filter.click();
      await expect(filter).toHaveAttribute('aria-pressed', 'false');
    } else {
      await page.getByRole('button', { name: 'Clear Paris', exact: true }).click();
      await expect(page.getByRole('combobox', { name: 'Destinations' })).toBeFocused();
      await expect(page.getByText('Paris', { exact: true })).toHaveCount(0);
    }
  }
});

test('Chip fixture and interactive Storybook examples have accessible semantics', async ({ page }) => {
  await page.goto('/chips');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  for (const story of [
    'all-types',
    'input',
    'read-only-input',
    'expressive',
    'removable',
    'single-selection',
    'right-to-left',
    'disabled',
  ]) {
    // AxeBuilder owns this scan; the Storybook addon must not start another one in the same iframe.
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-chip--${story}&viewMode=story&globals=a11y.manual:!true`,
    );
    await expect(page.getByRole('heading', { name: 'Chip', exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});
