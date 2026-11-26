import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

export type ToolbarColor = 'standard' | 'vibrant';
export type ToolbarOrientation = 'horizontal' | 'vertical';
export type ToolbarPosition = 'static' | 'sticky' | 'fixed' | 'absolute';
export type ToolbarPlacement = 'top' | 'bottom' | 'start' | 'end';
export type ToolbarScrollBehavior = 'none' | 'hide' | 'collapse';
export type ToolbarScrollTarget = HTMLElement | Window | (() => HTMLElement | Window | null);

interface ToolbarCommonProps extends Omit<ComponentPropsWithRef<'div'>, 'color' | 'role' | 'aria-orientation'> {
  readonly color?: ToolbarColor;
  readonly position?: ToolbarPosition;
  readonly placement?: ToolbarPlacement;
  /** Leading, middle (children), and trailing content are independent composition regions. */
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly primaryAction?: ReactNode;
  readonly align?: 'start' | 'center' | 'end' | 'space-between' | 'responsive';
  /** False renders a passive named group with ordinary native tab order. */
  readonly keyboardNavigation?: boolean;
  readonly loopFocus?: boolean;
  /** Defaults to the nearest scrolling ancestor, then the document window. */
  readonly scrollTarget?: ToolbarScrollTarget;
  /** Accumulated directional scroll in CSS pixels; AndroidX default is 40. */
  readonly scrollThreshold?: number;
}

export interface DockedToolbarProps extends ToolbarCommonProps {
  readonly variant?: 'docked';
  readonly orientation?: 'horizontal';
  readonly fullWidth?: boolean;
  readonly shape?: 'square' | 'rounded';
  /** Keeps 48px targets while reducing the container's vertical padding. */
  readonly dense?: boolean;
  readonly scrollBehavior?: 'none' | 'hide';
  readonly fab?: never;
  readonly fabPosition?: never;
  readonly expanded?: never;
  readonly defaultExpanded?: never;
  readonly onExpandedChange?: never;
  readonly elevation?: never;
}

export interface FloatingToolbarProps extends ToolbarCommonProps {
  readonly variant: 'floating';
  readonly orientation?: ToolbarOrientation;
  readonly fab?: ReactNode;
  /** Logical start/end: left/right horizontally, top/bottom vertically. */
  readonly fabPosition?: 'start' | 'end';
  readonly expanded?: boolean;
  readonly defaultExpanded?: boolean;
  /** Return false to cancel a scroll/focus expansion request. */
  readonly onExpandedChange?: (expanded: boolean, event: Event) => void | boolean;
  readonly scrollBehavior?: ToolbarScrollBehavior;
  readonly elevation?: 0 | 1 | 2 | 3;
  readonly fullWidth?: never;
  readonly shape?: never;
  readonly dense?: never;
}

export type ToolbarProps = DockedToolbarProps | FloatingToolbarProps;

export interface ToolbarOverflowAction {
  readonly id: string;
  /** Exactly one accessible representation is exposed at a time. */
  readonly control: ReactNode;
  /** Author the MenuItem/checkbox/radio item explicitly; no child-prop introspection. */
  readonly menuItem: ReactElement;
  readonly overflow?: 'auto' | 'always' | 'never';
  /** Higher priorities remain in the toolbar longer; ties preserve declaration order. */
  readonly priority?: number;
}

export interface ToolbarOverflowProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  readonly actions: readonly ToolbarOverflowAction[];
  readonly label: string;
  readonly icon?: ReactNode;
}
