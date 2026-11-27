'use client';

import { useRef, useState } from 'react';
import { calendarValue, toCalendarDate } from '../calendar/calendar-date';
import type { CalendarValueFormat } from '../calendar/calendar.types';
import { DateEntry } from '../date-entry/date-entry.component';
import type { DateValidationError } from '../date-entry/date-entry.types';
import type { DateFieldProps } from './date-field.types';

export function DateField<Format extends CalendarValueFormat = 'temporal'>({
  value,
  defaultValue = null,
  valueFormat,
  onChange,
  onError,
  format,
  localeText,
  clearable,
  locale,
  timezone,
  today,
  referenceDate,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  ...fieldProps
}: DateFieldProps<Format>) {
  const [uncontrolled, setUncontrolled] = useState(() =>
    defaultValue === null ? null : toCalendarDate(defaultValue, timezone),
  );
  const supplied = value === undefined ? uncontrolled : value;
  const date = supplied === null ? null : toCalendarDate(supplied, timezone);
  const lastError = useRef<DateValidationError | undefined>(undefined);
  const rules = {
    ...(locale !== undefined ? { locale } : {}),
    ...(timezone !== undefined ? { timezone } : {}),
    ...(today !== undefined ? { today } : {}),
    ...(referenceDate !== undefined ? { referenceDate } : {}),
    ...(minDate !== undefined ? { minDate } : {}),
    ...(maxDate !== undefined ? { maxDate } : {}),
    ...(disablePast !== undefined ? { disablePast } : {}),
    ...(disableFuture !== undefined ? { disableFuture } : {}),
    ...(shouldDisableMonth ? { shouldDisableMonth } : {}),
    ...(shouldDisableYear ? { shouldDisableYear } : {}),
  };

  return (
    <DateEntry
      values={[date]}
      rules={rules}
      fieldProps={fieldProps}
      format={format}
      localeText={localeText}
      clearable={clearable}
      shouldDisableDate={shouldDisableDate}
      onValuesChange={(dates, context) => {
        const next = dates[0] ?? null;

        if (value === undefined) {
          setUncontrolled(next);
        }

        onChange?.(next ? calendarValue(next, valueFormat) : null, context);
      }}
      onValidation={(error) => {
        if (lastError.current !== error) {
          lastError.current = error;
          onError?.(error, date ? calendarValue(date, valueFormat) : null);
        }
      }}
      onReset={() => {
        if (value === undefined) {
          setUncontrolled(defaultValue === null ? null : toCalendarDate(defaultValue, timezone));
        }
      }}
    />
  );
}
