import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SnackbarCloseReason = 'timeout' | 'escapeKeyDown' | 'closeButtonClick';
export interface SnackbarProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onClose' | 'role' | 'aria-modal'
> {
  readonly message: ReactNode;
  readonly action?: ReactNode;
  readonly open?: boolean | undefined;
  readonly defaultOpen?: boolean | undefined;
  readonly onOpenChange?: ((open: boolean, event: Event | null) => void | boolean) | undefined;
  readonly onClose?: ((event: Event | null, reason: SnackbarCloseReason) => void | boolean) | undefined;
  readonly autoHideDuration?: number | null;
  readonly disableWindowBlurListener?: boolean;
  readonly priority?: 'polite' | 'assertive';
  readonly anchorOrigin?: { readonly vertical: 'top' | 'bottom'; readonly horizontal: 'left' | 'center' | 'right' };
  readonly showCloseButton?: boolean;
  readonly closeText?: string;
  readonly notificationsLabel?: string;
  readonly container?: HTMLElement | null | (() => HTMLElement | null);
}
