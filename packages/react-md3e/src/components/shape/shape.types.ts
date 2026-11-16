import type { ComponentPropsWithRef } from 'react';
import type { shapeVariants } from './shape-variants';
import type { SurfaceColor } from '../../styles/surface-colors';

export type ShapeVariant = (typeof shapeVariants)[number];
export type ShapeColor = SurfaceColor;
export type ShapeSize = 'small' | 'medium' | 'large';
export type ShapeProps = Omit<ComponentPropsWithRef<'div'>, 'color' | 'role'> & {
  readonly variant?: ShapeVariant;
  /** Morph variant changes with compiled CSS. False uses the exact static SVG mask. */
  readonly morph?: boolean;
  readonly size?: ShapeSize;
  readonly color?: ShapeColor;
};
