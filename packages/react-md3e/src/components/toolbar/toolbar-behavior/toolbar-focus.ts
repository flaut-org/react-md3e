const focusable =
  'button, a[href], input:not([type="hidden"]), textarea, select, [contenteditable="true"], [tabindex], [role="checkbox"], [role="switch"], [role="radio"], [role="slider"]';

export function toolbarControls(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(focusable)].filter((element) => {
    const style = getComputedStyle(element);

    return (
      element.closest('[data-md3-toolbar-controls]') === root &&
      !element.closest('[inert], [hidden], [aria-hidden="true"], [data-overflowed="true"]') &&
      !element.matches(':disabled, [aria-disabled="true"], [data-base-ui-focus-guard]') &&
      element.getClientRects().length > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none'
    );
  });
}

function revealToolbarControl(root: HTMLElement, control: HTMLElement) {
  const visual = control.closest('[data-md3-slider]') ?? control;
  let parent = control.parentElement;

  while (parent && parent !== root) {
    const bounds = parent.getBoundingClientRect();
    const item = visual.getBoundingClientRect();
    const leftOverflow = Math.min(0, item.left - bounds.left);
    const rightOverflow = Math.max(0, item.right - bounds.right);
    const topOverflow = Math.min(0, item.top - bounds.top);
    const bottomOverflow = Math.max(0, item.bottom - bounds.bottom);

    if (parent.scrollWidth > parent.clientWidth || parent.scrollHeight > parent.clientHeight) {
      parent.scrollBy({ left: leftOverflow + rightOverflow, top: topOverflow + bottomOverflow });
    }

    parent = parent.parentElement;
  }
}

/** Native/custom controls share one tab stop without inspecting React children or replacing their semantics. */
export function observeToolbarFocus(root: HTMLElement) {
  const original = new Map<HTMLElement, string | null>();
  let last: HTMLElement | undefined;
  let lastIndex = 0;
  let ownedFocus = false;
  let frame = 0;

  const synchronize = () => {
    const controls = toolbarControls(root);
    const active = root.ownerDocument.activeElement;

    if (active instanceof HTMLElement && controls.includes(active)) {
      last = active;
      lastIndex = controls.indexOf(active);
      revealToolbarControl(root, active);
    } else if (ownedFocus && last && !controls.includes(last)) {
      const next = controls[Math.min(lastIndex, controls.length - 1)];

      (next ?? root).focus({ preventScroll: true });
      last = next;
    }

    const tabStop = last && controls.includes(last) ? last : controls[0];

    for (const control of original.keys()) {
      if (!control.isConnected) {
        original.delete(control);
      } else if (!controls.includes(control)) {
        if (control.getAttribute('tabindex') !== '-1') {
          control.tabIndex = -1;
        }
      }
    }

    for (const control of controls) {
      if (!original.has(control)) {
        original.set(control, control.getAttribute('tabindex'));
      }

      const desired = control === tabStop ? 0 : -1;

      if (control.getAttribute('tabindex') !== String(desired)) {
        control.tabIndex = desired;
      }
    }
  };
  const queue = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(synchronize);
  };
  const onFocus = () => {
    ownedFocus = true;
    synchronize();
  };
  const onDocumentFocus = (event: FocusEvent) => {
    if (event.target instanceof Node && !root.contains(event.target)) {
      ownedFocus = false;
    }
  };
  const observer = new MutationObserver(queue);

  synchronize();
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      'disabled',
      'aria-disabled',
      'tabindex',
      'hidden',
      'inert',
      'style',
      'class',
      'data-expanded',
      'data-overflowed',
    ],
  });

  const resize = new ResizeObserver(queue);

  resize.observe(root);
  root.addEventListener('focusin', onFocus);
  root.ownerDocument.addEventListener('focusin', onDocumentFocus);

  return () => {
    observer.disconnect();
    resize.disconnect();
    cancelAnimationFrame(frame);
    root.removeEventListener('focusin', onFocus);
    root.ownerDocument.removeEventListener('focusin', onDocumentFocus);

    for (const [control, tabIndex] of original) {
      if (tabIndex === null) {
        control.removeAttribute('tabindex');
      } else {
        control.setAttribute('tabindex', tabIndex);
      }
    }
  };
}

export function navigateToolbar(root: HTMLElement, event: KeyboardEvent, orientation: string, loop: boolean) {
  const { target } = event;

  if (
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    !(target instanceof HTMLElement) ||
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="combobox"], [role="slider"], [role="spinbutton"], [data-md3-toolbar-arrow-keys="native"]',
    )
  ) {
    return;
  }

  const rtl = getComputedStyle(root).direction === 'rtl';
  const horizontalForward = rtl ? 'ArrowLeft' : 'ArrowRight';
  const horizontalBackward = rtl ? 'ArrowRight' : 'ArrowLeft';
  const forward = orientation === 'vertical' ? 'ArrowDown' : horizontalForward;
  const backward = orientation === 'vertical' ? 'ArrowUp' : horizontalBackward;
  const controls = toolbarControls(root);
  const index = controls.indexOf(target);
  let next: number;

  if (event.key === 'Home') {
    next = 0;
  } else if (event.key === 'End') {
    next = controls.length - 1;
  } else if (event.key === forward || event.key === backward) {
    next = index + (event.key === forward ? 1 : -1);

    if (loop && controls.length > 0) {
      next = (next + controls.length) % controls.length;
    }
  } else {
    return;
  }

  const control = controls[Math.max(0, Math.min(controls.length - 1, next))];

  if (control) {
    event.preventDefault();
    control.focus({ preventScroll: true });
  }
}

export function updateToolbarVisibility(root: HTMLElement, expanded: boolean, hidden: boolean) {
  const active = root.ownerDocument.activeElement;
  const collapsing = [...root.querySelectorAll<HTMLElement>('[data-md3-toolbar-collapsible]')];

  if (!expanded && active instanceof HTMLElement && collapsing.some((region) => region.contains(active))) {
    const persistent = toolbarControls(root).find(
      (control) =>
        control.closest('[data-md3-toolbar-persistent]') && !collapsing.some((region) => region.contains(control)),
    );

    (persistent ?? root).focus({ preventScroll: true });
  }

  for (const region of collapsing) {
    region.inert = !expanded;
  }

  root.toggleAttribute('inert', hidden);
}
