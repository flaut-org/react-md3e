'use client';

import { useLayoutEffect, useRef } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { IconButton } from '../../icon-button/icon-button.component';
import { SearchBar } from '../search-bar/search-bar.component';
import { SearchIcon } from '../search-icons/search-icons.component';
import { useMergedRefs } from '../../../internal/hooks/use-merged-refs.hook';
import { enterSearchResults, navigateSearchResults } from '../search.helpers';
import { SearchHeaderTransition } from './search-header-transition/search-header-transition.component';
import { measureSearchViewInput } from './search-header-transition/search-header-transition.helpers';
import {
  searchPopup,
  searchHeader,
  searchResults,
  searchScroll,
  searchStatus,
  searchLoading,
  searchBack,
  searchEmpty,
  searchViewTrailing,
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
  sourceBarRef,
  keyboardReturn,
  onInteractionChange,
  onReactivate,
  restoreFocus,
  inputRef,
  resultsRef,
  onChange,
  onSearch,
  popupId,
}: SearchViewInternalProps) {
  const fieldRef = useMergedRefs(inputRef, viewInputRef);
  const barRef = useRef<HTMLDivElement>(null);
  const fallback = loading ? loadingText : emptyText;

  useLayoutEffect(() => {
    const bar = barRef.current;
    const input = inputRef.current;
    const popup = bar?.closest<HTMLElement>('[data-md3-search-view]');

    if (bar && input && popup) {
      const update = () => measureSearchViewInput(bar, input, popup);
      const observer = new ResizeObserver(update);

      update();
      observer.observe(bar);
      observer.observe(bar.querySelector('[data-md3-search-view-trailing]')!);

      return () => observer.disconnect();
    }

    return undefined;
  }, [inputRef]);

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
      data-keyboard-return={keyboardReturn}
      onKeyDownCapture={(event) => {
        viewProps.onKeyDownCapture?.(event);

        if (!event.defaultPrevented) {
          onInteractionChange(true);
        }
      }}
      onPointerDownCapture={(event) => {
        viewProps.onPointerDownCapture?.(event);

        if (!event.defaultPrevented) {
          onInteractionChange(false);
        }
      }}
      onPointerDown={(event) => {
        viewProps.onPointerDown?.(event);

        if (
          !event.defaultPrevented &&
          event.currentTarget.hasAttribute('data-ending-style') &&
          event.target instanceof Element &&
          event.target.closest('[data-md3-search-header]') &&
          !event.target.closest('button, a')
        ) {
          onReactivate(event.nativeEvent);
        }
      }}
    >
      <div className={searchHeader} data-md3-search-header="">
        <SearchBar
          ref={barRef}
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
            onCompositionEnd: (event) => {
              inputProps.onCompositionEnd?.(event);

              if (!event.defaultPrevented && event.currentTarget.closest('[data-ending-style]')) {
                onReactivate(event.nativeEvent);
              }
            },
            onKeyDown: (event) => {
              inputProps.onKeyDown?.(event);

              if (
                !event.defaultPrevented &&
                !event.nativeEvent.isComposing &&
                event.nativeEvent.keyCode !== 229 &&
                event.currentTarget.closest('[data-ending-style]') &&
                ['Enter', 'ArrowDown'].includes(event.key)
              ) {
                onReactivate(event.nativeEvent);
                event.preventDefault();
              }

              if (!event.defaultPrevented && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                event.preventDefault();
                enterSearchResults(resultsRef.current, event.key === 'ArrowUp');
              }
            },
          }}
          leading={
            <BaseDialog.Close
              render={
                <IconButton
                  variant="standard"
                  aria-label={backText}
                  dir={dir}
                  className={searchBack}
                  data-md3-search-back=""
                >
                  <SearchIcon kind="back" />
                </IconButton>
              }
            />
          }
          trailing={
            <span className={searchViewTrailing} data-md3-search-view-trailing="">
              {viewTrailing}
            </span>
          }
        />
        <SearchHeaderTransition source={sourceBarRef} geometry={anchorStyle} />
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
