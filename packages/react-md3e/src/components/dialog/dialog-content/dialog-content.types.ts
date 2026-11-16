import type { ComponentPropsWithRef } from 'react';

export interface DialogContentProps extends ComponentPropsWithRef<'div'> {
  readonly dividers?: boolean;
}
