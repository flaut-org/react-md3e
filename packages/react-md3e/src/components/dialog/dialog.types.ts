import type { ComponentPropsWithRef, RefObject } from 'react';

import type { Breakpoint } from '../../theme/theme.types';

export type DialogCloseReason = 'backdropClick' | 'escapeKeyDown';

export type DialogScroll = 'paper' | 'body';

export type DialogContainer = HTMLElement | null | (() => HTMLElement | null);

export type DialogFocusTarget = boolean | RefObject<HTMLElement | null>;

export interface DialogProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'title' | 'onClose' | 'aria-modal'> {
  readonly open: boolean;
  readonly onClose?: (event: Event, reason: DialogCloseReason) => void;
  readonly fullScreen?: boolean;
  readonly fullWidth?: boolean;
  /** Omit for the MD3 560px cap; false removes the cap while keeping viewport gutters. */
  readonly maxWidth?: Breakpoint | false;
  readonly scroll?: DialogScroll;
  readonly keepMounted?: boolean;
  readonly disableEscapeKeyDown?: boolean;
  readonly container?: DialogContainer;
  readonly initialFocus?: DialogFocusTarget | undefined;
  readonly finalFocus?: DialogFocusTarget | undefined;
  /** MD3 basic dialogs default to alertdialog; full-screen tasks default to dialog. */
  readonly role?: 'dialog' | 'alertdialog' | undefined;
}
