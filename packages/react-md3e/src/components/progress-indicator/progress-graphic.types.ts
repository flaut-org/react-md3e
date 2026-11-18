import type { ProgressIndicatorAppearance } from './progress-indicator.types';

export interface ProgressGraphicProps {
  readonly appearance: ProgressIndicatorAppearance;
  readonly thickness: 4 | 8;
  readonly indeterminate: boolean;
  readonly wave: boolean;
}
