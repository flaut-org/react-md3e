import type { CalendarProps, CalendarSlotProps, CalendarValueFormat } from '../calendar/calendar.types';
import type { DateFieldProps } from '../date-field/date-field.types';
import type { TextFieldProps } from '../text-field';
import type { DialogContainer } from '../dialog';

export type DatePickerVariant = 'docked' | 'modal' | 'responsive';
export type DatePickerCloseReason = 'accept' | 'cancel' | 'escapeKeyDown' | 'clickAway' | 'triggerClick' | 'focusOut';
export interface DatePickerPresentationProps {
  readonly variant?: DatePickerVariant;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpen?: () => void;
  readonly onClose?: (reason: DatePickerCloseReason) => void;
  readonly closeOnSelect?: boolean;
  readonly defaultMode?: 'calendar' | 'input';
  /** Range modals fill compact viewports by default; override explicitly when needed. */
  readonly fullScreen?: boolean;
  readonly container?: DialogContainer;
  readonly reduceAnimations?: boolean;
  readonly slotProps?: CalendarSlotProps & { readonly textField?: Partial<TextFieldProps> };
}

export type DatePickerProps<Format extends CalendarValueFormat = 'temporal'> = Omit<DateFieldProps<Format>, 'variant'> &
  DatePickerPresentationProps &
  Pick<
    CalendarProps<Format>,
    | 'views'
    | 'view'
    | 'openTo'
    | 'onViewChange'
    | 'onMonthChange'
    | 'onYearChange'
    | 'slots'
    | 'showDaysOutsideCurrentMonth'
    | 'weekStartsOn'
    | 'disableHighlightToday'
    | 'fixedWeekNumber'
    | 'displayWeekNumber'
    | 'loading'
    | 'renderLoading'
    | 'monthsPerRow'
    | 'yearsPerRow'
    | 'yearsOrder'
  > & {
    readonly onAccept?: DateFieldProps<Format>['onChange'];
  };
