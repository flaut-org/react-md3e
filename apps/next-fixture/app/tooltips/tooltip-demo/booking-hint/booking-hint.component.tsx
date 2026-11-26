'use client';

import { useContext } from 'react';
import { TooltipDemoContext } from '../contexts/tooltip-demo.context';

export function BookingHint() {
  const value = useContext(TooltipDemoContext);

  return <span>Context: {value}</span>;
}
