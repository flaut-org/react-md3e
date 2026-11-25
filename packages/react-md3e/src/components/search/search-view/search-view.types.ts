import type { RefObject } from 'react';
import type { SearchAnchorStyle } from '../../../internal/hooks/use-search-anchor.hook';
import type { SearchProps } from '../search.types';

export interface SearchViewInternalProps extends Pick<
  SearchProps,
  | 'label'
  | 'placeholder'
  | 'layout'
  | 'viewTrailing'
  | 'viewProps'
  | 'viewInputRef'
  | 'clearText'
  | 'disableClearable'
  | 'children'
  | 'loading'
  | 'loadingText'
  | 'statusText'
  | 'emptyText'
  | 'resultsLabel'
  | 'backText'
  | 'inputProps'
  | 'form'
  | 'dir'
> {
  readonly query: string;
  readonly anchorStyle: SearchAnchorStyle;
  readonly sourceBarRef: RefObject<HTMLDivElement | null>;
  readonly keyboardReturn: boolean;
  readonly onInteractionChange: (keyboard: boolean) => void;
  readonly onReactivate: (event: Event) => boolean;
  readonly restoreFocus: (interaction: string) => HTMLInputElement | null | false;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly resultsRef: RefObject<HTMLDivElement | null>;
  readonly onChange: NonNullable<SearchProps['onChange']>;
  readonly onSearch: NonNullable<SearchProps['onSearch']>;
  readonly popupId: string;
}
