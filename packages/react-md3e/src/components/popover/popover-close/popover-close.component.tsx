'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { Button } from '../../button/button.component';
import type { PopoverCloseProps } from './popover-close.types';

export function PopoverClose(props: PopoverCloseProps) {
  return <BasePopover.Close render={<Button {...props} />} />;
}
