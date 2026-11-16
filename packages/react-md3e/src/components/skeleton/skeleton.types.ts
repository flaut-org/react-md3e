import type { ComponentPropsWithRef, CSSProperties } from 'react';

export type SkeletonVariant = 'text' | 'rectangular' | 'rounded' | 'circular';
export interface SkeletonProps extends Omit<ComponentPropsWithRef<'span'>, 'role' | 'aria-hidden'> {
  readonly variant?: SkeletonVariant;
  readonly animation?: 'pulse' | 'wave' | false;
  readonly width?: CSSProperties['width'];
  readonly height?: CSSProperties['height'];
}
