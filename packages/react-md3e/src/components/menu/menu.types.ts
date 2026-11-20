import type { ComponentPropsWithRef, MouseEvent, ReactElement, ReactNode, Ref, RefObject } from 'react';

export type MenuVariant = 'standard' | 'vibrant';
export type MenuDensity = 0 | -1 | -2 | -3;
export type MenuLayout = 'standard' | 'grouped';
type Side = 'top' | 'bottom' | 'left' | 'right';
export type MenuPlacement = Side | `${Side}-${'start' | 'end'}`;
export type MenuCloseReason =
  'escapeKeyDown' | 'clickAway' | 'triggerClick' | 'focusOut' | 'itemClick' | 'tabKeyDown' | 'programmatic';

export interface MenuSurfaceProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'onClose'> {
  /** Separate MenuGroup/MenuRadioGroup surfaces with a transparent 2px gap. */
  readonly layout?: MenuLayout;
  readonly variant?: MenuVariant;
  /** Fine-pointer density. Coarse pointers retain 48px targets. */
  readonly density?: MenuDensity;
  readonly offset?: number;
  readonly collisionPadding?: number;
  readonly positionMethod?: 'absolute' | 'fixed';
  readonly container?: HTMLElement | null | (() => HTMLElement | null);
  /** Retain uncontrolled item selections between openings. Defaults to true. */
  readonly keepMounted?: boolean;
  readonly finalFocus?: boolean | RefObject<HTMLElement | null>;
}

interface MenuStateProps {
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean, event: Event) => void | boolean;
  readonly onClose?: (event: Event, reason: MenuCloseReason) => void | boolean;
  readonly disabled?: boolean;
  readonly loopFocus?: boolean;
}

export interface MenuProps extends MenuSurfaceProps, MenuStateProps {
  /** A native button or component forwarding button props and ref. */
  readonly trigger: ReactElement<Pick<ComponentPropsWithRef<'button'>, 'id' | 'disabled'>>;
  readonly placement?: MenuPlacement;
  readonly modal?: boolean;
  readonly anchorEl?: Element | null | RefObject<Element | null> | (() => Element | null);
}

export interface MenuItemContentProps {
  readonly children?: ReactNode;
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly supportingText?: ReactNode;
  /** Plain primary label for typeahead when children contain custom markup. */
  readonly textValue?: string;
}

export interface MenuItemBaseProps
  extends
    Omit<
      ComponentPropsWithRef<'div'>,
      'role' | 'tabIndex' | 'onClick' | 'onChange' | 'ref' | 'children' | 'aria-checked' | 'aria-selected'
    >,
    MenuItemContentProps {
  readonly ref?: Ref<HTMLElement>;
  readonly disabled?: boolean;
  readonly disableRipple?: boolean;
  readonly closeOnClick?: boolean;
  /** Returning false or preventing default cancels activation and dismissal. */
  readonly onClick?: (event: MouseEvent<HTMLElement>) => void | boolean;
}

export interface MenuItemProps extends MenuItemBaseProps {
  /** Visual selection for application-owned navigation; use radio/checkbox items for settings. */
  readonly selected?: boolean;
  readonly href?: string;
  readonly target?: ComponentPropsWithRef<'a'>['target'];
  readonly rel?: string;
  readonly download?: string | boolean;
}

export interface MenuCheckboxItemProps extends MenuItemBaseProps {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly onChange?: (event: Event, checked: boolean) => void | boolean;
}

export interface MenuRadioItemProps extends MenuItemBaseProps {
  readonly value: string;
}

export interface MenuGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'role'> {
  readonly label?: ReactNode;
}

export interface MenuRadioGroupProps extends Omit<MenuGroupProps, 'defaultValue' | 'onChange'> {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly onChange?: (event: Event, value: string) => void | boolean;
}

export type MenuDividerProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'role' | 'tabIndex'>;

export interface MenuSubmenuProps extends MenuSurfaceProps, MenuStateProps {
  readonly label: ReactNode;
  readonly leading?: ReactNode;
  readonly textValue?: string;
}
