import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';

type NativeProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'color' | 'onChange' | 'role' | 'aria-checked' | 'defaultChecked' | 'dangerouslySetInnerHTML'
>;

export type SwitchProps = NativeProps & {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly disableRipple?: boolean;
  readonly name?: string;
  readonly value?: string;
  readonly form?: string;
  readonly inputRef?: Ref<HTMLInputElement>;
  /** Optional decorative 16px icon in the unselected handle. */
  readonly icon?: ReactNode;
  /** Optional decorative 16px icon in the selected handle. */
  readonly checkedIcon?: ReactNode;
  /** Native DOM event and next checked state; preventDefault vetoes the change. */
  readonly onChange?: (event: Event, checked: boolean) => void;
};
