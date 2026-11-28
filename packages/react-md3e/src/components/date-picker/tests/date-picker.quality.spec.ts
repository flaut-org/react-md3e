import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import type { OpenStory } from '../../../../tests/browser/ui-quality/storybook';
import { test, expect } from '../../../../tests/browser/ui-quality/storybook';
import { captureFrames, recordMotion } from '../../../../tests/browser/ui-quality/motion';
import {
  expectUsableOverlay,
  interruptOpenClose,
  repeatOpenClose,
  waitForOverlayEntry,
} from '../../../../tests/browser/ui-quality/assertions';

test('[DP-001] section entry selects and advances each section without separators', async ({ page, story }) => {
  await story('qa-datepicker--empty');

  const input = page.getByRole('textbox', { name: 'Departure', exact: true });
  const selection = () =>
    input.evaluate((node: HTMLInputElement) => node.value.slice(node.selectionStart ?? 0, node.selectionEnd ?? 0));

  await input.click();
  expect(await selection()).toBe('mm');

  for (const [digits, value, next] of [
    ['02', '02/dd/yyyy', 'dd'],
    ['29', '02/29/yyyy', 'yyyy'],
    ['2024', '02/29/2024', '2024'],
  ]) {
    await input.pressSequentially(digits!);
    await expect(input).toHaveValue(value!);
    expect(await selection(), 'DP-001:section-advance').toBe(next);
  }

  await input.press('Home');
  await input.press('Delete');
  await expect(input).toHaveValue('mm/29/2024');
});

