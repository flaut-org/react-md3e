'use client';

import { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuCheckboxItem,
  MenuItem,
  MenuSubmenu,
  SplitButton,
} from '@flaut-travel/react-md3e';

export function SplitButtonDemo() {
  const [primaryCount, setPrimaryCount] = useState(0);
  const [action, setAction] = useState('none');
  const [open, setOpen] = useState(false);
  const [blockOpening, setBlockOpening] = useState(false);
  const [blockClosing, setBlockClosing] = useState(false);
  const [closeReason, setCloseReason] = useState('none');
  const [formValue, setFormValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section>
        <h2>Independent actions</h2>
        <Button>Before split button</Button>
        <SplitButton
          data-testid="action-split"
          menuButtonLabel="More send options"
          startIcon="✉"
          onClick={() => {
            setPrimaryCount((count) => count + 1);
            setAction('send');
          }}
          menuProps={{ 'aria-label': 'Send actions' }}
          menu={
            <>
              <MenuItem onClick={() => setAction('schedule')}>Schedule send</MenuItem>
              <MenuItem onClick={() => setAction('draft')}>Save draft</MenuItem>
              <MenuCheckboxItem defaultChecked>Request receipt</MenuCheckboxItem>
              <MenuSubmenu label="Send format">
                <MenuItem onClick={() => setAction('plain')}>Plain text</MenuItem>
              </MenuSubmenu>
            </>
          }
        >
          Send
        </SplitButton>
        <Button>After split button</Button>
        <p data-testid="primary-count">{primaryCount}</p>
        <p data-testid="last-split-action">{action}</p>
      </section>
      <section>
        <h2>Controlled menu</h2>
        <label>
          <input type="checkbox" checked={blockOpening} onChange={(event) => setBlockOpening(event.target.checked)} />
          Prevent menu opening
        </label>
        <label>
          <input type="checkbox" checked={blockClosing} onChange={(event) => setBlockClosing(event.target.checked)} />
          Prevent menu closing
        </label>
        <SplitButton
          menuButtonLabel="More export options"
          variant="tonal"
          open={open}
          onOpenChange={(next) => {
            if (next && blockOpening) {
              return false;
            }

            setOpen(next);

            return undefined;
          }}
          onClose={(_event, reason) => {
            setCloseReason(reason);

            return blockClosing ? false : undefined;
          }}
          menuProps={{ modal: false }}
          menu={<MenuItem>Download PDF</MenuItem>}
        >
          Export
        </SplitButton>
        <Button onClick={() => setOpen((current) => !current)}>Toggle export from code</Button>
        <p data-testid="export-open">{String(open)}</p>
        <p data-testid="export-close-reason">{closeReason}</p>
      </section>
      <section>
        <h2>Form and refs</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const { submitter } = event.nativeEvent;

            setFormValue(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget, submitter))));
          }}
        >
          <SplitButton
            ref={groupRef}
            menuButtonLabel="More publish options"
            variant="outlined"
            buttonProps={{ ref: actionRef, type: 'submit', name: 'intent', value: 'publish' }}
            menuButtonProps={{ ref: triggerRef }}
            menuProps={{ ref: popupRef }}
            menu={<MenuItem>Publish later</MenuItem>}
          >
            Publish
          </SplitButton>
        </form>
        <Button
          onClick={() =>
            groupRef.current?.setAttribute(
              'data-refs',
              [groupRef.current, actionRef.current, triggerRef.current, popupRef.current]
                .map((element) => element?.tagName)
                .join(','),
            )
          }
        >
          Check split refs
        </Button>
        <p data-testid="split-form-value">{formValue}</p>
      </section>
      <section>
        <h2>Inside a dialog</h2>
        <Button onClick={() => setDialogOpen(true)}>Open split dialog</Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="split-dialog-title">
          <DialogTitle id="split-dialog-title">Document actions</DialogTitle>
          <DialogContent>
            <SplitButton menuButtonLabel="More document options" menu={<MenuItem>Duplicate document</MenuItem>}>
              Edit
            </SplitButton>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
