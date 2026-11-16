'use client';

import { useId, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@flaut-travel/react-md3e';
import type { Breakpoint, DialogProps } from '@flaut-travel/react-md3e';

const widths = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function BreakpointDialogDemo({ name }: { readonly name: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState<Breakpoint | 'default' | 'false'>('default');
  const [fullWidth, setFullWidth] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const widthProps: Pick<DialogProps, 'maxWidth'> =
    width === 'default' ? {} : { maxWidth: width === 'false' ? false : width };

  return (
    <section>
      <h2>{name} breakpoints</h2>
      <label htmlFor={id}>{name} maximum width</label>
      <select id={id} value={width} onChange={(event) => setWidth(event.target.value as typeof width)}>
        <option value="default">MD3 default</option>
        {widths.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
        <option value="false">No cap</option>
      </select>
      <label>
        <input type="checkbox" checked={fullWidth} onChange={(event) => setFullWidth(event.target.checked)} />
        {name} full width
      </label>
      <label>
        <input type="checkbox" checked={fullScreen} onChange={(event) => setFullScreen(event.target.checked)} />
        {name} full screen
      </label>
      <Button onClick={() => setOpen(true)}>Open {name} width dialog</Button>
      <Dialog {...widthProps} open={open} onClose={() => setOpen(false)} fullWidth={fullWidth} fullScreen={fullScreen}>
        <DialogTitle>{name} width dialog</DialogTitle>
        <DialogContent>Width follows the nearest CSS theme scope.</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close width dialog</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
