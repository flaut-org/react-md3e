import type { ReactNode } from 'react';

export interface MenuItemContentProps {
  readonly children?: ReactNode;
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly supportingText?: ReactNode;
}
