'use client';

import { useInheritedDirection } from '../../internal/hooks/use-inherited-direction.hook';
import { Sheet } from '../sheet/sheet.component';
import type { SideSheetProps } from './side-sheet.types';

export function SideSheet({ anchor = 'end', dir, ...props }: SideSheetProps) {
  const { anchorRef, direction } = useInheritedDirection(dir);
  const edge = (anchor === 'end') !== (direction === 'rtl') ? 'right' : 'left';

  return (
    <>
      <span hidden ref={anchorRef} />
      <Sheet {...props} edge={edge} dir={direction} />
    </>
  );
}
