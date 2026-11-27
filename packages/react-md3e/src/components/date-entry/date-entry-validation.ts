import { calendarBounds, monthStart, toCalendarDate } from '../calendar/calendar-date';
import type { DateValidationError, DateValidationProps } from './date-entry.types';
import type { RangePosition } from '../range-calendar/range-calendar.types';

export function validateDate(
  day: Temporal.PlainDate | null,
  rules: DateValidationProps,
  bounds = calendarBounds(rules),
): DateValidationError {
  if (!day) {
    return null;
  }

  if (rules.disablePast && Temporal.PlainDate.compare(day, bounds.today) < 0) {
    return 'disablePast';
  }

  if (rules.disableFuture && Temporal.PlainDate.compare(day, bounds.today) > 0) {
    return 'disableFuture';
  }

  if (Temporal.PlainDate.compare(day, bounds.min) < 0) {
    return 'minDate';
  }

  if (Temporal.PlainDate.compare(day, bounds.max) > 0) {
    return 'maxDate';
  }

  if (rules.shouldDisableYear?.(day.with({ month: 1, day: 1 }))) {
    return 'shouldDisableYear';
  }

  if (rules.shouldDisableMonth?.(monthStart(day))) {
    return 'shouldDisableMonth';
  }

  return rules.shouldDisableDate?.(day) ? 'shouldDisableDate' : null;
}

export function normalizeDates(values: readonly (DateValidationProps['minDate'] | null)[], timezone?: string) {
  return values.map((day) => (day == null ? null : toCalendarDate(day, timezone)));
}

export function datesKey(values: readonly (Temporal.PlainDate | null)[]) {
  return values.map((day) => day?.toString() ?? '').join('/');
}

export function validateDates(
  values: readonly (Temporal.PlainDate | null)[],
  rules: DateValidationProps,
  required = false,
  shouldDisableDate?: (day: Temporal.PlainDate, position: RangePosition) => boolean,
): DateValidationError {
  const bounds = calendarBounds(rules);

  for (const [index, day] of values.entries()) {
    const error = validateDate(
      day,
      {
        ...rules,
        shouldDisableDate: (date) =>
          shouldDisableDate
            ? shouldDisableDate(date, index === 0 ? 'start' : 'end')
            : Boolean(rules.shouldDisableDate?.(date)),
      },
      bounds,
    );

    if (error) {
      return error;
    }
  }

  if (values.length === 2) {
    const [start, end] = values;

    if (start && end && Temporal.PlainDate.compare(start, end) > 0) {
      return 'invalidRange';
    }

    if (Boolean(start) !== Boolean(end)) {
      return 'incompleteRange';
    }
  }

  return required && values.every((day) => !day) ? 'required' : null;
}
