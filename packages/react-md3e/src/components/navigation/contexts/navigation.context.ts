'use client';

import { createContext } from 'react';
import type { NavigationValue } from '../navigation.types';

export interface NavigationSelectionContextValue {
  readonly value: NavigationValue | null;
  readonly select: (event: Event, value: NavigationValue) => boolean;
}

export const NavigationSelectionContext = createContext<NavigationSelectionContextValue | null>(null);
