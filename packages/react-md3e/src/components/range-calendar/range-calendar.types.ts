import type { ComponentPropsWithRef } from 'react';
import type {
  CalendarCommonProps,
  CalendarDateInput,
  CalendarSelectionState,
  CalendarValue,
  CalendarValueFormat,
} from '../calendar/calendar.types';

export type RangePosition = 'start' | 'end';
export type RangeCalendarInput = readonly [CalendarDateInput | null, CalendarDateInput | null];
export type RangeCalendarValue<Format extends CalendarValueFormat = 'temporal'> = [
  CalendarValue<Format> | null,
  CalendarValue<Format> | null,
];

export type RangeCalendarProps<Format extends CalendarValueFormat = 'temporal'> = Omit<
  ComponentPropsWithRef<'div'>,
  'defaultValue' | 'onChange' | 'children' | 'autoFocus'
> &
  Omit<CalendarCommonProps, 'referenceDate'> & {
    readonly value?: RangeCalendarInput;
    readonly defaultValue?: RangeCalendarInput;
    readonly valueFormat?: Format;
    readonly onChange?: (
      value: RangeCalendarValue<Format>,
      selectionState: CalendarSelectionState,
      selectedView: 'day',
    ) => void;
    readonly calendars?: 1 | 2 | 3;
    readonly currentMonthCalendarPosition?: 1 | 2 | 3;
    readonly referenceDate?: CalendarDateInput | RangeCalendarInput;
    readonly rangePosition?: RangePosition;
    readonly defaultRangePosition?: RangePosition;
    readonly availableRangePositions?: readonly RangePosition[];
    readonly onRangePositionChange?: (position: RangePosition) => void;
    readonly shouldDisableDate?: (day: Temporal.PlainDate, position: RangePosition) => boolean;
    readonly disableAutoMonthSwitching?: boolean;
    readonly disableDragEditing?: boolean;
    readonly currentMonth?: CalendarDateInput;
    readonly view?: 'day';
    readonly views?: readonly ['day'];
    readonly openTo?: 'day';
    readonly onViewChange?: (view: 'day') => void;
  };
