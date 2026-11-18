import { circularGraphic } from './circular-progress.styles';
import type { ProgressGraphicProps } from '../progress-graphic.types';

export function CircularProgress({ appearance, thickness, indeterminate, wave }: ProgressGraphicProps) {
  const size = appearance === 'wavy' ? 48 : 40;
  const center = size / 2;
  const radius = appearance === 'wavy' ? 20.4 - (thickness - 4) / 2 : center - thickness / 2;
  const path = `M${center} ${center - radius}a${radius} ${radius} 0 1 1 0 ${radius * 2}a${radius} ${radius} 0 1 1 0 ${-radius * 2}`;

  return (
    <svg
      className={circularGraphic}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
      data-md3-progress-svg=""
      data-appearance={appearance}
      data-thickness={thickness}
      data-indeterminate={indeterminate}
      data-wave={wave}
    >
      <g data-md3-progress-orbit="">
        <path d={path} pathLength="100" data-md3-progress-track="" />
        <path d={path} pathLength="100" data-md3-progress-active="" />
      </g>
    </svg>
  );
}
