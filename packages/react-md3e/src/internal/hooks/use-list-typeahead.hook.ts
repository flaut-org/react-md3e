'use client';

import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();

/** Optional listbox typeahead; Base UI retains arrow navigation and roving focus. */
export function useListTypeahead() {
  const search = useRef({ text: '', time: 0 });

  return (event: KeyboardEvent<HTMLElement>) => {
    const canSearch =
      !event.defaultPrevented &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      event.key.length === 1 &&
      event.key !== ' ';

    if (canSearch) {
      const now = Date.now();
      const previous = now - search.current.time < 500 ? search.current.text : '';
      const key = normalize(event.key);
      const text = previous && [...previous].every((letter) => letter === key) ? key : previous + key;
      const options = [
        ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-md3-list-item-control]:not(:disabled)'),
      ];
      const activeIndex = options.indexOf(event.currentTarget.ownerDocument.activeElement as HTMLButtonElement);
      const start = previous && text.length > 1 ? Math.max(0, activeIndex) : activeIndex + 1;
      const ordered = [...options.slice(start), ...options.slice(0, start)];
      const match = ordered.find((option) =>
        normalize(option.dataset.textValue ?? option.textContent ?? '').startsWith(text),
      );

      search.current = { text, time: now };

      if (match) {
        event.preventDefault();
        match.focus();
      }
    }
  };
}
