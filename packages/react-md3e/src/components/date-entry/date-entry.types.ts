import type {
  CalendarCommonProps,
  CalendarLocaleText,
  CalendarProps,
  CalendarSelectionState,
} from '../calendar/calendar.types';

export type DateValidationError =
  | 'invalidDate'
  | 'incompleteDate'
  | 'required'
  | 'minDate'
  | 'maxDate'
  | 'disablePast'
  | 'disableFuture'
  | 'shouldDisableDate'
  | 'shouldDisableMonth'
  | 'shouldDisableYear'
  | 'incompleteRange'
  | 'invalidRange'
  | null;

export interface DateChangeContext {
  readonly validationError: DateValidationError;
  readonly source: 'field' | 'calendar' | 'clear' | 'cancel' | 'accept';
  readonly selectionState?: CalendarSelectionState;
}

export interface DatePickerLocaleText extends CalendarLocaleText {
  readonly chooseDate: string;
  readonly chooseRange: string;
  readonly selectDate: string;
  readonly selectRange: string;
  readonly enterDate: string;
  readonly enterRange: string;
  readonly start: string;
  readonly end: string;
  readonly cancel: string;
  readonly accept: string;
  readonly clear: string;
  readonly calendarMode: string;
  readonly inputMode: string;
  readonly previousMonths: string;
  readonly nextMonths: string;
  readonly error: (error: Exclude<DateValidationError, null>, format: string) => string;
}

export type DateValidationProps = Pick<
  CalendarProps,
  | 'minDate'
  | 'maxDate'
  | 'disablePast'
  | 'disableFuture'
  | 'shouldDisableDate'
  | 'shouldDisableMonth'
  | 'shouldDisableYear'
> &
  Pick<CalendarCommonProps, 'today' | 'timezone' | 'locale' | 'referenceDate'>;
