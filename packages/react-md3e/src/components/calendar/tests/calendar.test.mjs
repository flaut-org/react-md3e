import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Calendar } from '@flaut-travel/react-md3e/calendar';

const { calendarBounds, calendarWeeks, dateFormatter, findEnabledDate, toCalendarDate, weekInfo, weekNumber } =
  await import(new URL('../../../../dist/components/calendar/calendar-date.js', import.meta.url));
const { keyboardDate } = await import(
  new URL('../../../../dist/components/calendar/calendar-keyboard.js', import.meta.url)
);

const date = (value) => Temporal.PlainDate.from(value);

test('dates use Temporal, validate ISO inputs, and reject legacy Date and arbitrary objects', () => {
  for (const value of [new Date(), 0, {}, '2024-02-30', 'not a date']) {
    assert.throws(() => toCalendarDate(value));
  }

  assert.equal(toCalendarDate('2024-02-29').toString(), '2024-02-29');
  assert.equal(toCalendarDate(Temporal.PlainDateTime.from('2024-02-29T23:59')).toString(), '2024-02-29');
  assert.equal(toCalendarDate(date('2024-02-29'), 'Asia/Tokyo').toString(), '2024-02-29');
});

test('only exact instants need zones; zoned dates keep their own date unless a zone is requested', () => {
  const instant = Temporal.Instant.from('2024-03-01T01:30Z');
  const zoned = instant.toZonedDateTimeISO('Asia/Tokyo');

  assert.throws(() => toCalendarDate(instant), /explicit Calendar timezone/);
  assert.throws(() => toCalendarDate('2024-03-01T01:30Z'), /explicit Calendar timezone/);
  assert.equal(toCalendarDate(instant, 'America/Los_Angeles').toString(), '2024-02-29');
  assert.equal(toCalendarDate('2024-03-01T01:30Z', 'UTC').toString(), '2024-03-01');
  assert.equal(toCalendarDate(zoned).toString(), '2024-03-01');
  assert.equal(toCalendarDate(zoned, 'America/Los_Angeles').toString(), '2024-02-29');
  assert.equal(toCalendarDate(zoned.toString()).toString(), '2024-03-01');
});

test('month grids handle leap years, locale week starts and fixed row counts', () => {
  assert.equal(weekInfo('en-US').firstDay, 7);
  assert.equal(weekInfo('uk-UA').firstDay, 1);
  assert.equal(weekInfo('en-US', 1).firstDay, 1);
  assert.equal(calendarWeeks(date('2024-02-01'), 1)[0][0].toString(), '2024-01-29');
  assert.equal(calendarWeeks(date('2024-02-01'), 1, 6).length, 6);

  for (const [year, length] of [
    [1900, 28],
    [2000, 29],
    [2024, 29],
  ]) {
    const days = calendarWeeks(date(`${year}-02-01`), 1)
      .flat()
      .filter((day) => day.month === 2);

    assert.equal(days.length, length);
    assert.equal(days.at(-1).day, length);
  }

  for (const invalid of [0, 7, 2.5, NaN]) {
    assert.throws(() => calendarWeeks(date('2024-02-01'), 1, invalid), /fixedWeekNumber/);
  }

  assert.equal(weekNumber(date('2020-12-28')), 53);
  assert.equal(weekNumber(date('2021-01-04')), 1);
});

test('keyboard date math constrains leap days, moves by weeks and mirrors horizontal arrows', () => {
  const leap = date('2024-02-29');

  assert.equal(keyboardDate(leap, 'PageDown', true, false, 1).toString(), '2025-02-28');
  assert.equal(keyboardDate(date('2024-01-31'), 'PageDown', false, false, 1).toString(), '2024-02-29');
  assert.equal(keyboardDate(leap, 'ArrowDown', false, false, 1).toString(), '2024-03-07');
  assert.equal(keyboardDate(leap, 'Home', false, false, 1).toString(), '2024-02-26');
  assert.equal(keyboardDate(leap, 'End', false, false, 1).toString(), '2024-03-03');
  assert.equal(keyboardDate(leap, 'ArrowLeft', false, true, 1).toString(), '2024-03-01');
  assert.equal(keyboardDate(leap, 'Escape', false, false, 1), null);
});

test('bounds and enabled-day searches respect disabled days and wholly disabled months', () => {
  const min = date('2024-02-05');
  const max = date('2024-02-29');
  const bounds = calendarBounds({ today: '2024-02-15', minDate: min, maxDate: max, disablePast: true });

  assert.equal(bounds.min.toString(), '2024-02-15');
  assert.equal(findEnabledDate(date('2024-02-14'), 1, min, max, (day) => day.day === 14).day, 15);
  assert.equal(findEnabledDate(date('2024-02-14'), -1, min, max, (day) => day.day === 14).day, 13);
  assert.equal(
    findEnabledDate(min, 1, min, max, () => true),
    null,
  );
  assert.throws(() => calendarBounds({ minDate: max, maxDate: min }), /minDate/);
});

test('Intl formats PlainDate without a zone, independently of the host TZ at DST changes', () => {
  assert.match(dateFormatter('uk-UA', { month: 'long', year: 'numeric' }).format(date('2024-03-10')), /березень/);

  const script =
    'const day = Temporal.PlainDate.from("2024-03-10"); console.log(new Intl.DateTimeFormat("en-US", {dateStyle:"full"}).format(day));';
  const outputs = ['UTC', 'America/New_York', 'Pacific/Kiritimati'].map((timezone) =>
    execFileSync(process.execPath, ['-e', script], { env: { ...process.env, TZ: timezone }, encoding: 'utf8' }),
  );

  assert.equal(new Set(outputs).size, 1);
  assert.match(outputs[0], /Sunday, March 10, 2024/);
});

test('server markup contains a labeled inline grid, selected day, today, and exactly one tab stop', () => {
  const html = renderToString(createElement(Calendar, { defaultValue: '2024-02-29', today: '2024-02-29' }));

  assert.match(html, /role="grid"/);

  const selected = html.match(/<button[^>]*data-date="2024-02-29"[^>]*>/)?.[0] ?? '';

  assert.match(selected, /data-selected="true"/);
  assert.match(selected, /data-today="true"/);
  assert.equal([...html.matchAll(/<table[\s\S]*?<\/table>/g)].join('').match(/tabindex="0"/g).length, 1);
  assert.doesNotMatch(html, /role="dialog"|<input/);
  assert.throws(() => renderToString(createElement(Calendar, { views: [] })), /unique views/);
});

test('package imports need no Temporal global until Calendar actually renders', () => {
  const script =
    'delete globalThis.Temporal; const {Calendar} = await import("@flaut-travel/react-md3e"); const {createElement} = await import("react"); const {renderToString} = await import("react-dom/server"); try { renderToString(createElement(Calendar)); process.exit(1); } catch(error) { console.log(error.message); }';
  const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' });

  assert.match(output, /requires Temporal/);
});
