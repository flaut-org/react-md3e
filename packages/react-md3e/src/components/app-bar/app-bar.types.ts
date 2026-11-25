import type { ComponentPropsWithRef, ReactNode } from 'react';

export type AppBarVariant = 'search' | 'small' | 'mediumFlexible' | 'largeFlexible';
export type AppBarPosition = 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
export type AppBarTitleAlign = 'start' | 'center';
export type AppBarScrollBehavior = 'none' | 'pinned' | 'enterAlways' | 'exitUntilCollapsed';
export type AppBarScrollTarget = HTMLElement | Window | (() => HTMLElement | Window | null);

export interface AppBarProps extends Omit<ComponentPropsWithRef<'header'>, 'title'> {
  readonly title?: ReactNode;
  readonly subtitle?: ReactNode;
  readonly navigationIcon?: ReactNode;
  readonly actions?: ReactNode;
  readonly variant?: AppBarVariant;
  readonly position?: AppBarPosition;
  readonly titleAlign?: AppBarTitleAlign;
  /** Custom title content, or a Search composition for variant="search". */
  readonly children?: ReactNode;
  /** Opt-in Material scroll behavior; none preserves the static server layout. */
  readonly scrollBehavior?: AppBarScrollBehavior;
  /** Defaults to the nearest scrolling ancestor, or the window. Resolvers run after hydration. */
  readonly scrollTarget?: AppBarScrollTarget;
  /** Overrides the automatically derived MD3 surface/elevation state. */
  readonly scrolled?: boolean | undefined;
}
