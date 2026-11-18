import { toCalendarDate } from '../calendar/calendar-date';
import type { RangeCalendarInput, RangePosition } from './range-calendar.types';

export type PlainDateRange = readonly [Temporal.PlainDate | null, Temporal.PlainDate | null];

export function toDateRange(value: RangeCalendarInput, timezone?: string): PlainDateRange {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new TypeError('RangeCalendar values must contain exactly two endpoints.');
  }

  const range = value.map((day) => (day === null ? null : toCalendarDate(day, timezone)));
  const start = range[0] ?? null;
  const end = range[1] ?? null;

  if (start && end && Temporal.PlainDate.compare(start, end) > 0) {
    throw new RangeError('RangeCalendar start must be on or before end.');
  }

  return [start, end];
}

export function isInRange(day: Temporal.PlainDate, range: PlainDateRange) {
  return Boolean(
    range[0] &&
    range[1] &&
    Temporal.PlainDate.compare(day, range[0]) >= 0 &&
    Temporal.PlainDate.compare(day, range[1]) <= 0,
  );
}

export function selectRangeDate(
  day: Temporal.PlainDate,
  range: PlainDateRange,
  position: RangePosition,
): PlainDateRange {
  const [start, end] = range;

  if (position === 'start') {
    return [day, end && Temporal.PlainDate.compare(day, end) <= 0 ? end : null];
  }

  if (!start || Temporal.PlainDate.compare(day, start) < 0) {
    return [day, null];
  }

  return [start, day];
}
