import type { ComponentPropsWithRef, ReactNode } from 'react';

export type BadgeVariant = 'small' | 'large';

export interface BadgeProps extends Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'color' | 'dangerouslySetInnerHTML'
> {
  /** Anchor content, normally an icon. Without children the badge renders inline. */
  readonly children?: ReactNode;
  /** A count or short, localized status. Large labels display at most four characters. */
  readonly badgeContent?: number | string | null | undefined;
  /** Defaults to large with content and small without content. */
  readonly variant?: BadgeVariant;
  /** Highest count before adding +. Defaults to 999; limited to 0–999. */
  readonly max?: number;
  /** Display a numeric zero rather than hiding it. */
  readonly showZero?: boolean;
  /** Hide the indicator without hiding or resizing its anchor. */
  readonly invisible?: boolean;
  readonly slotProps?: {
    readonly badge?: Omit<
      ComponentPropsWithRef<'span'>,
      'children' | 'dangerouslySetInnerHTML' | 'aria-hidden' | 'tabIndex'
    >;
  };
}
