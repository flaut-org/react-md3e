import type { SurfaceElement, SurfaceProps } from '../surface/surface.types';

export type CardVariant = 'filled' | 'elevated' | 'outlined';
export type CardProps<C extends SurfaceElement = 'div'> = Omit<
  SurfaceProps<C>,
  'variant' | 'color' | 'elevation' | 'clip'
> & {
  readonly variant?: CardVariant;
  /** Controlled visual drag state only; the application owns reordering and alternative actions. */
  readonly dragged?: boolean;
};
