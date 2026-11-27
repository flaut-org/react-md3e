import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { DateField } from '@flaut-travel/react-md3e/date-field';
import { DateRangeField } from '@flaut-travel/react-md3e/date-range-field';
import { DatePicker } from '@flaut-travel/react-md3e/date-picker';

const { createDateFormat } = await import(
  new URL('../../../../dist/components/date-entry/date-entry-format.js', import.meta.url)
);
const { validateDates } = await import(
  new URL('../../../../dist/components/date-entry/date-entry-validation.js', import.meta.url)
);
const { createDateMask } = await import(
  new URL('../../../../dist/components/date-entry/date-entry-mask.js', import.meta.url)
);
const date = (text) => Temporal.PlainDate.from(text);

test('section masks insert locale separators and advance independently without rolling invalid dates', () => {
  for (const [locale, digits, expected] of [
    ['en-US', '02292024', '02/29/2024'],
    ['uk-UA', '29022024', '29.02.2024'],
  ]) {
    const mask = createDateMask(createDateFormat(locale), false);
    let state = { values: mask.read(''), index: 0, buffer: '' };

    for (const digit of digits) {
      state = mask.digit(state.values, state.index, state.buffer, digit);
    }

    assert.equal(mask.serialize(state.values), expected);
    assert.equal(state.index, 2);
  }

  const format = createDateFormat('en-US');
  const mask = createDateMask(format, false);

  assert.equal(mask.render(mask.read('')).value, 'mm/dd/yyyy');
  assert.equal(mask.serialize(mask.read('')), '');
  assert.deepEqual(mask.read('/29/2024'), ['', '29', '2024']);
  assert.equal(mask.render(mask.read('03')).value, '03/dd/yyyy');
  assert.equal(format.parse(mask.serialize(mask.read('02/29/2025'))).error, 'invalidDate');
  assert.equal(mask.canRead('not a date'), false);
  assert.equal(mask.canRead('02/29/2024/01'), false);
  assert.equal(mask.canRead('02/29/2024/'), false);
  assert.equal(mask.canRead('022920240'), false);

  const range = createDateMask(format, true);
  const wrapped = createDateMask(createDateFormat('en-US', '[MM]/[dd]/[yyyy]'), false);

  assert.equal(range.canRead('02/29/2024 – 03/01/2024 – 03/02/2024'), false);
  assert.deepEqual(wrapped.read('[02]/[29]/[2024]'), ['02', '29', '2024']);
});

test('localized numeric entry round-trips leap and DST dates without a Date bridge', () => {
  for (const locale of ['en-US', 'en-GB', 'uk-UA', 'de-DE', 'ar-EG', 'ja-JP']) {
    const formatter = createDateFormat(locale);

    for (const day of ['2024-02-29', '2024-03-10', '2024-11-03']) {
      assert.equal(formatter.parse(formatter.display(date(day))).date.toString(), day);
    }
  }

  assert.equal(createDateFormat('uk-UA').placeholder, 'DD.MM.YYYY');
  assert.equal(createDateFormat('en-US', 'yyyy-MM-dd').parse('2024-02-29').date.toString(), '2024-02-29');
  assert.equal(createDateFormat('en-US').parse('02292024').date.toString(), '2024-02-29');
  assert.equal(createDateFormat('uk-UA').parse('29022024').date.toString(), '2024-02-29');
  assert.equal(createDateFormat('en-US', 'yyyy-MM-dd').parse('20240229').date.toString(), '2024-02-29');
});

test('entry rejects overflow and preserves a distinction between invalid, empty and incomplete dates', () => {
  const formatter = createDateFormat('en-US');

  for (const input of ['02/31/2024', '02/29/2023', '12/32/2024', '13/01/2024']) {
    assert.deepEqual(formatter.parse(input), { date: null, error: 'invalidDate' });
  }

  assert.deepEqual(formatter.parse('02/2'), { date: null, error: 'incompleteDate' });
  assert.deepEqual(formatter.parse(''), { date: null, error: null });
  assert.throws(() => createDateFormat('en-US', 'MMM dd, yyyy'), /numeric/);
  assert.throws(() => createDateFormat('en-US', 'MM/dd/yyyy/yyyy'), /numeric/);
});

test('field and grid rules share inclusive bounds and endpoint predicates', () => {
  const rules = { today: '2024-02-29', minDate: '2024-02-10', maxDate: '2024-03-10' };

  assert.equal(validateDates([date('2024-02-09')], rules), 'minDate');
  assert.equal(validateDates([date('2024-02-10')], rules), null);
  assert.equal(validateDates([date('2024-03-11')], rules), 'maxDate');
  assert.equal(validateDates([date('2024-02-28')], { ...rules, disablePast: true }), 'disablePast');
  assert.equal(validateDates([date('2024-03-01')], { ...rules, disableFuture: true }), 'disableFuture');
  assert.equal(validateDates([date('2024-02-29')], { ...rules, shouldDisableMonth: () => true }), 'shouldDisableMonth');
  assert.equal(validateDates([date('2024-02-29')], { ...rules, shouldDisableYear: () => true }), 'shouldDisableYear');
  assert.equal(
    validateDates([date('2024-02-29')], rules, false, () => true),
    'shouldDisableDate',
  );
  assert.equal(validateDates([null], rules, true), 'required');
  assert.equal(validateDates([null], rules), null);
  assert.equal(validateDates([date('2024-03-01'), date('2024-02-29')], rules), 'invalidRange');
  assert.equal(validateDates([date('2024-02-29'), null], rules), 'incompleteRange');
  assert.equal(validateDates([date('2024-02-29'), date('2024-02-29')], rules), null);
  assert.equal(
    validateDates([date('2024-02-29'), date('2024-03-01')], rules, false, (_day, position) => position === 'end'),
    'shouldDisableDate',
  );
});

test('fields and responsive picker server-render deterministic dates, native form values and no portal', () => {
  for (const Component of [DateField, DatePicker]) {
    const html = renderToString(
      createElement(Component, {
        label: 'Date',
        name: 'date',
        defaultValue: '2024-03-01T01:30Z',
        timezone: 'America/Los_Angeles',
        today: '2024-02-29',
      }),
    );

    assert.match(html, /value="02\/29\/2024"/);
    assert.match(html, /name="date" value="2024-02-29"/);
    assert.doesNotMatch(html, /role="dialog"/);
  }

  const html = renderToString(
    createElement(DateRangeField, { name: 'trip', defaultValue: ['2024-02-29', '2024-03-01'], today: '2024-02-29' }),
  );

  assert.match(html, /name="trip.start" value="2024-02-29"/);
  assert.match(html, /name="trip.end" value="2024-03-01"/);
});
