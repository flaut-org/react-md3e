import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { FabSize } from '../fab/fab.types';
import type { MenuItemProps, MenuProps } from '../menu/menu.types';

export type FabMenuColor = 'primary' | 'secondary' | 'tertiary';
export type FabMenuButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  | 'children'
  | 'type'
  | 'disabled'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-haspopup'
  | 'aria-expanded'
  | 'aria-controls'
  | 'aria-pressed'
> & { readonly disableRipple?: boolean };
export type FabMenuPopupProps = Omit<
  MenuProps,
  | 'trigger'
  | 'children'
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'onClose'
  | 'disabled'
  | 'dir'
  | 'variant'
  | 'density'
  | 'layout'
  | 'placement'
  | 'anchorEl'
>;

export interface FabMenuProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'color' | 'onClick'> {
  /** Two to six FabMenuItem actions, in reading order. */
  readonly children: ReactNode;
  readonly icon: ReactNode;
  readonly label: string;
  readonly closeLabel?: string;
  readonly color?: FabMenuColor;
  readonly size?: Exclude<FabSize, 'small'>;
  readonly lowered?: boolean;
  readonly disabled?: boolean;
  readonly fabProps?: FabMenuButtonProps;
  readonly menuProps?: FabMenuPopupProps;
  readonly open?: MenuProps['open'];
  readonly defaultOpen?: MenuProps['defaultOpen'];
  readonly onOpenChange?: MenuProps['onOpenChange'];
  readonly onClose?: MenuProps['onClose'];
}

export interface FabMenuItemProps extends Omit<
  MenuItemProps,
  'children' | 'leading' | 'trailing' | 'supportingText' | 'selected' | 'closeOnClick'
> {
  readonly children: ReactNode;
  readonly icon?: ReactNode;
}
