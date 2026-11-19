'use client';

import { useLayoutEffect, useRef } from 'react';

/** Drive the extracted CSS animation in either direction, retaining its playhead on interruption. */
export function useSliderValueMotion(open: boolean, animated: boolean) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    if (!animated) {
      delete element.dataset.present;

      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let player: Animation | undefined;
    const finish = () => {
      // A queued finish from opening must not hide a label that has already started closing.
      if (open || Number(player?.currentTime ?? 0) <= 0) {
        element.dataset.present = String(open);
      }
    };
    const sync = (play: boolean) => {
      player?.removeEventListener('finish', finish);
      player = element.getAnimations().find((animation) => animation instanceof CSSAnimation);

      if (!player || reducedMotion.matches) {
        element.dataset.present = String(open);

        return;
      }

      player.addEventListener('finish', finish);

      const duration = Number(player.effect?.getComputedTiming().duration ?? 0);
      const time = Math.min(duration, Math.max(0, Number(player.currentTime ?? 0)));

      player.pause();

      if (!play) {
        player.currentTime = open ? duration : 0;
        element.dataset.present = String(open);

        return;
      }

      player.currentTime = time;

      if (open) {
        element.dataset.present = 'true';

        if (time < duration) {
          player.playbackRate = 1;
          player.play();
        }
      } else if (time > 0) {
        element.dataset.present = 'true';
        player.playbackRate = -1;
        player.play();
      } else {
        element.dataset.present = 'false';
      }
    };
    const handlePreferenceChange = () => sync(false);

    sync(true);
    reducedMotion.addEventListener('change', handlePreferenceChange);

    return () => {
      reducedMotion.removeEventListener('change', handlePreferenceChange);
      player?.removeEventListener('finish', finish);
    };
  }, [animated, open]);

  return ref;
}
