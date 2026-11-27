'use client';

import { calendarValue, toCalendarDate } from '../calendar/calendar-date';
import type { CalendarValueFormat } from '../calendar/calendar.types';
import { DatePickerPanel } from '../date-picker-panel/date-picker-panel.component';
import type { DatePickerProps } from './date-picker.types';

export function DatePicker<Format extends CalendarValueFormat = 'temporal'>({
  value,
  defaultValue = null,
  valueFormat,
  onChange,
  onAccept,
  onError,
  format,
  localeText,
  clearable,
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
  views,
  view,
  openTo,
  onViewChange,
  onMonthChange,
  onYearChange,
  slots,
  showDaysOutsideCurrentMonth,
  weekStartsOn,
  disableHighlightToday,
  fixedWeekNumber,
  displayWeekNumber,
  loading,
  renderLoading,
  monthsPerRow,
  yearsPerRow,
  yearsOrder,
  ...fieldProps
}: DatePickerProps<Format>) {
  const normalize = (day: typeof defaultValue) => (day === null ? null : toCalendarDate(day, timezone));
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
  const calendarProps = {
    ...(views ? { views } : {}),
    ...(view ? { view } : {}),
    ...(openTo ? { openTo } : {}),
    ...(onViewChange ? { onViewChange } : {}),
    ...(onMonthChange ? { onMonthChange } : {}),
    ...(onYearChange ? { onYearChange } : {}),
    ...(slots ? { slots } : {}),
    ...(showDaysOutsideCurrentMonth !== undefined ? { showDaysOutsideCurrentMonth } : {}),
    ...(weekStartsOn ? { weekStartsOn } : {}),
    ...(disableHighlightToday !== undefined ? { disableHighlightToday } : {}),
    ...(fixedWeekNumber ? { fixedWeekNumber } : {}),
    ...(displayWeekNumber !== undefined ? { displayWeekNumber } : {}),
    ...(loading !== undefined ? { loading } : {}),
    ...(renderLoading ? { renderLoading } : {}),
    ...(monthsPerRow ? { monthsPerRow } : {}),
    ...(yearsPerRow ? { yearsPerRow } : {}),
    ...(yearsOrder ? { yearsOrder } : {}),
  };

  return (
    <DatePickerPanel
      value={value === undefined ? undefined : [normalize(value)]}
      defaultValue={[normalize(defaultValue)]}
      rules={rules}
      fieldProps={fieldProps}
      calendarProps={calendarProps}
      shouldDisableDate={shouldDisableDate}
      format={format}
      localeText={localeText}
      clearable={clearable}
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
      onChange={(next, context) => onChange?.(next[0] ? calendarValue(next[0], valueFormat) : null, context)}
      onAccept={(next, context) => onAccept?.(next[0] ? calendarValue(next[0], valueFormat) : null, context)}
      onError={(error, next) => onError?.(error, next[0] ? calendarValue(next[0], valueFormat) : null)}
    />
  );
}
