import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type { NavigationValue } from '../navigation/navigation.types';

type Selection =
  | { readonly value: NavigationValue; readonly selected?: never }
  | { readonly value?: never; readonly selected?: boolean };

type Appearance = Selection & {
  readonly label?: ReactNode;
  readonly icon?: ReactNode;
  readonly selectedIcon?: ReactNode;
  readonly badge?: ReactNode;
  readonly disabled?: boolean;
  readonly disableRipple?: boolean;
};

export type NavigationItemProps<C extends ElementType = 'button'> = Appearance & {
  readonly component?: C;
} & Omit<ComponentPropsWithRef<C>, keyof Appearance | 'component' | 'type' | 'role' | 'aria-current' | 'aria-pressed'>;

export type NavigationItemLinkProps = Appearance &
  Omit<
    ComponentPropsWithRef<'a'>,
    keyof Appearance | 'component' | 'href' | 'type' | 'role' | 'aria-current' | 'aria-pressed'
  > & {
    readonly href: string;
    readonly component?: 'a';
  };
