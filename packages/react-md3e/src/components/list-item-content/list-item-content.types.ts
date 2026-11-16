import type { ReactNode } from 'react';

export type ListControlPosition = 'start' | 'end';

export type ListLeadingKind = 'icon' | 'avatar' | 'image' | 'video';

export interface ListItemContentProps {
  readonly primary?: ReactNode;
  readonly secondary?: ReactNode;
  readonly overline?: ReactNode;
  readonly children?: ReactNode;
  readonly leading?: ReactNode;
  readonly leadingKind?: ListLeadingKind | undefined;
  readonly trailing?: ReactNode;
  readonly trailingKind?: 'text' | 'icon' | undefined;
  /** Minimum height/alignment configuration; text remains free to wrap and grow. */
  readonly lines?: 1 | 2 | 3 | undefined;
}
