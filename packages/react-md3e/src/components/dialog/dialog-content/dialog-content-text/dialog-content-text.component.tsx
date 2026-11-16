'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { dialogContentText } from './dialog-content-text.styles';
import type { DialogContentTextProps } from './dialog-content-text.types';

export function DialogContentText({ className, ...props }: DialogContentTextProps) {
  return <BaseDialog.Description {...props} className={[dialogContentText, className].filter(Boolean).join(' ')} />;
}
