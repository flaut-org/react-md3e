'use client';

import { useLayoutEffect, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

export type SearchAnchorStyle = CSSProperties & {
  readonly '--_search-anchor-left': string;
  readonly '--_search-anchor-top': string;
  readonly '--_search-anchor-width': string;
  readonly '--_search-anchor-height': string;
};

/** Measure before opening Base UI, which reads starting styles during its own ref attachment. */
export function useSearchAnchor(anchorRef: RefObject<HTMLDivElement | null>, open: boolean) {
  const [geometry, setGeometry] = useState<{ open: boolean; style: SearchAnchorStyle }>();

  useLayoutEffect(() => {
    const anchor = anchorRef.current;

    if (anchor) {
      const update = () => {
        const rect = anchor.getBoundingClientRect();
        const style: SearchAnchorStyle = {
          '--_search-anchor-left': `${rect.left}px`,
          '--_search-anchor-top': `${rect.top}px`,
          '--_search-anchor-width': `${rect.width}px`,
          '--_search-anchor-height': `${rect.height}px`,
        };

        setGeometry((previous) => {
          const same =
            previous?.open === open &&
            Object.entries(style).every(([key, value]) => previous.style[key as keyof SearchAnchorStyle] === value);

          return same ? previous : { open, style };
        });
      };

      update();

      if (open) {
        const observer = new ResizeObserver(update);

        observer.observe(anchor);
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        window.visualViewport?.addEventListener('resize', update);

        return () => {
          observer.disconnect();
          window.removeEventListener('resize', update);
          window.removeEventListener('scroll', update, true);
          window.visualViewport?.removeEventListener('resize', update);
        };
      }
    }

    return undefined;
  }, [anchorRef, open]);

  return { anchorStyle: geometry?.style, ready: geometry?.open === open };
}
