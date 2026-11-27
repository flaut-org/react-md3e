'use client';

import { useRef } from 'react';
import { useDateInputMask } from '../../../internal/hooks/use-date-input-mask.hook';
import { useMergedRefs } from '../../../internal/hooks/use-merged-refs.hook';
import { TextField } from '../../text-field';
import type { TextFieldControl, TextFieldProps } from '../../text-field';
import type { DateFormat } from '../date-entry-format';

interface DateEntryInputProps {
  readonly raw: string;
  readonly format: DateFormat;
  readonly range: boolean;
  readonly fieldProps: TextFieldProps;
  readonly onRawChange: (raw: string) => void;
}

export function DateEntryInput({ raw, format, range, fieldProps, onRawChange }: DateEntryInputProps) {
  const input = useRef<TextFieldControl>(null);
  const ref = useMergedRefs(input, fieldProps.inputRef);
  const mask = useDateInputMask({ raw, format, range, input, native: fieldProps, onChange: onRawChange });

  return <TextField {...fieldProps} {...mask} inputRef={ref} />;
}
