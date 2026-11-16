'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { radioGroup } from './radio-group.styles';
import type { RadioGroupProps } from './radio-group.types';

export function RadioGroup({ row = false, className, onChange, dir, ...props }: RadioGroupProps) {
  const group = (
    <BaseRadioGroup
      {...props}
      dir={dir}
      className={[radioGroup, className].filter(Boolean).join(' ')}
      data-md3-radio-group=""
      data-row={row}
      onValueChange={(value: string | null, details) => {
        if (value !== null) {
          onChange?.(details.event, value);
        }

        if (details.event.defaultPrevented) {
          details.cancel();
        }
      }}
    />
  );

  return dir === 'rtl' || dir === 'ltr' ? <DirectionProvider direction={dir}>{group}</DirectionProvider> : group;
}
