import type { CSSProperties } from 'react';
import { indicatorState } from '../../internal/indicators/indicator-state';
import { progressRoot } from './progress-indicator.styles';
import { LinearProgress } from './linear-progress/linear-progress.component';
import { CircularProgress } from './circular-progress/circular-progress.component';
import type { ProgressIndicatorProps } from './progress-indicator.types';

/** A passive RSC progress display; no client context, observers or SVG generation during animation. */
export function ProgressIndicator({
  type = 'linear',
  appearance = 'flat',
  variant,
  value,
  min,
  max,
  thickness = 4,
  color = 'primary',
  size,
  style,
  className,
  ...props
}: ProgressIndicatorProps) {
  if (variant === 'determinate' && value == null) {
    throw new TypeError('Determinate progress requires a numeric value.');
  }

  if (thickness !== 4 && thickness !== 8) {
    throw new TypeError('MD3 progress thickness must be 4 or 8.');
  }

  const state = indicatorState(variant === 'indeterminate' ? null : value, min, max);
  const radius = appearance === 'wavy' ? 20.4 - (thickness - 4) / 2 : 20 - thickness / 2;
  const gap = type === 'circular' ? ((4 + thickness) / (radius * Math.PI * 2)) * 100 : 0;
  const trackVisible =
    state.indeterminate ||
    state.fraction === 0 ||
    (type === 'linear' ? state.fraction < 1 : state.fraction * 100 + gap * 2 < 100);
  const variables = { '--_progress': state.fraction * 100, '--_progress-gap': gap } as CSSProperties;
  const graphic = {
    appearance,
    thickness,
    indeterminate: state.indeterminate,
    wave: state.indeterminate || (state.fraction > 0.1 && state.fraction < 0.95),
  };

  return (
    <span
      {...props}
      role="progressbar"
      aria-valuemin={state.min}
      aria-valuemax={state.max}
      aria-valuenow={state.current}
      className={[progressRoot, className].filter(Boolean).join(' ')}
      data-md3-progress-indicator=""
      data-type={type}
      data-appearance={appearance}
      data-color={color}
      data-thickness={thickness}
      data-indeterminate={state.indeterminate}
      data-empty={!state.indeterminate && state.fraction === 0}
      data-complete={!state.indeterminate && state.fraction === 1}
      data-track-visible={trackVisible}
      style={{ ...variables, inlineSize: size, ...(type === 'circular' ? { blockSize: size } : {}), ...style }}
    >
      {type === 'linear' ? <LinearProgress {...graphic} /> : <CircularProgress {...graphic} />}
    </span>
  );
}
