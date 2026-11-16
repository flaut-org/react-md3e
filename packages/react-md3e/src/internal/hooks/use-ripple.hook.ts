'use client';

import { useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { rippleInk } from '../ripple/ripple.styles';
import { measureRipple } from '../ripple/ripple-geometry';
import type { RippleGeometry, RipplePoint } from '../ripple/ripple-geometry';

type Timer = ReturnType<typeof setTimeout>;
interface Press {
  pointerId?: number;
  key?: string;
  point?: RipplePoint;
  delay?: Timer;
  ink?: HTMLSpanElement;
  startedAt?: number;
}

/** Create the visual ink node using precompiled classes and geometry variables. */
function createRippleInk(ownerDocument: Document, geometry: RippleGeometry): HTMLSpanElement {
  const ink = ownerDocument.createElement('span');
  const variables = {
    '--_ripple-size': `${geometry.size}px`,
    '--_ripple-start-x': `${geometry.startX}px`,
    '--_ripple-start-y': `${geometry.startY}px`,
    '--_ripple-end-x': `${geometry.endX}px`,
    '--_ripple-end-y': `${geometry.endY}px`,
    '--_ripple-scale': String(geometry.scale),
  };

  ink.className = rippleInk;
  ink.dataset.md3RippleInk = '';

  for (const [name, value] of Object.entries(variables)) {
    ink.style.setProperty(name, value);
  }

  return ink;
}

/** Event/geometry work only. All selectors, keyframes, and transitions are precompiled CSS. */
export function useRipple(disabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  const active = useRef<Press | null>(null);
  const timers = useRef(new Set<Timer>());
  const keyboardClickPending = useRef(false);

  useEffect(() => {
    const surface = ref.current;
    const pending = timers.current;

    if (disabled) {
      pending.forEach(clearTimeout);
      pending.clear();
      surface?.replaceChildren();
      active.current = null;
      keyboardClickPending.current = false;
    }

    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
      surface?.replaceChildren();
      active.current = null;
      keyboardClickPending.current = false;
    };
  }, [disabled]);

  function schedule(callback: () => void, delay: number) {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);

    timers.current.add(timer);

    return timer;
  }

  function clearDelay(press: Press) {
    if (press.delay !== undefined) {
      clearTimeout(press.delay);
      timers.current.delete(press.delay);
      delete press.delay;
    }
  }

  function start(press: Press) {
    const surface = ref.current;
    const canAnimate =
      surface !== null &&
      !disabled &&
      !window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)').matches;

    if (canAnimate) {
      const geometry = measureRipple(surface, press.point);

      if (geometry) {
        const ink = createRippleInk(surface.ownerDocument, geometry);

        surface.append(ink);
        press.ink = ink;
        press.startedAt = performance.now();
      }
    }
  }

  function fade(press: Press, cancelled = false) {
    clearDelay(press);

    const { ink } = press;

    if (ink) {
      const wait = cancelled ? 0 : Math.max(0, 225 - (performance.now() - (press.startedAt ?? 0)));

      schedule(() => {
        ink.dataset.leaving = 'true';
        schedule(() => ink.remove(), 150);
      }, wait);
    }
  }

  function cancel() {
    if (active.current) {
      fade(active.current, true);
    }

    active.current = null;
    keyboardClickPending.current = false;
  }

  function release() {
    const press = active.current;

    if (press) {
      clearDelay(press);

      if (!press.ink) {
        start(press);
      }

      fade(press);
      active.current = null;
    }
  }

  const handlers: HTMLAttributes<HTMLElement> = {
    onPointerDown(event) {
      const canStart = !disabled && !event.defaultPrevented && event.isPrimary && event.button === 0;

      if (canStart) {
        cancel();

        const press: Press = {
          pointerId: event.pointerId,
          point: { x: event.clientX, y: event.clientY },
        };

        active.current = press;

        if (event.pointerType === 'touch') {
          press.delay = schedule(() => {
            delete press.delay;

            if (active.current === press) {
              start(press);
            }
          }, 150);
        } else {
          start(press);
        }
      }
    },
    onPointerUp(event) {
      if (active.current?.pointerId === event.pointerId) {
        release();
      }
    },
    onPointerCancel(event) {
      if (active.current?.pointerId === event.pointerId) {
        cancel();
      }
    },
    onPointerLeave(event) {
      if (event.pointerType !== 'touch') {
        cancel();
      }
    },
    onKeyDown(event) {
      const isActivationKey = event.key === 'Enter' || event.key === ' ';
      const canStart = !disabled && !event.defaultPrevented && !event.repeat && isActivationKey;

      if (canStart) {
        cancel();

        const press: Press = { key: event.key };

        active.current = press;
        keyboardClickPending.current = true;
        start(press);
      }
    },
    onKeyUp(event) {
      if (active.current?.key === event.key) {
        release();
      }
    },
    onClick(event) {
      const isCenteredActivation = !disabled && !event.defaultPrevented && event.detail === 0;

      if (isCenteredActivation) {
        if (keyboardClickPending.current) {
          keyboardClickPending.current = false;
        } else {
          // Assistive technology and programmatic activation have no pointer origin.
          const press: Press = {};

          start(press);
          fade(press);
        }
      }
    },
    onBlur: cancel,
    onContextMenu: cancel,
  };

  return { ref, handlers };
}
