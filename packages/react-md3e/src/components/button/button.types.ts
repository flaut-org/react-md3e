import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
export type ButtonSize = 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
export type ButtonShape = 'round' | 'square';
type Appearance = {
  readonly size?: ButtonSize;
  readonly shape?: ButtonShape;
  readonly startIcon?: ReactNode;
  readonly endIcon?: ReactNode;
  readonly disableRipple?: boolean;
  readonly loading?: boolean;
  readonly loadingIndicator?: ReactNode;
  readonly fullWidth?: boolean;
  readonly disabled?: boolean;
} & (
  | { readonly variant?: Exclude<ButtonVariant, 'text'>; readonly selected?: boolean }
  | { readonly variant: 'text'; readonly selected?: never }
);
export type ButtonProps<C extends ElementType = 'button'> = Appearance & { readonly component?: C } & Omit<
    ComponentPropsWithRef<C>,
    keyof Appearance | 'component' | 'color' | 'aria-pressed'
  >;
export type ButtonLinkProps = Omit<ButtonProps<'a'>, 'href' | 'component'> & {
  readonly href: string;
  readonly component?: 'a';
};
