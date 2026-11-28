import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const handle = (root: Locator) => root.locator('[data-md3-switch-handle]');
const position = (root: Locator) => root.locator('[data-md3-switch-position]');

async function expectSettledHandleOffset(root: Locator, expected: number) {
  // Computed inset/width can round to their targets while the native spring is still settling.
  await expect
    .poll(() =>
      root.evaluate(
        (node) =>
          node
            .getAnimations({ subtree: true })
            .filter(
              (animation) => animation.playState === 'running' && animation.effect?.getTiming().iterations !== Infinity,
            ).length,
      ),
    )
    .toBe(0);

  const offset = await root.evaluate(
    (node) =>
      node.querySelector('[data-md3-switch-handle]')!.getBoundingClientRect().x - node.getBoundingClientRect().x,
  );

  expect(offset).toBeCloseTo(expected);
}

async function drag(page: Page, root: Locator, dx: number) {
  await root.scrollIntoViewIfNeeded();

  const box = (await root.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y, { steps: 5 });
  await page.mouse.up();
}

test('labels, Space, Enter, controlled updates, event veto and native refs keep one switch state', async ({ page }) => {
  await page.goto('/switches');

  const notifications = page.getByRole('switch', { name: 'Notifications', exact: true });
  const veto = page.getByRole('switch', { name: 'Veto setting' });

  await expect(notifications).not.toBeChecked();
  await page.getByText('Notifications', { exact: true }).click();
  await expect(notifications).toBeChecked();
  await notifications.focus();
  await page.keyboard.press('Space');
  await expect(notifications).not.toBeChecked();
  await page.keyboard.press('Enter');
  await expect(notifications).toBeChecked();
  await expect(page.getByTestId('switch-state')).toHaveText('true / 3');
  await page.getByRole('button', { name: 'Change from code' }).click();
  await expect(notifications).not.toBeChecked();
  await expect(page.getByTestId('switch-state')).toHaveText('false / 3');
  await veto.click();
  await expect(veto).not.toBeChecked();
  await drag(page, veto, 20);
  await expect(veto).not.toBeChecked();
  await expect(page.getByTestId('switch-vetoes')).toHaveText('2');
  await page.getByRole('button', { name: 'Check switch refs' }).click();
  await expect(notifications).toHaveAttribute('data-refs-connected', 'true');
  await expect(notifications).toBeFocused();
});

test('native validation, form association, omission and application reset policy work', async ({ page }) => {
  await page.goto('/switches');
  await page.getByRole('button', { name: 'Submit preferences' }).click();
  await expect(page.getByTestId('switch-submitted')).toHaveText('');
  expect(
    await page.locator('#automatic-updates').evaluate((node) => (node as HTMLInputElement).validity.valueMissing),
  ).toBe(true);
  await page.getByText('Automatic updates', { exact: true }).click();
  await page.getByRole('switch', { name: 'Notifications', exact: true }).click();
  await page.getByRole('button', { name: 'Submit preferences' }).click();
  await expect(page.getByTestId('switch-submitted')).toHaveText(
    '{"notifications":"enabled","updates":"enabled","locked":"yes","external":"yes"}',
  );
  await page.getByRole('button', { name: 'Reset preferences' }).click();
  await expect(page.getByRole('switch', { name: 'Notifications', exact: true })).not.toBeChecked();
  await expect(page.getByRole('switch', { name: 'Automatic updates', exact: true })).not.toBeChecked();
  await expect(page.getByRole('switch', { name: 'External setting' })).toBeChecked();
});

test('dragging commits once at release, settles without toggling twice and mirrors inherited RTL', async ({ page }) => {
  await page.goto('/switches');

  const root = page.getByTestId('controlled-switch');
  const styleCount = await page.locator('style').count();

  await root.scrollIntoViewIfNeeded();

  const box = (await root.boundingBox())!;
  const x = box.x + 26;
  const y = box.y + 24;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 12, y, { steps: 4 });
  await expect(root).toHaveAttribute('data-dragging', '');
  await expect(root).not.toBeChecked();
  await expect(page.getByTestId('switch-state')).toHaveText('false / 0');
  await expect(handle(root)).toHaveCSS('width', '28px');
  await page.mouse.up();
  await expect(root).toBeChecked();
  await expect(position(root)).toHaveCSS('inset-inline-start', '16px');
  await expect(page.getByTestId('switch-state')).toHaveText('true / 1');
  await drag(page, root, -6);
  await expect(root).toBeChecked();
  await expect(page.getByTestId('switch-state')).toHaveText('true / 1');
  await drag(page, root, -20);
  await expect(root).not.toBeChecked();
  await expect(position(root)).toHaveCSS('inset-inline-start', '-4px');
  await expect(page.getByTestId('switch-state')).toHaveText('false / 2');

  const rtl = page.getByTestId('rtl-switch');

  await drag(page, rtl, -20);
  await expect(rtl).toBeChecked();
  await expect(position(rtl)).toHaveCSS('inset-inline-start', '16px');
  await expect(handle(rtl)).toHaveCSS('width', '24px');
  await expectSettledHandleOffset(rtl, 4);
  await drag(page, rtl, 20);
  await expect(rtl).not.toBeChecked();
  await expect(position(rtl)).toHaveCSS('inset-inline-start', '-4px');
  await expect(handle(rtl)).toHaveCSS('width', '16px');
  await expectSettledHandleOffset(rtl, 28);
  expect(await page.locator('style').count()).toBe(styleCount);
});

