import type { ComponentPropsWithRef, ReactElement, RefObject } from 'react';

type Side = 'top' | 'bottom' | 'left' | 'right';
export type PopoverPlacement = Side | `${Side}-${'start' | 'end'}`;
export type PopoverCloseReason =
  'escapeKeyDown' | 'clickAway' | 'triggerClick' | 'focusOut' | 'closeButtonClick' | 'programmatic';
export type PopoverContainer = HTMLElement | null | (() => HTMLElement | null);
export type PopoverAnchor = Element | null | RefObject<Element | null> | (() => Element | null);
export type PopoverFocusTarget = boolean | RefObject<HTMLElement | null>;
type AccessibleName =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'aria-label'?: string; readonly 'aria-labelledby': string };
type TriggerProps = Pick<ComponentPropsWithRef<'button'>, 'id' | 'disabled'>;
type NativeProps = Omit<
  ComponentPropsWithRef<'div'>,
  'role' | 'onClose' | 'aria-modal' | 'aria-label' | 'aria-labelledby'
>;
export type PopoverProps = NativeProps &
  AccessibleName & {
    /** A native button, or a component forwarding native button props and ref. */
    readonly trigger: ReactElement<TriggerProps>;
    readonly open?: boolean;
    readonly defaultOpen?: boolean;
    readonly onOpenChange?: (open: boolean, event: Event) => void | boolean;
    readonly onClose?: (event: Event, reason: PopoverCloseReason) => void | boolean;
    readonly placement?: PopoverPlacement;
    readonly offset?: number;
    readonly collisionPadding?: number;
    /** Flip to the opposite side (default), or shift the full panel within the viewport. */
    readonly collisionStrategy?: 'flip' | 'shift';
    readonly positionMethod?: 'absolute' | 'fixed';
    readonly anchorEl?: PopoverAnchor | undefined;
    readonly container?: PopoverContainer | undefined;
    readonly initialFocus?: PopoverFocusTarget | undefined;
    readonly finalFocus?: PopoverFocusTarget | undefined;
    readonly disabled?: boolean;
    readonly modal?: boolean;
    readonly keepMounted?: boolean;
    readonly matchAnchorWidth?: boolean;
    readonly disablePadding?: boolean;
    readonly disableEscapeKeyDown?: boolean;
    readonly closeText?: string;
  };
