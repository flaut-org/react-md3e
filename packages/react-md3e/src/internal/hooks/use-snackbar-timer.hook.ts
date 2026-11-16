'use client';

import { useEffect, useRef } from 'react';

/** Controlled dismissal timing, independent of Toast's animation and announcement lifecycle. */
export function useSnackbarTimer(
  open: boolean,
  duration: number | null,
  ignoreWindowBlur: boolean,
  onTimeout: () => void,
) {
  const callback = useRef(onTimeout);
  const controls = useRef<{ pause: (reason: string) => void; resume: (reason: string) => void }>({
    pause: () => {},
    resume: () => {},
  });

  useEffect(() => {
    callback.current = onTimeout;
  }, [onTimeout]);
  useEffect(() => {
    if (open && duration !== null) {
      let remaining = duration;
      let started = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const paused = new Set<string>();
      const start = () => {
        if (paused.size === 0 && timer === undefined) {
          started = performance.now();
          timer = setTimeout(
            () => {
              timer = undefined;
              remaining = 0;
              callback.current();
            },
            Math.max(0, remaining),
          );
        }
      };
      const pause = (reason: string) => {
        paused.add(reason);

        if (timer !== undefined) {
          clearTimeout(timer);
          timer = undefined;
          remaining = Math.max(0, remaining - (performance.now() - started));
        }
      };
      const resume = (reason: string) => {
        paused.delete(reason);
        start();
      };
      const blur = () => pause('window');
      const focus = () => resume('window');

      controls.current = { pause, resume };
      start();

      if (!ignoreWindowBlur) {
        window.addEventListener('blur', blur);
        window.addEventListener('focus', focus);
      }

      return () => {
        clearTimeout(timer);
        controls.current = { pause: () => {}, resume: () => {} };
        window.removeEventListener('blur', blur);
        window.removeEventListener('focus', focus);
      };
    }

    return undefined;
  }, [open, duration, ignoreWindowBlur]);

  return {
    pause: (reason: string) => controls.current.pause(reason),
    resume: (reason: string) => controls.current.resume(reason),
  };
}
