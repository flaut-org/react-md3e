import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

function day(calendar: Locator, value: string) {
  return calendar.locator(`[data-calendar-current] button[data-date="${value}"][data-outside="false"]`);
}

test('preview dash lengths stay uniform across cell boundaries and fractional cell widths', async ({
  page,
}, testInfo) => {
  await page.goto('/calendars');

  const calendar = page.getByRole('group', { name: 'One month range', exact: true });

  await calendar.scrollIntoViewIfNeeded();
  await day(calendar, '2024-02-02').click();

  for (const width of [360, 335, 320]) {
    await calendar
      .locator('[data-md3-calendar]')
      .evaluate((node, size) => node.style.setProperty('inline-size', `${size}px`), width);

    const target = day(calendar, '2024-02-18');
    const geometry = () =>
      target.evaluate((node) => {
        const box = node.getBoundingClientRect();
        const table = node.closest('table')!.getBoundingClientRect();

        return { x: box.x - table.x, y: box.y - table.y, width: box.width, height: box.height };
      });
    const before = await geometry();

    await target.hover();
    expect(await geometry()).toEqual(before);

    const row = calendar.locator('[data-calendar-current] tr:has(button[data-date="2024-02-11"])');
    const color = await row.evaluate((node) =>
      getComputedStyle(node, '::after').borderTopColor.match(/\d+/g)!.map(Number),
    );
    const screenshot = await row.screenshot({
      path: testInfo.outputPath(`preview-${width}.png`),
      animations: 'disabled',
    });
    const lengths = await page.evaluate(
      async ({ png, stroke }) => {
        const image = new Image();

        image.src = `data:image/png;base64,${png}`;
        await image.decode();

        const canvas = document.createElement('canvas');

        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d')!;

        context.drawImage(image, 0, 0);

        const samples = [3, 4, 5, 6].map((y) => {
          const pixels = context.getImageData(0, y, image.width, 1).data;
          const runs: number[] = [];
          let length = 0;

          for (let x = 0; x < image.width; x += 1) {
            const matches = stroke
              .slice(0, 3)
              .every((channel, index) => Math.abs(pixels[x * 4 + index]! - channel) < 40);

            if (matches) {
              length += 1;
            } else if (length) {
              runs.push(length);
              length = 0;
            }
          }

          return runs;
        });

        return samples.sort((a, b) => b.length - a.length)[0]!;
      },
      { png: screenshot.toString('base64'), stroke: color },
    );

    expect(lengths.length).toBeGreaterThan(20);
    expect(Math.max(...lengths.slice(1, -1))).toBeLessThanOrEqual(4);
  }

  await calendar.screenshot({ path: testInfo.outputPath('preview-calendar.png'), animations: 'disabled' });
});

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
