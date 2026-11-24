import type { NavigationProps, NavigationLayoutProps, NavigationModalOptions } from '../navigation/navigation.types';

export type NavigationDrawerProps = NavigationProps &
  NavigationLayoutProps &
  ({ readonly variant: 'standard' } | (NavigationModalOptions & { readonly variant?: 'modal' }));
export type { SheetCloseReason as NavigationDrawerCloseReason } from '../sheet/sheet.types';
