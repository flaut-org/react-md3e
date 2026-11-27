'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import queries from '../picker-media.generated.json';

// Behavioral capability queries, not theme layout observers. SSR always starts with modal behavior.
const desktopQuery = queries.desktop;
const compactQuery = queries.compact;
const serverSnapshot = () => '0/0/1/1/1';

export function usePickerMedia(panels = 1, actions = false) {
  // Keep complete 360×416 calendar panels. These are behavioral fit checks, not theme/style observers.
  const media = useMemo(
    () => [
      desktopQuery,
      compactQuery,
      `(width >= ${panels * 360 + 16}px) and (height >= ${416 + (actions ? 62 : 0) + 16}px)`,
      '(height >= 598px)',
      '(height >= 646px)',
    ],
    [panels, actions],
  );
  const subscribe = useCallback(
    (callback: () => void) => {
      const matches = media.map((query) => window.matchMedia(query));

      matches.forEach((query) => query.addEventListener('change', callback));

      return () => matches.forEach((query) => query.removeEventListener('change', callback));
    },
    [media],
  );
  const snapshot = useCallback(
    () => media.map((query) => (window.matchMedia(query).matches ? '1' : '0')).join('/'),
    [media],
  );
  const value = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [desktop, compact, dockFits, modalCalendar, modalGutters] = value.split('/').map((match) => match === '1');

  return { desktop, compact, dockFits, modalCalendar, modalGutters };
}
