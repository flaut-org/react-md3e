import type { ComponentPropsWithRef, CSSProperties } from 'react';
import type { IndicatorColor, IndicatorLabel } from '../../internal/indicators/indicator.types';

export type ProgressIndicatorType = 'linear' | 'circular';
export type ProgressIndicatorVariant = 'determinate' | 'indeterminate';
export type ProgressIndicatorAppearance = 'flat' | 'wavy';
export type ProgressIndicatorColor = IndicatorColor;
type ValueProps =
  | { readonly variant: 'determinate'; readonly value: number }
  | { readonly variant: 'indeterminate'; readonly value?: number | null }
  | { readonly variant?: undefined; readonly value?: number | null };

export type ProgressIndicatorProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'role' | 'color' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'
> &
  IndicatorLabel &
  ValueProps & {
    readonly type?: ProgressIndicatorType;
    readonly appearance?: ProgressIndicatorAppearance;
    readonly color?: ProgressIndicatorColor;
    readonly thickness?: 4 | 8;
    /** Circular diameter or linear width. */
    readonly size?: CSSProperties['width'];
    readonly min?: number;
    readonly max?: number;
  };
