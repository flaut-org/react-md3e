'use client';

import { useId } from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { collapsiblePanel, collapsibleContent } from './collapsible.styles';
import type { CollapsibleProps } from './collapsible.types';

export function Collapsible({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  disabled = false,
  keepMounted = false,
  panelProps = {},
  children,
  ...props
}: CollapsibleProps) {
  const generatedId = useId();
  const triggerId = `${props.id ?? generatedId}-trigger`;

  return (
    <BaseCollapsible.Root
      {...props}
      open={open}
      defaultOpen={defaultOpen}
      disabled={disabled}
      data-md3-collapsible=""
      onOpenChange={(next, details) => {
        const prevented = details.event.defaultPrevented;

        if (onOpenChange?.(next, details.event) === false || (!prevented && details.event.defaultPrevented)) {
          details.cancel();
        }
      }}
    >
      {trigger && <BaseCollapsible.Trigger id={triggerId} render={trigger} />}
      <BaseCollapsible.Panel
        {...panelProps}
        keepMounted={keepMounted}
        className={[collapsiblePanel, panelProps.className].filter(Boolean).join(' ')}
        data-md3-collapsible-panel=""
        role={panelProps.role ?? (trigger ? 'region' : undefined)}
        aria-labelledby={panelProps['aria-labelledby'] ?? (trigger ? triggerId : undefined)}
      >
        <div className={collapsibleContent}>{children}</div>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}
