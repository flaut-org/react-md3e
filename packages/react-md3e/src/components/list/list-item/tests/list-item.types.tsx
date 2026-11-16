import type { ListItemProps } from '@flaut-travel/react-md3e';

// @ts-expect-error Individual disabled state requires an interactive value.
export const disabledStatic: ListItemProps = { primary: 'Static', disabled: true };

// @ts-expect-error Selected state comes from the parent value.
export const contradictoryState: ListItemProps = { value: 'en', selected: true };
