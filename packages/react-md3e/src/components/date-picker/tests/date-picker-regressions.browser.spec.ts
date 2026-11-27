import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

async function selectedText(input: Locator) {
  return input.evaluate((node: HTMLInputElement) => node.value.slice(node.selectionStart ?? 0, node.selectionEnd ?? 0));
}

test('mask selects month, advances through digits and keeps section deletion local', async ({ page }) => {
  await page.goto('/date-pickers');

  const input = page.getByRole('textbox', { name: 'Bounded date', exact: true });

  await input.click();
  await expect(input).toHaveValue('mm/dd/yyyy');
  expect(await selectedText(input)).toBe('mm');
  await input.pressSequentially('02');
  await expect(input).toHaveValue('02/dd/yyyy');
  expect(await selectedText(input)).toBe('dd');
  await input.pressSequentially('29');
  expect(await selectedText(input)).toBe('yyyy');
  await input.pressSequentially('2024');
  await expect(input).toHaveValue('02/29/2024');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await input.press('Home');
  await input.press('Delete');
  await expect(input).toHaveValue('mm/29/2024');
  await input.pressSequentially('02');
  await expect(input).toHaveValue('02/29/2024');
  await input.press('ControlOrMeta+A');
  await input.press('Backspace');
  await expect(input).toHaveValue('mm/dd/yyyy');
  await page.getByRole('heading', { level: 1 }).click();
  await expect(input).toHaveValue('');
});

test('mask follows explicit/localized order and crosses single-input range endpoints', async ({ page }) => {
  await page.goto('/date-pickers');

  const iso = page.getByRole('textbox', { name: 'ISO format', exact: true });

  await iso.click();
  expect(await selectedText(iso)).toBe('yyyy');
  await iso.pressSequentially('20240229');
  await expect(iso).toHaveValue('2024-02-29');

  const uk = page.getByRole('textbox', { name: 'Ukrainian date', exact: true });

  await uk.click();
  await uk.press('ControlOrMeta+A');
  await uk.pressSequentially('01032024');
  await expect(uk).toHaveValue('01.03.2024');

  const range = page.getByRole('textbox', { name: 'Range field', exact: true });

  await range.click();
  await range.pressSequentially('1231202401012025');
  await expect(range).toHaveValue('12/31/2024 – 01/01/2025');
  await expect(range).not.toHaveAttribute('aria-invalid', 'true');
});

test('clipboard and native input events replace selected sections and preserve date validation', async ({ page }) => {
  await page.goto('/date-pickers');

  const input = page.getByRole('textbox', { name: 'Bounded date', exact: true });

  await input.click();

  for (const digits of ['02', '29', '2024']) {
    await input.evaluate((node: HTMLInputElement, text) => {
      node.setRangeText(text, node.selectionStart ?? 0, node.selectionEnd ?? 0, 'end');
      node.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }, digits);
  }

  await expect(input).toHaveValue('02/29/2024');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await input.press('Home');
  await input.press('ArrowRight');
  await input.evaluate((node) => {
    const clipboardData = new DataTransfer();

    clipboardData.setData('text/plain', '31');
    node.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }));
  });
  await expect(input).toHaveValue('02/31/2024');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await input.evaluate((node) => {
    const clipboardData = new DataTransfer();

    clipboardData.setData('text/plain', '02292024');
    node.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }));
  });
  await expect(input).toHaveValue('02/29/2024');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await input.evaluate((node) => {
    const clipboardData = new DataTransfer();

    clipboardData.setData('text/plain', '02/29/2024/01');
    node.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }));
  });
  await expect(input).toHaveValue('02/29/2024/01');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('calendar icon never focuses the empty input or starts its floating-label transition', async ({ page }) => {
  await page.goto('/date-pickers');

  const input = page.getByRole('textbox', { name: 'Controlled date', exact: true });
  const field = input.locator('xpath=ancestor::*[@data-md3-text-field][1]');
  const button = field.getByRole('button');

  await field.evaluate((node) => {
    const control = node.querySelector('input')!;
    const label = node.querySelector('label')!;

    control.addEventListener('focus', () => node.setAttribute('data-unwanted-input-focus', 'true'));
    node.querySelector('button')!.addEventListener(
      'focus',
      () => {
        for (const animation of label.getAnimations()) {
          animation.finish();
        }

        node.setAttribute('data-label-size-at-icon-focus', getComputedStyle(label).fontSize);
      },
      { once: true },
    );
  });
  await button.click();
  await expect(page.getByRole('dialog', { name: 'Select date', exact: true })).toBeVisible();
  await expect(field).not.toHaveAttribute('data-unwanted-input-focus');
  await expect(field).toHaveAttribute('data-label-size-at-icon-focus', '16px');
});

