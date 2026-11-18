'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { calendarDay } from '../calendar.styles';
import type { CalendarDayProps } from '../calendar.types';

export function CalendarDay({
  day,
  selected,
  today,
  outsideCurrentMonth,
  disabled,
  isHighlighting,
  isStartOfHighlighting,
  isEndOfHighlighting,
  isPreviewing,
  isStartOfPreviewing,
  isEndOfPreviewing,
  className,
  children,
  ...props
}: CalendarDayProps) {
  return (
    <BaseButton
      {...props}
      type="button"
      disabled={disabled}
      className={[calendarDay, className].filter(Boolean).join(' ')}
      data-date={day.toString()}
      data-selected={selected}
      data-today={today}
      data-outside={outsideCurrentMonth}
      data-in-range={isHighlighting}
      data-range-start={isStartOfHighlighting}
      data-range-end={isEndOfHighlighting}
      data-preview={isPreviewing}
      data-preview-start={isStartOfPreviewing}
      data-preview-end={isEndOfPreviewing}
    >
      {children ?? day.day}
    </BaseButton>
  );
}
