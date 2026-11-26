'use client';

import { Combobox } from '@base-ui/react/combobox';
import { Chip } from '../../chip/chip.component';

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
      aria-label={label}
      render={(props, state) => (
        <Chip
          {...props}
          aria-readonly={undefined}
          kind="input"
          label={label}
          disabled={state.disabled}
          readOnly={readOnly}
          removable={!readOnly}
          deleteLabel={`${removeText} ${label}`}
          slots={{ deleteButton: Combobox.ChipRemove }}
        />
      )}
    />
  );
}
