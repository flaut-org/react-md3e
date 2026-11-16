'use client';

import { useId, useRef, useState } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { useMergedRefs } from '../../internal/hooks/use-merged-refs.hook';
import { useSearchAnchor } from '../../internal/hooks/use-search-anchor.hook';
import { useSearchValue } from '../../internal/hooks/use-search-value.hook';
import { SearchBar } from './search-bar/search-bar.component';
import { SearchView } from './search-view/search-view.component';
import { getSearchCloseReason } from './search.helpers';
import { searchRoot, searchAnchor, searchPortal, searchBackdrop } from './search.styles';
import type { SearchProps } from './search.types';

export function Search({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  onSearch,
  name,
  form,
  open,
  defaultOpen = false,
  onOpenChange,
  onClose,
  layout = 'auto',
  keepMounted = false,
  disableEscapeKeyDown = false,
  disabled = false,
  readOnly = false,
  fullWidth = false,
  leading,
  trailing,
  viewTrailing,
  disableClearable = false,
  clearText,
  backText,
  resultsLabel,
  loading,
  loadingText,
  statusText,
  emptyText,
  viewProps,
  viewInputRef,
  inputRef,
  inputProps = {},
  container,
  className,
  id,
  dir,
  children,
  ...props
}: SearchProps) {
  const generatedId = useId();
  const rootId = id ?? generatedId;
  const popupId = viewProps?.id ?? `${rootId}-view`;
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const isOpen = (open ?? localOpen) && !disabled && !readOnly;
  const { anchorRef: portalAnchor, host, direction } = usePortalContainer(container);
  const resolvedDirection = dir ?? direction;
  const barRef = useRef<HTMLDivElement>(null);
  const barInputRef = useRef<HTMLInputElement>(null);
  const viewFieldRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const suppressFocusOpen = useRef(false);
  const forwardedInput = useMergedRefs(barInputRef, inputRef);
  const { anchorStyle, ready } = useSearchAnchor(barRef, isOpen);
  const expanded = isOpen && ready;
  const { query, changeValue } = useSearchValue(value, defaultValue, valueRef, onChange);

  const requestOpen = (next: boolean, event: Event, closeReason = 'programmatic') => {
    const wasPrevented = event.defaultPrevented;
    const blocked = (next && (disabled || readOnly)) || (!next && disableEscapeKeyDown && closeReason === 'escape-key');
    let accepted = false;

    if (!blocked) {
      const closeCancelled = !next && onClose?.(event, getSearchCloseReason(closeReason)) === false;

      if (!closeCancelled && (wasPrevented || !event.defaultPrevented)) {
        const changeCancelled = onOpenChange?.(next, event) === false;

        if (!changeCancelled && (wasPrevented || !event.defaultPrevented)) {
          suppressFocusOpen.current = !next;

          if (open === undefined) {
            setLocalOpen(next);
          }

          accepted = true;
        }
      }
    }

    return accepted;
  };

  const submit = (event: Event, next: string) => {
    const wasPrevented = event.defaultPrevented;
    const cancelled = onSearch?.(event, next) === false || (!wasPrevented && event.defaultPrevented);

    event.preventDefault();

    if (!cancelled) {
      const owner = valueRef.current?.form;

      owner?.requestSubmit();
      resultsRef.current?.focus({ preventScroll: true });
    }

    return !cancelled;
  };

  return (
    <div
      {...props}
      id={rootId}
      dir={resolvedDirection}
      className={[searchRoot, className].filter(Boolean).join(' ')}
      data-md3-search=""
      data-full-width={fullWidth}
    >
      <BaseDialog.Root
        open={expanded}
        onOpenChange={(next, details) => {
          if (!requestOpen(next, details.event, details.reason)) {
            details.cancel();
          }
        }}
      >
        <span hidden ref={portalAnchor} />
        <input ref={valueRef} type="hidden" name={name} form={form} value={query} disabled={disabled} />
        <div className={searchAnchor} data-expanded={expanded}>
          <SearchBar
            ref={barRef}
            onPointerDown={(event) => {
              if (
                !event.defaultPrevented &&
                !isOpen &&
                event.target instanceof Element &&
                !event.target.closest('button, a, input')
              ) {
                suppressFocusOpen.current = false;
                requestOpen(true, event.nativeEvent);
              }
            }}
            label={label}
            placeholder={placeholder}
            value={query}
            onChange={changeValue}
            onSearch={submit}
            fullWidth
            disabled={disabled}
            readOnly={readOnly}
            leading={leading}
            trailing={trailing}
            disableClearable={disableClearable}
            clearText={clearText}
            inputRef={forwardedInput}
            inputProps={{
              ...inputProps,
              'aria-haspopup': 'dialog',
              'aria-expanded': expanded,
              'aria-controls': expanded ? popupId : undefined,
              'onFocus': (event) => {
                inputProps.onFocus?.(event);

                if (!event.defaultPrevented && !isOpen && !suppressFocusOpen.current) {
                  requestOpen(true, event.nativeEvent);
                }
              },
              'onPointerDown': (event) => {
                inputProps.onPointerDown?.(event);
                suppressFocusOpen.current = false;

                if (!event.defaultPrevented && !isOpen) {
                  requestOpen(true, event.nativeEvent);
                }
              },
              'onBlur': (event) => {
                inputProps.onBlur?.(event);
                suppressFocusOpen.current = false;
              },
            }}
          />
        </div>
        <BaseDialog.Portal container={host} keepMounted={keepMounted} className={searchPortal} dir={resolvedDirection}>
          <BaseDialog.Backdrop className={searchBackdrop} data-md3-search-backdrop="" />
          {anchorStyle && (
            <SearchView
              query={query}
              label={label}
              placeholder={placeholder}
              layout={layout}
              viewTrailing={viewTrailing}
              viewProps={viewProps}
              viewInputRef={viewInputRef}
              clearText={clearText}
              disableClearable={disableClearable}
              loading={loading}
              loadingText={loadingText}
              statusText={statusText}
              emptyText={emptyText}
              resultsLabel={resultsLabel}
              backText={backText}
              inputProps={inputProps}
              form={form}
              dir={resolvedDirection}
              anchorStyle={anchorStyle}
              restoreFocus={() => {
                suppressFocusOpen.current = true;

                return barInputRef.current;
              }}
              inputRef={viewFieldRef}
              resultsRef={resultsRef}
              onChange={changeValue}
              onSearch={submit}
              popupId={popupId}
            >
              {children}
            </SearchView>
          )}
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </div>
  );
}
