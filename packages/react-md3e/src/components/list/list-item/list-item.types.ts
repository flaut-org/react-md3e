import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ListItemContentProps } from '../../list-item-content/list-item-content.types';

type ItemDomProps = Omit<
  ComponentPropsWithRef<'li'>,
  'value' | 'role' | 'children' | 'aria-selected' | 'aria-checked' | 'tabIndex'
> &
  ListItemContentProps & { readonly divider?: boolean };

export type StaticListItemProps = ItemDomProps & {
  readonly value?: never;
  readonly disabled?: never;
  readonly readOnly?: never;
  readonly disableRipple?: never;
  readonly textValue?: never;
  readonly action?: never;
  readonly expansion?: never;
  readonly leadingAction?: never;
  readonly trailingAction?: never;
};

export type SelectableListItemProps = ItemDomProps & {
  readonly value: string;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly disableRipple?: boolean;
  /** Plain label for typeahead when primary/children contains custom markup. */
  readonly textValue?: string;
  readonly action?: never;
  readonly expansion?: never;
  readonly leadingAction?: never;
  readonly trailingAction?: never;
};

type ActionOwnedProps = 'children' | 'disabled' | 'aria-pressed' | 'aria-selected' | 'aria-expanded' | 'aria-controls';

/** Native attributes belong to the primary action, while ListItem's ref and DOM props belong to li. */
export type ListItemActionProps =
  | (Omit<ComponentPropsWithRef<'button'>, ActionOwnedProps | 'value' | 'defaultValue'> & { readonly href?: never })
  | (Omit<ComponentPropsWithRef<'a'>, ActionOwnedProps | 'href'> & { readonly href: string });

export interface ListItemExpansionProps {
  readonly content: ReactNode;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean, event: Event) => void | boolean;
  readonly keepMounted?: boolean;
  readonly panelProps?: ComponentPropsWithRef<'div'>;
}

type ActionItemProps = ItemDomProps & {
  readonly value?: never;
  readonly readOnly?: never;
  readonly textValue?: never;
  readonly disabled?: boolean;
  readonly disableRipple?: boolean;
  /** Independent controls; decorative visuals continue to use leading/trailing. */
  readonly leadingAction?: ReactNode;
  readonly trailingAction?: ReactNode;
};

export type ActionListItemProps = ActionItemProps & {
  readonly action: ListItemActionProps;
  readonly expansion?: never;
};

export type ExpandableListItemProps = ActionItemProps & {
  readonly action?: never;
  readonly expansion: ListItemExpansionProps;
};

export type ListItemProps =
  StaticListItemProps | SelectableListItemProps | ActionListItemProps | ExpandableListItemProps;
