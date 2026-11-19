'use client';

import { createContext } from 'react';
import type { ReactNode } from 'react';

export const SegmentedButtonContext = createContext<{
  disabled: boolean;
  readOnly: boolean;
  multiple: boolean;
  hideSelectionIndicator: boolean;
  selectedIcon: ReactNode;
  name: string | undefined;
  form: string | undefined;
} | null>(null);
