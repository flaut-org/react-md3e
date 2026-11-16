'use client';

import { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import type { Ref } from 'react';

/** Keep the listbox's entry tab stop on selection without stealing focus or resetting Base UI. */
function syncEntry(list: HTMLUListElement | null) {
  if (list?.isConnected && !list.contains(list.ownerDocument.activeElement)) {
    const options = [
      ...list.querySelectorAll<HTMLButtonElement>(
        '[data-md3-list-item-control]:not(:disabled):not([aria-disabled="true"])',
      ),
    ];
    const entry = options.find((option) => option.getAttribute('aria-selected') === 'true') ?? options[0];

    for (const option of options) {
      const tabIndex = option === entry ? 0 : -1;

      if (option.tabIndex !== tabIndex) {
        option.tabIndex = tabIndex;
      }
    }
  }
}

export function useListEntryFocus(forwardedRef: Ref<HTMLUListElement> | undefined) {
  const ref = useRef<HTMLUListElement>(null);

  useImperativeHandle(forwardedRef, () => ref.current!, []);
  useLayoutEffect(() => {
    const list = ref.current;
    let observer: MutationObserver | undefined;

    if (list) {
      syncEntry(list);
      observer = new MutationObserver(() => syncEntry(list));
      observer.observe(list, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['aria-selected', 'aria-disabled', 'disabled', 'tabindex'],
      });
    }

    return () => observer?.disconnect();
  }, []);

  const onBlur = () => {
    queueMicrotask(() => syncEntry(ref.current));
  };

  return { ref, onBlur };
}
