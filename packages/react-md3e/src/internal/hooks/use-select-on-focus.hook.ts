import { useRef } from 'react';
import type { FocusEvent, MouseEvent } from 'react';

/** Preserve input selection through the mouse-up that follows pointer focus. */
export function useSelectOnFocus(enabled: boolean) {
  const selecting = useRef(false);

  return {
    onFocus(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
      if (enabled) {
        event.currentTarget.select();
        selecting.current = true;
      }
    },
    onMouseUp(event: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) {
      if (selecting.current) {
        event.preventDefault();
        selecting.current = false;
      }
    },
    onBlur() {
      selecting.current = false;
    },
  };
}
