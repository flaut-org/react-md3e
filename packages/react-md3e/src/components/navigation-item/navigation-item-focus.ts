import type { KeyboardEvent } from 'react';

/** Navigation links remain ordinary Tab stops; rail/drawer also support optional arrow movement. */
export function moveNavigationFocus(event: KeyboardEvent<HTMLElement>) {
  const current = event.currentTarget;
  const navigation = current.closest('[data-md3-navigation]');

  if (event.target !== current || !navigation || navigation.getAttribute('data-md3-navigation') === 'bar') {
    return;
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  const items = [...navigation.querySelectorAll<HTMLElement>('[data-md3-navigation-item]')].filter(
    (item) =>
      item.closest('[data-md3-navigation]') === navigation &&
      !item.matches(':disabled, [aria-disabled="true"]') &&
      item.getClientRects().length > 0,
  );
  const index = items.indexOf(current);

  if (index < 0) {
    return;
  }

  let next = index;

  if (event.key === 'Home') {
    next = 0;
  } else if (event.key === 'End') {
    next = items.length - 1;
  } else {
    next = (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  }

  event.preventDefault();

  const target = items[next];

  if (target) {
    target.focus({ preventScroll: true });

    const bounds = navigation.getBoundingClientRect();
    const destination = target.getBoundingClientRect();

    if (destination.top < bounds.top) {
      navigation.scrollTop += destination.top - bounds.top;
    } else if (destination.bottom > bounds.bottom) {
      navigation.scrollTop += destination.bottom - bounds.bottom;
    }
  }
}
