'use client';

import { calendarValue } from '../calendar/calendar-date';
import type { CalendarValueFormat } from '../calendar/calendar.types';
import { DatePickerPanel } from '../date-picker-panel/date-picker-panel.component';
import { normalizeDates } from '../date-entry/date-entry-validation';
import type { DateRangePickerProps } from './date-range-picker.types';
import type { RangeCalendarValue } from '../range-calendar/range-calendar.types';

const emptyRange = [null, null] as const;

export function DateRangePicker<Format extends CalendarValueFormat = 'temporal'>({
  value,
  defaultValue = emptyRange,
  valueFormat,
  onChange,
  onAccept,
  onError,
  format,
  localeText,
  clearable,
  fieldType,
  startLabel,
  endLabel,
  startName,
  endName,
  variant,
  open,
  defaultOpen,
  onOpen,
  onClose,
  closeOnSelect,
  defaultMode,
  fullScreen,
  container,
  reduceAnimations,
  slotProps,
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
  calendars,
  rangePosition,
  defaultRangePosition,
  onRangePositionChange,
  disableAutoMonthSwitching,
  disableDragEditing,
  onMonthChange,
  weekStartsOn,
  slots,
  showDaysOutsideCurrentMonth,
  fixedWeekNumber,
  displayWeekNumber,
  disableHighlightToday,
  loading,
  renderLoading,
  ...fieldProps
}: DateRangePickerProps<Format>) {
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
  const rangeCalendarProps = {
    ...(calendars ? { calendars } : {}),
    ...(rangePosition ? { rangePosition } : {}),
    ...(defaultRangePosition ? { defaultRangePosition } : {}),
    ...(onRangePositionChange ? { onRangePositionChange } : {}),
    ...(disableAutoMonthSwitching !== undefined ? { disableAutoMonthSwitching } : {}),
    ...(disableDragEditing !== undefined ? { disableDragEditing } : {}),
    ...(onMonthChange ? { onMonthChange } : {}),
    ...(weekStartsOn ? { weekStartsOn } : {}),
    ...(slots ? { slots } : {}),
    ...(showDaysOutsideCurrentMonth !== undefined ? { showDaysOutsideCurrentMonth } : {}),
    ...(fixedWeekNumber ? { fixedWeekNumber } : {}),
    ...(displayWeekNumber !== undefined ? { displayWeekNumber } : {}),
    ...(disableHighlightToday !== undefined ? { disableHighlightToday } : {}),
    ...(loading !== undefined ? { loading } : {}),
    ...(renderLoading ? { renderLoading } : {}),
  };
  const output = (dates: readonly (Temporal.PlainDate | null)[]): RangeCalendarValue<Format> => [
    dates[0] ? calendarValue(dates[0], valueFormat) : null,
    dates[1] ? calendarValue(dates[1], valueFormat) : null,
  ];

  if (defaultValue.length !== 2 || (value !== undefined && value.length !== 2)) {
    throw new TypeError('DateRangePicker values must contain exactly two endpoints.');
  }

  return (
    <DatePickerPanel
      range
      value={value === undefined ? undefined : normalizeDates(value, timezone)}
      defaultValue={normalizeDates(defaultValue, timezone)}
      rules={rules}
      fieldProps={fieldProps}
      rangeCalendarProps={rangeCalendarProps}
      shouldDisableDate={shouldDisableDate}
      format={format}
      localeText={localeText}
      clearable={clearable}
      fieldType={fieldType}
      startLabel={startLabel}
      endLabel={endLabel}
      startName={startName}
      endName={endName}
      {...(variant ? { variant } : {})}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpen ? { onOpen } : {})}
      {...(onClose ? { onClose } : {})}
      {...(closeOnSelect !== undefined ? { closeOnSelect } : {})}
      {...(defaultMode ? { defaultMode } : {})}
      {...(fullScreen !== undefined ? { fullScreen } : {})}
      {...(container !== undefined ? { container } : {})}
      {...(reduceAnimations !== undefined ? { reduceAnimations } : {})}
      {...(slotProps ? { slotProps } : {})}
      onChange={(next, context) => onChange?.(output(next), context)}
      onAccept={(next, context) => onAccept?.(output(next), context)}
      onError={(error, next) => onError?.(error, output(next))}
    />
  );
}
