'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useMergedRefs } from '../../internal/hooks/use-merged-refs.hook';
import { DateEntryInput } from './date-entry-input/date-entry-input.component';
import type { TextFieldControl, TextFieldProps } from '../text-field';
import { IconButton } from '../icon-button';
import { calendarBounds } from '../calendar/calendar-date';
import type { RangePosition } from '../range-calendar/range-calendar.types';
import { createDateFormat } from './date-entry-format';
import { dateEntryLocale } from './date-entry-locale';
import { datesKey, validateDates } from './date-entry-validation';
import { dateEntryRoot } from './date-entry.styles';
import type {
  DateChangeContext,
  DatePickerLocaleText,
  DateValidationError,
  DateValidationProps,
} from './date-entry.types';

export interface DateEntryProps {
  readonly values: readonly (Temporal.PlainDate | null)[];
  readonly onValuesChange: (values: readonly (Temporal.PlainDate | null)[], context: DateChangeContext) => void;
  readonly onValidation: (error: DateValidationError) => void;
  readonly rules: DateValidationProps;
  readonly shouldDisableDate?: ((day: Temporal.PlainDate, position: RangePosition) => boolean) | undefined;
  readonly format?: string | undefined;
  readonly localeText?: Partial<DatePickerLocaleText> | undefined;
  readonly fieldProps: TextFieldProps;
  readonly fieldType?: 'single-input' | 'multi-input' | undefined;
  readonly startLabel?: ReactNode;
  readonly endLabel?: ReactNode;
  readonly startName?: string | undefined;
  readonly endName?: string | undefined;
  readonly clearable?: boolean | undefined;
  readonly onReset?: (() => void) | undefined;
  readonly resetKey?: number;
}

export function DateEntry({
  values,
  onValuesChange,
  onValidation,
  rules,
  shouldDisableDate,
  format,
  localeText,
  fieldProps,
  fieldType = 'single-input',
  startLabel,
  endLabel,
  startName,
  endName,
  clearable = false,
  onReset,
  resetKey = 0,
}: DateEntryProps) {
  const locale = rules.locale ?? 'en-US';
  const formatter = useMemo(() => createDateFormat(locale, format), [locale, format]);
  const text = dateEntryLocale(locale, localeText);
  const multi = values.length === 2 && fieldType === 'multi-input';
  const display = () =>
    multi ? values.map(formatter.display) : [values.some(Boolean) ? values.map(formatter.display).join(' – ') : ''];
  const key = datesKey(values);
  const formatKey = `${locale}/${format ?? ''}/${multi}/${resetKey}`;
  const [editing, setEditing] = useState(() => ({
    key,
    formatKey,
    raw: display(),
    errors: [] as DateValidationError[],
    publishedKey: null as string | null,
  }));
  const firstInput = useRef<TextFieldControl>(null);
  const secondInput = useRef<TextFieldControl>(null);
  const mergedInput = useMergedRefs(firstInput, fieldProps.inputRef);
  const [initialToday] = useState(() => calendarBounds(rules).today);
  const stableRules = { ...rules, today: rules.today ?? initialToday };
  const valueError = validateDates(values, stableRules, fieldProps.required, shouldDisableDate);
  const parseError = editing.errors.find(Boolean) ?? null;
  const validationError = parseError ?? valueError;
  const message = validationError ? text.error(validationError, formatter.placeholder) : '';
  const { name, ref, className, inputRef, InputProps, ...native } = fieldProps;

  if (editing.key !== key || editing.formatKey !== formatKey) {
    const keepRaw = editing.publishedKey === key && editing.formatKey === formatKey;

    setEditing({
      key,
      formatKey,
      raw: keepRaw ? editing.raw : display(),
      errors: keepRaw ? editing.errors : [],
      publishedKey: null,
    });
  }

  useEffect(() => {
    onValidation(validationError);
    firstInput.current?.setCustomValidity(message);
    secondInput.current?.setCustomValidity(message);
  }, [validationError, message, onValidation]);

  useEffect(() => {
    const form = firstInput.current?.form;
    const reset = () => {
      setEditing((previous) => ({ ...previous, raw: display(), errors: [] }));
      onReset?.();
    };

    form?.addEventListener('reset', reset);

    return () => form?.removeEventListener('reset', reset);
  });

  const update = (raw: string[], source: DateChangeContext['source'] = 'field') => {
    let pieces = raw;

    if (!multi && values.length === 2) {
      pieces = raw[0]!.split(/\s+[–—-]\s*/);
    }

    const parsed = Array.from({ length: values.length }, (_, index) => formatter.parse(pieces[index] ?? ''));
    const next = parsed.map((part) => part.date);
    const errors = parsed.map((part) => part.error);
    const error = errors.find(Boolean) ?? validateDates(next, stableRules, native.required, shouldDisableDate);

    if (pieces.length > values.length) {
      errors[0] = 'invalidDate';
    }

    setEditing({ key, formatKey, raw, errors, publishedKey: datesKey(next) });
    onValuesChange(next, { validationError: errors.find(Boolean) ?? error, source });
  };
  const clear =
    clearable && !native.disabled && !native.readOnly ? (
      <IconButton
        variant="standard"
        aria-label={text.clear}
        onClick={() => {
          update(multi ? ['', ''] : [''], 'clear');
          firstInput.current?.focus();
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z"
          />
        </svg>
      </IconButton>
    ) : null;

  return (
    <div
      ref={ref}
      dir={native.dir}
      className={[dateEntryRoot, className].filter(Boolean).join(' ')}
      data-md3-date-entry=""
      data-full-width={native.fullWidth}
    >
      {editing.raw.map((raw, index) => (
        <DateEntryInput
          key={index === 0 ? 'start' : 'end'}
          raw={raw}
          format={formatter}
          range={values.length === 2 && !multi}
          onRawChange={(next) => update(editing.raw.map((current, position) => (position === index ? next : current)))}
          fieldProps={{
            ...native,
            id: native.id && multi ? `${native.id}-${index}` : native.id,
            inputRef: index === 0 ? mergedInput : secondInput,
            label: multi
              ? [startLabel ?? text.start, endLabel ?? text.end][index]
              : (native.label ?? (values.length === 2 ? text.chooseRange : text.chooseDate)),
            autoFocus: native.autoFocus && index === 0,
            inputMode: native.inputMode ?? (values.length === 1 || multi ? 'numeric' : 'text'),
            placeholder:
              native.placeholder ??
              (values.length === 2 && !multi
                ? `${formatter.placeholder} – ${formatter.placeholder}`
                : formatter.placeholder),
            error: native.error || validationError !== null,
            helperText: validationError ? <span role="status">{message}</span> : native.helperText,
            InputProps: {
              ...InputProps,
              endAdornment:
                index === editing.raw.length - 1 ? (
                  <>
                    {clear}
                    {InputProps?.endAdornment}
                  </>
                ) : undefined,
            },
            onBlur: (event) => {
              native.onBlur?.(event);

              if (!event.defaultPrevented && !editing.errors.some(Boolean)) {
                setEditing((previous) => ({ ...previous, raw: display() }));
              }
            },
          }}
        />
      ))}
      {values.map((day, index) => (
        <input
          key={index === 0 ? 'start' : 'end'}
          type="hidden"
          form={native.form}
          disabled={native.disabled}
          name={
            values.length === 1
              ? name
              : [startName ?? (name ? `${name}.start` : undefined), endName ?? (name ? `${name}.end` : undefined)][
                  index
                ]
          }
          value={day?.toString() ?? ''}
        />
      ))}
    </div>
  );
}
