'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, MouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import type { TooltipProps } from '../../components/tooltip/tooltip.types';

interface Options {
  readonly open: boolean | undefined;
  readonly defaultOpen: boolean | undefined;
  readonly onOpenChange: TooltipProps['onOpenChange'];
  readonly disabled: boolean;
  readonly enterTouchDelay: number;
  readonly leaveTouchDelay: number;
  readonly disableTouchListener: boolean;
  readonly rich: boolean;
  readonly persistent: boolean;
}

/** Base UI owns hover, positioning and dismissal. This adds the shared long-press gesture and cancellable state. */
export function useTooltipController({
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  enterTouchDelay = 700,
  leaveTouchDelay = 1500,
  disableTouchListener = false,
  rich,
  persistent,
}: Options) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = !disabled && (open ?? uncontrolledOpen);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const longPressed = useRef(false);
  const touching = useRef(false);
  const ignoreRestoredFocus = useRef(false);

  useLayoutEffect(() => {
    const popup = popupRef.current;

    // Hover-opened Base UI popovers do not activate their focus manager. Restore only focus that
    // would otherwise be left inside disappearing content, including a controlled empty title.
    if (rich && !isOpen && popup?.contains(popup.ownerDocument.activeElement)) {
      ignoreRestoredFocus.current = true;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [rich, isOpen]);

  const requestChange = (next: boolean, event: Event) => {
    if (next && disabled) {
      return false;
    }

    if (next === isOpen) {
      return true;
    }

    const prevented = event.defaultPrevented;

    if (onOpenChange?.(next, event) === false || (!prevented && event.defaultPrevented)) {
      return false;
    }

    if (!next && event instanceof KeyboardEvent && event.key === 'Escape') {
      ignoreRestoredFocus.current = true;
    }

    if (open === undefined) {
      setUncontrolledOpen(next);
    }

    return true;
  };
  const clearTimers = useCallback(() => {
    clearTimeout(touchTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => clearTimers, [clearTimers, disabled, disableTouchListener, persistent]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    touching.current = event.pointerType === 'touch';
    longPressed.current = false;

    if (touching.current && !disabled && !disableTouchListener && !persistent) {
      clearTimers();

      const { nativeEvent } = event;

      touchOrigin.current = { x: event.clientX, y: event.clientY };
      touchTimer.current = setTimeout(() => {
        longPressed.current = requestChange(true, nativeEvent);
      }, enterTouchDelay);
    }
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const origin = touchOrigin.current;

    if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 10) {
      clearTimeout(touchTimer.current);
      touchOrigin.current = null;
    }
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    clearTimeout(touchTimer.current);
    touchOrigin.current = null;
    touching.current = false;

    if (longPressed.current && !rich) {
      const { nativeEvent } = event;

      closeTimer.current = setTimeout(() => requestChange(false, nativeEvent), leaveTouchDelay);
    }
  };

  return {
    isOpen,
    requestChange,
    popupRef,
    setTriggerRef,
    clearTimers,
    triggerProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: () => {
        clearTimers();
        touchOrigin.current = null;
        touching.current = false;
        longPressed.current = false;
      },
      onBlur: () => {
        ignoreRestoredFocus.current = false;
      },
      onContextMenu: (event: MouseEvent<HTMLElement>) => {
        if (longPressed.current) {
          event.preventDefault();
        }
      },
      onClickCapture: (event: MouseEvent<HTMLElement>) => {
        if (longPressed.current) {
          event.preventDefault();
          event.stopPropagation();
          longPressed.current = false;
        }
      },
    },
    onTriggerFocus: (event: FocusEvent<HTMLElement>) => {
      if (ignoreRestoredFocus.current || popupRef.current?.hasAttribute('data-ending-style')) {
        ignoreRestoredFocus.current = false;

        return;
      }

      if (!persistent && !touching.current && event.currentTarget.matches(':focus-visible')) {
        requestChange(true, event.nativeEvent);
      }
    },
    hasFocus: () => {
      const active = triggerRef.current?.ownerDocument.activeElement;

      return Boolean(active && (active === triggerRef.current || popupRef.current?.contains(active)));
    },
  };
}
