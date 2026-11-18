import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Locator } from '@playwright/test';

function day(calendar: Locator, value: string) {
  return calendar.locator(`[data-calendar-current] button[data-date="${value}"][data-outside="false"]`);
}

test('single-date keyboard navigation crosses leap days, months and years without selecting on focus', async ({
  page,
}) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'Single date', exact: true });

  await day(calendar, '2024-02-28').focus();
  await page.keyboard.press('ArrowRight');
  await expect(day(calendar, '2024-02-29')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(day(calendar, '2024-03-01')).toBeFocused();
  await expect(page.getByTestId('single-selection')).toBeEmpty();
  await page.keyboard.press('PageUp');
  await expect(day(calendar, '2024-02-01')).toBeFocused();
  await page.keyboard.press('Shift+PageDown');
  await expect(day(calendar, '2025-02-01')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(day(calendar, '2025-01-26')).toBeFocused();
  await page.keyboard.press('End');
  await expect(day(calendar, '2025-02-01')).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByTestId('single-selection')).toHaveText('2025-02-01/finish/day');
  await expect(calendar.locator('[data-calendar-current] button[data-date][tabindex="0"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('controlled values, ISO callbacks, slot event veto and root refs work through the built package', async ({
  page,
}) => {
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'Single date', exact: true });

  await day(calendar, '2024-02-15').click();
  await expect(day(calendar, '2024-02-28')).toHaveAttribute('data-selected', 'true');
  await expect(page.getByTestId('single-selection')).toBeEmpty();
  await day(calendar, '2024-02-20').click();
  await expect(page.getByTestId('single-selection')).toHaveText('2024-02-20/finish/day');
  await page.getByRole('button', { name: 'Set date from code' }).click();
  await expect(day(calendar, '2025-01-31')).toHaveAttribute('data-selected', 'true');
  await page.getByRole('button', { name: 'Check calendar refs' }).click();
  await expect(calendar).toHaveAttribute('data-ref-checked', 'true');
  await expect(page.getByRole('group', { name: 'Travel dates', exact: true })).toHaveAttribute(
    'data-ref-checked',
    'true',
  );
});

test('year and month views preserve constrained dates and emit partial/finish selection states', async ({ page }) => {
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'Calendar views', exact: true });

  await calendar.getByRole('button', { name: 'Choose year' }).click();
  await expect(calendar.getByRole('radio', { name: '2024', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('view-selection')).toHaveText('2025-02-28/partial/year');
  await calendar.getByRole('radio', { name: 'Apr', exact: true }).click();
  await expect(page.getByTestId('view-selection')).toHaveText('2025-04-28/partial/month');
  await day(calendar, '2025-04-30').click();
  await expect(page.getByTestId('view-selection')).toHaveText('2025-04-30/finish/day');
});

test('validation skips disabled dates and enforces bounds, today, readOnly and disabled state', async ({ page }) => {
  await page.goto('/calendars');

  const limited = page.getByRole('group', { name: 'Limited calendar', exact: true });

  await expect(day(limited, '2024-02-04')).toBeDisabled();
  await expect(day(limited, '2024-02-14')).toBeDisabled();
  await expect(limited.getByRole('button', { name: 'Previous month' })).toBeDisabled();
  await day(limited, '2024-02-13').focus();
  await page.keyboard.press('ArrowRight');
  await expect(day(limited, '2024-02-15')).toBeFocused();
  await limited.getByRole('button', { name: 'Next month' }).click();
  await limited.getByRole('button', { name: 'Next month' }).click();
  await expect(day(limited, '2024-04-16')).toBeDisabled();
  await expect(limited.getByRole('button', { name: 'Next month' })).toBeDisabled();

  const readOnly = page.getByRole('group', { name: 'Server calendar', exact: true });
  const disabled = page.getByRole('group', { name: 'Disabled calendar', exact: true });

  await day(readOnly, '2024-02-20').click();
  await day(readOnly, '2024-02-20').press('Enter');
  await expect(day(readOnly, '2024-02-29')).toHaveAttribute('data-selected', 'true');
  await readOnly.getByRole('button', { name: 'Next month' }).click();
  await expect(readOnly.getByRole('grid', { name: 'March 2024' })).toBeVisible();
  await expect(disabled.getByRole('button', { name: 'Next month' })).toBeDisabled();
  await expect(day(disabled, '2024-02-20')).toBeDisabled();
  await expect(day(page.getByRole('group', { name: 'Past calendar', exact: true }), '2024-02-14')).toBeDisabled();
  await expect(day(page.getByRole('group', { name: 'Future calendar', exact: true }), '2024-02-16')).toBeDisabled();
});

