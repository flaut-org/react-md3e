'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { tabList, tabIndicator } from '../tabs.styles';
import type { TabListProps } from '../tabs.types';

export function TabList({
  scrollable = false,
  selectionFollowsFocus = false,
  loopFocus = true,
  className,
  children,
  ...props
}: TabListProps) {
  if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) {
    throw new TypeError('TabList requires a non-empty aria-label or aria-labelledby.');
  }

  return (
    <BaseTabs.List
      {...props}
      className={[tabList, className].filter(Boolean).join(' ')}
      data-md3-tab-list=""
      data-scrollable={scrollable}
      activateOnFocus={selectionFollowsFocus}
      loopFocus={loopFocus}
    >
      {children}
      <BaseTabs.Indicator className={tabIndicator} data-md3-tab-indicator="" />
    </BaseTabs.List>
  );
}
