/// <reference lib="esnext.intl" />

import type { CalendarCommonProps, CalendarDateInput, CalendarValue, CalendarValueFormat } from './calendar.types';

export const defaultLocaleText = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  calendarLabel: 'Calendar',
  loading: 'Loading calendar',
  weekNumber: 'Week',
  switchView: (view: string) => `Choose ${view}`,
};

/** Native Temporal is intentionally not installed or patched by a component import. */
export function requireTemporal() {
  if (typeof Temporal === 'undefined') {
    throw new Error(
      'Calendar requires Temporal. Install a global Temporal polyfill before rendering in older runtimes.',
    );
  }
}

export function toCalendarDate(value: CalendarDateInput, timezone?: string): Temporal.PlainDate {
  requireTemporal();

  const tag = Object.prototype.toString.call(value);

  if (tag === '[object Temporal.Instant]') {
    if (!timezone) {
      throw new TypeError('An Instant requires an explicit Calendar timezone. Pass a PlainDate for date-only values.');
    }

    return Temporal.Instant.from(value.toString()).toZonedDateTimeISO(timezone).toPlainDate();
  }

  if (tag === '[object Temporal.ZonedDateTime]' || (typeof value === 'string' && /\[[^=\]]+\]/.test(value))) {
    const zoned = Temporal.ZonedDateTime.from(value.toString());

    return (timezone ? zoned.withTimeZone(timezone) : zoned).toPlainDate().withCalendar('iso8601');
  }

  if (typeof value === 'string' && /[Tt].*(?:[Zz]|[+-]\d{2}:?\d{2})(?:\[.*\])?$/.test(value)) {
    if (!timezone) {
      throw new TypeError(
        'An ISO instant requires an explicit Calendar timezone. Use YYYY-MM-DD for date-only values.',
      );
    }

    return Temporal.Instant.from(value).toZonedDateTimeISO(timezone).toPlainDate();
  }

  if (typeof value !== 'string' && tag !== '[object Temporal.PlainDate]' && tag !== '[object Temporal.PlainDateTime]') {
    throw new TypeError('Calendar values must be Temporal dates or ISO strings.');
  }

  return Temporal.PlainDate.from(value.toString()).withCalendar('iso8601');
}

export function calendarValue<Format extends CalendarValueFormat>(day: Temporal.PlainDate, format?: Format) {
  return (format === 'iso' ? day.toString() : day) as CalendarValue<Format>;
}

export function monthStart(day: Temporal.PlainDate) {
  return day.with({ day: 1 });
}

export function sameMonth(a: Temporal.PlainDate, b: Temporal.PlainDate) {
  return a.year === b.year && a.month === b.month;
}

export function clampDate(day: Temporal.PlainDate, min: Temporal.PlainDate, max: Temporal.PlainDate) {
  if (Temporal.PlainDate.compare(day, min) < 0) {
    return min;
  }

  if (Temporal.PlainDate.compare(day, max) > 0) {
    return max;
  }

  return day;
}

export function calendarBounds(props: CalendarCommonProps) {
  requireTemporal();

  const today = props.today ? toCalendarDate(props.today, props.timezone) : Temporal.Now.plainDateISO(props.timezone);
  const min = toCalendarDate(props.minDate ?? '1900-01-01', props.timezone);
  const max = toCalendarDate(props.maxDate ?? '2099-12-31', props.timezone);

  if (Temporal.PlainDate.compare(min, max) > 0) {
    throw new RangeError('Calendar minDate must be on or before maxDate.');
  }

  return {
    today,
    min: props.disablePast && Temporal.PlainDate.compare(today, min) > 0 ? today : min,
    max: props.disableFuture && Temporal.PlainDate.compare(today, max) < 0 ? today : max,
  };
}

export function weekInfo(locale: string, weekStartsOn?: number) {
  if (weekStartsOn !== undefined && (!Number.isInteger(weekStartsOn) || weekStartsOn < 1 || weekStartsOn > 7)) {
    throw new RangeError('Calendar weekStartsOn must be an ISO weekday from 1 to 7.');
  }

  const info = new Intl.Locale(locale).getWeekInfo();

  return { firstDay: weekStartsOn ?? info.firstDay };
}

export function weekStart(day: Temporal.PlainDate, firstDay: number) {
  return day.subtract({ days: (day.dayOfWeek - firstDay + 7) % 7 });
}

export function calendarWeeks(month: Temporal.PlainDate, firstDay: number, fixedWeekNumber?: number) {
  if (
    fixedWeekNumber !== undefined &&
    (!Number.isInteger(fixedWeekNumber) || fixedWeekNumber < 1 || fixedWeekNumber > 6)
  ) {
    throw new RangeError('Calendar fixedWeekNumber must be an integer from 1 to 6.');
  }

  const first = weekStart(monthStart(month), firstDay);
  const offset = first.until(monthStart(month)).days;
  const count = Math.max(Math.ceil((offset + month.daysInMonth) / 7), fixedWeekNumber ?? 0);

  return Array.from({ length: count }, (_, row) =>
    Array.from({ length: 7 }, (__, column) => first.add({ days: row * 7 + column })),
  );
}

export function weekNumber(day: Temporal.PlainDate) {
  // Use the ISO week containing this row's Thursday, also for Sunday-first layouts.
  return day.add({ days: (4 - day.dayOfWeek + 7) % 7 }).weekOfYear ?? 1;
}

export function dateFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  // PlainDate formatting has no time-zone conversion, including at DST boundaries.
  return new Intl.DateTimeFormat(locale, { ...options, calendar: 'gregory' });
}

export function findEnabledDate(
  day: Temporal.PlainDate,
  direction: number,
  min: Temporal.PlainDate,
  max: Temporal.PlainDate,
  isDisabled: (date: Temporal.PlainDate) => boolean,
) {
  let candidate = clampDate(day, min, max);

  while (Temporal.PlainDate.compare(candidate, min) >= 0 && Temporal.PlainDate.compare(candidate, max) <= 0) {
    if (!isDisabled(candidate)) {
      return candidate;
    }

    candidate = candidate.add({ days: direction });
  }

  return null;
}
