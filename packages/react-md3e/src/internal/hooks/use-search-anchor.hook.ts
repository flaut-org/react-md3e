'use client';

import { useLayoutEffect, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { readSearchAnchor } from './search-anchor-geometry';

export type SearchAnchorStyle = CSSProperties & Readonly<ReturnType<typeof readSearchAnchor>>;

/** Measure before opening Base UI, which reads starting styles during its own ref attachment. */
export function useSearchAnchor(anchorRef: RefObject<HTMLDivElement | null>, open: boolean, query: string) {
  const [geometry, setGeometry] = useState<{ open: boolean; style: SearchAnchorStyle }>();

  useLayoutEffect(() => {
    const anchor = anchorRef.current;

    if (anchor) {
      const update = () => {
        const style: SearchAnchorStyle = readSearchAnchor(anchor);

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

        for (const child of anchor.querySelectorAll(
          '[data-md3-search-input], [data-md3-search-leading], [data-md3-search-trailing]',
        )) {
          observer.observe(child);
        }

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
  }, [anchorRef, open, query]);

  return { anchorStyle: geometry?.style, ready: geometry?.open === open };
}
