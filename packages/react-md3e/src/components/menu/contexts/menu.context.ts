'use client';

import { createContext } from 'react';
import type { MenuDensity, MenuVariant } from '../menu.types';

export const MenuContext = createContext<{
  readonly variant: MenuVariant;
  readonly density: MenuDensity;
  readonly disabled: boolean;
}>({ variant: 'standard', density: 0, disabled: false });
