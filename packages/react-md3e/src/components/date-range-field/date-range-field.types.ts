import type { ReactNode } from 'react';
import type { CalendarValueFormat } from '../calendar/calendar.types';
import type { DateFieldProps } from '../date-field/date-field.types';
import type { DateChangeContext, DateValidationError } from '../date-entry/date-entry.types';
import type { RangeCalendarInput, RangeCalendarValue, RangePosition } from '../range-calendar/range-calendar.types';

export type DateRangeFieldProps<Format extends CalendarValueFormat = 'temporal'> = Omit<
  DateFieldProps<Format>,
  'value' | 'defaultValue' | 'onChange' | 'onError' | 'shouldDisableDate'
> & {
  readonly value?: RangeCalendarInput;
  readonly defaultValue?: RangeCalendarInput;
  readonly onChange?: (value: RangeCalendarValue<Format>, context: DateChangeContext) => void;
  readonly onError?: (error: DateValidationError, value: RangeCalendarValue<Format>) => void;
  readonly shouldDisableDate?: (day: Temporal.PlainDate, position: RangePosition) => boolean;
  readonly fieldType?: 'single-input' | 'multi-input';
  readonly startLabel?: ReactNode;
  readonly endLabel?: ReactNode;
  readonly startName?: string;
  readonly endName?: string;
};
