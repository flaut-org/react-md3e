'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/** Resolve after all DOM refs attach; CSS continues to inherit without style computation. */
export function usePortalContainer(container: HTMLElement | null | (() => HTMLElement | null) | undefined) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [direction, setDirection] = useState<string | undefined>();

  useLayoutEffect(() => {
    const node = anchorRef.current;

    if (node) {
      const supplied = typeof container === 'function' ? container() : container;
      const scope = node.closest<HTMLElement>('[data-md3-theme], [data-base-ui-portal]');
      const inheritedDirection = node.closest('[dir]')?.getAttribute('dir') ?? undefined;

      setHost(supplied ?? scope ?? node.ownerDocument.body);
      setDirection(inheritedDirection);
    }
  }, [container]);

  return { anchorRef, host, direction };
}
