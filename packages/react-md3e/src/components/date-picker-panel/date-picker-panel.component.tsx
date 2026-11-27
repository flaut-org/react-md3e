'use client';

import { useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useMergedRefs } from '../../internal/hooks/use-merged-refs.hook';
import { usePickerMedia } from '../../internal/hooks/use-picker-media.hook';
import { useDatePickerState } from '../../internal/hooks/use-date-picker-state.hook';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { Typography } from '../typography';
import { Divider } from '../divider';
import { Dialog } from '../dialog';
import { Popover } from '../popover';
import { Calendar } from '../calendar';
import { calendarBounds, clampDate, dateFormatter, monthStart, toCalendarDate } from '../calendar/calendar-date';
import type { CalendarProps } from '../calendar/calendar.types';
import { RangeCalendar } from '../range-calendar';
import type { RangeCalendarProps, RangePosition } from '../range-calendar/range-calendar.types';
import { DateEntry } from '../date-entry/date-entry.component';
import { dateEntryLocale } from '../date-entry/date-entry-locale';
import { validateDates } from '../date-entry/date-entry-validation';
import type {
  DateChangeContext,
  DatePickerLocaleText,
  DateValidationError,
  DateValidationProps,
} from '../date-entry/date-entry.types';
import type { TextFieldProps } from '../text-field';
import type { DatePickerPresentationProps } from '../date-picker/date-picker.types';
import { datePickerPanel } from './date-picker-panel.styles';

type Dates = readonly (Temporal.PlainDate | null)[];

const ignoreValidation = () => {};

export interface DatePickerPanelProps extends DatePickerPresentationProps {
  readonly value: Dates | undefined;
  readonly defaultValue: Dates;
  readonly onChange: (value: Dates, context: DateChangeContext) => void;
  readonly onAccept: (value: Dates, context: DateChangeContext) => void;
  readonly onError: (error: DateValidationError, value: Dates) => void;
  readonly rules: DateValidationProps;
  readonly shouldDisableDate?: ((day: Temporal.PlainDate, position: RangePosition) => boolean) | undefined;
  readonly fieldProps: TextFieldProps;
  readonly range?: boolean;
  readonly calendarProps?: CalendarProps | undefined;
  readonly rangeCalendarProps?: RangeCalendarProps | undefined;
  readonly format?: string | undefined;
  readonly localeText?: Partial<DatePickerLocaleText> | undefined;
  readonly clearable?: boolean | undefined;
  readonly fieldType?: 'single-input' | 'multi-input' | undefined;
  readonly startLabel?: ReactNode;
  readonly endLabel?: ReactNode;
  readonly startName?: string | undefined;
  readonly endName?: string | undefined;
}

