import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import AxeBuilder from '@axe-core/playwright';

test('plain Tooltip describes a focused control, keeps focus, and dismisses on Escape', async ({ page }) => {
  await page.goto('/essentials');

  const action = page.getByRole('button', { name: 'Tooltip action', exact: true });

  await action.focus();

  const tip = page.getByRole('tooltip');

  await expect(tip).toHaveText('Switch appearance');
  await expect(action).toBeFocused();
  await expect(action).toHaveAccessibleDescription('Switch appearance');

  const theme = createTheme({ sourceColor: '#386a20' });
  const hex = theme.schemes.light.inverseSurface;
  const rgb = `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

  await expect(tip).toHaveCSS('background-color', rgb);
  await action.press('Escape');
  await expect(tip).not.toBeVisible();
  await expect(action).toBeFocused();
});

test.describe('Tooltip content and Material variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tooltips');
  });

  test('renders JSX, fragments, arrays, custom components and numbers without changing the visual variant', async ({
    page,
  }) => {
    for (const [name, text] of [
      ['Plain tooltip', 'Delete item'],
      ['Formatted tooltip', 'Delete selected items'],
      ['Custom component', 'Context: Fare 0'],
      ['Zero tooltip', '0'],
      ['Number tooltip', '42'],
      ['Array tooltip', 'First and second'],
      ['Server tooltip', 'Server supplied content'],
    ] as const) {
      const action = page.getByRole('button', { name, exact: true });

      await action.focus();

      const tip = page.getByRole('tooltip');

      await expect(tip).toHaveText(text);
      await expect(tip).toHaveAttribute('data-variant', 'plain');
      await expect(action).toHaveAccessibleName(name);
      await expect(action).toHaveAccessibleDescription(text);

      if (name === 'Formatted tooltip') {
        await expect(tip.locator('strong')).toHaveText('selected items');
      }

      await action.press('Escape');
      await expect(tip).not.toBeVisible();
    }
  });

  test('empty values never show a popup even when controlled open, and disabled hints leave actions enabled', async ({
    page,
  }) => {
    for (let index = 0; index < 8; index += 1) {
      const empty = page.getByRole('button', { name: 'Empty tooltip', exact: true });

      await empty.focus();
      await expect(empty).not.toHaveAttribute('aria-describedby');
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await page.getByRole('button', { name: 'Next empty value' }).click();
    }

    await page.getByRole('button', { name: 'Disabled hint', exact: true }).click();
    await page.getByRole('button', { name: 'Disabled rich hint', exact: true }).click();
    await expect(page.getByTestId('tooltip-count')).toHaveText('2');
    await expect(page.locator('[data-md3-tooltip]')).toHaveCount(0);
  });

  test('rich actions use a named nonmodal dialog, preserve focus on opening, and support Tab and Escape', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Rich actions', exact: true });

    await trigger.focus();

    const tip = page.getByRole('dialog', { name: 'Baggage options' });
    const action = tip.getByRole('button', { name: 'Add baggage' });

    await expect(tip).toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(tip).not.toHaveAttribute('aria-modal', 'true');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await trigger.press('Tab');
    await expect(action).toBeFocused();
    await action.press('Enter');
    await expect(page.getByTestId('tooltip-count')).toHaveText('1');
    await expect(tip).toBeVisible();
    await action.press('Tab');
    await expect(tip.getByRole('link', { name: 'Learn more' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(action).toBeFocused();
    await action.press('Escape');
    await expect(tip).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('Tab can leave rich content without a focus trap or stealing the outside focus', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Rich actions', exact: true });

    await trigger.focus();
    await expect(page.getByRole('dialog')).toBeVisible();
    await trigger.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After rich actions', exact: true })).toBeFocused();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Tab reaches the actions after a hover opening without stopping on a hidden focus guard', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Rich actions', exact: true });

    await trigger.hover();
    await expect(page.getByRole('dialog', { name: 'Baggage options' })).toBeVisible();
    await page.getByRole('heading', { level: 1 }).hover();
    await expect(page.getByRole('dialog', { name: 'Baggage options' })).not.toBeVisible();
    await trigger.hover();
    await expect(page.getByRole('dialog', { name: 'Baggage options' })).toBeVisible();
    await trigger.focus();
    await trigger.press('Tab');
    await expect(page.getByRole('button', { name: 'Add baggage' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('dialog', { name: 'Baggage options' })).toBeVisible();
  });

  test('pointer can cross the anchor gap, select text and use actions and links', async ({ page }) => {
    await page.getByRole('button', { name: 'Rich actions', exact: true }).hover();

    const tip = page.getByRole('dialog', { name: 'Baggage options' });

    await expect(tip).toBeVisible();
    await tip.hover();
    await expect(tip).toBeVisible();
    await tip.getByRole('button', { name: 'Add baggage' }).click();
    await expect(page.getByTestId('tooltip-count')).toHaveText('1');
    await expect(tip).toBeVisible();
    await expect(tip).toHaveCSS('user-select', 'text');
    await tip.getByText('Select the allowance that suits your journey.').click({ clickCount: 3 });
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toContain('Select');
    await tip.getByRole('link', { name: 'Learn more' }).click();
    await expect(page).toHaveURL(/#baggage-information$/);
    await page.getByRole('heading', { level: 1 }).click();
    await expect(tip).not.toBeVisible();
  });

  test('Escape restores focus after hover-opened content receives focus', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Rich actions', exact: true });

    await trigger.hover();

    const tip = page.getByRole('dialog', { name: 'Baggage options' });

    await tip.getByRole('button', { name: 'Add baggage' }).click();
    await page.getByRole('heading', { level: 1 }).hover();
    await expect(tip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tip).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('removing controlled open content hides it and preserves focus', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Dynamic content', exact: true });

    await trigger.focus();
    await page.getByTestId('dynamic-tooltip').getByRole('button', { name: 'Clear content' }).click();
    await expect(page.getByTestId('dynamic-tooltip')).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('controlled rich dismissal can be cancelled without losing its focused action', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Prevent rich dismissal' }).check();
    await page.getByRole('button', { name: 'Rich actions', exact: true }).hover();

    const tip = page.getByRole('dialog', { name: 'Baggage options' });
    const action = tip.getByRole('button', { name: 'Add baggage' });

    await action.click();
    await action.press('Escape');
    await expect(tip).toBeVisible();
    await expect(action).toBeFocused();
    await page.getByRole('button', { name: 'After rich actions', exact: true }).click();
    await expect(tip).toBeVisible();
    await expect(page.getByRole('button', { name: 'After rich actions', exact: true })).toBeFocused();
  });

  test('persistent rich tooltips open on click, survive mouseout, and dismiss outside', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Persistent tooltip', exact: true });

    await trigger.focus();
    await trigger.hover();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await trigger.click();

    const tip = page.getByRole('dialog', { name: 'New baggage feature' });

    await expect(tip).toBeVisible();
    await page.getByRole('heading', { level: 1 }).hover();
    await expect(tip).toBeVisible();
    await page.getByRole('heading', { level: 1 }).click();
    await expect(tip).not.toBeVisible();
  });

  test('open rich content resizes and repositions while retaining React context and focused actions', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Dynamic content', exact: true }).focus();

    const tip = page.getByTestId('dynamic-tooltip');

    await expect(tip).toContainText('Short description');

    const before = await tip.boundingBox();

    await tip.getByRole('button', { name: 'Update content' }).click();
    await expect(tip).toContainText('Context: Fare 1');
    await expect(tip).toContainText('Check your fare conditions');
    await expect(tip.getByRole('button', { name: 'Update content' })).toBeFocused();
    await expect.poll(async () => (await tip.boundingBox())!.height).toBeGreaterThan(before!.height);

    const box = (await tip.boundingBox())!;
    const viewport = page.viewportSize()!;

    expect(box.x).toBeGreaterThanOrEqual(7);
    expect(box.y).toBeGreaterThanOrEqual(7);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width - 7);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height - 7);
    expect(box.width).toBeLessThanOrEqual(320);
  });

  test('positioning supports every placement and viewport resizing', async ({ page }) => {
    const placement = page.getByRole('combobox', { name: 'Placement' });

    for (const value of [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ]) {
      await page.getByRole('heading', { level: 1 }).hover();
      await placement.selectOption(value);
      await page.getByRole('button', { name: 'Dynamic content', exact: true }).hover();

      const tip = page.getByTestId('dynamic-tooltip');

      await expect(tip).toBeVisible();
      await expect(tip.locator('..')).toHaveAttribute('data-side', /top|bottom|left|right/);
      await page.keyboard.press('Escape');
      await expect(tip).not.toBeVisible();
    }

    await page.getByRole('heading', { level: 1 }).hover();
    await page.getByRole('button', { name: 'Dynamic content', exact: true }).hover();
    await expect(page.getByTestId('dynamic-tooltip')).toBeVisible();
    await page.setViewportSize({ width: 360, height: 640 });

    await expect
      .poll(async () => {
        const box = (await page.getByTestId('dynamic-tooltip').boundingBox())!;

        return box.x >= 7 && box.x + box.width <= 353;
      })
      .toBe(true);
  });

  test('scroll containers do not clip the portal and the popup follows its anchor', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Scrollable tooltip', exact: true });

    await trigger.focus();

    const tip = page.getByRole('dialog', { name: 'Scrollable anchor' });

    await expect(tip).toBeVisible();

    const before = (await tip.boundingBox())!;

    await page.getByTestId('tooltip-scrollport').evaluate((node) => node.scrollBy(0, 20));
    await expect.poll(async () => (await tip.boundingBox())!.y).toBeLessThan(before.y - 10);
    await expect(page.getByTestId('tooltip-scrollport').locator('[data-md3-tooltip]')).toHaveCount(0);
    await expect(tip.locator('..')).toHaveCSS('position', 'fixed');
  });

  test('portals preserve custom hosts, dark scopes and RTL alignment', async ({ page }) => {
    await page.getByRole('button', { name: 'Custom host', exact: true }).focus();
    await expect(page.getByTestId('tooltip-custom-host').getByRole('tooltip')).toHaveText('Custom host description');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Dark rich tooltip', exact: true }).focus();

    const darkTip = page.getByTestId('dark-tooltip-scope').getByRole('dialog');

    await expect(darkTip).toBeVisible();
    await expect(darkTip).toHaveCSS('color-scheme', 'dark');

    const theme = createTheme();
    const darkColor = `rgb(${theme.schemes.dark.surfaceContainer
      .slice(1)
      .match(/../g)!
      .map((part) => parseInt(part, 16))
      .join(', ')})`;

    await expect(darkTip).toHaveCSS('background-color', darkColor);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'RTL rich tooltip', exact: true }).focus();

    const rtl = page.getByTestId('rtl-tooltip');

    await expect(rtl).toHaveCSS('direction', 'rtl');
    await expect(rtl.locator('..')).toHaveAttribute('data-align', 'start');

    const triggerBox = (await page.getByRole('button', { name: 'RTL rich tooltip', exact: true }).boundingBox())!;

    await expect
      .poll(async () => {
        const box = (await rtl.boundingBox())!;

        return Math.abs(box.x + box.width - triggerBox.x - triggerBox.width);
      })
      .toBeLessThan(2);
  });

  test('Material colors, geometry, typography, elevation and reduced motion are extracted CSS', async ({
    page,
  }, testInfo) => {
    const theme = createTheme({ sourceColor: '#386a20' });
    const rgb = (hex: string) =>
      `rgb(${hex
        .slice(1)
        .match(/../g)!
        .map((part) => parseInt(part, 16))
        .join(', ')})`;

    for (const [name, role, radius, fontSize, background] of [
      ['Plain tooltip', 'tooltip', '4px', '12px', theme.schemes.light.inverseSurface],
      ['Rich headline', 'dialog', '12px', '14px', theme.schemes.light.surfaceContainer],
    ] as const) {
      await page.getByRole('button', { name, exact: true }).focus();

      const tip = page.getByRole(role);

      await expect(tip).toBeVisible();
      await expect(tip).toHaveCSS('border-radius', radius);
      await expect(tip).toHaveCSS('font-size', fontSize);
      await expect(tip).toHaveCSS('background-color', rgb(background));

      if (role === 'dialog') {
        await expect(tip).not.toHaveCSS('box-shadow', 'none');
        await expect(tip).toHaveCSS('padding', '12px 16px 8px');
      } else {
        await expect(tip).toHaveCSS('box-shadow', 'none');
        await expect(tip).toHaveCSS('padding', '4px 8px');
      }

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(tip).toHaveCSS('transition-duration', '0s');

      const screenshotPath = testInfo.outputPath(`${role}-material.png`);

      await tip.screenshot({ path: screenshotPath });
      await testInfo.attach(`${role}-material.png`, { path: screenshotPath, contentType: 'image/png' });
      await page.keyboard.press('Escape');
    }

    await page.emulateMedia({ forcedColors: 'active' });
    await page.getByRole('button', { name: 'Plain tooltip', exact: true }).focus();
    await expect(page.getByRole('tooltip')).toHaveCSS('border-top-style', 'solid');
  });

  test('plain hints stay hoverable by default and support the disableInteractive alias', async ({ page }) => {
    await page.getByRole('button', { name: 'Plain tooltip', exact: true }).hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.getByRole('tooltip').hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.getByRole('heading', { level: 1 }).hover();
    await expect(page.getByRole('tooltip')).not.toBeVisible();
    await page.getByRole('button', { name: 'Disabled interactivity', exact: true }).hover();

    const disabledTip = page.getByRole('tooltip', { name: 'Also available in the adjacent description' });

    await expect(disabledTip).toBeVisible();
    await expect(disabledTip).toHaveCSS('pointer-events', 'none');

    const box = (await disabledTip.boundingBox())!;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await expect(disabledTip).not.toBeVisible();
  });

  test('plain and rich variants pass automated accessibility checks', async ({ page }) => {
    for (const name of ['Formatted tooltip', 'Rich actions']) {
      await page.getByRole('button', { name, exact: true }).focus();
      await expect(page.locator('[data-md3-tooltip]')).toBeVisible();
      await expect(page.locator('[data-md3-tooltip]')).toHaveCSS('opacity', '1');
      await expect(page.locator('[data-md3-tooltip]')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

      const audit = await new AxeBuilder({ page }).include('main').include('[data-md3-tooltip]').analyze();

      expect(audit.violations).toEqual([]);
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-md3-tooltip]')).toHaveCount(0);
    }
  });
});

test.describe('Tooltip touch input', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('long press opens plain and rich content, cancels scrolling, and leaves rich actions usable', async ({
    page,
  }) => {
    await page.goto('/tooltips');

    const session = await page.context().newCDPSession(page);

    for (const name of ['Touch plain', 'Touch rich']) {
      const trigger = page.getByRole('button', { name, exact: true });

      await trigger.scrollIntoViewIfNeeded();

      const box = (await trigger.boundingBox())!;

      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
      });
      await expect(page.locator('[data-md3-tooltip]')).toBeVisible();
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

      if (name === 'Touch rich') {
        await page.getByRole('button', { name: 'Touch action', exact: true }).tap();
        await expect(page.getByTestId('tooltip-count')).toHaveText('1');
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.getByRole('button', { name: 'Touch disabled', exact: true }).tap();
        await expect(page.getByRole('dialog')).not.toBeVisible();
      } else {
        await expect(page.getByTestId('tooltip-count')).toHaveText('0');
        await expect(page.getByRole('tooltip')).not.toBeVisible();
      }
    }

    const trigger = page.getByRole('button', { name: 'Touch plain', exact: true });

    await page.clock.install();
    await trigger.scrollIntoViewIfNeeded();

    const box = (await trigger.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 25 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await page.clock.fastForward(200);
    await expect(page.locator('[data-md3-tooltip]')).toHaveCount(0);
  });

  test('a cancelled rich long press does not block subsequent keyboard focus', async ({ page }) => {
    await page.goto('/tooltips');

    const rich = page.getByRole('button', { name: 'Touch rich', exact: true });

    await rich.scrollIntoViewIfNeeded();
    await page.clock.install();

    const box = (await rich.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const session = await page.context().newCDPSession(page);

    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 25 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await page.clock.fastForward(200);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', { name: 'Touch plain', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(rich).toBeFocused();
    await expect(page.getByRole('dialog', { name: 'Touch baggage' })).toBeVisible();
  });
});

test('Tooltip remains hoverable and supports disabled controls through a focusable wrapper', async ({ page }) => {
  await page.goto('/essentials');
  await page.getByRole('button', { name: 'Tooltip action', exact: true }).hover();

  const tip = page.getByRole('tooltip');

  await expect(tip).toBeVisible();
  await tip.hover();
  await expect(tip).toBeVisible();
  await page.getByRole('heading', { level: 1 }).hover();
  await expect(tip).not.toBeVisible();
  await page.getByRole('button', { name: 'Unavailable action', exact: true }).focus();
  await expect(page.getByRole('tooltip')).toHaveText('Passenger limit reached');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('tooltip')).toHaveCSS('transition-duration', '0s');
});
