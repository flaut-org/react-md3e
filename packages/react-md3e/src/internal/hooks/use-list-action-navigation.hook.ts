'use client';

import { useLayoutEffect, useRef } from 'react';

const selector = 'button, a[href], [role="checkbox"], [role="radio"], [role="switch"], input:not([type="hidden"])';
const controllers = new WeakMap<HTMLUListElement, { readonly release: () => void; users: number }>();

/** DOM registration lets server-rendered List stay passive, including with streamed action rows. */
function observeActions(list: HTMLUListElement) {
  const originals = new Map<HTMLElement, string | null>();

  function actions() {
    return [...list.querySelectorAll<HTMLElement>(`[data-md3-list-item-actions] :is(${selector})`)].filter(
      (element) =>
        element.closest('[data-md3-list]') === list &&
        !element.matches(':disabled, [aria-disabled="true"], input[tabindex="-1"]') &&
        !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
        (originals.has(element) || element.tabIndex >= 0) &&
        element.getClientRects().length > 0,
    );
  }

  function synchronize() {
    const elements = actions();
    const active = list.ownerDocument.activeElement;
    const entry = elements.find((element) => element === active) ?? elements[0];

    for (const element of elements) {
      if (!originals.has(element)) {
        originals.set(element, element.getAttribute('tabindex'));
      }

      const tabIndex = element === entry ? 0 : -1;

      if (element.tabIndex !== tabIndex) {
        element.tabIndex = tabIndex;
      }
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    const { target } = event;

    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      !(target instanceof HTMLElement) ||
      target.closest('[data-md3-list]') !== list ||
      target.closest('input:not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]')
    ) {
      return;
    }

    const elements = actions();
    const current = elements.indexOf(target);
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
    const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
    let index;

    if (current < 0 || elements.length === 0) {
      return;
    }

    if (forward || backward) {
      index = (current + (forward ? 1 : -1) + elements.length) % elements.length;
    } else if (event.key === 'Home') {
      index = 0;
    } else if (event.key === 'End') {
      index = elements.length - 1;
    }

    if (index !== undefined) {
      event.preventDefault();
      elements[index]?.focus();
      synchronize();
    }
  }

  function onBlur() {
    queueMicrotask(synchronize);
  }

  const observer = new MutationObserver(synchronize);

  observer.observe(list, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['disabled', 'aria-disabled', 'hidden', 'inert', 'tabindex'],
  });
  synchronize();
  // React's control-specific handlers run first and can prevent list navigation (e.g. RadioGroup).
  list.ownerDocument.addEventListener('keydown', onKeyDown);
  list.addEventListener('focusin', synchronize);
  list.addEventListener('focusout', onBlur);

  return () => {
    observer.disconnect();
    list.ownerDocument.removeEventListener('keydown', onKeyDown);
    list.removeEventListener('focusin', synchronize);
    list.removeEventListener('focusout', onBlur);

    for (const [element, original] of originals) {
      if (original === null) {
        element.removeAttribute('tabindex');
      } else {
        element.setAttribute('tabindex', original);
      }
    }
  };
}

export function useListActionNavigation() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const list = ref.current?.closest<HTMLUListElement>('[data-md3-list]');

    if (!list) {
      return undefined;
    }

    let controller = controllers.get(list);

    if (!controller) {
      controller = { users: 0, release: observeActions(list) };
      controllers.set(list, controller);
    }

    controller.users += 1;

    return () => {
      controller.users -= 1;

      if (controller.users === 0) {
        controller.release();
        controllers.delete(list);
      }
    };
  }, []);

  return ref;
}
