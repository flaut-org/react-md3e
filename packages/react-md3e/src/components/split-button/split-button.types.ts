import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ButtonProps, ButtonSize, ButtonVariant } from '../button/button.types';
import type { MenuProps } from '../menu/menu.types';

export type SplitButtonVariant = Exclude<ButtonVariant, 'text'>;
export type SplitButtonSize = ButtonSize;
export type SplitButtonActionProps = Omit<
  ButtonProps,
  | 'component'
  | 'children'
  | 'variant'
  | 'size'
  | 'shape'
  | 'selected'
  | 'fullWidth'
  | 'startIcon'
  | 'endIcon'
  | 'disableRipple'
  | 'loading'
  | 'onClick'
>;
export type SplitButtonMenuButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'type' | 'aria-label' | 'aria-labelledby' | 'aria-haspopup' | 'aria-expanded' | 'aria-controls'
>;
export type SplitButtonMenuProps = Omit<
  MenuProps,
  'trigger' | 'children' | 'disabled' | 'dir' | 'open' | 'defaultOpen' | 'onOpenChange' | 'onClose'
>;

export interface SplitButtonProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'onClick' | 'role'> {
  readonly children: ReactNode;
  readonly menu: ReactNode;
  /** Name the related choices, for example "More send options". */
  readonly menuButtonLabel: string;
  readonly variant?: SplitButtonVariant;
  readonly size?: SplitButtonSize;
  readonly startIcon?: ReactNode;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
  readonly disableRipple?: boolean;
  readonly onClick?: ButtonProps['onClick'];
  readonly buttonProps?: SplitButtonActionProps;
  readonly menuButtonProps?: SplitButtonMenuButtonProps;
  readonly menuProps?: SplitButtonMenuProps;
  readonly open?: MenuProps['open'];
  readonly defaultOpen?: MenuProps['defaultOpen'];
  readonly onOpenChange?: MenuProps['onOpenChange'];
  readonly onClose?: MenuProps['onClose'];
}
