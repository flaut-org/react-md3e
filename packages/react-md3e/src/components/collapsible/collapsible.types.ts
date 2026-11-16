import type { ComponentPropsWithRef, ReactElement } from 'react';

export interface CollapsibleProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean, event: Event) => void | boolean;
  readonly trigger?: ReactElement;
  readonly disabled?: boolean;
  readonly keepMounted?: boolean;
  readonly panelProps?: ComponentPropsWithRef<'div'>;
}
