'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { dialogTitle, dialogIcon } from './dialog-title.styles';
import type { DialogTitleProps } from './dialog-title.types';

export function DialogTitle({ icon, className, children, ...props }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      {...props}
      className={[dialogTitle, className].filter(Boolean).join(' ')}
      data-md3-dialog-title=""
      data-has-icon={icon != null}
    >
      {icon != null && (
        <span className={dialogIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </BaseDialog.Title>
  );
}
