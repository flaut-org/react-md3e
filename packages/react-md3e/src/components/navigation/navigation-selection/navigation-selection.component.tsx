'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { NavigationSelectionContext } from '../contexts/navigation.context';
import type { NavigationSelectionProps, NavigationValue } from '../navigation.types';

export function NavigationSelection({
  value,
  defaultValue = null,
  onChange,
  children,
}: NavigationSelectionProps & { readonly children: ReactNode }) {
  const [uncontrolledValue, setUncontrolledValue] = useState<NavigationValue | null>(defaultValue);
  const selectedValue = value === undefined ? uncontrolledValue : value;
  const context = useMemo(
    () => ({
      value: selectedValue,
      select(event: Event, next: NavigationValue) {
        if (next === selectedValue) {
          return true;
        }

        const prevented = event.defaultPrevented;
        const canceled = onChange?.(event, next) === false || (!prevented && event.defaultPrevented);

        if (canceled) {
          return false;
        }

        if (value === undefined) {
          setUncontrolledValue(next);
        }

        return true;
      },
    }),
    [onChange, selectedValue, value],
  );

  return <NavigationSelectionContext value={context}>{children}</NavigationSelectionContext>;
}
