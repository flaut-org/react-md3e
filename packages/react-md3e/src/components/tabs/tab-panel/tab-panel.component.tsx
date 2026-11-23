'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { tabPanel } from '../tabs.styles';
import type { TabPanelProps } from '../tabs.types';

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <BaseTabs.Panel {...props} className={[tabPanel, className].filter(Boolean).join(' ')} />;
}
