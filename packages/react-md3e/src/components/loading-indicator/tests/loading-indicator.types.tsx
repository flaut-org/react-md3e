import { createRef } from 'react';
import { LoadingIndicator } from '@flaut-travel/react-md3e';
import type { LoadingIndicatorProps } from '@flaut-travel/react-md3e/loading-indicator';

export const loading = (
  <LoadingIndicator
    ref={createRef<HTMLSpanElement>()}
    variant="contained"
    color="tertiary"
    size={64}
    value={50}
    aria-label="Loading"
  />
);
export const decorative = <LoadingIndicator aria-hidden />;
export const labelled: LoadingIndicatorProps = { 'aria-labelledby': 'operation-label' };
// @ts-expect-error A non-decorative indicator must have an accessible name.
export const unnamed = <LoadingIndicator />;
// @ts-expect-error LoadingIndicator configurations are MD3 contained/uncontained.
export const invalid = <LoadingIndicator variant="filled" aria-label="Loading" />;
