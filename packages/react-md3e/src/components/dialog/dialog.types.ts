import type { ComponentPropsWithRef, RefObject } from 'react';

export type DialogCloseReason = 'backdropClick' | 'escapeKeyDown';

export type DialogScroll = 'paper' | 'body';

export type DialogContainer = HTMLElement | null | (() => HTMLElement | null);

export type DialogFocusTarget = boolean | RefObject<HTMLElement | null>;

export interface DialogProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'title' | 'onClose' | 'aria-modal'> {
  readonly open: boolean;
  readonly onClose?: (event: Event, reason: DialogCloseReason) => void;
  readonly fullScreen?: boolean;
  readonly fullWidth?: boolean;
  readonly scroll?: DialogScroll;
  readonly keepMounted?: boolean;
  readonly disableEscapeKeyDown?: boolean;
  readonly container?: DialogContainer;
  readonly initialFocus?: DialogFocusTarget | undefined;
  readonly finalFocus?: DialogFocusTarget | undefined;
  /** MD3 basic dialogs default to alertdialog; full-screen tasks default to dialog. */
  readonly role?: 'dialog' | 'alertdialog' | undefined;
}
