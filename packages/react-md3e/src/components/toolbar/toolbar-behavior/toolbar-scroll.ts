import type { ToolbarScrollTarget } from '../toolbar.types';

function scrollAncestor(element: HTMLElement): HTMLElement | Window {
  let parent = element.parentElement;

  while (parent) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return element.ownerDocument.defaultView ?? window;
}

export function resolveToolbarScrollTarget(root: HTMLElement, target: ToolbarScrollTarget | undefined) {
  return (typeof target === 'function' ? target() : target) ?? scrollAncestor(root);
}

export function observeToolbarScroll(
  root: HTMLElement,
  resolved: HTMLElement | Window,
  threshold: number,
  change: (scrolledDown: boolean, event: Event) => void,
) {
  const position = () => ('scrollY' in resolved ? resolved.scrollY : resolved.scrollTop);
  let previous = Math.max(0, position());
  let distance = 0;
  let direction = 0;

  const onScroll = (event: Event) => {
    const next = Math.max(0, position());
    const delta = next - previous;

    previous = next;

    // Focused controls and open popups remain available throughout their interaction.
    if (
      root.contains(root.ownerDocument.activeElement) ||
      root.querySelector('[aria-haspopup][aria-expanded="true"]')
    ) {
      distance = 0;

      return;
    }

    if (delta === 0) {
      return;
    }

    if (Math.sign(delta) !== direction) {
      distance = 0;
      direction = Math.sign(delta);
    }

    distance += delta;

    if (next === 0 || Math.abs(distance) >= threshold) {
      change(next > 0 && direction > 0, event);
      distance = 0;
    }
  };

  resolved.addEventListener('scroll', onScroll, { passive: true });

  return () => resolved.removeEventListener('scroll', onScroll);
}
