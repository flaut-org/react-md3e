'use client';

import { createContext } from 'react';

export const ChipSetContext = createContext<{ readonly disabled: boolean } | null>(null);
