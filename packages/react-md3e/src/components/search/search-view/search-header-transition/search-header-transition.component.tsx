'use client';

import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { SearchAnchorStyle } from '../../../../internal/hooks/use-search-anchor.hook';
import { copySearchAdornment } from './search-header-transition.helpers';
import { sourceLayer, sourceBar, sourceLeading, sourceTrailing } from './search-header-transition.styles';

export function SearchHeaderTransition({
  source,
  geometry,
}: {
  readonly source: RefObject<HTMLDivElement | null>;
  readonly geometry: SearchAnchorStyle;
}) {
  const leadingRef = useRef<HTMLDivElement>(null);
  const trailingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const bar = source.current;
    const leading = leadingRef.current;
    const trailing = trailingRef.current;

    if (bar && leading && trailing) {
      copySearchAdornment(bar.querySelector('[data-md3-search-leading]'), leading);
      copySearchAdornment(bar.querySelector('[data-md3-search-trailing]'), trailing);

      return () => {
        leading.replaceChildren();
        trailing.replaceChildren();
      };
    }

    return undefined;
  }, [source, geometry]);

  return (
    <div className={sourceLayer} aria-hidden="true" inert data-md3-search-source="">
      <div className={sourceBar}>
        <div ref={leadingRef} className={sourceLeading} data-md3-search-source-leading="" />
        <div ref={trailingRef} className={sourceTrailing} data-md3-search-source-trailing="" />
      </div>
    </div>
  );
}
