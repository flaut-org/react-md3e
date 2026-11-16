import type { ComponentPropsWithRef, ReactElement, ReactNode, RefObject } from 'react';

export type SheetCloseReason =
  'escapeKeyDown' | 'backdropClick' | 'closeButtonClick' | 'swipe' | 'focusOut' | 'programmatic';
export type SheetVariant = 'modal' | 'standard';
export type SheetContainer = HTMLElement | null | (() => HTMLElement | null);
export type SheetFocusTarget = boolean | RefObject<HTMLElement | null>;
type Name =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'aria-label'?: string; readonly 'aria-labelledby': string };
export type SheetProps = Omit<
  ComponentPropsWithRef<'div'>,
  'role' | 'title' | 'onClose' | 'aria-modal' | 'aria-label' | 'aria-labelledby'
> &
  Name & {
    readonly open?: boolean | undefined;
    readonly defaultOpen?: boolean | undefined;
    readonly trigger?: ReactElement | undefined;
    readonly onOpenChange?: ((open: boolean, event: Event) => void | boolean) | undefined;
    readonly onClose?: ((event: Event, reason: SheetCloseReason) => void | boolean) | undefined;
    readonly onOpenChangeComplete?: ((open: boolean) => void) | undefined;
    readonly variant?: SheetVariant | undefined;
    readonly header?: ReactNode;
    readonly actions?: ReactNode;
    readonly keepMounted?: boolean | undefined;
    readonly disableEscapeKeyDown?: boolean | undefined;
    readonly disableSwipe?: boolean | undefined;
    readonly showCloseButton?: boolean | undefined;
    readonly closeText?: string | undefined;
    readonly container?: SheetContainer | undefined;
    readonly initialFocus?: SheetFocusTarget | undefined;
    readonly finalFocus?: SheetFocusTarget | undefined;
  };
export type SheetInternalProps = SheetProps & {
  readonly edge: 'bottom' | 'left' | 'right';
  readonly showDragHandle?: boolean;
};
