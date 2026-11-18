import { createRef } from 'react';
import { Badge } from '@flaut-travel/react-md3e/badge';
import type { BadgeProps, BadgeVariant } from '@flaut-travel/react-md3e';

const root = createRef<HTMLSpanElement>();
const indicator = createRef<HTMLSpanElement>();

export const variant: BadgeVariant = 'small';
export const props = { badgeContent: 123, max: 99, showZero: true } satisfies BadgeProps;
export const count = (
  <Badge {...props} ref={root} slotProps={{ badge: { ref: indicator, title: 'Unread' } }}>
    Inbox
  </Badge>
);
export const dot = <Badge variant={variant} invisible />;
export const status = <Badge badgeContent="New" />;

// @ts-expect-error Native Material variant names are used.
export const invalidVariant = <Badge variant="dot" />;
// @ts-expect-error Labels are counts or short text, not interactive content.
export const invalidContent = <Badge badgeContent={<button type="button">Unread</button>} />;
// @ts-expect-error Material error/onError mapping does not expose MUI semantic colors.
export const invalidColor = <Badge color="primary" />;
// @ts-expect-error The decorative indicator never becomes a tab stop.
export const invalidIndicator = <Badge slotProps={{ badge: { tabIndex: 0 } }} />;
