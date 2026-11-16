import type { ComponentPropsWithRef, ReactNode } from 'react';

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';
export type IconButtonSize = 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
export type IconButtonShape = 'round' | 'square';
export type IconButtonWidth = 'narrow' | 'default' | 'wide';

type NativeProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'color' | 'aria-pressed' | 'aria-label' | 'aria-labelledby'
>;
type AccessibleName =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'aria-label'?: string; readonly 'aria-labelledby': string };

export type IconButtonProps = NativeProps &
  AccessibleName & {
    readonly children: ReactNode;
    readonly variant?: IconButtonVariant;
    readonly size?: IconButtonSize;
    readonly shape?: IconButtonShape;
    readonly width?: IconButtonWidth;
    readonly selected?: boolean;
    readonly disableRipple?: boolean;
  };
