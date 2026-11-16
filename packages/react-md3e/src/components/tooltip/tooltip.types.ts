import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';
export interface TooltipProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'children' | 'role'> {
  readonly title: ReactNode;
  readonly children: ReactElement;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean, event: Event) => void | boolean;
  readonly placement?: TooltipPlacement;
  readonly enterDelay?: number;
  readonly leaveDelay?: number;
  readonly disableHoverablePopup?: boolean;
  readonly disabled?: boolean;
  readonly container?: HTMLElement | null | (() => HTMLElement | null);
}
