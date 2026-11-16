import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface DialogTitleProps extends ComponentPropsWithRef<'h2'> {
  readonly icon?: ReactNode;
}