test('year/day transitions keep the calendar height stable while their outgoing frame animates', async ({ page }) => {
  await page.goto('/date-pickers');
  await page
    .getByRole('textbox', { name: 'Controlled date', exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();

  const popup = page.getByRole('dialog');
  const calendar = popup.locator('[data-md3-calendar]');

  await calendar.getByRole('button', { name: /Choose year/ }).click();
  await expect(calendar.getByRole('radio', { name: '2024', exact: true })).toBeVisible();

  const before = await calendar.evaluate((node: HTMLElement) => node.offsetHeight);

  await calendar.getByRole('radio', { name: '2024', exact: true }).click();

  const samples = await calendar.evaluate((node: HTMLElement) => {
    const animations = node
      .getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSAnimation && animation.animationName.startsWith('md3-calendar-'));

    for (const animation of animations) {
      animation.pause();
    }

    const heights = [0, 0.25, 0.5, 0.75, 0.99].map((fraction) => {
      for (const animation of animations) {
        animation.currentTime = Number(animation.effect!.getTiming().duration) * fraction;
      }

      return node.offsetHeight;
    });

    for (const animation of animations) {
      animation.finish();
    }

    return { heights, count: animations.length };
  });
  const heights = [before, ...samples.heights];

  expect(samples.count).toBe(2);
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  await expect(calendar).toHaveCSS('height', '416px');
});

test('nested docked picker shows every day without scrolling or viewport clipping', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 600 });
  await page.goto('/date-pickers');
  await page.getByRole('button', { name: 'Open parent dialog' }).click();
  await page
    .getByRole('dialog', { name: 'Booking', exact: true })
    .getByRole('button', { name: /Choose date/ })
    .click();

  const popup = page.getByRole('dialog', { name: 'Select date', exact: true });

  await expect(popup).toHaveAttribute('data-picker-modal', 'false');
  await expect(popup.locator('[data-md3-calendar]')).toHaveCSS('height', '416px');
  await expect(popup.locator('[data-picker-content]')).toHaveCSS('overflow-y', 'visible');
  await expect
    .poll(async () => {
      const box = (await popup.boundingBox())!;

      return box.y >= 7 && box.y + box.height <= 593;
    })
    .toBe(true);
  await expect(popup.locator('[data-calendar-current] button[data-date="2024-02-29"]')).toBeInViewport();
  expect(await popup.evaluate((node) => node.scrollHeight <= node.clientHeight)).toBe(true);
});

test('a viewport shorter than the grid falls back to modal input instead of a scrollable grid', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 380 });
  await page.goto('/date-pickers');
  await page
    .getByRole('textbox', { name: 'Controlled date', exact: true })
    .locator('xpath=ancestor::*[@data-md3-date-entry][1]')
    .getByRole('button')
    .click();

  const popup = page.getByRole('dialog', { name: 'Enter date', exact: true });

  await expect(popup).toHaveAttribute('data-picker-modal', 'true');
  await expect(popup.getByRole('grid')).toHaveCount(0);
  await expect(popup.getByRole('textbox')).toBeFocused();
  await expect(popup.getByRole('button', { name: 'Switch to calendar', exact: true })).toBeDisabled();
});