test('touch dragging commits once, cancellation restores the handle and later tap/keyboard activation works', async ({
  browser,
}) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 740 } });

  try {
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3100/switches');

    const root = page.getByTestId('server-switch');
    const box = (await root.boundingBox())!;
    const session = await context.newCDPSession(page);
    const x = box.x + 26;
    const y = box.y + 24;

    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 18, y }] });
    await expect(root).toHaveAttribute('data-dragging', '');
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await expect(root).not.toHaveAttribute('data-dragging');
    await expect(root).not.toBeChecked();
    await expect(position(root)).toHaveCSS('inset-inline-start', '-4px');
    await root.tap();
    await expect(root).toBeChecked();
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 20, y }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(root).not.toBeChecked();
    await root.focus();
    await page.keyboard.press('Enter');
    await expect(root).toBeChecked();
  } finally {
    await context.close();
  }
});

test('disabled and readOnly block edits, while press size, icons, ripple and focus use Material states', async ({
  page,
}) => {
  await page.goto('/switches');

  const disabled = page.getByRole('switch', { name: 'Disabled setting' });
  const readOnly = page.getByRole('switch', { name: 'Read-only setting' });
  const root = page.getByTestId('server-switch');

  await expect(disabled).toBeDisabled();
  await disabled.evaluate((node) => (node as HTMLElement).click());
  await readOnly.click();
  await readOnly.focus();
  await page.keyboard.press('Space');
  await drag(page, readOnly, -20);
  await expect(disabled).toBeChecked();
  await expect(readOnly).toBeChecked();
  await expect(readOnly.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await expect(handle(root)).toHaveCSS('width', '16px');
  await expect(handle(page.getByTestId('icon-switch'))).toHaveCSS('width', '24px');
  await expect(handle(page.getByTestId('icon-switch')).locator('svg')).toHaveCSS('width', '16px');
  await root.scrollIntoViewIfNeeded();

  const box = (await root.boundingBox())!;

  expect(box.width).toBe(52);
  expect(box.height).toBe(48);
  await expect(root.locator('[data-md3-switch-track]')).toHaveCSS('height', '32px');
  await page.mouse.move(box.x + 26, box.y + 24);
  await page.mouse.down();
  await expect(handle(root)).toHaveCSS('width', '28px');
  await expect(root.locator('[data-md3-ripple-ink]')).toHaveCount(1);
  await page.mouse.up();
  await expect(root).toBeChecked();
  await expect(handle(root)).toHaveCSS('width', '24px');
  await expect(root.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await page.getByRole('switch', { name: 'Without ripple' }).click();
  await expect(page.getByRole('switch', { name: 'Without ripple' }).locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await root.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(position(root)).toHaveCSS('outline-width', '3px');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(handle(root)).toHaveCSS('transition-duration', '0s');
  await expect(position(root)).toHaveCSS('transition-duration', '0s');
  await root.click();
  await expect(root.locator('[data-md3-ripple-ink]')).toHaveCount(0);
});

test('Switch is styled in server HTML, streaming and themed Storybook with accessible system-color output', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/switches');
    await expect(server.getByRole('switch', { name: 'Server enabled' })).toBeChecked();
    await expect(handle(server.getByRole('switch', { name: 'Server enabled' }))).toHaveCSS('width', '24px');
    await expect(handle(server.getByRole('switch', { name: 'Server notifications' }))).toHaveCSS('width', '16px');
    await expect(server.getByRole('switch', { name: 'Server enabled' })).toHaveCSS('width', '52px');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('switch', { name: 'Streamed notifications' })).toBeChecked();
  await page.goto('/switches');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-switch--checked&viewMode=story&globals=brand:forest;colorScheme:dark;a11y.manual:!true',
  );

  const root = page.getByRole('switch', { name: 'Notifications' });
  const { primary } = createTheme({ sourceColor: '#386a20', keyColors: { secondary: '#5d6355', tertiary: '#386568' } })
    .schemes.dark;

  await expect(root.locator('[data-md3-switch-track]')).toHaveCSS(
    'background-color',
    `rgb(${primary
      .slice(1)
      .match(/../g)!
      .map((part) => parseInt(part, 16))
      .join(', ')})`,
  );

  const story = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(story.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await root.hover();
  await expect(root).toHaveCSS('forced-color-adjust', 'none');
  await expect(root.locator('[data-md3-switch-track]')).toHaveCSS('border-top-width', '2px');
  await root.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(position(root)).toHaveCSS('outline-style', 'solid');
});
