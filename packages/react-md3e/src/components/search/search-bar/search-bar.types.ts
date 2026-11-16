import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';

export type SearchChangeReason = 'input' | 'clear';
export type SearchInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'ref'
  | 'disabled'
  | 'readOnly'
  | 'name'
  | 'form'
  | 'type'
  | 'role'
  | 'placeholder'
>;
export interface SearchBarProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue' | 'children'> {
  readonly label: string;
  readonly placeholder?: string | undefined;
  readonly value?: string | undefined;
  readonly defaultValue?: string | undefined;
  readonly onChange?: ((event: Event, value: string, reason: SearchChangeReason) => void) | undefined;
  readonly onSearch?: ((event: Event, value: string) => void | boolean) | undefined;
  readonly name?: string | undefined;
  readonly form?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
  readonly fullWidth?: boolean | undefined;
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly disableClearable?: boolean | undefined;
  readonly clearText?: string | undefined;
  readonly inputRef?: Ref<HTMLInputElement> | undefined;
  readonly inputProps?: SearchInputProps | undefined;
}
