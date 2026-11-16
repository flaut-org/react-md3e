'use client';

import { createContext } from 'react';
import type { ListControlPosition } from '../../list-item-content/list-item-content.types';

interface ListSelectionContextValue {
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly controlPosition: ListControlPosition;
  readonly indicator: 'radio' | 'checkbox' | 'checkmark';
}

/** Interaction configuration only; themes continue to inherit through CSS. */
export const ListSelectionContext = createContext<ListSelectionContextValue | null>(null);