export function DatePickerPanel({
  value,
  defaultValue,
  onChange,
  onAccept,
  onError,
  rules,
  shouldDisableDate,
  fieldProps: providedFieldProps,
  range = false,
  calendarProps,
  rangeCalendarProps,
  format,
  localeText,
  clearable,
  fieldType,
  startLabel,
  endLabel,
  startName,
  endName,
  variant = 'responsive',
  open,
  defaultOpen,
  onOpen,
  onClose,
  closeOnSelect,
  defaultMode = 'calendar',
  fullScreen,
  container,
  reduceAnimations,
  slotProps,
}: DatePickerPanelProps) {
  const fieldProps = {
    ...providedFieldProps,
    ...slotProps?.textField,
    InputProps: { ...providedFieldProps.InputProps, ...slotProps?.textField?.InputProps },
  };
  const media = usePickerMedia(range ? (rangeCalendarProps?.calendars ?? 2) : 1, closeOnSelect === false);
  const modal = variant === 'modal' || (variant === 'responsive' && !media.desktop) || !media.dockFits;
  const fullscreen = modal && (fullScreen ?? ((range && media.compact) || !media.modalGutters));
  const [initialToday] = useState(() => calendarBounds(rules).today);
  const stableRules = { ...rules, today: rules.today ?? initialToday };
  const state = useDatePickerState({
    value,
    defaultValue,
    open,
    defaultOpen,
    onOpen,
    onClose,
    onChange,
    onAccept,
    onError,
    rules: stableRules,
    required: fieldProps.required,
    shouldDisableDate,
  });
  const [requestedMode, setMode] = useState(defaultMode);
  const calendarFits = media.modalCalendar && (fullscreen || media.modalGutters);
  const mode = modal && !calendarFits ? 'input' : requestedMode;
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(anchorRef, fieldProps.ref);
  const id = useId();
  const titleId = `${id}-title`;
  const text = dateEntryLocale(rules.locale ?? 'en-US', localeText);
  const bounds = calendarBounds(stableRules);
  const reference = state.viewValue[0] ?? state.viewValue[1] ?? rules.referenceDate ?? bounds.today;
  const firstRangeMonth = monthStart(bounds.min);
  const lastRangeWindow = monthStart(bounds.max).subtract({ months: 2 });
  const lastRangeMonth =
    Temporal.PlainDate.compare(lastRangeWindow, firstRangeMonth) < 0 ? firstRangeMonth : lastRangeWindow;
  const constrainRangeMonth = (month: Temporal.PlainDate) =>
    clampDate(monthStart(month), firstRangeMonth, lastRangeMonth);
  const [rangeMonth, setRangeMonth] = useState(() => constrainRangeMonth(toCalendarDate(reference, rules.timezone)));
  const [wasOpen, setWasOpen] = useState(state.open);
  const headlineFormat = dateFormatter(rules.locale ?? 'en-US', {
    month: 'short',
    day: 'numeric',
    ...(range ? {} : { weekday: 'short' }),
  });
  const calendarTitle = range ? text.selectRange : text.selectDate;
  const inputTitle = range ? text.enterRange : text.enterDate;
  const title = mode === 'input' ? inputTitle : calendarTitle;
  const disabled = Boolean(fieldProps.disabled);
  const readonly = Boolean(fieldProps.readOnly);
  const doCloseOnSelect = closeOnSelect ?? !modal;

  if (wasOpen !== state.open) {
    setWasOpen(state.open);

    if (state.open) {
      setMode(defaultMode);
      setRangeMonth(constrainRangeMonth(toCalendarDate(reference, rules.timezone)));
    }
  }

  const changeCalendar = (next: Dates, selectionState: 'partial' | 'finish') => {
    const error = validateDates(next, stableRules, fieldProps.required, shouldDisableDate);

    state.change(next, { validationError: error, source: 'calendar', selectionState });

    if (selectionState === 'finish' && doCloseOnSelect && !error) {
      state.accept(next, 'calendar');
    }
  };
  const changeRangeMonth = (month: Temporal.PlainDate) => {
    const next = constrainRangeMonth(month);

    if (!next.equals(rangeMonth)) {
      setRangeMonth(next);
      rangeCalendarProps?.onMonthChange?.(next);
    }
  };
  const inputProps: TextFieldProps = {
    ...fieldProps,
    ...slotProps?.textField,
    ref: mergedRef,
    InputProps: { ...fieldProps.InputProps, ...slotProps?.textField?.InputProps },
    onKeyDown: (event) => {
      (slotProps?.textField?.onKeyDown ?? fieldProps.onKeyDown)?.(event);

      if (!event.defaultPrevented && event.altKey && event.key === 'ArrowDown' && !disabled) {
        event.preventDefault();
        state.requestOpen();
      }

      if (!event.defaultPrevented && event.key === 'Enter' && !state.open && !disabled && !readonly) {
        state.accept(state.current, 'field');
      }
    },
  };
  const content = (
    <>
      {modal && (
        <>
          <div data-picker-header="">
            <Typography id={titleId} component="h2" variant="labelLarge" data-picker-label="">
              {title}
            </Typography>
            <div data-picker-headline-row="">
              <Typography variant={range ? 'titleLarge' : 'headlineLarge'} data-picker-headline="">
                {state.current
                  .map((day, index) => {
                    if (day) {
                      return headlineFormat.format(day);
                    }

                    return range ? [text.start, text.end][index] : '—';
                  })
                  .join(range ? ' – ' : '')}
              </Typography>
              <IconButton
                variant="standard"
                disabled={!calendarFits}
                aria-label={mode === 'calendar' ? text.inputMode : text.calendarMode}
                onClick={() => {
                  const next = mode === 'calendar' ? 'input' : 'calendar';

                  setMode(next);
                  requestAnimationFrame(() => {
                    bodyRef.current
                      ?.querySelector<HTMLElement>(
                        next === 'input'
                          ? '[data-picker-input] input:not([type="hidden"])'
                          : '[data-calendar-current] button[tabindex="0"]',
                      )
                      ?.focus();
                  });
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d={
                      mode === 'calendar'
                        ? 'm3 17 0 4 4 0L19 9l-4-4zM16 4l2-2 4 4-2 2z'
                        : 'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 10h14v10H5z'
                    }
                  />
                </svg>
              </IconButton>
            </div>
          </div>
          <Divider />
        </>
      )}
      <div
        data-picker-content=""
        onFocusCapture={(event) => {
          if (event.target instanceof HTMLElement && event.target.closest('[data-md3-calendar]')) {
            event.target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
          }
        }}
        ref={(node) => {
          bodyRef.current = node;
          focusRef.current =
            node?.querySelector<HTMLElement>(
              mode === 'input' && modal
                ? '[data-picker-input] input:not([type="hidden"])'
                : '[data-calendar-current] button[tabindex="0"]',
            ) ?? node;
        }}
        tabIndex={-1}
      >
        {modal && (
          <div data-picker-input="" hidden={mode !== 'input'} inert={mode !== 'input'}>
            <DateEntry
              key={`input-${state.epoch}`}
              values={state.current}
              rules={stableRules}
              shouldDisableDate={shouldDisableDate}
              fieldProps={{
                variant: slotProps?.textField?.variant ?? fieldProps.variant ?? 'outlined',
                required: Boolean(fieldProps.required),
                disabled,
                readOnly: readonly,
                label: range ? text.chooseRange : text.chooseDate,
              }}
              format={format}
              localeText={localeText}
              fieldType={range ? 'multi-input' : 'single-input'}
              startLabel={startLabel}
              endLabel={endLabel}
              onValuesChange={state.change}
              onValidation={ignoreValidation}
            />
          </div>
        )}
        {(!modal || mode === 'calendar') &&
          (range ? (
            <>
              {modal && (
                <div data-picker-month-actions="">
                  <IconButton
                    variant="standard"
                    aria-label={text.previousMonths}
                    disabled={Temporal.PlainDate.compare(rangeMonth, firstRangeMonth) <= 0}
                    onClick={() => changeRangeMonth(rangeMonth.subtract({ months: 3 }))}
                  >
                    <svg data-picker-arrow="" viewBox="0 0 24 24" aria-hidden="true">
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
                    variant="standard"
                    aria-label={text.nextMonths}
                    disabled={Temporal.PlainDate.compare(rangeMonth, lastRangeMonth) >= 0}
                    onClick={() => changeRangeMonth(rangeMonth.add({ months: 3 }))}
                  >
                    <svg data-picker-arrow="" viewBox="0 0 24 24" aria-hidden="true">
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
              )}
              <RangeCalendar
                {...rangeCalendarProps}
                {...stableRules}
                localeText={text}
                value={
                  state.viewValue[0] &&
                  state.viewValue[1] &&
                  Temporal.PlainDate.compare(state.viewValue[0], state.viewValue[1]) > 0
                    ? [state.viewValue[0], null]
                    : [state.viewValue[0] ?? null, state.viewValue[1] ?? null]
                }
                calendars={modal ? 3 : (rangeCalendarProps?.calendars ?? 2)}
                {...(modal ? { currentMonth: rangeMonth } : {})}
                disabled={disabled}
                readOnly={readonly}
                autoFocus
                reduceAnimations={Boolean(reduceAnimations)}
                shouldDisableDate={(day, position) => Boolean(shouldDisableDate?.(day, position))}
                {...(slotProps ? { slotProps } : {})}
                onMonthChange={(month) => {
                  if (modal) {
                    changeRangeMonth(month);
                  } else {
                    rangeCalendarProps?.onMonthChange?.(month);
                  }
                }}
                onChange={(next, selection) => changeCalendar(next, selection)}
              />
            </>
          ) : (
            <Calendar
              {...calendarProps}
              {...stableRules}
              localeText={text}
              value={state.viewValue[0] ?? null}
              disabled={disabled}
              readOnly={readonly}
              autoFocus
              reduceAnimations={Boolean(reduceAnimations)}
              {...(shouldDisableDate
                ? { shouldDisableDate: (day: Temporal.PlainDate) => shouldDisableDate(day, 'start') }
                : {})}
              {...(slotProps ? { slotProps } : {})}
              onChange={(day, selection) => changeCalendar([day], selection)}
            />
          ))}
      </div>
      {(modal || !doCloseOnSelect) && (
        <>
          <Divider />
          <div data-picker-actions="">
            {clearable && (
              <Button
                data-picker-clear=""
                variant="text"
                disabled={disabled || readonly}
                onClick={() =>
                  state.change(range ? [null, null] : [null], {
                    validationError: fieldProps.required ? 'required' : null,
                    source: 'clear',
                  })
                }
              >
                {text.clear}
              </Button>
            )}
            <Button variant="text" onClick={() => state.cancel('cancel')}>
              {text.cancel}
            </Button>
            <Button
              variant="text"
              disabled={disabled || readonly || state.error !== null}
              onClick={() => state.accept()}
            >
              {text.accept}
            </Button>
          </div>
        </>
      )}
    </>
  );
  const trigger = (
    <IconButton
      ref={triggerRef}
      variant="standard"
      disabled={disabled}
      aria-label={`${range ? text.chooseRange : text.chooseDate}${state.value.some(Boolean) ? `, ${state.value.map((day) => (day ? headlineFormat.format(day) : '')).join(' – ')}` : ''}`}
      aria-haspopup="dialog"
      aria-expanded={state.open && !disabled}
      aria-controls={state.open && !disabled ? id : undefined}
      {...(modal ? { onClick: () => (state.open ? state.cancel('triggerClick') : state.requestOpen()) } : {})}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 10h14v10H5z"
        />
      </svg>
    </IconButton>
  );
  const opener = modal ? (
    trigger
  ) : (
    <Popover
      id={id}
      trigger={trigger}
      open={state.open && !disabled}
      anchorEl={anchorRef}
      container={container}
      dir={fieldProps.dir}
      collisionStrategy="shift"
      aria-label={range ? text.selectRange : text.selectDate}
      onOpenChange={(next) => {
        if (next) {
          state.requestOpen();
        }
      }}
      onClose={(_event, reason) =>
        state.cancel(reason === 'programmatic' || reason === 'closeButtonClick' ? 'cancel' : reason)
      }
      initialFocus={focusRef}
      finalFocus={triggerRef}
      disablePadding
      className={datePickerPanel}
      data-picker-range={range}
      data-picker-modal="false"
      data-picker-mode={mode}
      data-reduce-animations={reduceAnimations}
    >
      {content}
    </Popover>
  );

  return (
    <>
      <DateEntry
        resetKey={state.epoch}
        values={state.current}
        rules={stableRules}
        shouldDisableDate={shouldDisableDate}
        fieldProps={{
          ...inputProps,
          name: undefined,
          InputProps: {
            ...inputProps.InputProps,
            endAdornment: (
              <>
                {inputProps.InputProps?.endAdornment}
                {opener}
              </>
            ),
          },
        }}
        format={format}
        localeText={localeText}
        clearable={clearable}
        fieldType={fieldType}
        startLabel={startLabel}
        endLabel={endLabel}
        onValuesChange={state.change}
        onValidation={ignoreValidation}
        onReset={state.reset}
      />
      {state.value.map((day, index) => (
        <input
          key={index === 0 ? 'start' : 'end'}
          type="hidden"
          form={fieldProps.form}
          disabled={disabled}
          name={
            range
              ? [
                  startName ?? (fieldProps.name ? `${fieldProps.name}.start` : undefined),
                  endName ?? (fieldProps.name ? `${fieldProps.name}.end` : undefined),
                ][index]
              : fieldProps.name
          }
          value={day?.toString() ?? ''}
        />
      ))}
      {modal && (
        <Dialog
          id={id}
          open={state.open && !disabled}
          role="dialog"
          aria-labelledby={titleId}
          onClose={(_event, reason) => state.cancel(reason === 'backdropClick' ? 'clickAway' : reason)}
          fullScreen={fullscreen}
          dir={fieldProps.dir}
          maxWidth={false}
          {...(container !== undefined ? { container } : {})}
          initialFocus={focusRef}
          finalFocus={triggerRef}
          className={datePickerPanel}
          data-picker-range={range}
          data-picker-modal="true"
          data-picker-mode={mode}
          data-reduce-animations={reduceAnimations}
          data-picker-fullscreen={fullscreen}
        >
          {content}
        </Dialog>
      )}
    </>
  );
}
