'use client';

import { Sheet } from '../sheet/sheet.component';
import type { BottomSheetProps } from './bottom-sheet.types';

export function BottomSheet({ showDragHandle = true, ...props }: BottomSheetProps) {
  return <Sheet {...props} showDragHandle={showDragHandle} edge="bottom" />;
}
