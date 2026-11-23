'use client';

import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { revealTab } from '../../tabs-geometry';
import { tabContent, tabIcon, tabLabel, tabBadge } from '../../tabs.styles';

export function TabContent({
  active,
  label,
  icon,
  badge,
}: {
  readonly active: boolean;
  readonly label: ReactNode;
  readonly icon: ReactNode;
  readonly badge: ReactNode;
}) {
  const contentRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const tab = content?.closest<HTMLElement>('[data-md3-tab]');
    const list = tab?.closest<HTMLElement>('[data-md3-tab-list]');
    const target = labelRef.current ?? content;

    if (active && tab && list && target) {
      const measure = () => {
        list.style.setProperty('--_md3-tab-label-width', `${Math.max(24, target.offsetWidth - 4)}px`);
      };
      const observer = new ResizeObserver(measure);

      measure();
      revealTab(tab);
      observer.observe(target);

      return () => observer.disconnect();
    }

    return undefined;
  }, [active, label, icon]);

  return (
    <span ref={contentRef} className={tabContent} data-md3-tab-content="">
      {icon != null && (
        <span className={tabIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      {label != null && (
        <span ref={labelRef} className={tabLabel} data-md3-tab-label="">
          {label}
        </span>
      )}
      {badge != null && <span className={tabBadge}>{badge}</span>}
    </span>
  );
}
