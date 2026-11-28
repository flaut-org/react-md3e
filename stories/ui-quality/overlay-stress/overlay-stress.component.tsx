import { useState } from 'react';
import {
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogTitle,
  Popover,
  PopoverClose,
  TextField,
} from '@flaut-travel/react-md3e';

export function OverlayStress() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open booking</Button>
      <Dialog open={open} onClose={() => setOpen(false)} role="dialog">
        <DialogTitle>Booking</DialogTitle>
        <DialogContent>
          <DatePicker label="Departure" variant="docked" today="2024-02-29" referenceDate="2024-02-29" />
          <Popover trigger={<Button>More options</Button>} aria-label="Options">
            <Popover trigger={<Button>Nested options</Button>} aria-label="Nested options">
              <TextField label="Note" />
              <Button onClick={() => setExpanded(!expanded)}>Change content</Button>
              {expanded && <p>Додаткові побажання для подорожі з пересадкою та розміщення всієї родини поруч.</p>}
              <PopoverClose>Close nested</PopoverClose>
            </Popover>
            <PopoverClose>Close options</PopoverClose>
          </Popover>
          <Button onClick={() => setOpen(false)}>Close booking</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
