import { useState } from 'react';
import { MenuItem, SplitButton } from '@flaut-travel/react-md3e';

export function ControlledSplitButton() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('none');

  return (
    <>
      <SplitButton
        open={open}
        onOpenChange={(next) => setOpen(next)}
        menuButtonLabel="More send options"
        onClick={() => setAction('Send now')}
        menu={
          <>
            <MenuItem onClick={() => setAction('Schedule send')}>Schedule send</MenuItem>
            <MenuItem onClick={() => setAction('Save draft')}>Save draft</MenuItem>
          </>
        }
      >
        Send
      </SplitButton>
      <p>Last action: {action}</p>
    </>
  );
}
