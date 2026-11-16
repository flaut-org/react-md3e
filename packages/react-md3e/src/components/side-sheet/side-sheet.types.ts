import type { SheetProps } from '../sheet/sheet.types';

export type { SheetCloseReason as SideSheetCloseReason } from '../sheet/sheet.types';
export type SideSheetProps = SheetProps & { readonly anchor?: 'start' | 'end' };
