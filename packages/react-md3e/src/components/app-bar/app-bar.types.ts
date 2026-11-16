import type { ComponentPropsWithRef, ReactNode } from 'react';

export type AppBarVariant = 'small' | 'mediumFlexible' | 'largeFlexible';
export type AppBarPosition = 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
export type AppBarTitleAlign = 'start' | 'center';

export interface AppBarProps extends Omit<ComponentPropsWithRef<'header'>, 'title'> {
  readonly title?: ReactNode;
  readonly subtitle?: ReactNode;
  readonly navigationIcon?: ReactNode;
  readonly actions?: ReactNode;
  readonly variant?: AppBarVariant;
  readonly position?: AppBarPosition;
  readonly titleAlign?: AppBarTitleAlign;
  /** Controlled MD3 surface/elevation state; no scroll listener is installed. */
  readonly scrolled?: boolean;
}
