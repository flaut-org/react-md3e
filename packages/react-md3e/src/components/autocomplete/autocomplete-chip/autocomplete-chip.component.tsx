'use client';

import { Combobox } from '@base-ui/react/combobox';
import { autocompleteChip, autocompleteChipRemove } from './autocomplete-chip.styles';

export function AutocompleteChip({
  label,
  readOnly,
  removeText,
}: {
  readonly label: string;
  readonly readOnly: boolean;
  readonly removeText: string;
}) {
  return (
    <Combobox.Chip
      className={autocompleteChip}
      aria-label={label}
      render={(props) => <div {...props} aria-readonly={undefined} />}
    >
      {label}
      {!readOnly && (
        <Combobox.ChipRemove className={autocompleteChipRemove} aria-label={`${removeText} ${label}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6 6 12 12M6 18 18 6" />
          </svg>
        </Combobox.ChipRemove>
      )}
    </Combobox.Chip>
  );
}
