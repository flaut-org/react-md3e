import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

function day(calendar: Locator, value: string) {
  return calendar.locator(`[data-calendar-current] button[data-date="${value}"][data-outside="false"]`);
}

test('range selection, hover previews, same-day ranges and reversed end clicks preserve ordered values', async ({
  page,
}) => {
  await page.goto('/calendars');
  await page.getByRole('button', { name: 'Clear range' }).click();

  const calendar = page.getByRole('group', { name: 'Travel dates', exact: true });

  await day(calendar, '2024-02-28').click();
  await expect(page.getByTestId('range-selection')).toHaveText('2024-02-28//partial');
  await expect(page.getByTestId('range-position')).toHaveText('end');
  await day(calendar, '2024-03-02').hover();
  await expect(day(calendar, '2024-02-29')).toHaveAttribute('data-preview', 'true');
  await day(calendar, '2024-03-02').click();
  await expect(page.getByTestId('range-selection')).toHaveText('2024-02-28/2024-03-02/finish');
  await expect(page.getByTestId('range-position')).toHaveText('start');
  await expect(calendar.locator('[data-calendar-current] td[aria-selected="true"]')).toHaveCount(4);
  await expect(day(calendar, '2024-03-02')).toBeFocused();
  await day(calendar, '2024-03-05').click();
  await expect(page.getByTestId('range-selection')).toHaveText('2024-03-05//partial');
  await day(calendar, '2024-03-01').click();
  await expect(page.getByTestId('range-selection')).toHaveText('2024-03-01//partial');
  await day(calendar, '2024-03-01').press('Enter');
  await expect(page.getByTestId('range-selection')).toHaveText('2024-03-01/2024-03-01/finish');
});

test('keyboard focus crosses visible panels and advances the window only when needed', async ({ page }) => {
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'Travel dates', exact: true });

  await day(calendar, '2024-02-29').focus();
  await page.keyboard.press('ArrowRight');
  await expect(day(calendar, '2024-03-01')).toBeFocused();
  await expect(calendar.getByRole('grid', { name: 'February 2024' })).toBeVisible();
  await page.keyboard.press('PageDown');
  await expect(day(calendar, '2024-04-01')).toBeFocused();
  await expect(calendar.getByRole('grid', { name: 'March 2024' })).toBeVisible();
  await expect(calendar.getByRole('grid', { name: 'April 2024' })).toBeVisible();
  await expect(calendar.locator('[data-calendar-current] button[data-date][tabindex="0"]')).toHaveCount(1);
  await calendar.getByRole('button', { name: 'Next month' }).click();
  await calendar.getByRole('button', { name: 'Next month' }).click();
  await expect(calendar.locator('[data-calendar-current] button[data-date][tabindex="0"]')).toHaveCount(1);
});

test('endpoint-specific validation keeps focus on an enabled day when editing advances to end', async ({ page }) => {
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'Travel dates', exact: true });

  await day(calendar, '2024-02-13').click();
  await expect(page.getByTestId('range-position')).toHaveText('end');
  await expect(day(calendar, '2024-02-13')).toBeDisabled();
  await expect(day(calendar, '2024-02-14')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('range-selection')).toHaveText('2024-02-13/2024-02-14/finish');
});

test('endpoint drag editing commits a range, cancels safely and keeps date validation position-aware', async ({
  page,
}) => {
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'Travel dates', exact: true });
  const start = day(calendar, '2024-02-27');
  const target = day(calendar, '2024-02-25');

  await start.scrollIntoViewIfNeeded();

  const origin = (await start.boundingBox())!;
  const destination = (await target.boundingBox())!;

  await page.mouse.move(origin.x + origin.width / 2, origin.y + origin.height / 2);
  await page.mouse.down();
  await page.mouse.move(destination.x + destination.width / 2, destination.y + destination.height / 2, { steps: 5 });
  await expect(calendar).toHaveAttribute('data-dragging', 'true');
  await page.mouse.up();
  await expect(page.getByTestId('range-selection')).toHaveText('2024-02-25/2024-03-04/finish');
  await expect(calendar).toHaveAttribute('data-dragging', 'false');

  const moved = (await day(calendar, '2024-02-25').boundingBox())!;

  await page.mouse.move(moved.x + moved.width / 2, moved.y + moved.height / 2);
  await page.mouse.down();

  const cancelledTarget = (await day(calendar, '2024-02-24').boundingBox())!;

  await page.mouse.move(cancelledTarget.x + cancelledTarget.width / 2, cancelledTarget.y + cancelledTarget.height / 2);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointercancel')));
  await page.mouse.up();
  await expect(calendar).toHaveAttribute('data-dragging', 'false');
  await expect(page.getByTestId('range-selection')).toHaveText('2024-02-25/2024-03-04/finish');
  await page.getByRole('button', { name: 'Edit end date' }).click();
  await expect(day(calendar, '2024-03-13')).toBeDisabled();
  await day(calendar, '2024-03-06').click();
  await expect(page.getByTestId('range-selection')).toHaveText('2024-02-25/2024-03-06/finish');
});

test('one and three panels, readOnly ranges, granular Storybook CSS and narrow viewports work', async ({ page }) => {
  await page.goto('/calendars');

  const one = page.getByRole('group', { name: 'One month range', exact: true });
  const three = page.getByRole('group', { name: 'Three month range', exact: true });
  const readOnly = page.getByRole('group', { name: 'Server range', exact: true });

  await expect(one.getByRole('grid')).toHaveCount(1);
  await expect(three.getByRole('grid')).toHaveCount(3);
  await expect(three.getByRole('grid', { name: 'January 2024' })).toBeVisible();
  await day(readOnly, '2024-02-20').click();
  await expect(day(readOnly, '2024-02-27')).toHaveAttribute('data-selected', 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-rangecalendar--playground&viewMode=story');
  await expect(page.getByRole('grid')).toHaveCount(2);
  await expect(page.locator('[data-md3-range-calendar]')).toHaveCSS('display', 'flex');
});
