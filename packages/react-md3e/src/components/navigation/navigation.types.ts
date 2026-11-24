import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { SheetProps } from '../sheet/sheet.types';

export type NavigationValue = string | number;

export interface NavigationSelectionProps {
  readonly value?: NavigationValue | null | undefined;
  readonly defaultValue?: NavigationValue | null | undefined;
  /** Return false or newly prevent the event to cancel selection and link navigation. */
  readonly onChange?: ((event: Event, value: NavigationValue) => void | boolean) | undefined;
}

export type NavigationName =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'aria-label'?: string; readonly 'aria-labelledby': string };

export type NavigationProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'role' | 'onChange' | 'defaultValue' | 'aria-label' | 'aria-labelledby'
> &
  NavigationSelectionProps &
  NavigationName;

export type NavigationModalOptions = Pick<
  SheetProps,
  | 'open'
  | 'defaultOpen'
  | 'trigger'
  | 'onOpenChange'
  | 'onOpenChangeComplete'
  | 'onClose'
  | 'keepMounted'
  | 'disableEscapeKeyDown'
  | 'disableSwipe'
  | 'container'
  | 'initialFocus'
  | 'finalFocus'
>;

export interface NavigationLayoutProps {
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
}

export type NavigationInternalProps = NavigationProps &
  NavigationLayoutProps &
  NavigationModalOptions & {
    readonly kind: 'bar' | 'rail' | 'drawer';
    readonly modal?: boolean;
  };
