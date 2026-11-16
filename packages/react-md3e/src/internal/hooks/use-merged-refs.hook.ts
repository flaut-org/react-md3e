'use client';

import { useCallback } from 'react';
import type { Ref } from 'react';

function attachRef<T>(ref: Ref<T> | undefined, node: T | null) {
  let cleanup = () => {};

  if (typeof ref === 'function') {
    const detach = ref(node);

    cleanup = typeof detach === 'function' ? detach : () => ref(null);
  } else if (ref) {
    const target = ref;

    target.current = node;

    cleanup = () => {
      target.current = null;
    };
  }

  return cleanup;
}

/** Preserve React 19 callback-ref cleanup when composing consumer and internal refs. */
export function useMergedRefs<T>(first: Ref<T> | undefined, second: Ref<T> | undefined) {
  return useCallback(
    (node: T | null) => {
      const detachFirst = attachRef(first, node);
      const detachSecond = attachRef(second, node);

      return () => {
        detachFirst();
        detachSecond();
      };
    },
    [first, second],
  );
}
