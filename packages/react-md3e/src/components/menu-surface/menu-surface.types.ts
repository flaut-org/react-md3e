import type { ComponentPropsWithRef } from 'react';

export interface MenuSurfaceAppearance {
  readonly variant?: 'standard' | 'vibrant';
  readonly density?: 0 | -1 | -2 | -3;
  readonly layout?: 'standard' | 'grouped';
}

export type MenuSurfaceElementProps = ComponentPropsWithRef<'div'> & MenuSurfaceAppearance;
