'use client';

import { createContext } from 'react';
import type { ButtonSize, ButtonVariant } from '../../button/button.types';

export const ButtonGroupContext = createContext<{
  size: ButtonSize;
  variant: Exclude<ButtonVariant, 'text'>;
  disabled: boolean;
  selectionMode: 'single' | 'multiple' | 'none';
} | null>(null);
