import type { ComponentPropsWithRef } from 'react';
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
};

export type SelectableListItemProps = ItemDomProps & {
  readonly value: string;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly disableRipple?: boolean;
  /** Plain label for typeahead when primary/children contains custom markup. */
  readonly textValue?: string;
};

export type ListItemProps = StaticListItemProps | SelectableListItemProps;
