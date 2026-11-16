'use client';

import { Combobox } from '@base-ui/react/combobox';
import { useMergedRefs } from '../../../internal/hooks/use-merged-refs.hook';
import type { TextFieldInputProps } from '../../text-field/text-field.types';

/** Selection validation belongs to Combobox's hidden input, rather than its search query. */
export function AutocompleteInput({ required, ref, rows, ...props }: TextFieldInputProps) {
  const inputRef = useMergedRefs(ref, undefined);

  return <Combobox.Input {...props} ref={inputRef} />;
}
