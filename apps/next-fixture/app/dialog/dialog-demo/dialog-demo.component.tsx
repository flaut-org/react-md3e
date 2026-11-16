'use client';

import { useCallback, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@flaut-travel/react-md3e';
import type { DialogCloseReason } from '@flaut-travel/react-md3e';

type Mode = 'basic' | 'long' | 'body' | 'fullScreen' | 'protected' | 'form' | 'kept' | 'rtl' | 'custom';

const modes: readonly Mode[] = ['basic', 'long', 'body', 'fullScreen', 'protected', 'form', 'kept', 'rtl', 'custom'];
const icon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
  </svg>
);

export function DialogDemo({ serverContent }: { readonly serverContent: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('basic');
  const [reason, setReason] = useState('none');
  const [nestedOpen, setNestedOpen] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const fieldId = useId();
  const field = useRef<HTMLInputElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const customHost = useRef<HTMLDivElement>(null);
  const finalTarget = useRef<HTMLButtonElement>(null);
  const getContainer = useCallback(() => (mode === 'custom' ? customHost.current : null), [mode]);
  const fullScreen = mode === 'fullScreen';
  const long = mode === 'long' || mode === 'body' || fullScreen;
  const form = mode === 'form' || mode === 'kept';

  const handleClose = (_event: Event, nextReason: DialogCloseReason) => {
    setReason(nextReason);

    if (mode !== 'protected') {
      setOpen(false);
    }
  };

  return (
    <section>
      <h2>Dialog behavior</h2>
      <div className="fixture-row">
        {modes.map((nextMode) => (
          <Button
            key={nextMode}
            onClick={() => {
              setMode(nextMode);
              setOpen(true);
            }}
          >
            Open {nextMode} dialog
          </Button>
        ))}
      </div>
      <p>
        Close reason: <span data-testid="dialog-close-reason">{reason}</span>
      </p>
      <p>
        Submitted name: <span data-testid="dialog-submitted">{submitted}</span>
      </p>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        fullWidth
        scroll={mode === 'body' ? 'body' : 'paper'}
        keepMounted={mode === 'kept'}
        disableEscapeKeyDown={mode === 'protected'}
        container={getContainer}
        finalFocus={mode === 'custom' ? finalTarget : true}
        initialFocus={form ? field : undefined}
        ref={popup}
        dir={mode === 'rtl' ? 'rtl' : undefined}
        role={form ? 'dialog' : undefined}
        data-testid="fixture-dialog"
      >
        <DialogTitle icon={mode === 'basic' ? icon : undefined}>
          {fullScreen && (
            <IconButton aria-label="Close full screen dialog" variant="standard" onClick={() => setOpen(false)}>
              ×
            </IconButton>
          )}
          Dialog demonstration
        </DialogTitle>
        <DialogContent dividers={long}>
          <DialogContentText>Review your journey collection before saving.</DialogContentText>
          {serverContent}
          {form && (
            <form
              id="collection-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(field.current?.value ?? '');
                setOpen(false);
              }}
            >
              <label className="fixture-dialog-field" htmlFor={fieldId}>
                Collection name
                <input id={fieldId} ref={field} defaultValue="Summer journeys" required />
              </label>
            </form>
          )}
          {long &&
            Array.from({ length: 30 }, (_, index) => (
              <p key={index}>
                Journey {index + 1}: scroll the dialog content while keeping its title and actions available.
              </p>
            ))}
          {fullScreen && (
            <>
              <Button onClick={() => setNestedOpen(true)}>Open discard confirmation</Button>
              <Dialog open={nestedOpen} onClose={() => setNestedOpen(false)} data-testid="nested-dialog">
                <DialogTitle>Discard changes?</DialogTitle>
                <DialogContent>
                  <DialogContentText>Changes have not been saved.</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="text" onClick={() => setNestedOpen(false)}>
                    Keep editing
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setNestedOpen(false);
                      setOpen(false);
                    }}
                  >
                    Discard changes
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>
            Cancel dialog
          </Button>
          {form ? (
            <Button variant="text" type="submit" form="collection-form">
              Save dialog form
            </Button>
          ) : (
            <Button
              variant="text"
              onClick={() => {
                popup.current?.setAttribute('data-ref-checked', 'true');
              }}
            >
              Check dialog ref
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <div ref={customHost} data-testid="custom-dialog-host" />
      <Button ref={finalTarget}>Custom return focus</Button>
    </section>
  );
}
