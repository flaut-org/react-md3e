import { dialogContent } from './dialog-content.styles';
import type { DialogContentProps } from './dialog-content.types';

export function DialogContent({ dividers = false, className, ...props }: DialogContentProps) {
  return (
    <div
      {...props}
      className={[dialogContent, className].filter(Boolean).join(' ')}
      data-md3-dialog-content=""
      data-dividers={dividers}
    />
  );
}
