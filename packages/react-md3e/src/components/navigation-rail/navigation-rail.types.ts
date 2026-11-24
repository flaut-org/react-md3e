import type { NavigationProps, NavigationLayoutProps, NavigationModalOptions } from '../navigation/navigation.types';

interface StandardRail {
  readonly variant?: 'standard';
  readonly expanded?: boolean;
  readonly hideWhenCollapsed?: boolean;
  readonly appearance?: 'expressive' | 'baseline';
}
type ModalRail = NavigationModalOptions & {
  readonly variant: 'modal';
  readonly expanded?: never;
  readonly hideWhenCollapsed?: never;
  readonly appearance?: 'expressive';
};

export type NavigationRailProps = NavigationProps &
  NavigationLayoutProps &
  (StandardRail | ModalRail) & {
    readonly alignment?: 'start' | 'center' | 'end';
    readonly indicator?: 'content' | 'fullWidth';
  };
export type { SheetCloseReason as NavigationRailCloseReason } from '../sheet/sheet.types';
