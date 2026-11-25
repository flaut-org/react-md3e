import { useState } from 'react';
import { Button, Snackbar } from '@flaut-travel/react-md3e';
import type { SnackbarProps } from '@flaut-travel/react-md3e';

export function SnackbarStory(props: SnackbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show notification</Button>
      <Snackbar {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
