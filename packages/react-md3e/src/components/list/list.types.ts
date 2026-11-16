import type { ComponentPropsWithRef } from 'react';
import type { ListControlPosition } from '../list-item-content/list-item-content.types';

export type ListVariant = 'standard' | 'segmented';

export type ListSelectionMode = 'none' | 'single' | 'multiple';

interface CommonListProps extends Omit<ComponentPropsWithRef<'ul'>, 'role' | 'defaultValue' | 'onChange'> {
  readonly variant?: ListVariant;
  readonly disablePadding?: boolean;
}

type AccessibleName =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'aria-label'?: string; readonly 'aria-labelledby': string };

interface SelectionProps {
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly controlPosition?: ListControlPosition;
}

export type ReadOnlyListProps = CommonListProps & {
  readonly selectionMode?: 'none';
  readonly value?: never;
  readonly defaultValue?: never;
  readonly onValueChange?: never;
  readonly disabled?: never;
  readonly readOnly?: never;
  readonly controlPosition?: never;
  readonly selectionIndicator?: never;
};

export type SingleSelectListProps = CommonListProps &
  AccessibleName &
  SelectionProps & {
    readonly selectionMode: 'single';
    readonly value?: string | null;
    readonly defaultValue?: string | null;
    readonly onValueChange?: (value: string) => void;
    readonly selectionIndicator?: 'radio' | 'checkmark';
  };

export type MultiSelectListProps = CommonListProps &
  AccessibleName &
  SelectionProps & {
    readonly selectionMode: 'multiple';
    readonly value?: readonly string[];
    readonly defaultValue?: readonly string[];
    readonly onValueChange?: (value: string[]) => void;
    readonly selectionIndicator?: 'checkbox';
  };

export type ListProps = ReadOnlyListProps | SingleSelectListProps | MultiSelectListProps;

export type SelectableListProps = SingleSelectListProps | MultiSelectListProps;
