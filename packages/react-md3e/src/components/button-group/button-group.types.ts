import type { ComponentPropsWithRef } from 'react';
import type { ButtonProps, ButtonSize, ButtonVariant } from '../button/button.types';

export type ButtonGroupVariant = 'connected' | 'standard';
export interface ButtonGroupCommonProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  readonly variant?: ButtonGroupVariant;
  readonly size?: ButtonSize;
  readonly buttonVariant?: Exclude<ButtonVariant, 'text'>;
  readonly disabled?: boolean;
  readonly allowEmpty?: boolean;
  readonly fullWidth?: boolean;
  readonly orientation?: 'horizontal' | 'vertical';
}
export type ButtonGroupProps = ButtonGroupCommonProps &
  (
    | {
        readonly selectionMode?: 'single';
        readonly value?: string | null;
        readonly defaultValue?: string | null;
        readonly onChange?: (event: Event, value: string | null) => void | boolean;
      }
    | {
        readonly selectionMode: 'multiple';
        readonly value?: readonly string[];
        readonly defaultValue?: readonly string[];
        readonly onChange?: (event: Event, value: string[]) => void | boolean;
      }
    | {
        readonly selectionMode: 'none';
        readonly value?: never;
        readonly defaultValue?: never;
        readonly onChange?: never;
      }
  );
export type ButtonGroupButtonProps = Omit<
  ButtonProps,
  'component' | 'href' | 'selected' | 'variant' | 'size' | 'value'
> & { readonly value: string };
