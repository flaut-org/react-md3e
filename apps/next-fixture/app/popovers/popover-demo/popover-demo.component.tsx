'use client';

import { useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  PopoverClose,
  TextField,
} from '@flaut-travel/react-md3e';
import type { TextFieldControl } from '@flaut-travel/react-md3e';

export function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [veto, setVeto] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mountNote, setMountNote] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<TextFieldControl>(null);
  const finalRef = useRef<HTMLButtonElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <section data-testid="controlled-popover">
        <h2>Controlled state and refs</h2>
        <Popover
          id="controlled-options"
          aria-label="Controlled options"
          trigger={
            <Button id="controlled-trigger" ref={triggerRef}>
              Controlled popover
            </Button>
          }
          open={open}
          onOpenChange={(next) => setOpen(next)}
          onClose={(_event, next) => setReason(next)}
          ref={popupRef}
        >
          <p>Selection changes keep this panel open.</p>
          <Button
            onClick={() => {
              popupRef.current?.setAttribute('data-ref-checked', 'true');
              triggerRef.current?.setAttribute('data-ref-checked', 'true');
            }}
          >
            Check popover refs
          </Button>
          <PopoverClose variant="text">Close controlled</PopoverClose>
        </Popover>
        <Button onClick={() => setOpen(true)}>Open from code</Button>
        <p data-testid="popover-reason">{reason}</p>
      </section>
      <section>
        <h2>Dismissal policy</h2>
        <Popover
          aria-label="Protected options"
          trigger={<Button>Protected popover</Button>}
          disableEscapeKeyDown
          onClose={(event, next) => {
            if (veto && next === 'clickAway') {
              event.preventDefault();
            }

            return veto && next === 'focusOut' ? false : undefined;
          }}
        >
          <Button onClick={() => setVeto(false)}>Allow outside close</Button>
          <PopoverClose variant="text">Close protected</PopoverClose>
        </Popover>
        <Button>Outside action</Button>
      </section>
      <section>
        <h2>Retained state and explicit focus</h2>
        <Popover
          aria-label="Retained options"
          trigger={<Button>Retained popover</Button>}
          keepMounted
          initialFocus={fieldRef}
          finalFocus={finalRef}
        >
          {mountNote && <TextField inputRef={fieldRef} label="Retained note" defaultValue="Initial" fullWidth />}
          <Button onClick={() => setMountNote((shown) => !shown)}>Toggle note</Button>
          <PopoverClose variant="text">Close retained</PopoverClose>
        </Popover>
        <Button ref={finalRef}>Final focus target</Button>
      </section>
      <section>
        <h2>Width, anchors and containers</h2>
        <Popover
          aria-label="Matched options"
          trigger={<Button className="popover-match-trigger">Matched popover</Button>}
          matchAnchorWidth
        >
          <p>Matches the trigger width.</p>
          <PopoverClose variant="text">Done</PopoverClose>
        </Popover>
        <div ref={anchorRef} className="popover-custom-anchor">
          Separate positioning anchor
        </div>
        <Popover
          aria-label="Custom anchor options"
          trigger={<Button>Custom anchor popover</Button>}
          anchorEl={anchorRef}
          placement="right-start"
        >
          <p>Positioned against the separate anchor.</p>
          <PopoverClose variant="text">Done</PopoverClose>
        </Popover>
        <div ref={targetRef} data-testid="popover-custom-container" />
        <Popover
          aria-label="Custom container options"
          trigger={<Button>Custom container popover</Button>}
          container={() => targetRef.current}
        >
          <p>Scoped custom portal target.</p>
          <PopoverClose variant="text">Done</PopoverClose>
        </Popover>
        <Popover aria-label="Disabled options" trigger={<Button>Disabled popover</Button>} disabled>
          <p>Unavailable.</p>
        </Popover>
        <Popover aria-label="Disabled child options" trigger={<Button disabled>Disabled child popover</Button>}>
          <p>Unavailable.</p>
        </Popover>
        <Popover aria-label="RTL options" trigger={<Button>RTL popover</Button>} dir="rtl">
          <TextField label="الاسم" />
          <PopoverClose variant="text">إغلاق</PopoverClose>
        </Popover>
      </section>
      <section>
        <h2>Nested interactions</h2>
        <Popover aria-label="Outer options" trigger={<Button>Nested popover</Button>}>
          <TextField label="Outer note" fullWidth />
          <Popover aria-label="Inner options" trigger={<Button>Inner popover</Button>} placement="right-start">
            <TextField label="Inner note" fullWidth />
            <PopoverClose variant="text">Close inner</PopoverClose>
          </Popover>
          <Autocomplete label="Popover destination" options={['Paris', 'Rome']} fullWidth />
          <PopoverClose variant="text">Close outer</PopoverClose>
        </Popover>
        <Button onClick={() => setDialogOpen(true)}>Open parent dialog</Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} role="dialog">
          <DialogTitle>Parent dialog</DialogTitle>
          <DialogContent>
            <Popover aria-label="Dialog popover options" trigger={<Button>Dialog popover</Button>}>
              <TextField label="Dialog popover note" fullWidth />
              <PopoverClose variant="text">Close child</PopoverClose>
            </Popover>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close parent dialog</Button>
          </DialogActions>
        </Dialog>
        <Popover aria-label="Modal options" trigger={<Button>Modal popover</Button>} modal>
          <TextField label="Modal note" fullWidth />
          <PopoverClose variant="text">Close modal</PopoverClose>
        </Popover>
      </section>
    </>
  );
}
