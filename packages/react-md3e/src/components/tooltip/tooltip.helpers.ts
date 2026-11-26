import { Fragment, isValidElement } from 'react';
import type { ReactNode } from 'react';

/** Inspect only React's structural containers; never execute a consumer component or flatten its text. */
export function hasTooltipContent(content: ReactNode): boolean {
  if (content == null || typeof content === 'boolean' || content === '') {
    return false;
  }

  if (Array.isArray(content)) {
    return content.some(hasTooltipContent);
  }

  if (isValidElement<{ children?: ReactNode }>(content) && content.type === Fragment) {
    return hasTooltipContent(content.props.children);
  }

  return true;
}
