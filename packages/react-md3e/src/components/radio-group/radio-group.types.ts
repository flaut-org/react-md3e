import type { ComponentPropsWithRef } from 'react';

type NativeProps = Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue' | 'role'>;
export type RadioGroupProps = NativeProps & {
  readonly value?: string | null;
  readonly defaultValue?: string;
  readonly onChange?: (event: Event, value: string) => void;
  readonly name?: string;
  readonly form?: string;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly row?: boolean;
};