test('[DP-002] icon does not transiently focus input or move its label', async ({ page, story }, testInfo) => {
  await story('qa-datepicker--empty');

  const input = page.getByRole('textbox', { name: 'Departure', exact: true });

  await input.evaluate((node) => node.setAttribute('data-testid', 'date-input'));

  const probe = await recordMotion(page, { label: '[data-md3-text-field] label', input: 'input' });

  await page.getByRole('button', { name: /Choose date/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await captureFrames(page, testInfo, 'icon-opening', 3);

  const data = await probe.stop(testInfo, 'icon-focus');
  const labels = data.frames.flatMap((frame) => (frame.elements.label ? [frame.elements.label] : []));

  expect(data.truncated).toBe(false);
  expect(
    data.focus.filter((event) => event.type === 'focusin' && event.target === 'date-input'),
    'DP-002:unexpected-input-focus',
  ).toEqual([]);
  expect(labels.length).toBeGreaterThan(2);
  expect(Math.max(...labels.map((label) => label.y)) - Math.min(...labels.map((label) => label.y))).toBeLessThan(0.5);
  expect(new Set(labels.map((label) => label.transform)).size).toBe(1);
  expect(new Set(labels.map((label) => label.fontSize)).size).toBe(1);
});

test('[DP-003] year/day height is stable on intermediate native animation frames', async ({
  page,
  story,
}, testInfo) => {
  await story('qa-datepicker--selected');
  await page.getByRole('button', { name: /Choose date/ }).click();

  const calendar = page.getByRole('dialog').locator('[data-md3-calendar]');

  await calendar.getByRole('button', { name: /Choose year/ }).click();
  await expect(calendar.getByRole('radio', { name: '2024', exact: true })).toBeVisible();
  await expect
    .poll(() =>
      calendar.evaluate(
        (node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);

  const probe = await recordMotion(page, {
    calendar: '[role="dialog"] [data-md3-calendar]',
    incoming: '[data-calendar-current]',
    outgoing: '[data-calendar-previous]',
  });

  await calendar.getByRole('radio', { name: '2024', exact: true }).click();
  await captureFrames(page, testInfo, 'year-to-day');
  await expect(calendar.getByRole('grid')).toBeVisible();

  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);

  if (reduced) {
    await expect(calendar.locator('[data-calendar-previous]')).toBeHidden();
    await expect(calendar.locator('[data-calendar-previous]')).toHaveAttribute('inert', '');
  } else {
    await expect(calendar.locator('[data-calendar-previous]')).toHaveCount(0);
  }

  const data = await probe.stop(testInfo);
  const samples = data.frames.flatMap((frame) => (frame.elements.calendar ? [frame.elements.calendar] : []));

  expect(data.truncated).toBe(false);
  expect(samples.length).toBeGreaterThan(3);
  expect(
    Math.max(...samples.map((sample) => sample.height)) - Math.min(...samples.map((sample) => sample.height)),
    'DP-003:unstable-calendar-height',
  ).toBeLessThan(1);
  expect(samples.every((sample) => !sample.scrollbarX && !sample.scrollbarY)).toBe(true);

  if (!reduced) {
    expect(
      data.frames.some((frame) => frame.elements.incoming?.animations && frame.elements.outgoing?.animations),
      'Must observe actual intermediate motion',
    ).toBe(true);
  } else {
    expect(data.frames.every((frame) => !frame.elements.incoming?.animations)).toBe(true);
  }
});

test('[DP-004] nested dialog calendar stays visible and clickable without grid scrollbars', async ({
  page,
  story,
}, testInfo) => {
  await story('qa-datepicker--nested-overlays');
  await page.getByRole('button', { name: 'Open booking', exact: true }).click();

  const probe = await recordMotion(page, { calendar: '[data-md3-calendar]', grid: '[data-calendar-current] table' });

  await page.getByRole('button', { name: /Choose date/ }).click();

  const popup = page.getByRole('dialog', { name: 'Select date', exact: true });
  const lastDay = popup.locator('[data-calendar-current] button[data-date="2024-02-29"]');

  await expectUsableOverlay(popup, lastDay, 'DP-004');
  await captureFrames(page, testInfo, 'nested-calendar', 3);

  const data = await probe.stop(testInfo);

  expect(
    data.frames
      .flatMap((frame) => Object.values(frame.elements))
      .every((box) => !box.scrollbarX && !box.scrollbarY && box.clippedBy.length === 0),
    'DP-004:clipped-calendar-frame',
  ).toBe(true);
  await lastDay.click();
  await expect(popup).toBeHidden();
  await expect(page.getByRole('textbox', { name: 'Departure', exact: true })).toHaveValue('02/29/2024');
});

async function verifyEdge(page: Page, story: OpenStory, edge: string) {
  await story('qa-datepicker--selected', { qaEdge: edge, qaLayout: 'hidden' });
  await page.getByRole('button', { name: /Choose date/ }).click();

  const popup = page.getByRole('dialog', { name: 'Select date', exact: true });

  await expectUsableOverlay(popup, popup.locator('[data-calendar-current] button[data-date="2024-02-29"]'));
  await page.setViewportSize({ width: 390, height: 380 });

  const inputModal = page.getByRole('dialog', { name: 'Enter date', exact: true });

  await expectUsableOverlay(inputModal, inputModal.getByRole('button', { name: 'Cancel', exact: true }));
  await expect(inputModal.getByRole('grid')).toHaveCount(0);
  await inputModal.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(inputModal).toBeHidden();
}

test('[DP-006] overlay near top-left survives constraints and viewport resize', ({ page, story }) =>
  verifyEdge(page, story, 'top-left'));

test('[DP-006] overlay near top-right survives constraints and viewport resize', ({ page, story }) =>
  verifyEdge(page, story, 'top-right'));

test('[DP-006] overlay near bottom-left survives constraints and viewport resize', ({ page, story }) =>
  verifyEdge(page, story, 'bottom-left'));

test('[DP-006] overlay near bottom-right survives constraints and viewport resize', ({ page, story }) =>
  verifyEdge(page, story, 'bottom-right'));

test('[DP-007] keyboard, rapid reopen and accessible modal content', async ({ page, story }) => {
  await story('components-datepicker--modal');

  const trigger = page.getByRole('button', { name: /Choose date/ });
  const popup = page.getByRole('dialog');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(popup).toBeVisible();

  const day = popup.locator('[data-calendar-current] button[data-date="2024-02-29"]');

  await day.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(popup.locator('[data-calendar-current] button[data-date="2024-02-28"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await expect(trigger).toBeFocused();
  await repeatOpenClose(trigger, popup, () => page.keyboard.press('Escape'));
});

test('[DP-017] settled modal content passes the automated accessibility scan', async ({ page, story }, testInfo) => {
  await story('qa-datepicker--open-modal');
  // Playwright 1.65.x Firefox crashes if ARIA reflection is read in both script worlds (#44135).
  // Keep this scan in its own page and use CSS locators here; DP-007 retains every keyboard assertion.
  await waitForOverlayEntry(page.locator('[data-picker-modal="true"]'));

  const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();

  await testInfo.attach('axe.json', { body: JSON.stringify(results), contentType: 'application/json' });
  expect(results.passes.length).toBeGreaterThan(0);
  expect(results.violations).toEqual([]);
});

test('[DP-009] RTL, localized long label and enlarged font remain operable', async ({ page, story }) => {
  await story('qa-datepicker--localized', { qaDirection: 'rtl', qaFontScale: 1.5 });
  await expect(page.locator('.qa-stage')).toHaveCSS('direction', 'rtl');
  await expect(page.getByRole('textbox')).toHaveCSS('font-size', '24px');
  await page.getByRole('button', { name: /Вибрати|Choose/ }).click();

  const popup = page.getByRole('dialog');

  await expectUsableOverlay(popup, popup.locator('[data-calendar-current] button[data-date="2024-02-29"]'));
});

test('[DP-010] scroll parent and nested popovers support dynamic content and dismissal', async ({ page, story }) => {
  await story('qa-datepicker--nested-overlays', { qaLayout: 'scroll' });
  await page.locator('.qa-container').evaluate((node) => node.scrollTo(0, node.scrollHeight));
  await page.getByRole('button', { name: 'Open booking', exact: true }).click();
  await page.getByRole('button', { name: 'More options', exact: true }).click();
  await page.getByRole('button', { name: 'Nested options', exact: true }).click();

  const nested = page.getByRole('dialog', { name: 'Nested options', exact: true });

  await nested.getByRole('button', { name: 'Change content', exact: true }).click();
  await expect(nested.getByText(/Додаткові/)).toBeVisible();
  await expectUsableOverlay(nested, nested.getByRole('textbox', { name: 'Note', exact: true }));
  await nested.getByRole('textbox', { name: 'Note', exact: true }).fill('Family seats');
  await page.keyboard.press('Escape');
  await expect(nested).toBeHidden();
  await expect(page.getByRole('dialog', { name: 'Options', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Booking', exact: true })).toBeVisible();
});

test('[DP-016] rapid toggles interrupt entry motion without stale state', async ({ page, story }, testInfo) => {
  await story('qa-datepicker--selected');

  const probe = await recordMotion(page, { popup: '[role="dialog"]', label: '[data-md3-text-field] label' });

  await interruptOpenClose(
    page,
    page.getByRole('button', { name: /Choose date/ }),
    page.locator('[data-picker-modal]'),
  );

  const data = await probe.stop(testInfo, 'interrupted-reopening');

  expect(data.truncated).toBe(false);
  await expect(page.getByRole('textbox')).toHaveValue('02/29/2024');
});
