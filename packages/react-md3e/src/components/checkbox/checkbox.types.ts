import type { ComponentPropsWithRef, Ref } from 'react';

type NativeProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'onChange' | 'role' | 'aria-checked' | 'defaultChecked'
>;
export type CheckboxProps = NativeProps & {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly indeterminate?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly error?: boolean;
  readonly disableRipple?: boolean;
  readonly name?: string;
  readonly value?: string;
  readonly form?: string;
  readonly inputRef?: Ref<HTMLInputElement>;
  /** Native change event and next checked state. */
  readonly onChange?: (event: Event, checked: boolean) => void;
};
