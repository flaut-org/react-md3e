import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-org/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('Dialog traps keyboard focus, restores it, and reports Escape/backdrop close reasons', async ({ page }) => {
  await page.goto('/dialog');

  const trigger = page.getByRole('button', { name: 'Open basic dialog', exact: true });

  await trigger.click();

  const dialog = page.getByRole('alertdialog', { name: 'Dialog demonstration' });
  const cancel = dialog.getByRole('button', { name: 'Cancel dialog' });
  const last = dialog.getByRole('button', { name: 'Check dialog ref' });

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(last).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancel).toBeFocused();
  await last.click();
  await expect(dialog).toHaveAttribute('data-ref-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByTestId('dialog-close-reason')).toHaveText('escapeKeyDown');
  await trigger.click();
  await page.locator('[data-md3-dialog-viewport]').click({ position: { x: 5, y: 5 } });
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('dialog-close-reason')).toHaveText('backdropClick');
});

test('portal preserves server-created and nested dark themes without inserting CSS rules', async ({ page }) => {
  await page.goto('/dialog');

  const styles = await page.locator('style').count();

  await page.getByRole('button', { name: 'Open basic dialog', exact: true }).click();

  const dialog = page.getByTestId('fixture-dialog');

  await expect(dialog).toHaveCSS('background-color', rgb(forest.schemes.light.surfaceContainerHigh));
  await expect(dialog).toHaveCSS('border-radius', '32px');
  await expect(dialog.getByRole('heading')).toHaveCSS('font-family', 'Georgia, serif');
  await expect(dialog.getByRole('heading')).toHaveCSS('font-size', '24px');
  await expect(dialog).toHaveAccessibleDescription('Review your journey collection before saving.');
  await expect(dialog.locator('[data-fixture="server-dialog-content"]')).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel dialog' }).click();
  await page.getByRole('button', { name: 'Open dark scoped dialog', exact: true }).click();

  const dark = page.getByTestId('scoped-dialog');

  await expect(dark).toHaveCSS('background-color', rgb(forest.schemes.dark.surfaceContainerHigh));
  await expect(page.getByTestId('dark-dialog-scope').locator('[data-md3-dialog]')).toHaveCount(1);
  await dark.getByRole('button', { name: 'Close dark dialog' }).click();
  await expect(dark).toHaveCount(0);
  expect(await page.locator('style').count()).toBe(styles);
});

