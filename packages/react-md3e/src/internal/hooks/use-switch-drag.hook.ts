'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { HTMLAttributes, RefObject } from 'react';

interface DragGesture {
  readonly pointerId: number;
  readonly target: HTMLElement;
  readonly x: number;
  readonly y: number;
  readonly start: number;
  readonly direction: number;
  offset: number;
  dragging: boolean;
}

/** Direct manipulation sets only a geometry variable; Base UI still owns checked state and events. */
export function useSwitchDrag(inputRef: RefObject<HTMLInputElement | null>, disabled: boolean) {
  const gesture = useRef<DragGesture | null>(null);
  const suppressClick = useRef(false);
  const reset = useCallback(() => {
    const { current } = gesture;

    gesture.current = null;

    if (current) {
      current.target.style.removeProperty('--_switch-drag-offset');
      delete current.target.dataset.dragging;

      if (current.target.hasPointerCapture(current.pointerId)) {
        current.target.releasePointerCapture(current.pointerId);
      }
    }
  }, []);

  useEffect(() => {
    if (disabled) {
      reset();
      suppressClick.current = false;
    }

    return reset;
  }, [disabled, reset]);

  const handlers: HTMLAttributes<HTMLElement> = {
    onPointerDown(event) {
      if (!disabled && !event.defaultPrevented && event.isPrimary && event.button === 0) {
        reset();
        suppressClick.current = false;

        const start = inputRef.current?.checked ? 20 : 0;

        gesture.current = {
          pointerId: event.pointerId,
          target: event.currentTarget,
          x: event.clientX,
          y: event.clientY,
          start,
          direction: getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1,
          offset: start,
          dragging: false,
        };
      }
    },
    onPointerMove(event) {
      const { current } = gesture;

      if (current?.pointerId === event.pointerId) {
        const dx = event.clientX - current.x;
        const dy = event.clientY - current.y;
        const blocked =
          disabled || current.target.hasAttribute('data-disabled') || current.target.hasAttribute('data-readonly');

        if (blocked || event.defaultPrevented || (!current.dragging && Math.abs(dy) > Math.max(3, Math.abs(dx)))) {
          reset();

          return;
        }

        if (!current.dragging && Math.abs(dx) > 3) {
          current.dragging = true;
          current.target.dataset.dragging = '';
          current.target.setPointerCapture(event.pointerId);
          current.target.focus({ preventScroll: true });
        }

        if (current.dragging) {
          event.preventDefault();
          current.offset = Math.min(20, Math.max(0, current.start + dx * current.direction));
          current.target.style.setProperty('--_switch-drag-offset', `${current.offset}px`);
        }
      }
    },
    onPointerUp(event) {
      const { current } = gesture;

      if (current?.pointerId === event.pointerId) {
        const input = inputRef.current;
        const nextChecked = current.offset >= 10;
        const canCommit =
          current.dragging &&
          !disabled &&
          !event.defaultPrevented &&
          input &&
          !input.disabled &&
          !current.target.hasAttribute('data-readonly');

        if (current.dragging) {
          suppressClick.current = true;

          if (canCommit && input.checked !== nextChecked) {
            input.click();
          }
        }

        reset();
      }
    },
    onClickCapture(event) {
      if (suppressClick.current) {
        suppressClick.current = false;

        if (event.detail > 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    onPointerCancel(event) {
      if (gesture.current?.pointerId === event.pointerId) {
        suppressClick.current = false;
        reset();
      }
    },
    onPointerLeave() {
      if (!gesture.current?.dragging) {
        reset();
      }
    },
    onLostPointerCapture: reset,
    onBlur: reset,
  };

  return handlers;
}
