'use client';

import { observeAppBarScroll } from './observe-app-bar-scroll';
import type { AppBarScrollBehavior, AppBarScrollTarget } from '../app-bar.types';

export interface AppBarScrollProps {
  readonly behavior: Exclude<AppBarScrollBehavior, 'none'>;
  readonly target: AppBarScrollTarget | undefined;
  readonly scrolled: boolean | undefined;
}

/** React 19's callback-ref cleanup owns the browser subscription; the header stays on the server. */
export function AppBarScroll({ behavior, target, scrolled }: AppBarScrollProps) {
  return (
    <span
      hidden
      data-md3-app-bar-scroll=""
      ref={(node) => {
        if (node) {
          let dispose: (() => void) | undefined;
          const activation = requestAnimationFrame(() => {
            dispose = observeAppBarScroll(node, behavior, target, scrolled);
          });

          return () => {
            cancelAnimationFrame(activation);
            dispose?.();
          };
        }

        return undefined;
      }}
    />
  );
}
