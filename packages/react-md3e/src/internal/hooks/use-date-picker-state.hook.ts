'use client';

import { useEffect, useRef, useState } from 'react';
import { datesKey, validateDates } from '../../components/date-entry/date-entry-validation';
import type {
  DateChangeContext,
  DateValidationError,
  DateValidationProps,
} from '../../components/date-entry/date-entry.types';
import type { DatePickerCloseReason } from '../../components/date-picker/date-picker.types';
import type { RangePosition } from '../../components/range-calendar/range-calendar.types';

type Dates = readonly (Temporal.PlainDate | null)[];
interface PickerStateProps {
  readonly value: Dates | undefined;
  readonly defaultValue: Dates;
  readonly open: boolean | undefined;
  readonly defaultOpen: boolean | undefined;
  readonly onOpen: (() => void) | undefined;
  readonly onClose: ((reason: DatePickerCloseReason) => void) | undefined;
  readonly onChange: (value: Dates, context: DateChangeContext) => void;
  readonly onAccept: (value: Dates, context: DateChangeContext) => void;
  readonly onError: (error: DateValidationError, value: Dates) => void;
  readonly rules: DateValidationProps;
  readonly required: boolean | undefined;
  readonly shouldDisableDate: ((day: Temporal.PlainDate, position: RangePosition) => boolean) | undefined;
}

export function useDatePickerState(props: PickerStateProps) {
  const [uncontrolled, setUncontrolled] = useState(props.defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(props.defaultOpen ?? false);
  const value = props.value ?? uncontrolled;
  const open = props.open ?? uncontrolledOpen;
  const key = datesKey(value);
  const [session, setSession] = useState(() => ({
    open,
    key,
    accepted: value,
    draft: value,
    viewValue: value,
    error: null as DateValidationError,
    epoch: 0,
    lastPublished: null as string | null,
  }));
  const current = open ? session.draft : value;
  const validation = session.error ?? validateDates(current, props.rules, props.required, props.shouldDisableDate);
  const lastError = useRef<DateValidationError | undefined>(undefined);

  if (session.open !== open) {
    setSession({
      open,
      key,
      accepted: value,
      draft: value,
      viewValue: value,
      error: null,
      epoch: session.epoch + 1,
      lastPublished: null,
    });
  } else if (session.key !== key) {
    const echoed = session.lastPublished === key;

    setSession({
      ...session,
      key,
      ...(echoed ? {} : { accepted: value, draft: value, viewValue: value, error: null, epoch: session.epoch + 1 }),
    });
  }

  useEffect(() => {
    if (lastError.current !== validation) {
      lastError.current = validation;
      props.onError(validation, current);
    }
  }, [validation, current, props]);

  const requestOpen = () => {
    if (props.open === undefined) {
      setUncontrolledOpen(true);
    }

    props.onOpen?.();
  };
  const close = (reason: DatePickerCloseReason) => {
    if (props.open === undefined) {
      setUncontrolledOpen(false);
    }

    props.onClose?.(reason);
  };
  const change = (next: Dates, context: DateChangeContext) => {
    const parseError = context.validationError === 'invalidDate' || context.validationError === 'incompleteDate';

    setSession((previous) => ({
      ...previous,
      draft: next,
      viewValue: parseError ? previous.viewValue : next,
      lastPublished: datesKey(next),
      error: parseError ? context.validationError : null,
      epoch: previous.epoch + (context.source === 'calendar' || context.source === 'clear' ? 1 : 0),
    }));

    if (!open && props.value === undefined) {
      setUncontrolled(next);
    }

    props.onChange(next, context);
  };
  const accept = (next = current, source: DateChangeContext['source'] = 'accept') => {
    const error = validateDates(next, props.rules, props.required, props.shouldDisableDate);

    if (error || (source === 'accept' && session.error)) {
      return;
    }

    if (props.value === undefined) {
      setUncontrolled(next);
    }

    props.onAccept(next, { validationError: null, source });

    if (open) {
      close('accept');
    }
  };
  const cancel = (reason: DatePickerCloseReason) => {
    if (datesKey(session.draft) !== datesKey(session.accepted) || session.error) {
      props.onChange(session.accepted, {
        validationError: validateDates(session.accepted, props.rules, props.required, props.shouldDisableDate),
        source: 'cancel',
      });
    }

    setSession((previous) => ({
      ...previous,
      draft: previous.accepted,
      viewValue: previous.accepted,
      lastPublished: datesKey(previous.accepted),
      error: null,
      epoch: previous.epoch + 1,
    }));
    close(reason);
  };
  const reset = () => {
    const next = props.value ?? props.defaultValue;

    if (props.value === undefined) {
      setUncontrolled(next);
    }

    setSession((previous) => ({
      ...previous,
      key: datesKey(next),
      accepted: next,
      draft: next,
      viewValue: next,
      lastPublished: null,
      error: null,
      epoch: previous.epoch + 1,
    }));
  };

  return {
    open,
    value,
    current,
    viewValue: open ? session.viewValue : value,
    error: validation,
    epoch: session.epoch,
    requestOpen,
    change,
    accept,
    cancel,
    reset,
  };
}
