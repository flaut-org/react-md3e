import type { CalendarValueFormat } from '../calendar/calendar.types';
import type { DateRangeFieldProps } from '../date-range-field/date-range-field.types';
import type { DatePickerPresentationProps } from '../date-picker/date-picker.types';
import type { RangeCalendarProps } from '../range-calendar/range-calendar.types';

export type DateRangePickerProps<Format extends CalendarValueFormat = 'temporal'> = Omit<
  DateRangeFieldProps<Format>,
  'variant'
> &
  DatePickerPresentationProps &
  Pick<
    RangeCalendarProps<Format>,
    | 'calendars'
    | 'rangePosition'
    | 'defaultRangePosition'
    | 'onRangePositionChange'
    | 'disableAutoMonthSwitching'
    | 'disableDragEditing'
    | 'onMonthChange'
    | 'weekStartsOn'
    | 'slots'
    | 'showDaysOutsideCurrentMonth'
    | 'fixedWeekNumber'
    | 'displayWeekNumber'
    | 'disableHighlightToday'
    | 'loading'
    | 'renderLoading'
  > & {
    readonly onAccept?: DateRangeFieldProps<Format>['onChange'];
  };
