'use client';

import { useRef, useState } from 'react';
import { Button, ExtendedFab, Fab, FabMenu, FabMenuItem } from '@flaut-travel/react-md3e';

const add = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
  </svg>
);

export function FabDemo() {
  const [extended, setExtended] = useState(true);
  const [open, setOpen] = useState(false);
  const [preventClose, setPreventClose] = useState(false);
  const [lastAction, setLastAction] = useState('None');
  const [submissions, setSubmissions] = useState('None');
  const [reason, setReason] = useState('None');
  const fabRef = useRef<HTMLButtonElement>(null);
  const extendedRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <section>
        <h2>Extended and collapsed</h2>
        <div className="fixture-row">
          <Button onClick={() => setExtended(!extended)}>Toggle extended label</Button>
          <ExtendedFab startIcon={add} extended={extended} data-testid="collapsible-fab">
            Compose message
          </ExtendedFab>
        </div>
      </section>
      <section>
        <h2>Native actions</h2>
        <form
          id="fab-form"
          onSubmit={(event) => {
            event.preventDefault();

            const submitter = event.nativeEvent.submitter as HTMLButtonElement;

            setSubmissions(submitter.value);
          }}
        >
          <div className="fixture-row">
            <Fab type="submit" name="action" value="fab" ref={fabRef} aria-label="Submit floating action">
              {add}
            </Fab>
            <ExtendedFab type="submit" name="action" value="extended" ref={extendedRef} startIcon={add}>
              Submit extended action
            </ExtendedFab>
            <Fab href="/fabs?from=fab#fab-form" aria-label="Open floating destination">
              {add}
            </Fab>
            <ExtendedFab href="/fabs?from=extended#fab-form" startIcon={add}>
              Open extended destination
            </ExtendedFab>
            <Fab disabled href="/unavailable" aria-label="Unavailable floating destination">
              {add}
            </Fab>
          </div>
        </form>
        <Button onClick={() => fabRef.current?.focus()}>Focus floating action</Button>{' '}
        <Button onClick={() => extendedRef.current?.focus()}>Focus extended action</Button>
        <p>
          Last submitter: <span data-testid="fab-submission">{submissions}</span>
        </p>
      </section>
      <section>
        <h2>Controlled floating menu</h2>
        <div className="fixture-row">
          <label>
            <input type="checkbox" checked={preventClose} onChange={(event) => setPreventClose(event.target.checked)} />
            Prevent Escape dismissal
          </label>
          <Button onClick={() => setOpen(true)}>Open create actions</Button>
        </div>
        <div style={{ position: 'relative', height: 460, border: '1px solid currentColor', marginBlock: 16 }}>
          <p style={{ padding: 24 }}>Create a related item using the floating action menu.</p>
          <FabMenu
            data-testid="create-fab-menu"
            style={{ position: 'absolute', insetInlineEnd: 24, insetBlockEnd: 24 }}
            label="Create item"
            closeLabel="Close create actions"
            icon={add}
            size="large"
            open={open}
            onOpenChange={setOpen}
            onClose={(_event, closeReason) => {
              setReason(closeReason);

              if (preventClose && closeReason === 'escapeKeyDown') {
                return false;
              }

              return true;
            }}
          >
            <FabMenuItem icon={add} onClick={() => setLastAction('Document')}>
              Document
            </FabMenuItem>
            <FabMenuItem icon={add} onClick={() => setLastAction('Folder')}>
              Folder
            </FabMenuItem>
            <FabMenuItem icon={add} disabled>
              Upload file
            </FabMenuItem>
            <FabMenuItem icon={add} onClick={() => false}>
              Keep menu open
            </FabMenuItem>
          </FabMenu>
        </div>
        <Button onClick={() => setLastAction('After')}>After create actions</Button>
        <p>
          Last action: <span data-testid="fab-menu-action">{lastAction}</span>
        </p>
        <p>
          Close reason: <span data-testid="fab-menu-reason">{reason}</span>
        </p>
      </section>
      <section>
        <h2>Disabled menu</h2>
        <FabMenu disabled label="Unavailable create menu" icon={add}>
          <FabMenuItem>Unavailable document</FabMenuItem>
          <FabMenuItem>Unavailable folder</FabMenuItem>
        </FabMenu>
      </section>
    </>
  );
}
