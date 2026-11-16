import type { ComponentPropsWithRef } from 'react';

export interface DialogActionsProps extends ComponentPropsWithRef<'div'> {
  /** Visually place the last (confirming) action above dismissive actions. */
  readonly stacked?: boolean;
}
