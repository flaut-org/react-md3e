import type { CalendarDateInput, CalendarValue, CalendarValueFormat } from '../calendar/calendar.types';
import type { TextFieldProps } from '../text-field/text-field.types';
import type {
  DateChangeContext,
  DatePickerLocaleText,
  DateValidationError,
  DateValidationProps,
} from '../date-entry/date-entry.types';

export type DateFieldProps<Format extends CalendarValueFormat = 'temporal'> = Omit<
  TextFieldProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onError'
  | 'type'
  | 'multiline'
  | 'rows'
  | 'min'
  | 'max'
  | 'slots'
  | 'slotProps'
> &
  DateValidationProps & {
    readonly value?: CalendarDateInput | null;
    readonly defaultValue?: CalendarDateInput | null;
    readonly valueFormat?: Format;
    readonly onChange?: (value: CalendarValue<Format> | null, context: DateChangeContext) => void;
    readonly onError?: (error: DateValidationError, value: CalendarValue<Format> | null) => void;
    /** Numeric Gregorian format: yyyy, MM, dd (YYYY/DD also accepted). Defaults to Intl locale order. */
    readonly format?: string;
    readonly localeText?: Partial<DatePickerLocaleText>;
    readonly clearable?: boolean;
  };
