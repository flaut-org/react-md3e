import type { KeyboardEvent } from 'react';
import type { SearchCloseReason } from './search.types';

export function getSearchCloseReason(reason: string): SearchCloseReason {
  switch (reason) {
    case 'escape-key':
      return 'escapeKeyDown';
    case 'outside-press':
      return 'clickAway';
    case 'close-press':
      return 'backButtonClick';
    default:
      return 'programmatic';
  }
}

export function searchResultControls(container: HTMLElement | null): HTMLElement[] {
  const selector = 'button:not(:disabled), a[href], [role="option"]';

  return Array.from(container?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
    (node) =>
      !node.closest('[hidden], [inert], [aria-hidden="true"]') &&
      node.getAttribute('aria-disabled') !== 'true' &&
      node.getClientRects().length > 0,
  );
}

export function enterSearchResults(container: HTMLDivElement | null, last = false) {
  const controls = searchResultControls(container);

  (last ? controls.at(-1) : controls[0])?.focus();

  if (controls.length === 0) {
    container?.focus();
  }
}

/** Lists with their own keyboard behavior preventDefault first; native result actions remain navigable. */
export function navigateSearchResults(
  event: KeyboardEvent<HTMLDivElement>,
  container: HTMLDivElement | null,
  input: HTMLInputElement | null,
) {
  const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

  if (!event.defaultPrevented && keys.includes(event.key)) {
    const controls = searchResultControls(container);
    const current = controls.indexOf(event.target as HTMLElement);

    if (current >= 0) {
      event.preventDefault();

      if (event.key === 'ArrowUp' && current === 0) {
        input?.focus();
      } else {
        let next = Math.min(controls.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1));

        if (event.key === 'Home') {
          next = 0;
        } else if (event.key === 'End') {
          next = controls.length - 1;
        }

        controls[next]?.focus();
      }
    }
  }
}
