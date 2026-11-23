import type { ComponentPropsWithRef, ReactNode } from 'react';

export type TabValue = string | number;

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  readonly variant?: 'primary' | 'secondary';
  readonly value?: TabValue | null;
  readonly defaultValue?: TabValue | null;
  /** Return false or prevent the event to cancel a user-initiated change. */
  readonly onChange?: (event: Event, value: TabValue | null) => void | boolean;
}

export interface TabListProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'aria-orientation'> {
  readonly scrollable?: boolean;
  readonly selectionFollowsFocus?: boolean;
  readonly loopFocus?: boolean;
}

export interface TabProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultValue' | 'type' | 'role' | 'aria-selected' | 'aria-controls'
> {
  readonly value: TabValue;
  readonly label?: ReactNode;
  readonly icon?: ReactNode;
  readonly iconPosition?: 'top' | 'start';
  readonly badge?: ReactNode;
  readonly disableRipple?: boolean;
}

export interface TabPanelProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'hidden' | 'aria-labelledby'> {
  readonly value: TabValue;
  readonly keepMounted?: boolean;
}
