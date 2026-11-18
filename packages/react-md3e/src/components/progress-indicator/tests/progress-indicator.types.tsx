import { createRef } from 'react';
import { ProgressIndicator } from '@flaut-travel/react-md3e';
import type { ProgressIndicatorProps } from '@flaut-travel/react-md3e/progress-indicator';

export const progress = (
  <ProgressIndicator
    ref={createRef<HTMLSpanElement>()}
    type="circular"
    variant="determinate"
    value={42}
    appearance="wavy"
    thickness={8}
    aria-label="Download"
  />
);
export const unknown = <ProgressIndicator value={null} aria-label="Preparing" />;
export const labelled: ProgressIndicatorProps = { 'aria-labelledby': 'task-title', 'value': 50 };
// @ts-expect-error Determinate mode needs a value.
export const missing = <ProgressIndicator variant="determinate" aria-label="Download" />;
// @ts-expect-error These MD3 appearances are flat and wavy.
export const invalid = <ProgressIndicator appearance="buffer" aria-label="Download" />;
// @ts-expect-error A non-decorative indicator must have an accessible name.
export const unnamed = <ProgressIndicator />;
