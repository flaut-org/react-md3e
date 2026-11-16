import type { ComponentPropsWithRef } from 'react';
import type { ShapeRole } from '../../theme/theme.types';
import type { SurfaceColor as SurfaceColorRole } from '../../styles/surface-colors';
import type { ElevationLevel } from '../../styles/elevation';

export type SurfaceElement = 'div' | 'span' | 'article' | 'section' | 'aside' | 'figure' | 'header' | 'footer' | 'main';
export type SurfaceShape = ShapeRole | 'none';
export type SurfaceColor = SurfaceColorRole;
export type SurfaceElevation = ElevationLevel;
export type SurfaceVariant = 'filled' | 'outlined';
interface OwnProps<C extends SurfaceElement> {
  readonly component?: C | undefined;
  readonly shape?: SurfaceShape;
  readonly color?: SurfaceColor;
  readonly elevation?: SurfaceElevation;
  readonly variant?: SurfaceVariant;
  /** Clip content to the themed corners. Disabled by default to preserve outside focus rings. */
  readonly clip?: boolean;
}
export type SurfaceProps<C extends SurfaceElement = 'div'> = OwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof OwnProps<C>>;
