import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { RangeCalendar } from '@flaut-travel/react-md3e/range-calendar';

const { isInRange, selectRangeDate, toDateRange } = await import(
  new URL('../../../../dist/components/range-calendar/range-calendar-date.js', import.meta.url)
);

const date = (value) => Temporal.PlainDate.from(value);
const strings = (value) => value.map((day) => day?.toString() ?? null);

test('range arithmetic handles partial ranges, endpoint edits, same-day ranges and reversed clicks', () => {
  const range = toDateRange(['2024-02-27', '2024-03-04']);

  assert.deepEqual(strings(selectRangeDate(date('2024-02-28'), range, 'start')), ['2024-02-28', '2024-03-04']);
  assert.deepEqual(strings(selectRangeDate(date('2024-03-06'), range, 'start')), ['2024-03-06', null]);
  assert.deepEqual(strings(selectRangeDate(date('2024-02-20'), range, 'end')), ['2024-02-20', null]);
  assert.deepEqual(strings(selectRangeDate(date('2024-02-27'), range, 'end')), ['2024-02-27', '2024-02-27']);
  assert.deepEqual(strings(selectRangeDate(date('2024-03-01'), [null, null], 'end')), ['2024-03-01', null]);
  assert.equal(isInRange(date('2024-02-29'), range), true);
  assert.equal(isInRange(date('2024-03-05'), range), false);
  assert.throws(() => toDateRange(['2024-03-04', '2024-02-27']), /start/);
});

test('RangeCalendar composes Calendar grids with contiguous ranges and unique headings', () => {
  const html = renderToString(
    createElement(RangeCalendar, { defaultValue: ['2024-02-27', '2024-03-04'], today: '2024-02-29' }),
  );
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);

  assert.equal([...html.matchAll(/role="grid"/g)].length, 2);
  assert.equal([...html.matchAll(/aria-multiselectable="true"/g)].length, 2);
  assert.equal([...html.matchAll(/<td aria-selected="true"/g)].length, 7);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal([...html.matchAll(/<table[\s\S]*?<\/table>/g)].join('').match(/tabindex="0"/g).length, 1);
});

test('range calendars validate panel positions and support a centered current month', () => {
  assert.throws(
    () => renderToString(createElement(RangeCalendar, { calendars: 1, currentMonthCalendarPosition: 2 })),
    /positions/,
  );

  const html = renderToString(
    createElement(RangeCalendar, {
      calendars: 3,
      currentMonthCalendarPosition: 2,
      defaultValue: ['2024-02-27', '2024-03-04'],
      today: '2024-02-29',
    }),
  );

  for (const month of ['January 2024', 'February 2024', 'March 2024']) {
    assert.ok(html.includes(month));
  }
});
