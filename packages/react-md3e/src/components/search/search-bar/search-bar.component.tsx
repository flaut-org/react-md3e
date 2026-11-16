'use client';

import { useId, useRef } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { IconButton } from '../../icon-button/icon-button.component';
import { useMergedRefs } from '../../../internal/hooks/use-merged-refs.hook';
import { useSearchValue } from '../../../internal/hooks/use-search-value.hook';
import { SearchIcon } from '../search-icons/search-icons.component';
import { searchBar, searchInput, searchLeading, searchTrailing } from './search-bar.styles';
import type { SearchBarProps } from './search-bar.types';

export function SearchBar({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  onSearch,
  name,
  form,
  disabled = false,
  readOnly = false,
  fullWidth = false,
  leading,
  trailing,
  disableClearable = false,
  clearText = 'Clear search',
  inputRef,
  inputProps = {},
  className,
  id,
  onClick,
  ...props
}: SearchBarProps) {
  const generatedId = useId();
  const localRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(localRef, inputRef);
  const { query, changeValue } = useSearchValue(value, defaultValue, localRef, onChange);
  const showClear = !disableClearable && !readOnly && query.length > 0;

  if (!label.trim()) {
    throw new TypeError('SearchBar requires a non-empty label.');
  }

  return (
    // The surface delegates pointer focus to its native input; the input and actions provide keyboard access.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      {...props}
      id={id}
      className={[searchBar, className].filter(Boolean).join(' ')}
      data-md3-search-bar=""
      data-disabled={disabled}
      data-full-width={fullWidth}
      onClick={(event) => {
        onClick?.(event);

        if (
          !event.defaultPrevented &&
          !disabled &&
          event.target instanceof Element &&
          !event.target.closest('button, a, input')
        ) {
          localRef.current?.focus();
        }
      }}
    >
      {leading !== null && (
        <span className={searchLeading} data-md3-search-leading="">
          {leading ?? <SearchIcon kind="search" />}
        </span>
      )}
      <BaseInput
        {...inputProps}
        id={inputProps.id ?? `${id ?? generatedId}-input`}
        ref={mergedRef}
        role="searchbox"
        type="text"
        inputMode="search"
        enterKeyHint="search"
        name={name}
        form={form}
        disabled={disabled}
        readOnly={readOnly}
        value={query}
        placeholder={placeholder ?? label}
        aria-label={inputProps['aria-label'] ?? label}
        autoComplete={inputProps.autoComplete ?? 'off'}
        className={[searchInput, inputProps.className].filter(Boolean).join(' ')}
        data-md3-search-input=""
        onChange={(event) => changeValue(event.nativeEvent, event.target.value, 'input')}
        onKeyDown={(event) => {
          inputProps.onKeyDown?.(event);

          if (
            !event.defaultPrevented &&
            event.key === 'Enter' &&
            !event.nativeEvent.isComposing &&
            event.nativeEvent.keyCode !== 229 &&
            !disabled
          ) {
            if (onSearch?.(event.nativeEvent, query) === false) {
              event.preventDefault();
            }
          }
        }}
      />
      {showClear && (
        <IconButton
          variant="standard"
          disabled={disabled}
          aria-label={clearText}
          onClick={(event) => {
            changeValue(event.nativeEvent, '', 'clear');
            localRef.current?.focus();
          }}
        >
          <SearchIcon kind="clear" />
        </IconButton>
      )}
      {trailing != null && (
        <span className={searchTrailing} data-md3-search-trailing="">
          {trailing}
        </span>
      )}
    </div>
  );
}
