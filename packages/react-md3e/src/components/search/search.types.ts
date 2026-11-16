import type { ComponentPropsWithRef, Ref, ReactNode } from 'react';
import type { SearchBarProps } from './search-bar/search-bar.types';

export type SearchLayout = 'auto' | 'docked' | 'fullScreen';
export type SearchCloseReason = 'escapeKeyDown' | 'clickAway' | 'backButtonClick' | 'programmatic';
export type SearchContainer = HTMLElement | null | (() => HTMLElement | null);
export type SearchViewProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'role' | 'aria-modal' | 'aria-label'>;
export interface SearchProps extends Omit<SearchBarProps, 'onSearch' | 'children'> {
  readonly children?: ReactNode;
  readonly open?: boolean | undefined;
  readonly defaultOpen?: boolean | undefined;
  readonly onOpenChange?: (open: boolean, event: Event) => void | boolean;
  readonly onClose?: (event: Event, reason: SearchCloseReason) => void | boolean;
  readonly layout?: SearchLayout | undefined;
  readonly keepMounted?: boolean | undefined;
  readonly disableEscapeKeyDown?: boolean | undefined;
  readonly backText?: string | undefined;
  readonly resultsLabel?: string | undefined;
  readonly loading?: boolean | undefined;
  readonly loadingText?: string | undefined;
  readonly statusText?: string | undefined;
  readonly emptyText?: ReactNode;
  readonly viewTrailing?: ReactNode;
  readonly viewProps?: SearchViewProps | undefined;
  readonly viewInputRef?: Ref<HTMLInputElement> | undefined;
  readonly container?: SearchContainer;
  readonly onSearch?: (event: Event, value: string) => void | boolean;
}
