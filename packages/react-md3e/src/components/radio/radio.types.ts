import type { ComponentPropsWithRef, Ref } from 'react';

type NativeProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'onChange' | 'role' | 'aria-checked' | 'defaultChecked'
>;
export type RadioProps = NativeProps & {
  readonly value: string;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly error?: boolean;
  readonly disableRipple?: boolean;
  readonly inputRef?: Ref<HTMLInputElement>;
};
