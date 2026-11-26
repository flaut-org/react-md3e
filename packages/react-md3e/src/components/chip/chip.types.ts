import type { ComponentPropsWithRef, ElementType, MouseEventHandler, ReactNode, SyntheticEvent } from 'react';

export type ChipKind = 'assist' | 'filter' | 'input' | 'suggestion';
export type ChipVariant = 'outlined' | 'elevated';
export type ChipShape = 'standard' | 'expressive';

interface ChipCommonProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'color' | 'onClick' | 'onChange' | 'onSelect' | 'aria-pressed'
> {
  readonly label: ReactNode;
  readonly icon?: ReactNode;
  readonly trailingIcon?: ReactNode;
  readonly disabled?: boolean;
  /** Visual dragged state; the application owns drag-and-drop behavior. */
  readonly dragged?: boolean;
  readonly disableRipple?: boolean;
  /** Primary action. The remove action never invokes this handler. */
  readonly onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly name?: string;
  readonly value?: string;
  readonly form?: string;
  readonly slotProps?: {
    readonly action?: Omit<
      ComponentPropsWithRef<'button'>,
      'children' | 'disabled' | 'aria-pressed' | 'type' | 'name' | 'value' | 'form'
    >;
    readonly deleteButton?: Omit<ComponentPropsWithRef<'button'>, 'children' | 'disabled'>;
  };
}

interface ChipSelectionProps {
  readonly selected?: boolean;
  readonly defaultSelected?: boolean;
  readonly onSelectedChange?: (event: Event, selected: boolean) => void | boolean;
  readonly selectedIcon?: ReactNode;
}

interface ChipRemovalProps {
  readonly onDelete?: (event: SyntheticEvent<HTMLElement>) => void;
  /** Defaults to Boolean(onDelete). Useful when a composition primitive owns removal. */
  readonly removable?: boolean;
  readonly deleteIcon?: ReactNode;
  /** Defaults to "Remove <label>" for a string label; required for a complex label. */
  readonly deleteLabel?: string;
  readonly slots?: { readonly deleteButton?: ElementType };
}

type ActionChipProps = ChipCommonProps & {
  readonly kind: 'assist' | 'suggestion';
  readonly variant?: ChipVariant;
  readonly shape?: 'standard';
  readonly selected?: never;
  readonly defaultSelected?: never;
  readonly onSelectedChange?: never;
  readonly selectedIcon?: never;
  readonly avatar?: never;
  readonly readOnly?: never;
  readonly onDelete?: never;
  readonly removable?: never;
  readonly deleteIcon?: never;
  readonly deleteLabel?: never;
  readonly slots?: never;
};

type FilterChipProps = ChipCommonProps &
  ChipSelectionProps &
  ChipRemovalProps & {
    readonly kind: 'filter';
    readonly variant?: ChipVariant;
    readonly shape?: ChipShape;
    readonly avatar?: never;
    readonly readOnly?: never;
    readonly type?: 'button';
    readonly name?: never;
    readonly value?: never;
    readonly form?: never;
  };

export type InputChipProps = ChipCommonProps &
  ChipSelectionProps &
  ChipRemovalProps & {
    readonly kind: 'input';
    readonly variant?: 'outlined';
    readonly shape?: ChipShape;
    readonly avatar?: ReactNode;
    readonly selectedIcon?: never;
    readonly readOnly?: boolean;
    readonly type?: 'button';
    readonly name?: never;
    readonly value?: never;
    readonly form?: never;
  };

export type ChipProps = ActionChipProps | FilterChipProps | InputChipProps;

export interface ChipSetProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'aria-orientation'> {
  readonly disabled?: boolean;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly loopFocus?: boolean;
}
