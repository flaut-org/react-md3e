import { dialogActions } from './dialog-actions.styles';
import type { DialogActionsProps } from './dialog-actions.types';

export function DialogActions({ stacked = false, className, ...props }: DialogActionsProps) {
  return (
    <div
      {...props}
      className={[dialogActions, className].filter(Boolean).join(' ')}
      data-md3-dialog-actions=""
      data-stacked={stacked}
    />
  );
}
