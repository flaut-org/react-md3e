'use client';

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Calendar } from '../calendar/calendar.component';
import {
  calendarBounds,
  calendarValue,
  clampDate,
  monthStart,
  sameMonth,
  toCalendarDate,
} from '../calendar/calendar-date';
import { isInRange, selectRangeDate, toDateRange } from './range-calendar-date';
import { rangeCalendarRoot } from './range-calendar.styles';
import type { CalendarDayState, CalendarValueFormat } from '../calendar/calendar.types';
import type { PlainDateRange } from './range-calendar-date';
import type { RangeCalendarProps, RangePosition } from './range-calendar.types';

const emptyRange = [null, null] as const;
const defaultPositions = ['start', 'end'] as const;

interface DragState {
  readonly position: RangePosition;
  readonly initial: Temporal.PlainDate;
  readonly range: PlainDateRange;
  readonly over: Temporal.PlainDate;
}

export function RangeCalendar<Format extends CalendarValueFormat = 'temporal'>({
  value,
  defaultValue = emptyRange,
  valueFormat,
  onChange,
  calendars = 2,
  currentMonthCalendarPosition = 1,
  currentMonth,
  referenceDate,
  'rangePosition': rangePositionProp,
  defaultRangePosition = 'start',
  availableRangePositions = defaultPositions,
  onRangePositionChange,
  shouldDisableDate,
  disableAutoMonthSwitching = false,
  disableDragEditing = false,
  view = 'day',
  views,
  openTo,
  onViewChange,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  timezone,
  'today': todayProp,
  locale = 'en-US',
  localeText,
  onMonthChange,
  slots,
  slotProps,
  classes,
  ref,
  className,
  onPointerLeave,
  style,
  'aria-label': ariaLabel,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
  disableHighlightToday,
  reduceAnimations,
  loading,
  renderLoading,
  showDaysOutsideCurrentMonth,
  fixedWeekNumber,
  displayWeekNumber,
  weekStartsOn,
  dayOfWeekFormatter,
  onFocusedViewChange,
  ...rootProps
}: RangeCalendarProps<Format>) {
  const calendarProps = {
    ...(minDate !== undefined ? { minDate } : {}),
    ...(maxDate !== undefined ? { maxDate } : {}),
    ...(disablePast !== undefined ? { disablePast } : {}),
    ...(disableFuture !== undefined ? { disableFuture } : {}),
    ...(disableHighlightToday !== undefined ? { disableHighlightToday } : {}),
    ...(reduceAnimations !== undefined ? { reduceAnimations } : {}),
    ...(loading !== undefined ? { loading } : {}),
    ...(renderLoading !== undefined ? { renderLoading } : {}),
    ...(fixedWeekNumber !== undefined ? { fixedWeekNumber } : {}),
    ...(displayWeekNumber !== undefined ? { displayWeekNumber } : {}),
    ...(weekStartsOn !== undefined ? { weekStartsOn } : {}),
    ...(dayOfWeekFormatter !== undefined ? { dayOfWeekFormatter } : {}),
    ...(onFocusedViewChange !== undefined ? { onFocusedViewChange } : {}),
  };
  const [initialBounds] = useState(() =>
    calendarBounds({
      ...(timezone ? { timezone } : {}),
      ...(todayProp !== undefined ? { today: todayProp } : {}),
    }),
  );
  const today = todayProp ?? initialBounds.today;
  const { min, max } = calendarBounds({ ...calendarProps, today, ...(timezone !== undefined ? { timezone } : {}) });
  const [uncontrolledValue, setUncontrolledValue] = useState(() => toDateRange(defaultValue, timezone));
  const range = value === undefined ? uncontrolledValue : toDateRange(value, timezone);
  const [start, end] = range;
  const valueKey = `${start?.toString() ?? ''}/${end?.toString() ?? ''}`;
  const [uncontrolledPosition, setUncontrolledPosition] = useState(
    availableRangePositions.includes(defaultRangePosition)
      ? defaultRangePosition
      : (availableRangePositions[0] ?? 'start'),
  );
  const rangePosition = rangePositionProp ?? uncontrolledPosition;
  const reference = Array.isArray(referenceDate) ? (referenceDate[0] ?? referenceDate[1]) : referenceDate;
  const anchor =
    (rangePosition === 'start' ? start : end) ??
    start ??
    end ??
    (reference ? toCalendarDate(reference, timezone) : toCalendarDate(today, timezone));
  const minMonth = monthStart(min);
  const lastFirstMonth = monthStart(max).subtract({ months: calendars - 1 });
  const maxFirstMonth = Temporal.PlainDate.compare(lastFirstMonth, minMonth) < 0 ? minMonth : lastFirstMonth;
  const constrainMonth = (day: Temporal.PlainDate) => monthStart(clampDate(monthStart(day), minMonth, maxFirstMonth));
  const anchorFirstMonth = (day: Temporal.PlainDate) =>
    constrainMonth(monthStart(day).subtract({ months: currentMonthCalendarPosition - 1 }));
  const [navigation, setNavigation] = useState(() => ({ month: anchorFirstMonth(anchor), valueKey }));
  const firstMonth = currentMonth
    ? anchorFirstMonth(toCalendarDate(currentMonth, timezone))
    : constrainMonth(navigation.month);
  const [focusedDate, setFocusedDate] = useState(() => clampDate(anchor, min, max));
  const [hoveredDate, setHoveredDate] = useState<Temporal.PlainDate | null>(null);
  const [dragPosition, setDragPosition] = useState<RangePosition | null>(null);
  const dragging = dragPosition !== null;
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(autoFocus);
  const focusRequest = useRef<Temporal.PlainDate | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClick = useRef(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { root: rootClass, ...panelClasses } = classes ?? {};

  useImperativeHandle(ref, () => rootRef.current!, []);

  if (
    ![1, 2, 3].includes(calendars) ||
    !Number.isInteger(currentMonthCalendarPosition) ||
    currentMonthCalendarPosition > calendars ||
    currentMonthCalendarPosition < 1 ||
    !availableRangePositions.length ||
    availableRangePositions.some((position) => position !== 'start' && position !== 'end') ||
    new Set(availableRangePositions).size !== availableRangePositions.length ||
    !availableRangePositions.includes(rangePosition) ||
    view !== 'day' ||
    (openTo !== undefined && openTo !== 'day') ||
    (views !== undefined && (views.length !== 1 || views[0] !== 'day'))
  ) {
    throw new RangeError('RangeCalendar requires 1–3 calendars and valid month/range positions.');
  }

  const visible = (day: Temporal.PlainDate) =>
    Temporal.PlainDate.compare(monthStart(day), firstMonth) >= 0 &&
    Temporal.PlainDate.compare(monthStart(day), firstMonth.add({ months: calendars })) < 0;
  const panelFocus = visible(focusedDate) ? focusedDate : clampDate(firstMonth, min, max);

  if (navigation.valueKey !== valueKey) {
    setNavigation({ month: visible(anchor) ? navigation.month : anchorFirstMonth(anchor), valueKey });
    setFocusedDate(clampDate(anchor, min, max));
  }

  useLayoutEffect(() => {
    if (pendingFocus.current) {
      const target = rootRef.current?.querySelector<HTMLElement>(
        '[data-calendar-current] button[data-date][data-outside="false"][tabindex="0"]:not(:disabled)',
      );

      if (target) {
        pendingFocus.current = false;
        target.focus({ preventScroll: true });
      }
    }
  });

  const setPosition = (position: RangePosition) => {
    if (position !== rangePosition && availableRangePositions.includes(position)) {
      setUncontrolledPosition(position);
      onRangePositionChange?.(position);
    }
  };
  const setMonth = (next: Temporal.PlainDate, requestedFocus?: Temporal.PlainDate) => {
    const month = constrainMonth(next);

    if (!disabled && !sameMonth(month, firstMonth)) {
      setNavigation((previous) => ({ month, valueKey: previous.valueKey }));
      onMonthChange?.(month);

      if (requestedFocus) {
        setFocusedDate(requestedFocus);
      } else if (
        Temporal.PlainDate.compare(monthStart(focusedDate), month) < 0 ||
        Temporal.PlainDate.compare(monthStart(focusedDate), month.add({ months: calendars })) >= 0
      ) {
        setFocusedDate(month.with({ day: Math.min(focusedDate.day, month.daysInMonth) }));
      }
    }
  };
  const commitRange = (next: PlainDateRange, complete: boolean) => {
    const nextKey = `${next[0]?.toString() ?? ''}/${next[1]?.toString() ?? ''}`;

    setNavigation((previous) => ({ ...previous, valueKey: nextKey }));

    if (value === undefined) {
      setUncontrolledValue(next);
    }

    onChange?.(
      [next[0] ? calendarValue(next[0], valueFormat) : null, next[1] ? calendarValue(next[1], valueFormat) : null],
      complete ? 'finish' : 'partial',
      'day',
    );
  };
  const selectDay = (day: Temporal.PlainDate) => {
    if (suppressClick.current) {
      suppressClick.current = false;

      return;
    }

    if (disabled || readOnly || shouldDisableDate?.(day, rangePosition)) {
      return;
    }

    const next = selectRangeDate(day, range, rangePosition);
    const complete = (rangePosition === 'end' && next[1] !== null) || availableRangePositions.length === 1;

    pendingFocus.current = true;
    setFocusedDate(day);
    commitRange(next, complete);
    setHoveredDate(null);
    setPosition(complete ? 'start' : 'end');

    if (!disableAutoMonthSwitching && !complete && next[1] && !visible(next[1])) {
      setMonth(monthStart(next[1]).subtract({ months: calendars - 1 }));
    }
  };

  useEffect(() => {
    const finishDrag = (event: PointerEvent) => {
      const drag = dragRef.current;

      dragRef.current = null;

      if (drag) {
        setDragPosition(null);
        setHoveredDate(null);

        const target =
          event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button[data-date]') : null;

        if (
          event.type === 'pointerup' &&
          !drag.over.equals(drag.initial) &&
          !disabled &&
          !readOnly &&
          target &&
          !target.disabled &&
          rootRef.current?.contains(target) &&
          Temporal.PlainDate.compare(drag.over, min) >= 0 &&
          Temporal.PlainDate.compare(drag.over, max) <= 0 &&
          !shouldDisableDate?.(drag.over, drag.position)
        ) {
          const updated = selectRangeDate(drag.over, drag.range, drag.position);

          commitRange(updated, updated[0] !== null && updated[1] !== null);
          suppressClick.current = true;
          clickTimer.current = setTimeout(() => {
            suppressClick.current = false;
          }, 0);
          pendingFocus.current = true;
          setFocusedDate(drag.over);
        }
      }
    };

    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);

    return () => {
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  });

  useEffect(
    () => () => {
      if (clickTimer.current !== null) {
        clearTimeout(clickTimer.current);
      }
    },
    [],
  );

  const preview =
    hoveredDate && !readOnly && !disabled
      ? selectRangeDate(hoveredDate, range, dragPosition ?? rangePosition)
      : emptyRange;

  return (
    <div
      {...rootProps}
      ref={rootRef}
      role="group"
      aria-label={ariaLabel ?? localeText?.calendarLabel ?? 'Date range calendar'}
      aria-disabled={disabled || undefined}
      className={[rangeCalendarRoot, rootClass, className].filter(Boolean).join(' ')}
      style={style}
      data-md3-range-calendar=""
      data-calendars={calendars}
      data-range-position={rangePosition}
      data-dragging={dragging}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setHoveredDate(null);
      }}
    >
      {Array.from({ length: calendars }, (_, index) => {
        const month = firstMonth.add({ months: index });

        return (
          <Calendar
            {...calendarProps}
            key={index}
            value={rangePosition === 'start' ? start : end}
            aria-multiselectable
            currentMonth={month}
            focusedDate={panelFocus}
            onFocusedDateChange={(day) => {
              pendingFocus.current = true;
              focusRequest.current = !sameMonth(day, month) ? day : null;
              setFocusedDate(day);
            }}
            onMonthChange={(next) => {
              const request = focusRequest.current;

              focusRequest.current = null;

              if (request && sameMonth(request, next)) {
                if (!visible(next)) {
                  setMonth(
                    Temporal.PlainDate.compare(next, firstMonth) < 0 ? next : next.subtract({ months: calendars - 1 }),
                    request,
                  );
                }
              } else {
                setMonth(next.subtract({ months: index }));
              }
            }}
            onChange={selectDay}
            views={['day']}
            view={view}
            onViewChange={(next) => {
              if (next === 'day') {
                onViewChange?.(next);
              }
            }}
            locale={locale}
            {...(localeText ? { localeText } : {})}
            {...(timezone ? { timezone } : {})}
            today={today}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus && index === currentMonthCalendarPosition - 1}
            shouldDisableDate={(day) => Boolean(shouldDisableDate?.(day, dragPosition ?? rangePosition))}
            showDaysOutsideCurrentMonth={calendars === 1 && Boolean(showDaysOutsideCurrentMonth)}
            {...(slots ? { slots } : {})}
            {...(classes ? { classes: panelClasses } : {})}
            slotProps={{
              day: (state: CalendarDayState) => {
                const extra = typeof slotProps?.day === 'function' ? slotProps.day(state) : slotProps?.day;
                const inRange = isInRange(state.day, range);
                const inPreview = isInRange(state.day, preview);

                return {
                  ...extra,
                  selected: Boolean(start?.equals(state.day) || end?.equals(state.day)),
                  isHighlighting: inRange,
                  isStartOfHighlighting: inRange && Boolean(start?.equals(state.day)),
                  isEndOfHighlighting: inRange && Boolean(end?.equals(state.day)),
                  isPreviewing: inPreview,
                  isStartOfPreviewing: inPreview && Boolean(preview[0]?.equals(state.day)),
                  isEndOfPreviewing: inPreview && Boolean(preview[1]?.equals(state.day)),
                  onPointerEnter: (event) => {
                    extra?.onPointerEnter?.(event);

                    if (!event.defaultPrevented && !readOnly && !disabled) {
                      setHoveredDate(state.disabled ? null : state.day);

                      if (dragRef.current) {
                        dragRef.current = { ...dragRef.current, over: state.day };
                      }
                    }
                  },
                  onPointerDown: (event) => {
                    extra?.onPointerDown?.(event);

                    if (
                      !event.defaultPrevented &&
                      !disableDragEditing &&
                      !disabled &&
                      !readOnly &&
                      event.button === 0 &&
                      event.pointerType !== 'touch' &&
                      start &&
                      end &&
                      (start.equals(state.day) || end.equals(state.day))
                    ) {
                      const position = start.equals(state.day) ? 'start' : 'end';

                      if (availableRangePositions.includes(position) && !shouldDisableDate?.(state.day, position)) {
                        dragRef.current = { position, initial: state.day, over: state.day, range };
                        setDragPosition(position);
                      }
                    }
                  },
                };
              },
            }}
          />
        );
      })}
    </div>
  );
}