async function sampleMonthSlide(calendar: Locator, fraction: number) {
  return calendar.locator('[data-md3-calendar-transition]').evaluate((node, progress) => {
    const current = node.querySelector<HTMLElement>('[data-calendar-current]')!;
    const previous = node.querySelector<HTMLElement>('[data-calendar-previous]')!;

    for (const frame of [current, previous]) {
      for (const animation of frame.getAnimations()) {
        animation.pause();
        animation.currentTime = Number(animation.effect!.getTiming().duration) * progress;
      }
    }

    const viewport = node.getBoundingClientRect();
    const currentStyle = getComputedStyle(current);
    const previousStyle = getComputedStyle(previous);
    const weekdays = node.parentElement!.querySelector('[data-calendar-weekdays]')!.getBoundingClientRect();

    return {
      width: viewport.width,
      incoming: current.getBoundingClientRect().left - viewport.left,
      outgoing: previous.getBoundingClientRect().left - viewport.left,
      incomingOpacity: currentStyle.opacity,
      outgoingOpacity: previousStyle.opacity,
      duration: currentStyle.animationDuration,
      easing: currentStyle.animationTimingFunction,
      names: currentStyle.animationName,
      weekdayLeft: weekdays.left,
      weekdayTop: weekdays.top,
    };
  }, fraction);
}

test('month paging keeps opaque grids adjacent across the full width with fixed weekday headings', async ({ page }) => {
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'Single date', exact: true });
  const styles = await page.locator('style').count();

  await calendar.getByRole('button', { name: 'Next month' }).click();

  const samples = [];

  for (const fraction of [0, 0.1, 0.25, 0.5, 0.9]) {
    samples.push(await sampleMonthSlide(calendar, fraction));
  }

  const first = samples[0]!;

  expect(first.incoming).toBeCloseTo(first.width, 0);
  expect(first.outgoing).toBeCloseTo(0, 0);
  expect(first.names).toContain('md3-calendar-enter');
  expect(first.names).not.toContain('fade');
  expect(parseFloat(first.duration)).toBeCloseTo(0.375, 3);
  expect(first.easing).toBe('cubic-bezier(0.35, 0.8, 0.4, 1)');

  for (const [index, sample] of samples.entries()) {
    expect(sample.incoming - sample.outgoing).toBeCloseTo(sample.width, 0);
    expect(sample.incomingOpacity).toBe('1');
    expect(sample.outgoingOpacity).toBe('1');
    expect(sample.incoming).toBeGreaterThanOrEqual(0);
    expect(sample.incoming).toBeLessThanOrEqual(samples[Math.max(0, index - 1)]!.incoming + 0.1);
    expect(sample.weekdayLeft).toBe(first.weekdayLeft);
    expect(sample.weekdayTop).toBe(first.weekdayTop);
  }

  await expect(calendar.locator('[data-calendar-previous]')).toHaveAttribute('inert', '');
  await expect(calendar.getByRole('grid')).toHaveCount(1);
  await calendar.getByRole('button', { name: 'Previous month' }).click();

  const backward = await sampleMonthSlide(calendar, 0.25);

  expect(backward.incoming).toBeLessThan(0);
  expect(backward.outgoing - backward.incoming).toBeCloseTo(backward.width, 0);
  await expect(calendar.locator('[data-calendar-previous]')).toHaveCount(1);
  await calendar.locator('[data-calendar-current]').evaluate((node) => {
    for (const animation of node.getAnimations()) {
      animation.play();
    }
  });
  await expect(calendar.locator('[data-calendar-previous]')).toHaveCount(0);
  expect(await page.locator('style').count()).toBe(styles);
});

