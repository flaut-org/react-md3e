'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { SearchBarProps, SearchChangeReason } from '../../components/search/search-bar/search-bar.types';

/** Query state and native form reset; independent from search fetching or result selection. */
export function useSearchValue(
  value: string | undefined,
  defaultValue: string | undefined,
  inputRef: RefObject<HTMLInputElement | null>,
  onChange: SearchBarProps['onChange'],
) {
  const [localValue, setLocalValue] = useState(defaultValue ?? '');

  useEffect(() => {
    const form = inputRef.current?.form;

    if (value === undefined && form) {
      const reset = (event: Event) => {
        queueMicrotask(() => {
          if (!event.defaultPrevented) {
            setLocalValue(defaultValue ?? '');
          }
        });
      };

      form.addEventListener('reset', reset);

      return () => form.removeEventListener('reset', reset);
    }

    return undefined;
  }, [value, defaultValue, inputRef]);

  const changeValue = (event: Event, next: string, reason: SearchChangeReason) => {
    if (value === undefined) {
      setLocalValue(next);
    }

    onChange?.(event, next, reason);
  };

  return { query: value ?? localValue, changeValue };
}
