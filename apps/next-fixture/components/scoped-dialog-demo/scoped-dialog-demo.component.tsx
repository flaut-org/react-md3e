'use client';

import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@flaut-travel/react-md3e';

export function ScopedDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dark scoped dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} data-testid="scoped-dialog">
        <DialogTitle>Dark collection</DialogTitle>
        <DialogContent>
          <DialogContentText>The portal inherits the enclosing server-created theme.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>
            Close dark dialog
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