test('full-width month paging mirrors explicit and inherited RTL layouts', async ({ page }) => {
  await page.goto('/calendars');

  const explicit = page.getByRole('group', { name: 'Arabic calendar', exact: true });
  const inherited = page.getByRole('group', { name: 'Single date', exact: true });

  await explicit.getByRole('button', { name: 'Next month' }).click();

  const rtl = await sampleMonthSlide(explicit, 0.25);

  expect(rtl.incoming).toBeLessThan(0);
  expect(rtl.outgoing - rtl.incoming).toBeCloseTo(rtl.width, 0);
  await inherited.evaluate((node) => node.parentElement!.setAttribute('dir', 'rtl'));
  await inherited.getByRole('button', { name: 'Next month' }).click();

  const inheritedRtl = await sampleMonthSlide(inherited, 0.25);

  expect(inheritedRtl.incoming).toBeLessThan(0);
  expect(inheritedRtl.outgoing - inheritedRtl.incoming).toBeCloseTo(inheritedRtl.width, 0);
});

test('locale weekdays, RTL keyboard navigation, fixed weeks, loading and explicit timezone conversion work', async ({
  page,
}) => {
  await page.goto('/calendars');

  const uk = page.getByRole('group', { name: 'Ukrainian calendar', exact: true });
  const rtl = page.getByRole('group', { name: 'Arabic calendar', exact: true });
  const weeks = page.getByRole('group', { name: 'Weeks calendar', exact: true });

  await expect(uk.getByRole('columnheader').first()).toHaveAttribute('aria-label', 'понеділок');
  await day(rtl, '2024-03-15').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(day(rtl, '2024-03-16')).toBeFocused();
  await expect(day(rtl, '2024-03-15')).toHaveText('١٥');
  await expect(weeks.locator('tbody tr')).toHaveCount(6);
  await expect(day(page.getByRole('group', { name: 'Zoned calendar', exact: true }), '2024-02-29')).toHaveAttribute(
    'data-selected',
    'true',
  );
  await page.getByRole('button', { name: 'Toggle calendar loading' }).click();
  await expect(page.getByRole('group', { name: 'Limited calendar', exact: true }).getByRole('status')).toHaveText(
    'Fetching dates',
  );
  await expect(page.getByRole('group', { name: 'Limited calendar', exact: true })).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Toggle calendar loading' }).click();
  await expect(page.getByRole('group', { name: 'Limited calendar', exact: true }).getByRole('grid')).toBeVisible();
});

test('calendars honor reduced motion, forced colors, accessible grids and compiled server CSS', async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, timezoneId: 'Pacific/Kiritimati' });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/calendars');

    const calendar = server.getByRole('group', { name: 'Server calendar', exact: true });

    await expect(day(calendar, '2024-02-29')).toHaveAttribute('data-selected', 'true');
    await expect(day(calendar, '2024-02-29')).toHaveCSS('height', '48px');
    await expect(calendar).toHaveCSS('width', '360px');
  } finally {
    await context.close();
  }

  await page.goto('/calendars');
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const calendar = page.getByRole('group', { name: 'Single date', exact: true });

  await calendar.getByRole('button', { name: 'Next month' }).click();
  await expect(calendar.locator('[data-calendar-current]')).toHaveCSS('animation-name', 'none');
  await expect(calendar.locator('[data-calendar-previous]')).toHaveCSS('display', 'none');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(results.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });

  const selected = day(page.getByRole('group', { name: 'Dark calendar', exact: true }), '2024-02-29');

  await expect(selected).toHaveCSS('forced-color-adjust', 'none');
  await selected.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(selected).toHaveCSS('outline-style', 'solid');
  await page.goto('/streaming');
  await expect(day(page.getByRole('group', { name: 'Streamed calendar', exact: true }), '2024-02-29')).toHaveAttribute(
    'data-selected',
    'true',
  );
  await expect(page.getByRole('group', { name: 'Streamed range calendar', exact: true }).getByRole('grid')).toHaveCount(
    2,
  );
});

