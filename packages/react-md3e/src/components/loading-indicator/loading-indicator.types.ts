import type { ComponentPropsWithRef, CSSProperties } from 'react';
import type { IndicatorColor, IndicatorLabel } from '../../internal/indicators/indicator.types';

export type LoadingIndicatorVariant = 'contained' | 'uncontained';
export type LoadingIndicatorColor = IndicatorColor;
export type LoadingIndicatorProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'role' | 'color' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'
> &
  IndicatorLabel & {
    readonly variant?: LoadingIndicatorVariant;
    readonly color?: LoadingIndicatorColor;
    readonly size?: CSSProperties['width'];
    /** Omit/null for the seven-shape loop. Numeric values morph circle to soft burst. */
    readonly value?: number | null;
    readonly min?: number;
    readonly max?: number;
  };
