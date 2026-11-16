import type { SheetProps } from '../sheet/sheet.types';

export type { SheetCloseReason as BottomSheetCloseReason } from '../sheet/sheet.types';
export type BottomSheetProps = SheetProps & { readonly showDragHandle?: boolean };
