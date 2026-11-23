import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const indicator = (root: Locator) => root.locator('[data-md3-tab-indicator]');

test('RSC composition renders selected content and extracted styles without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/tabs');

    const root = page.getByTestId('server-tabs');
    const tabs = root.getByRole('tab');

    await expect(tabs).toHaveCount(3);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('streamed-tab-content')).toBeVisible();
    await expect(root.getByRole('tabpanel')).toHaveCount(1);
    await expect(tabs.first()).toHaveCSS('min-height', '48px');
    await expect(tabs.first()).toHaveCSS('font-size', '14px');
    expect(await tabs.first().evaluate((node) => getComputedStyle(node, '::after').height)).toBe('3px');

    const widths = await tabs.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));

    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    await expect(page.getByTestId('icon-tabs').getByRole('tablist')).toHaveCSS('height', '64px');
    await expect(page.getByTestId('secondary-tabs').getByRole('tablist')).toHaveCSS('height', '48px');
  } finally {
    await context.close();
  }
});

test('manual activation announces disabled tabs and connects panels with keyboard focus', async ({ page }) => {
  await page.goto('/tabs');

  const root = page.getByTestId('server-tabs');
  const first = root.getByRole('tab', { name: 'Flights', exact: true });
  const second = root.getByRole('tab', { name: 'Hotels', exact: true });

  await first.focus();
  await first.press('ArrowRight');
  await expect(second).toBeFocused();
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await second.press('Enter');
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(root.getByRole('tabpanel')).toHaveText('Hotel search');
  await expect(second).toHaveAttribute('aria-controls', (await root.getByRole('tabpanel').getAttribute('id'))!);
  await expect(root.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', (await second.getAttribute('id'))!);
  await second.press('ArrowRight');
  await expect(root.getByRole('tab', { name: 'Cars', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(first).toBeFocused();
  await first.press('Space');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await first.press('End');
  await expect(root.getByRole('tab', { name: 'Cars', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
  await expect(root.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  await first.press('Tab');
  await expect(root.getByRole('tabpanel')).toBeFocused();
});

test('controlled automatic activation, null selection and refs work', async ({ page }) => {
  await page.goto('/tabs');
  await page.getByRole('button', { name: 'Check tab refs' }).click();
  await expect(page.getByTestId('tab-refs')).toHaveText('true');

  const list = page.getByRole('tablist', { name: 'Controlled', exact: true });
  const first = list.getByRole('tab', { name: 'One', exact: true });
  const second = list.getByRole('tab', { name: 'Two', exact: true });

  await first.focus();
  await first.press('ArrowRight');
  await expect(list.getByRole('tab', { name: 'Unavailable', exact: true })).toBeFocused();
  await expect(page.getByTestId('tab-value')).toHaveText('one');
  await page.keyboard.press('ArrowRight');
  await expect(second).toBeFocused();
  await expect(page.getByTestId('tab-value')).toHaveText('two');
  await expect(page.getByTestId('tab-changes')).toHaveText('1');
  await second.press('Enter');
  await expect(page.getByTestId('tab-changes')).toHaveText('1');
  await page.getByRole('button', { name: 'Set third tab' }).click();
  await expect(list.getByRole('tab', { name: 'Three', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Clear tabs' }).click();
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(0);
  await expect(indicator(list)).toHaveCount(0);
  await page.getByRole('button', { name: 'Set first tab' }).click();
  await expect(first).toHaveAttribute('aria-selected', 'true');
});

test('unmounted panels reset and keepMounted panels preserve state while hidden', async ({ page }) => {
  await page.goto('/tabs');

  const list = page.getByRole('tablist', { name: 'Controlled', exact: true });

  await page.getByRole('textbox', { name: 'Persistent input' }).fill('changed');
  await list.getByRole('tab', { name: 'Two', exact: true }).click();
  await page.getByRole('textbox', { name: 'Kept input' }).fill('retained');
  await list.getByRole('tab', { name: 'One', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Persistent input' })).toHaveValue('saved');
  await expect(page.getByRole('textbox', { name: 'Kept input' })).toHaveCount(0);
  await expect(page.locator('input[aria-label="Kept input"]')).toHaveValue('retained');
  await list.getByRole('tab', { name: 'Two', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Kept input' })).toHaveValue('retained');
});

test('vetoes and prevented tab clicks preserve selection', async ({ page }) => {
  await page.goto('/tabs');

  for (const name of ['Vetoed', 'Prevented', 'Click prevented']) {
    const list = page.getByRole('tablist', { name, exact: true });

    await list.getByRole('tab').nth(1).click();
    await expect(list.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
  }
});

test('primary indicator follows label width and secondary indicator follows tab width', async ({ page }) => {
  await page.goto('/tabs');

  const primary = page.getByTestId('dynamic-tabs');
  const active = primary.getByRole('tab', { name: 'First', exact: true });

  await expect(indicator(primary)).toBeVisible();
  await expect(async () => {
    const label = (await active.locator('[data-md3-tab-label]').boundingBox())!;
    const ink = (await indicator(primary).boundingBox())!;
    const tab = (await active.boundingBox())!;

    expect(ink.width).toBeCloseTo(Math.max(24, Math.round(label.width) - 4), 0);
    expect(ink.x + ink.width / 2).toBeCloseTo(tab.x + tab.width / 2, 0);
    expect(ink.height).toBe(3);
  }).toPass();
  await page.getByRole('button', { name: 'Change first label' }).click();
  await expect(async () => {
    const label = primary.locator('[aria-selected="true"] [data-md3-tab-label]');

    expect((await indicator(primary).boundingBox())!.width).toBeCloseTo(
      Math.round((await label.boundingBox())!.width) - 4,
      0,
    );
  }).toPass();

  const secondary = page.getByTestId('secondary-tabs');
  const selected = secondary.getByRole('tab').first();

  await expect(async () => {
    expect((await indicator(secondary).boundingBox())!.width).toBeCloseTo((await selected.boundingBox())!.width, 0);
  }).toPass();
  await expect(indicator(secondary)).toHaveCSS('height', '2px');
  await expect(indicator(secondary)).toHaveCSS('border-radius', '0px');
});

test('scrollable keyboard navigation reveals LTR and RTL tabs inside their own list', async ({ page }) => {
  await page.goto('/tabs');

  for (const [id, key] of [
    ['scrollable-tabs', 'ArrowRight'],
    ['rtl-tabs', 'ArrowLeft'],
  ]) {
    const root = page.getByTestId(id!);
    const list = root.getByRole('tablist');
    const first = root.getByRole('tab').first();
    const last = root.getByRole('tab').last();

    await first.focus();
    await first.press(key!);
    await expect(root.getByRole('tab').nth(1)).toBeFocused();

    const scrollTop = await page.evaluate(() => window.scrollY);

    await root.getByRole('tab').nth(1).press('End');
    await expect(last).toBeFocused();
    await expect(last).toHaveAttribute('aria-selected', 'true');

    const bounds = (await list.boundingBox())!;
    const target = (await last.boundingBox())!;

    expect(target.x).toBeGreaterThanOrEqual(bounds.x - 1);
    expect(target.x + target.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollTop);
    await expect(list).toHaveCSS('padding-inline-start', '52px');
  }
});

test('dynamic disabling/removal and implicit initial selection use Base UI fallback', async ({ page }) => {
  await page.goto('/tabs');

  const root = page.getByTestId('dynamic-tabs');

  await page.getByRole('button', { name: 'Toggle first disabled' }).click();
  await expect(root.getByRole('tab', { name: 'Second', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Toggle first disabled' }).click();
  await root.getByRole('tab', { name: 'First', exact: true }).click();
  await page.getByRole('button', { name: 'Toggle first mounted' }).click();
  await expect(root.getByRole('tab', { name: 'Second', exact: true })).toHaveAttribute('aria-selected', 'true');

  const implicit = page.getByRole('tablist', { name: 'Implicit selection' });

  await expect(implicit.getByRole('tab', { name: 'Implicit first', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await implicit.getByRole('tab').last().focus();
  await implicit.getByRole('tab').last().press('ArrowRight');
  await expect(implicit.getByRole('tab').last()).toBeFocused();
});

test('nested tabs keep selection and appearance independent', async ({ page }) => {
  await page.goto('/tabs');

  const child = page.getByRole('tablist', { name: 'Nested child' });
  const parent = page.getByRole('tablist', { name: 'Nested parent' });

  await child.getByRole('tab').last().click();
  await expect(parent.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
  await expect(indicator(child)).toHaveCSS('height', '2px');
  await expect(indicator(parent)).toHaveCSS('height', '3px');
});

test('reduced motion, forced colors, focus and CSS-only interaction stay accessible', async ({ page }) => {
  await page.goto('/tabs');

  const root = page.getByTestId('server-tabs');
  const first = root.getByRole('tab').first();
  const styleCount = await page.locator('style').count();

  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(root.getByRole('tab').nth(1).locator('[data-md3-tab-focus-ring]')).toBeVisible();
  await root.getByRole('tab').nth(1).press('Enter');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(indicator(root)).toHaveCSS('transition-duration', '0s');
  await expect(first).toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(indicator(root)).toHaveCSS('forced-color-adjust', 'none');
  await page.emulateMedia({ forcedColors: 'none' });

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test('Storybook consumes the public tabs entry and CSS', async ({ page }) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-tabs--primary&viewMode=story');
  await expect(page.getByRole('tab', { name: 'Flights', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Hotels', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toHaveText('Find a hotel');
  await expect(page.locator('[data-md3-tab-indicator]')).toHaveCSS('height', '3px');
});
