import type { CSSProperties } from 'react';
import { indicatorState } from '../../internal/indicators/indicator-state';
import { loadingRoot, loadingRotor, loadingMorph } from './loading-indicator.styles';
import type { LoadingIndicatorProps } from './loading-indicator.types';

/** Passive progress semantics and CSS-only motion; safe in RSC and streamed fallbacks. */
export function LoadingIndicator({
  variant = 'uncontained',
  color = 'primary',
  size,
  value,
  min,
  max,
  className,
  style,
  ...props
}: LoadingIndicatorProps) {
  const state = indicatorState(value, min, max);
  const variables = { '--_loading-progress': state.fraction } as CSSProperties;

  return (
    <span
      {...props}
      role="progressbar"
      aria-valuemin={state.min}
      aria-valuemax={state.max}
      aria-valuenow={state.current}
      className={[loadingRoot, className].filter(Boolean).join(' ')}
      data-md3-loading-indicator=""
      data-variant={variant}
      data-color={color}
      data-indeterminate={state.indeterminate}
      style={{ ...variables, inlineSize: size, blockSize: size, ...style }}
    >
      <span className={loadingRotor} aria-hidden="true" data-md3-loading-rotor="">
        <span className={loadingMorph} data-md3-loading-shape="" />
      </span>
    </span>
  );
}
