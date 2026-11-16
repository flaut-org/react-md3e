'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { IconButton } from '../../icon-button/icon-button.component';
import { SearchBar } from '../search-bar/search-bar.component';
import { SearchIcon } from '../search-icons/search-icons.component';
import { useMergedRefs } from '../../../internal/hooks/use-merged-refs.hook';
import { enterSearchResults, navigateSearchResults } from '../search.helpers';
import {
  searchPopup,
  searchHeader,
  searchResults,
  searchScroll,
  searchStatus,
  searchLoading,
  searchBack,
  searchEmpty,
} from './search-view.styles';
import type { SearchViewInternalProps } from './search-view.types';

export function SearchView({
  query,
  label,
  placeholder,
  layout = 'auto',
  viewTrailing,
  viewProps = {},
  viewInputRef,
  clearText,
  disableClearable,
  children,
  loading = false,
  loadingText = 'Searching…',
  statusText = '',
  emptyText,
  resultsLabel = 'Search results',
  backText = 'Back',
  inputProps = {},
  form,
  dir,
  anchorStyle,
  restoreFocus,
  inputRef,
  resultsRef,
  onChange,
  onSearch,
  popupId,
}: SearchViewInternalProps) {
  const fieldRef = useMergedRefs(inputRef, viewInputRef);
  const fallback = loading ? loadingText : emptyText;

  return (
    <BaseDialog.Popup
      {...viewProps}
      style={{ ...viewProps.style, ...anchorStyle }}
      id={viewProps.id ?? popupId}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initialFocus={inputRef}
      finalFocus={restoreFocus}
      dir={dir}
      className={[searchPopup, viewProps.className].filter(Boolean).join(' ')}
      data-md3-search-view=""
      data-layout={layout}
    >
      <div className={searchHeader} data-md3-search-header="">
        <SearchBar
          label={label}
          placeholder={placeholder}
          value={query}
          onChange={onChange}
          onSearch={onSearch}
          inputRef={fieldRef}
          fullWidth
          clearText={clearText}
          disableClearable={disableClearable}
          form={form}
          inputProps={{
            ...inputProps,
            id: `${popupId}-query`,
            onKeyDown: (event) => {
              inputProps.onKeyDown?.(event);

              if (!event.defaultPrevented && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                event.preventDefault();
                enterSearchResults(resultsRef.current, event.key === 'ArrowUp');
              }
            },
          }}
          leading={
            <BaseDialog.Close
              render={
                <IconButton variant="standard" aria-label={backText} dir={dir} className={searchBack}>
                  <SearchIcon kind="back" />
                </IconButton>
              }
            />
          }
          trailing={viewTrailing}
        />
      </div>
      <div className={searchResults} data-md3-search-results="" aria-busy={loading}>
        {loading && <div className={searchLoading} role="progressbar" aria-label={loadingText} />}
        {/* This named region delegates bubbling arrow keys between native actions, without changing their roles. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={resultsRef}
          className={searchScroll}
          role="region"
          aria-label={resultsLabel}
          tabIndex={-1}
          onKeyDown={(event) => navigateSearchResults(event, resultsRef.current, inputRef.current)}
        >
          {children ?? (fallback != null && <div className={searchEmpty}>{fallback}</div>)}
        </div>
      </div>
      <p className={searchStatus} role="status" aria-live="polite" aria-atomic="true">
        {loading ? loadingText : statusText}
      </p>
    </BaseDialog.Popup>
  );
}
