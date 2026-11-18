import { linearGraphic } from './linear-progress.styles';
import type { ProgressGraphicProps } from '../progress-graphic.types';

export function LinearProgress({ appearance, thickness, indeterminate, wave }: ProgressGraphicProps) {
  return (
    <>
      <svg
        className={linearGraphic}
        aria-hidden="true"
        focusable="false"
        data-md3-progress-svg=""
        data-appearance={appearance}
        data-thickness={thickness}
        data-indeterminate={indeterminate}
        data-wave={wave}
      >
        <rect rx={thickness / 2} data-md3-progress-track="" />
        <rect rx={thickness / 2} data-md3-progress-active="" />
        {indeterminate && <rect rx={thickness / 2} data-md3-progress-active="" data-md3-progress-secondary="" />}
      </svg>
      <span data-md3-progress-stop="" aria-hidden="true" />
    </>
  );
}
