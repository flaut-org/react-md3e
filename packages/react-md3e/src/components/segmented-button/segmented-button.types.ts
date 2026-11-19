import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface SegmentedButtonCommonProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'onChange' | 'defaultValue' | 'role' | 'aria-orientation' | 'aria-multiselectable'
> {
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly allowEmpty?: boolean;
  readonly fullWidth?: boolean;
  readonly hideSelectionIndicator?: boolean;
  readonly selectedIcon?: ReactNode;
  readonly name?: string;
  readonly form?: string;
}

export type SegmentedButtonProps = SegmentedButtonCommonProps &
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
  );

export type ButtonSegmentProps = Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultValue' | 'onChange' | 'name' | 'form' | 'type' | 'role' | 'aria-checked' | 'aria-pressed'
> & {
  readonly value: string;
  readonly icon?: ReactNode;
  readonly disableRipple?: boolean;
};
