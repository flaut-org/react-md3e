'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { IconButton } from '../icon-button';
import { CalendarDay } from './calendar-day/calendar-day.component';
import { CalendarChoices } from './calendar-choices/calendar-choices.component';
import { CalendarTransition } from './calendar-transition/calendar-transition.component';
import {
  calendarBounds,
  calendarValue,
  calendarWeeks,
  clampDate,
  dateFormatter,
  defaultLocaleText,
  findEnabledDate,
  monthStart,
  sameMonth,
  toCalendarDate,
  weekInfo,
  weekNumber,
} from './calendar-date';
import { keyboardDate } from './calendar-keyboard';
import { calendarHeader, calendarLoading, calendarRoot, calendarTable, calendarWeekdays } from './calendar.styles';
import type { CalendarDayState, CalendarProps, CalendarValueFormat, CalendarView } from './calendar.types';

const defaultViews: readonly CalendarView[] = ['year', 'day'];

export function Calendar<Format extends CalendarValueFormat = 'temporal'>({
  value,
  defaultValue = null,
  valueFormat,
  onChange,
  locale = 'en-US',
  localeText,
  timezone,
  'today': todayProp,
  referenceDate,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  disableHighlightToday = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  reduceAnimations = false,
  loading = false,
  renderLoading,
  showDaysOutsideCurrentMonth = false,
  fixedWeekNumber,
  displayWeekNumber = false,
  weekStartsOn,
  dayOfWeekFormatter,
  onMonthChange,
  onFocusedViewChange,
  views = defaultViews,
  'view': viewProp,
  openTo = 'day',
  onViewChange,
  onYearChange,
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  monthsPerRow = 3,
  yearsPerRow = 3,
  yearsOrder = 'asc',
  currentMonth,
  'focusedDate': focusedDateProp,
  onFocusedDateChange,
  slots,
  slotProps,
  classes,
  ref,
  className,
  onFocus,
  onBlur,
  'aria-label': ariaLabel,
  'aria-multiselectable': multiselectable,
  ...props
}: CalendarProps<Format>) {
  const [initialBounds] = useState(() =>
    calendarBounds({
      ...(timezone ? { timezone } : {}),
      ...(todayProp !== undefined ? { today: todayProp } : {}),
    }),
  );
  const { today, min, max } = calendarBounds({
    today: todayProp ?? initialBounds.today,
    ...(minDate !== undefined ? { minDate } : {}),
    ...(maxDate !== undefined ? { maxDate } : {}),
    ...(timezone !== undefined ? { timezone } : {}),
    disablePast,
    disableFuture,
  });
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue === null ? null : toCalendarDate(defaultValue, timezone),
  );
  const suppliedValue = value === undefined ? uncontrolledValue : value;
  const selected = suppliedValue === null ? null : toCalendarDate(suppliedValue, timezone);
  const selectedKey = selected?.toString() ?? null;
  const initialDate = selected ?? (referenceDate ? toCalendarDate(referenceDate, timezone) : today);
  const [navigation, setNavigation] = useState(() => ({
    month: monthStart(clampDate(initialDate, min, max)),
    valueKey: selectedKey,
  }));
  const [focused, setFocused] = useState(initialDate);
  const [uncontrolledView, setUncontrolledView] = useState(views.includes(openTo) ? openTo : views[0]);
  const view = viewProp ?? uncontrolledView;
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(autoFocus);
  const headingId = useId();
  const text = { ...defaultLocaleText, ...localeText };
  const formats = useMemo(
    () => ({
      month: dateFormatter(locale, { month: 'long', year: 'numeric' }),
      day: dateFormatter(locale, { dateStyle: 'full' }),
      weekday: dateFormatter(locale, { weekday: 'narrow' }),
      weekdayFull: dateFormatter(locale, { weekday: 'long' }),
      monthShort: dateFormatter(locale, { month: 'short' }),
      year: dateFormatter(locale, { year: 'numeric' }),
      number: new Intl.NumberFormat(locale, { useGrouping: false }),
    }),
    [locale],
  );
  const { firstDay } = weekInfo(locale, weekStartsOn);

  useImperativeHandle(ref, () => rootRef.current!, []);

  if (!view || !views.length || !views.includes(view) || new Set(views).size !== views.length) {
    throw new RangeError('Calendar view/openTo must belong to a nonempty list of unique views.');
  }

  if (navigation.valueKey !== selectedKey) {
    setNavigation({
      month: selected ? monthStart(clampDate(selected, min, max)) : navigation.month,
      valueKey: selectedKey,
    });

    if (selected) {
      setFocused(selected);
    }
  }

  const month = monthStart(
    currentMonth ? toCalendarDate(currentMonth, timezone) : clampDate(navigation.month, min, max),
  );
  const monthKey = month.toString();
  const isDisabled = (day: Temporal.PlainDate) =>
    disabled ||
    Temporal.PlainDate.compare(day, min) < 0 ||
    Temporal.PlainDate.compare(day, max) > 0 ||
    Boolean(shouldDisableYear?.(day.with({ month: 1, day: 1 }))) ||
    Boolean(shouldDisableMonth?.(monthStart(day))) ||
    Boolean(shouldDisableDate?.(day));
  let candidate: Temporal.PlainDate | null = focused;

  if (focusedDateProp !== undefined) {
    candidate = focusedDateProp === null ? null : toCalendarDate(focusedDateProp, timezone);
  }

  let focusTarget = candidate;

  if (!candidate || !sameMonth(candidate, month)) {
    focusTarget = focusedDateProp === undefined ? month.with({ day: Math.min(focused.day, month.daysInMonth) }) : null;
  }

  const activeDay = focusTarget
    ? (findEnabledDate(focusTarget, 1, month, month.with({ day: month.daysInMonth }), isDisabled) ??
      findEnabledDate(focusTarget, -1, month, month.with({ day: month.daysInMonth }), isDisabled))
    : null;
  const focusKey = activeDay?.toString();

  useLayoutEffect(() => {
    if (pendingFocus.current && !loading) {
      const selector =
        view === 'day'
          ? `[data-calendar-current] button[data-date="${focusKey}"]`
          : '[data-calendar-current] [data-calendar-choice][tabindex="0"]';
      const target = rootRef.current?.querySelector<HTMLElement>(selector);

      if (target) {
        pendingFocus.current = false;
        target.focus({ preventScroll: true });
      }
    }
  }, [monthKey, focusKey, view, loading]);

  const changeMonth = (next: Temporal.PlainDate) => {
    const target = monthStart(clampDate(next, min, max));

    if (!disabled && !sameMonth(target, month)) {
      setNavigation({ month: target, valueKey: selectedKey });
      onMonthChange?.(target);
    }
  };
  const changeView = (next: CalendarView) => {
    if (!disabled && next !== view) {
      pendingFocus.current = true;
      setUncontrolledView(next);
      onViewChange?.(next);
    }
  };
  const focusDay = (day: Temporal.PlainDate) => {
    pendingFocus.current = true;
    setFocused(day);
    onFocusedDateChange?.(day);
    changeMonth(day);
  };
  const selectDate = (day: Temporal.PlainDate) => {
    if (disabled || readOnly || isDisabled(day)) {
      return;
    }

    const order: readonly CalendarView[] = ['year', 'month', 'day'];
    const nextView = order.slice(order.indexOf(view) + 1).find((entry) => views.includes(entry));

    if (value === undefined) {
      setUncontrolledValue(day);
    }

    onChange?.(calendarValue(day, valueFormat), nextView ? 'partial' : 'finish', view);
    setFocused(day);
    changeMonth(day);

    if (view === 'year') {
      onYearChange?.(day);
    }

    if (nextView) {
      changeView(nextView);
    }
  };
  const Day = slots?.day ?? CalendarDay;
  const weeks = calendarWeeks(month, firstDay, fixedWeekNumber);
  let nextHeaderView: CalendarView = views[0]!;

  if (view === 'day') {
    nextHeaderView = views.includes('year') ? 'year' : 'month';
  } else if (views.includes('day')) {
    nextHeaderView = 'day';
  }

  const weekdayHeader = (
    <div role="row" className={calendarWeekdays} data-calendar-weekdays="" data-week-numbers={displayWeekNumber}>
      {displayWeekNumber && (
        <span role="columnheader" aria-label={text.weekNumber} data-week-number="">
          #
        </span>
      )}
      {weeks[0]?.map((day) => (
        <span key={day.dayOfWeek} role="columnheader" aria-label={formats.weekdayFull.format(day)}>
          {dayOfWeekFormatter?.(day) ?? formats.weekday.format(day)}
        </span>
      ))}
    </div>
  );
  const dayContent = (
    <table role="presentation" className={calendarTable}>
      <tbody>
        {weeks.map((week) => (
          <tr key={week[0]!.toString()} role="row">
            {displayWeekNumber && (
              <th scope="row" role="rowheader" data-week-number="">
                {formats.number.format(weekNumber(week[0]!))}
              </th>
            )}
            {week.map((day) => {
              const outside = !sameMonth(day, month);
              const state: CalendarDayState = {
                day,
                selected: selected?.equals(day) ?? false,
                today: !disableHighlightToday && day.equals(today),
                outsideCurrentMonth: outside,
                disabled: isDisabled(day),
              };
              const extra = typeof slotProps?.day === 'function' ? slotProps.day(state) : slotProps?.day;
              const dayState = { ...state, ...extra };

              if (outside && !showDaysOutsideCurrentMonth) {
                return <td key={day.toString()} role="gridcell" aria-hidden="true" />;
              }

              return (
                <td
                  key={day.toString()}
                  aria-selected={dayState.selected || dayState.isHighlighting || false}
                  role="gridcell"
                  data-in-range={dayState.isHighlighting}
                  data-range-start={dayState.isStartOfHighlighting}
                  data-range-end={dayState.isEndOfHighlighting}
                  data-preview={dayState.isPreviewing}
                  data-preview-start={dayState.isStartOfPreviewing}
                  data-preview-end={dayState.isEndOfPreviewing}
                >
                  <Day
                    {...state}
                    {...extra}
                    disabled={state.disabled || Boolean(extra?.disabled)}
                    data-date={day.toString()}
                    data-outside={outside}
                    className={[classes?.day, extra?.className].filter(Boolean).join(' ')}
                    tabIndex={!outside && day.equals(activeDay ?? month) && activeDay ? 0 : -1}
                    aria-label={extra?.['aria-label'] ?? formats.day.format(day)}
                    aria-current={day.equals(today) ? 'date' : undefined}
                    onFocus={(event) => {
                      extra?.onFocus?.(event);

                      if (!event.defaultPrevented) {
                        setFocused(day);
                        onFocusedDateChange?.(day);
                      }
                    }}
                    onClick={(event) => {
                      extra?.onClick?.(event);

                      if (!event.defaultPrevented) {
                        selectDate(day);
                      }
                    }}
                    onKeyDown={(event) => {
                      extra?.onKeyDown?.(event);

                      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
                        return;
                      }

                      const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
                      const target = keyboardDate(day, event.key, event.shiftKey, rtl, firstDay);

                      if (target) {
                        event.preventDefault();

                        const direction = Temporal.PlainDate.compare(target, day) < 0 ? -1 : 1;
                        const enabled = findEnabledDate(target, direction, min, max, isDisabled);

                        if (enabled) {
                          focusDay(enabled);
                        }
                      }
                    }}
                  >
                    {extra?.children ?? formats.number.format(day.day)}
                  </Day>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
  const choices =
    view === 'month'
      ? Array.from({ length: 12 }, (_, index) => {
          const date = month.with({ month: index + 1 });

          return {
            date,
            label: formats.monthShort.format(date),
            selected: Boolean(selected && sameMonth(selected, date)),
            disabled:
              disabled ||
              Temporal.PlainDate.compare(date.with({ day: date.daysInMonth }), min) < 0 ||
              Temporal.PlainDate.compare(date, max) > 0 ||
              Boolean(shouldDisableMonth?.(date)) ||
              Boolean(shouldDisableYear?.(date.with({ month: 1 }))),
          };
        })
      : Array.from({ length: view === 'year' ? Math.max(0, max.year - min.year + 1) : 0 }, (_, index) => {
          const year = yearsOrder === 'asc' ? min.year + index : max.year - index;
          const date = month.with({ year });

          return {
            date,
            label: formats.year.format(date),
            selected: selected?.year === year,
            disabled: disabled || Boolean(shouldDisableYear?.(date.with({ month: 1 }))),
          };
        });

  const heading = (
    <span id={headingId} aria-live="polite" aria-atomic="true">
      {formats.month.format(month)}
    </span>
  );

  return (
    <div
      {...props}
      ref={rootRef}
      className={[calendarRoot, classes?.root, className].filter(Boolean).join(' ')}
      role="group"
      aria-label={ariaLabel ?? text.calendarLabel}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      data-md3-calendar=""
      data-view={view}
      onFocus={(event) => {
        onFocus?.(event);

        if (!event.currentTarget.contains(event.relatedTarget)) {
          onFocusedViewChange?.(view, true);
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);

        if (!event.currentTarget.contains(event.relatedTarget)) {
          onFocusedViewChange?.(view, false);
        }
      }}
    >
      <div className={[calendarHeader, classes?.header].filter(Boolean).join(' ')} data-calendar-header="">
        <div data-calendar-heading="">
          {views.length > 1 ? (
            <BaseButton
              type="button"
              data-calendar-heading-button=""
              aria-label={`${formats.month.format(month)}. ${text.switchView(nextHeaderView)}`}
              disabled={disabled}
              onClick={() => changeView(nextHeaderView)}
            >
              {heading}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d={view === 'day' ? 'm7 10 5 5 5-5z' : 'm7 14 5-5 5 5z'} />
              </svg>
            </BaseButton>
          ) : (
            heading
          )}
        </div>
        <IconButton
          data-calendar-previous-button=""
          variant="standard"
          aria-label={text.previousMonth}
          disabled={disabled || view !== 'day' || Temporal.PlainDate.compare(month, monthStart(min)) <= 0}
          onClick={() => changeMonth(month.subtract({ months: 1 }))}
        >
          <svg data-calendar-arrow="" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15 6-6 6 6 6"
            />
          </svg>
        </IconButton>
        <IconButton
          data-calendar-next-button=""
          variant="standard"
          aria-label={text.nextMonth}
          disabled={disabled || view !== 'day' || Temporal.PlainDate.compare(month, monthStart(max)) >= 0}
          onClick={() => changeMonth(month.add({ months: 1 }))}
        >
          <svg data-calendar-arrow="" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 6 6 6-6 6"
            />
          </svg>
        </IconButton>
      </div>
      {loading ? (
        <div className={calendarLoading} role="status">
          {renderLoading?.() ?? text.loading}
        </div>
      ) : (
        <div
          role={view === 'day' ? 'grid' : undefined}
          aria-labelledby={view === 'day' ? headingId : undefined}
          aria-readonly={view === 'day' ? readOnly || undefined : undefined}
          aria-multiselectable={view === 'day' ? multiselectable : undefined}
          data-md3-calendar-grid={view === 'day' ? '' : undefined}
        >
          {view === 'day' && weekdayHeader}
          <CalendarTransition
            transitionKey={`${view}-${monthKey}`}
            order={month.year * 12 + month.month}
            reduceAnimations={reduceAnimations}
            className={classes?.viewTransitionContainer}
          >
            {view === 'day' ? (
              <div data-calendar-day-view="">{dayContent}</div>
            ) : (
              <CalendarChoices
                items={choices}
                columns={view === 'month' ? monthsPerRow : yearsPerRow}
                label={text.switchView(view)}
                active={Math.max(
                  0,
                  choices.findIndex((item) =>
                    view === 'month' ? item.date.month === month.month : item.date.year === month.year,
                  ),
                )}
                readOnly={readOnly}
                onSelect={(date) => {
                  // A year/month choice retains the day where possible and respects boundary dates.
                  const day = clampDate(
                    date.with({ day: Math.min((selected ?? focused).day, date.daysInMonth) }),
                    min,
                    max,
                  );
                  const first = view === 'year' ? date.with({ month: 1, day: 1 }) : monthStart(date);
                  const last =
                    view === 'year' ? date.with({ month: 12, day: 31 }) : date.with({ day: date.daysInMonth });
                  const lower = Temporal.PlainDate.compare(first, min) < 0 ? min : first;
                  const upper = Temporal.PlainDate.compare(last, max) > 0 ? max : last;
                  const enabled =
                    findEnabledDate(day, 1, lower, upper, isDisabled) ??
                    findEnabledDate(day, -1, lower, upper, isDisabled);

                  if (enabled) {
                    selectDate(enabled);
                  }
                }}
              />
            )}
          </CalendarTransition>
        </div>
      )}
    </div>
  );
}
