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
export type TooltipVariant = 'plain' | 'rich';

interface CommonTooltipProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'children' | 'role' | 'aria-modal'> {
  /** Rendered by React without string conversion. Empty content disables the tooltip; zero is visible. */
  readonly title: ReactNode;
  /** One element forwarding its received props and ref. Give the trigger its own accessible name. */
  readonly children: ReactElement;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean, event: Event) => void | boolean;
  readonly placement?: TooltipPlacement;
  readonly enterDelay?: number;
  readonly leaveDelay?: number;
  readonly enterTouchDelay?: number;
  readonly leaveTouchDelay?: number;
  readonly disableTouchListener?: boolean;
  /** Optional 16 × 8 Material caret; absent by default. */
  readonly arrow?: boolean;
  /** Anchor gap, in CSS pixels. Defaults to the Material bounded-anchor gap of 4. */
  readonly offset?: number;
  readonly disabled?: boolean;
  readonly container?: HTMLElement | null | (() => HTMLElement | null);
}

interface PlainTooltipProps {
  readonly variant?: 'plain';
  /** Opts out of hoverable content (WCAG 1.4.13); use only when the information is also available elsewhere. */
  readonly disableInteractive?: boolean;
  /** Existing alias for disableInteractive. The latter takes precedence when supplied. */
  readonly disableHoverablePopup?: boolean;
  readonly headline?: never;
  readonly actions?: never;
  readonly persistent?: never;
}

type RichTooltipName =
  | { readonly 'headline': ReactNode; readonly 'aria-label'?: string; readonly 'aria-labelledby'?: string }
  | { readonly 'headline'?: ReactNode; readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'headline'?: ReactNode; readonly 'aria-label'?: string; readonly 'aria-labelledby': string };

type RichTooltipProps = RichTooltipName & {
  readonly variant: 'rich';
  /** Up to two brief text buttons, or a relevant link. Use variant="text" on Button. */
  readonly actions?: ReactNode;
  /** Opens on click/tap rather than hover/focus; stays open until dismissed. */
  readonly persistent?: boolean;
  readonly disableInteractive?: false;
  readonly disableHoverablePopup?: false;
};

export type TooltipProps = CommonTooltipProps & (PlainTooltipProps | RichTooltipProps);