test('Storybook serves the isolated Calendar styles with themes and animation opt-out', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-calendar--reduced-motion&viewMode=story&globals=brand:forest;colorScheme:dark',
  );

  const calendar = page.getByRole('group', { name: 'Choose a date', exact: true });

  await expect(day(calendar, '2026-11-18')).toHaveAttribute('data-selected', 'true');
  await calendar.getByRole('button', { name: 'Next month' }).click();
  await expect(calendar.locator('[data-calendar-current]')).toHaveCSS('animation-name', 'none');
});

test('single headers keep labels left and controls right; multi-panel headings center above each grid', async ({
  page,
}) => {
  await page.goto('/calendars');

  const single = page.getByRole('group', { name: 'Single date', exact: true });
  const range = page.getByRole('group', { name: 'Travel dates', exact: true });
  const one = page.getByRole('group', { name: 'One month range', exact: true });

  for (const calendar of [single, one]) {
    const label = (await calendar.locator('[data-calendar-heading] [aria-live]').boundingBox())!;
    const previous = (await calendar.getByRole('button', { name: 'Previous month' }).boundingBox())!;
    const next = (await calendar.getByRole('button', { name: 'Next month' }).boundingBox())!;
    const weekdays = (await calendar.locator('[data-calendar-weekdays]').boundingBox())!;

    expect(label.x).toBeLessThan(previous.x);
    expect(previous.x + previous.width).toBeLessThanOrEqual(next.x);
    expect(next.x + next.width).toBeCloseTo(weekdays.x + weekdays.width, 0);
  }

  for (const name of ['Travel dates', 'Three month range']) {
    const calendars = page.getByRole('group', { name, exact: true }).locator('[data-md3-calendar]');

    for (const calendar of await calendars.all()) {
      const label = (await calendar.locator('[data-calendar-heading] [aria-live]').boundingBox())!;
      const grid = (await calendar.getByRole('grid').boundingBox())!;

      expect(label.x + label.width / 2).toBeCloseTo(grid.x + grid.width / 2, 0);
    }
  }

  const first = range.locator('[data-md3-calendar]').first();
  const last = range.locator('[data-md3-calendar]').last();
  const firstGrid = (await first.getByRole('grid').boundingBox())!;
  const lastGrid = (await last.getByRole('grid').boundingBox())!;
  const previous = (await range.getByRole('button', { name: 'Previous month' }).boundingBox())!;
  const next = (await range.getByRole('button', { name: 'Next month' }).boundingBox())!;

  expect(previous.x).toBeCloseTo(firstGrid.x, 0);
  expect(next.x + next.width).toBeCloseTo(lastGrid.x + lastGrid.width, 0);
  await expect(first.locator('[data-calendar-next-button]')).toBeHidden();
  await expect(last.locator('[data-calendar-previous-button]')).toBeHidden();
});

test('calendars have no implicit background, border radius, shadow or Surface wrapper', async ({ page }) => {
  await page.goto('/calendars');

  for (const name of ['Server calendar', 'Single date', 'Travel dates', 'One month range', 'Three month range']) {
    const calendar = page.getByRole('group', { name, exact: true });

    await expect(calendar).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(calendar).toHaveCSS('border-radius', '0px');
    await expect(calendar).toHaveCSS('box-shadow', 'none');
    expect(await calendar.evaluate((node) => node.closest('[data-md3-surface]'))).toBeNull();
  }

  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-calendar--with-surface&viewMode=story');

  const example = page.getByRole('group', { name: 'Choose a date', exact: true });

  await expect(example).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect(await example.evaluate((node) => getComputedStyle(node.parentElement!).backgroundColor)).not.toBe(
    'rgba(0, 0, 0, 0)',
  );
});
