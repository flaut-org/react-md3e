import type { ReactNode } from 'react';
import { loadingIndicator, loadingSpinner } from './button-loading-indicator.styles';

export function ButtonLoadingIndicator({ children }: { children?: ReactNode }) {
  return (
    <span className={loadingIndicator} aria-hidden="true" data-md3-button-loading="">
      {children ?? <span className={loadingSpinner} />}
    </span>
  );
}
