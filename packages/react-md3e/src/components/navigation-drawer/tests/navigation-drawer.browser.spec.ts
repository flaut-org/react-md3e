import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('standard drawer stays inline without a dialog or focus trap and supports arrow navigation', async ({ page }) => {
  await page.goto('/navigation');

  const root = page.getByTestId('server-drawer');
  const first = root.getByRole('button', { name: 'Inbox 24', exact: true });
  const second = root.getByRole('button', { name: 'Outbox', exact: true });

  await expect(root).toHaveCSS('width', '360px');
  await expect(first).toHaveCSS('height', '56px');
  await expect(first.locator('[data-md3-navigation-surface]')).toHaveCSS('width', '336px');
  await expect(first.locator('[data-md3-navigation-inline-label]')).toHaveCSS('font-size', '14px');
  await first.focus();
  await first.press('ArrowDown');
  await expect(second).toBeFocused();
  await second.press('Enter');
  await expect(second).toHaveAttribute('aria-current', 'page');
  await second.press('Tab');
  await expect(page.getByRole('button', { name: 'One', exact: true })).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(second.locator('[data-md3-navigation-inline-label]')).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('modal drawer traps and restores focus, preserves kept state and selection, and closes on Escape', async ({
  page,
}) => {
  await page.goto('/navigation');

  const trigger = page.getByRole('button', { name: 'Open navigation drawer', exact: true });

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Modal destinations', exact: true });
  const inbox = dialog.getByRole('button', { name: 'Inbox', exact: true });
  const saved = dialog.getByRole('button', { name: 'Saved mail', exact: true });

  await expect(inbox).toBeFocused();
  await expect(dialog).toHaveCSS('width', '360px');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await inbox.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Close navigation drawer', exact: true })).toBeFocused();
  await saved.click();
  await dialog.getByRole('textbox', { name: 'Kept drawer input', exact: true }).fill('retained');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByTestId('drawer-close-reason')).toHaveText('escapeKeyDown');
  await trigger.click();
  await expect(saved).toHaveAttribute('aria-current', 'page');
  await expect(dialog.getByRole('textbox', { name: 'Kept drawer input', exact: true })).toHaveValue('retained');

  const results = await new AxeBuilder({ page }).exclude('[data-base-ui-focus-guard]').analyze();

  expect(results.violations).toEqual([]);
});

test('Escape opt-out and canceled closing retain the dialog, then outside press dismisses with its reason', async ({
  page,
}) => {
  await page.goto('/navigation');
  await page.getByLabel('Disable drawer Escape', { exact: true }).check();
  await page.getByRole('button', { name: 'Open navigation drawer', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Modal destinations', exact: true });

  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close navigation drawer', exact: true }).click();
  await page.getByLabel('Disable drawer Escape', { exact: true }).uncheck();
  await page.getByLabel('Cancel drawer close', { exact: true }).check();
  await page.getByRole('button', { name: 'Open navigation drawer', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close navigation drawer', exact: true }).click();
  await page.getByLabel('Cancel drawer close', { exact: true }).uncheck();
  await page.getByRole('button', { name: 'Open navigation drawer', exact: true }).click();
  await page.mouse.click(900, 200);
  await expect(dialog).not.toBeVisible();
  await expect(page.getByTestId('drawer-close-reason')).toHaveText('backdropClick');
});

test('inherited RTL selects the physical start edge and mobile sizing keeps the scrim accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/navigation');
  await page.getByRole('button', { name: 'Open RTL navigation', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'RTL modal destinations', exact: true });

  await expect(dialog).toHaveAttribute('data-edge', 'right');
  await expect(dialog).toHaveCSS('direction', 'rtl');
  await expect(dialog).toHaveCSS('width', '334px');
  await expect(dialog).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  const bounds = await dialog.boundingBox();

  expect(bounds!.x).toBeCloseTo(56, 0);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('Storybook modal movement and scrim are sampled together, reduced motion removes both transitions', async ({
  page,
}, testInfo) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-navigationdrawer--modal&viewMode=story');
  await page.getByRole('button', { name: 'Open navigation drawer', exact: true }).click();

  const dialog = page.getByRole('dialog');

  await expect(dialog).toBeVisible();
  await dialog.evaluate((node) => {
    for (const animation of node.getAnimations()) {
      animation.pause();
      animation.currentTime = 0;
    }

    const backdrop = node.closest('[data-base-ui-portal]')!.querySelector('[data-md3-navigation-backdrop]')!;

    for (const animation of backdrop.getAnimations()) {
      animation.pause();
      animation.currentTime = 0;
    }
  });

  const samples = [];

  for (const time of [0, 50, 100, 200, 500]) {
    const frame = await dialog.evaluate((node, currentTime) => {
      const backdrop = node.closest('[data-base-ui-portal]')!.querySelector('[data-md3-navigation-backdrop]')!;

      for (const animation of [...node.getAnimations(), ...backdrop.getAnimations()]) {
        animation.currentTime = currentTime;
      }

      return {
        x: new DOMMatrixReadOnly(getComputedStyle(node).transform).m41,
        opacity: Number(getComputedStyle(backdrop).opacity),
      };
    }, time);

    samples.push(frame);

    const screenshotPath = testInfo.outputPath(`drawer-${time}ms.png`);

    await page.screenshot({ path: screenshotPath, animations: 'allow' });
    await testInfo.attach(`drawer-${time}ms.png`, {
      path: screenshotPath,
      contentType: 'image/png',
    });
  }

  expect(samples[0]!.x).toBeCloseTo(-360, 0);
  expect(samples.at(-1)!.x).toBeCloseTo(0, 0);
  expect(samples[2]!.x).toBeGreaterThan(samples[1]!.x);
  expect(samples[0]!.opacity).toBe(0);
  expect(samples.at(-1)!.opacity).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(dialog).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('[data-md3-navigation-backdrop]')).toHaveCSS('transition-duration', '0s');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});