test('long content scrolls internally with pinned title/actions while the page is locked', async ({ page }) => {
  await page.goto('/dialog');
  await page.getByRole('button', { name: 'Open long dialog', exact: true }).click();

  const dialog = page.getByTestId('fixture-dialog');
  const content = dialog.locator('[data-md3-dialog-content]');
  const title = dialog.getByRole('heading');
  const actions = dialog.locator('[data-md3-dialog-actions]');

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('opacity', '1');

  const titleBefore = (await title.boundingBox())!.y;
  const actionsBefore = (await actions.boundingBox())!.y;

  expect(await content.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await content.evaluate((node) => node.scrollTo({ top: node.scrollHeight }));
  expect((await title.boundingBox())!.y).toBeCloseTo(titleBefore, 0);
  expect((await actions.boundingBox())!.y).toBeCloseTo(actionsBefore, 0);
  expect(
    await page.evaluate(() =>
      [document.body, document.documentElement].some((node) => getComputedStyle(node).overflowY === 'hidden'),
    ),
  ).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() =>
        [document.body, document.documentElement].every((node) => getComputedStyle(node).overflowY !== 'hidden'),
      ),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Open body dialog', exact: true }).click();

  const viewport = page.locator('[data-md3-dialog-viewport]');

  await expect(viewport).toHaveCSS('overflow-y', 'auto');
  expect(await viewport.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
});

test('full-screen and nested dialogs keep focus and scroll locking on the active layer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dialog');
  await page.getByRole('button', { name: 'Open fullScreen dialog', exact: true }).click();

  const parent = page.getByRole('dialog', { name: 'Dialog demonstration' });

  await expect(parent).toHaveCSS('width', '390px');
  await expect(parent).toHaveCSS('height', '844px');
  await expect(parent).toHaveCSS('border-radius', '0px');
  await parent.getByRole('button', { name: 'Open discard confirmation' }).click();

  const child = page.getByRole('alertdialog', { name: 'Discard changes?' });

  await expect(child).toBeVisible();
  await expect(child.getByRole('button', { name: 'Keep editing' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(child).toHaveCount(0);
  await expect(parent).toBeVisible();
  await expect(parent.getByRole('button', { name: 'Open discard confirmation' })).toBeFocused();
  await parent.getByRole('button', { name: 'Close full screen dialog' }).click();
  await expect(parent).toHaveCount(0);
});

test('dismissal can be vetoed, forms focus/submit, and keepMounted preserves field state while hidden', async ({
  page,
}) => {
  await page.goto('/dialog');
  await page.getByRole('button', { name: 'Open protected dialog', exact: true }).click();

  const dialog = page.getByTestId('fixture-dialog');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('dialog-close-reason')).toHaveText('none');
  await page.locator('[data-md3-dialog-viewport]').click({ position: { x: 5, y: 5 } });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel dialog' }).click();
  await page.getByRole('button', { name: 'Open form dialog', exact: true }).click();
  await expect(dialog.getByLabel('Collection name')).toBeFocused();
  await dialog.getByLabel('Collection name').fill('Autumn journeys');
  await dialog.getByRole('button', { name: 'Save dialog form' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('dialog-submitted')).toHaveText('Autumn journeys');
  await page.getByRole('button', { name: 'Open kept dialog', exact: true }).click();
  await dialog.getByLabel('Collection name').fill('Retained journey');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(dialog).toHaveCount(1);
  await page.getByRole('button', { name: 'Open kept dialog', exact: true }).click();
  await expect(dialog.getByLabel('Collection name')).toHaveValue('Retained journey');
});

test('Dialog fits narrow viewports, respects RTL, reduced motion, forced colors, and accessibility', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/dialog');
  await page.getByRole('button', { name: 'Open rtl dialog', exact: true }).click();

  const dialog = page.getByTestId('fixture-dialog');

  await expect(dialog).toHaveCSS('direction', 'rtl');
  await expect(dialog).toHaveCSS('transition-duration', '0s');

  const box = (await dialog.boundingBox())!;

  expect(box.x).toBeGreaterThanOrEqual(24);
  expect(box.x + box.width).toBeLessThanOrEqual(296);

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(dialog).toHaveCSS('border-top-style', 'solid');
  await expect(dialog.getByRole('button', { name: 'Cancel dialog' })).toBeVisible();
});

test('Storybook themes and request-time streamed server composition support Dialog', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-dialog--with-icon&viewMode=story&globals=brand:forest;colorScheme:dark',
  );
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();

  const story = page.getByRole('alertdialog', { name: 'Save this collection?' });

  await expect(story).toHaveCSS('background-color', rgb(forest.schemes.dark.surfaceContainerHigh));
  await story.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(story).toHaveCount(0);
  await page.goto('/dialog');
  await page.getByRole('link', { name: 'Check request-time streaming' }).click();
  await page.getByRole('button', { name: 'Open dark scoped dialog' }).click();
  await expect(page.getByRole('alertdialog', { name: 'Dark collection' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('custom container resolves refs after mounting, ignores pointer drags, and honors finalFocus', async ({
  page,
}) => {
  await page.goto('/dialog');
  await page.getByRole('button', { name: 'Open custom dialog', exact: true }).click();

  const dialog = page.getByTestId('custom-dialog-host').getByRole('alertdialog', { name: 'Dialog demonstration' });

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('background-color', rgb(forest.schemes.light.surfaceContainerHigh));
  await expect(dialog).toHaveCSS('opacity', '1');

  const box = (await dialog.getByRole('heading').boundingBox())!;

  await page.mouse.move(box.x + 20, box.y + 8);
  await page.mouse.down();
  await page.mouse.move(5, 5);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('dialog-close-reason')).toHaveText('none');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Custom return focus', exact: true })).toBeFocused();
});
