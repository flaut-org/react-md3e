/// <reference lib="esnext.temporal" preserve="true" />

import type { ComponentPropsWithRef, ComponentType, ReactNode } from 'react';

/** Dates have no time zone. Exact instants require an explicit timezone. */
export type CalendarDateInput =
  string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant;
export type CalendarValueFormat = 'temporal' | 'iso';
export type CalendarValue<Format extends CalendarValueFormat = 'temporal'> = Format extends 'iso'
  ? string
  : Temporal.PlainDate;
export type CalendarView = 'day' | 'month' | 'year';
export type CalendarSelectionState = 'partial' | 'finish';

export interface CalendarLocaleText {
  readonly previousMonth: string;
  readonly nextMonth: string;
  readonly calendarLabel: string;
  readonly loading: string;
  readonly weekNumber: string;
  readonly switchView: (view: CalendarView) => string;
}

export interface CalendarDayState {
  readonly day: Temporal.PlainDate;
  readonly selected: boolean;
  readonly today: boolean;
  readonly outsideCurrentMonth: boolean;
  readonly disabled: boolean;
  readonly isHighlighting?: boolean;
  readonly isStartOfHighlighting?: boolean;
  readonly isEndOfHighlighting?: boolean;
  readonly isPreviewing?: boolean;
  readonly isStartOfPreviewing?: boolean;
  readonly isEndOfPreviewing?: boolean;
}

/** Custom day slots must forward the ref, events, ARIA attributes and tabIndex to their button. */
export type CalendarDayProps = Omit<ComponentPropsWithRef<'button'>, 'value' | 'disabled'> & CalendarDayState;
export type CalendarDaySlotProps = Partial<Omit<CalendarDayProps, 'day'>>;

export interface CalendarSlots {
  readonly day?: ComponentType<CalendarDayProps>;
}

export interface CalendarSlotProps {
  readonly day?: CalendarDaySlotProps | ((state: CalendarDayState) => CalendarDaySlotProps);
}

export interface CalendarClasses {
  readonly root?: string;
  readonly header?: string;
  readonly viewTransitionContainer?: string;
  readonly day?: string;
}

export interface CalendarCommonProps {
  readonly locale?: string;
  readonly localeText?: Partial<CalendarLocaleText>;
  readonly timezone?: string;
  readonly today?: CalendarDateInput;
  readonly referenceDate?: CalendarDateInput;
  readonly minDate?: CalendarDateInput;
  readonly maxDate?: CalendarDateInput;
  readonly disablePast?: boolean;
  readonly disableFuture?: boolean;
  readonly shouldDisableMonth?: (month: Temporal.PlainDate) => boolean;
  readonly shouldDisableYear?: (year: Temporal.PlainDate) => boolean;
  readonly disableHighlightToday?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly autoFocus?: boolean;
  readonly reduceAnimations?: boolean;
  readonly loading?: boolean;
  readonly renderLoading?: () => ReactNode;
  readonly showDaysOutsideCurrentMonth?: boolean;
  readonly fixedWeekNumber?: number;
  readonly displayWeekNumber?: boolean;
  /** ISO day of week: Monday = 1, Sunday = 7. Defaults to Intl.Locale's first day. */
  readonly weekStartsOn?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  readonly dayOfWeekFormatter?: (day: Temporal.PlainDate) => string;
  readonly onMonthChange?: (month: Temporal.PlainDate) => void;
  readonly onFocusedViewChange?: (view: CalendarView, hasFocus: boolean) => void;
  readonly slots?: CalendarSlots;
  readonly slotProps?: CalendarSlotProps;
  readonly classes?: CalendarClasses;
}

export type CalendarProps<Format extends CalendarValueFormat = 'temporal'> = Omit<
  ComponentPropsWithRef<'div'>,
  'defaultValue' | 'onChange' | 'children' | 'autoFocus'
> &
  CalendarCommonProps & {
    readonly value?: CalendarDateInput | null;
    readonly defaultValue?: CalendarDateInput | null;
    /** Callback representation; inputs accept either representation regardless of this setting. */
    readonly valueFormat?: Format;
    readonly onChange?: (
      value: CalendarValue<Format>,
      selectionState: CalendarSelectionState,
      selectedView: CalendarView,
    ) => void;
    readonly views?: readonly CalendarView[];
    readonly view?: CalendarView;
    readonly openTo?: CalendarView;
    readonly onViewChange?: (view: CalendarView) => void;
    readonly onYearChange?: (year: Temporal.PlainDate) => void;
    readonly shouldDisableDate?: (day: Temporal.PlainDate) => boolean;
    readonly monthsPerRow?: 3 | 4;
    readonly yearsPerRow?: 3 | 4;
    readonly yearsOrder?: 'asc' | 'desc';
    /** Optional controlled display/focus for composing multiple calendars. */
    readonly currentMonth?: CalendarDateInput;
    readonly focusedDate?: CalendarDateInput | null;
    readonly onFocusedDateChange?: (day: Temporal.PlainDate) => void;
  };
