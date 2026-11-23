'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useInheritedDirection } from '../../internal/hooks/use-inherited-direction.hook';
import { tabsRoot } from './tabs.styles';
import type { TabsProps } from './tabs.types';

export function Tabs({ variant = 'primary', value, defaultValue, onChange, className, children, ...props }: TabsProps) {
  const { anchorRef, direction } = useInheritedDirection(props.dir);

  return (
    <DirectionProvider direction={direction === 'rtl' ? 'rtl' : 'ltr'}>
      <BaseTabs.Root
        {...props}
        value={value}
        defaultValue={defaultValue}
        orientation="horizontal"
        className={[tabsRoot, className].filter(Boolean).join(' ')}
        data-md3-tabs=""
        data-variant={variant}
        onValueChange={(next: string | number | null, details) => {
          const prevented = details.event.defaultPrevented;
          const result = onChange?.(details.event, next);

          if (result === false || (!prevented && details.event.defaultPrevented)) {
            details.cancel();
          }
        }}
      >
        <span hidden ref={anchorRef} />
        {children}
      </BaseTabs.Root>
    </DirectionProvider>
  );
}
