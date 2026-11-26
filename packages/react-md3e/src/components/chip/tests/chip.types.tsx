import { createRef } from 'react';
import { Chip, ChipSet } from '@flaut-travel/react-md3e/chip';
import type { ChipProps, InputChipProps } from '@flaut-travel/react-md3e';

export const filters = (
  <ChipSet aria-label="Filters">
    <Chip
      kind="filter"
      label="Nonstop"
      shape="expressive"
      onSelectedChange={(_event, selected) => selected}
      ref={createRef<HTMLDivElement>()}
      slotProps={{ action: { ref: createRef<HTMLButtonElement>() } }}
    />
  </ChipSet>
);
export const input: InputChipProps = {
  kind: 'input',
  label: 'Alex',
  avatar: 'AM',
  onDelete: (event) => event.preventDefault(),
};
export const submit: ChipProps = {
  kind: 'assist',
  label: 'Save',
  type: 'submit',
  name: 'intent',
  value: 'save',
  form: 'booking',
};
// @ts-expect-error The MD3 type is intentional and required.
export const missingKind: ChipProps = { label: 'Chip' };
// @ts-expect-error Chips always have a text label.
export const missingLabel: ChipProps = { kind: 'assist' };
// @ts-expect-error Input chips have no elevated variant.
export const elevatedInput: ChipProps = { kind: 'input', label: 'Alex', variant: 'elevated' };
// @ts-expect-error Assist chips trigger actions; they cannot be selected.
export const selectedAssist: ChipProps = { kind: 'assist', label: 'Save', selected: true };
// @ts-expect-error Suggestions are not removable input tokens.
export const removableSuggestion: ChipProps = { kind: 'suggestion', label: 'Paris', onDelete: () => {} };
// @ts-expect-error Avatars belong to input chips.
export const avatarFilter: ChipProps = { kind: 'filter', label: 'Paris', avatar: 'P' };
// @ts-expect-error Expressive selection shapes belong to filter and input chips.
export const expressiveAssist: ChipProps = { kind: 'assist', label: 'Save', shape: 'expressive' };
// @ts-expect-error Do not introduce MD2 visual aliases.
export const containedChip: ChipProps = { kind: 'assist', label: 'Save', variant: 'contained' };
// @ts-expect-error Filter selection must not submit a surrounding form.
export const filterSubmit: ChipProps = { kind: 'filter', label: 'Nonstop', type: 'submit' };
// @ts-expect-error Input tokens are data, not submit actions.
export const inputSubmit: ChipProps = { kind: 'input', label: 'Alex', type: 'submit' };
// @ts-expect-error The selected checkmark belongs to filter chips; input icons keep their identity.
export const inputCheck: ChipProps = { kind: 'input', label: 'Alex', selectedIcon: 'check' };
