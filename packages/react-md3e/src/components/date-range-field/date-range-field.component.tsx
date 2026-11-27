'use client';

import { useRef, useState } from 'react';
import { calendarValue } from '../calendar/calendar-date';
import type { CalendarValueFormat } from '../calendar/calendar.types';
import { DateEntry } from '../date-entry/date-entry.component';
import { normalizeDates } from '../date-entry/date-entry-validation';
import type { DateValidationError } from '../date-entry/date-entry.types';
import type { DateRangeFieldProps } from './date-range-field.types';

const emptyRange = [null, null] as const;

export function DateRangeField<Format extends CalendarValueFormat = 'temporal'>({
  value,
  defaultValue = emptyRange,
  valueFormat,
  onChange,
  onError,
  format,
  localeText,
  clearable,
  fieldType,
  startLabel,
  endLabel,
  startName,
  endName,
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
}: DateRangeFieldProps<Format>) {
  const [uncontrolled, setUncontrolled] = useState(() => normalizeDates(defaultValue, timezone));
  const dates = value === undefined ? uncontrolled : normalizeDates(value, timezone);
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

  if (dates.length !== 2) {
    throw new TypeError('DateRangeField values must contain exactly two endpoints.');
  }

  return (
    <DateEntry
      values={dates}
      rules={rules}
      fieldProps={fieldProps}
      format={format}
      localeText={localeText}
      clearable={clearable}
      fieldType={fieldType}
      startLabel={startLabel}
      endLabel={endLabel}
      startName={startName}
      endName={endName}
      shouldDisableDate={shouldDisableDate}
      onValuesChange={(next, context) => {
        if (value === undefined) {
          setUncontrolled([...next]);
        }

        onChange?.(
          [next[0] ? calendarValue(next[0], valueFormat) : null, next[1] ? calendarValue(next[1], valueFormat) : null],
          context,
        );
      }}
      onValidation={(error) => {
        if (lastError.current !== error) {
          lastError.current = error;
          onError?.(error, [
            dates[0] ? calendarValue(dates[0], valueFormat) : null,
            dates[1] ? calendarValue(dates[1], valueFormat) : null,
          ]);
        }
      }}
      onReset={() => {
        if (value === undefined) {
          setUncontrolled(normalizeDates(defaultValue, timezone));
        }
      }}
    />
  );
}
