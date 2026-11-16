'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Autocomplete,
  BottomSheet,
  Button,
  ButtonGroup,
  ButtonGroupButton,
  Collapsible,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  SideSheet,
  Snackbar,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@flaut-org/react-md3e';

export function EssentialsDemo() {
  const [theme, setTheme] = useState<string | null>('light');
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [sheetReason, setSheetReason] = useState('');
  const [notice, setNotice] = useState(false);
  const [timed, setTimed] = useState(false);
  const [noticeReason, setNoticeReason] = useState('');
  const [protect, setProtect] = useState(true);
  const [protectedOpen, setProtectedOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [clearReason, setClearReason] = useState('');
  const fieldRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section>
        <h2>Tooltips</h2>
        <Tooltip title="Switch appearance" enterDelay={30} leaveDelay={100}>
          <Button>Tooltip action</Button>
        </Tooltip>
        <Tooltip title="Passenger limit reached" enterDelay={0}>
          <span tabIndex={0} role="button" aria-disabled="true" aria-label="Unavailable action">
            <Button disabled>Unavailable</Button>
          </span>
        </Tooltip>
      </section>
      <section>
        <h2>Button selection</h2>
        <ButtonGroup aria-label="Appearance" value={theme} onChange={(_event, next) => setTheme(next)}>
          <ButtonGroupButton value="light">Light</ButtonGroupButton>
          <ButtonGroupButton value="dark">Dark</ButtonGroupButton>
          <ButtonGroupButton value="system" disabled>
            System
          </ButtonGroupButton>
        </ButtonGroup>
        <p data-testid="selected-theme">{theme}</p>
        <ButtonGroup aria-label="Optional choice" allowEmpty defaultValue="one">
          <ButtonGroupButton value="one">Optional one</ButtonGroupButton>
          <ButtonGroupButton value="two">Optional two</ButtonGroupButton>
        </ButtonGroup>
        <ButtonGroup aria-label="Locked choice" defaultValue="one" onChange={() => false}>
          <ButtonGroupButton value="one">Locked one</ButtonGroupButton>
          <ButtonGroupButton value="two">Locked two</ButtonGroupButton>
        </ButtonGroup>
        <div dir="rtl">
          <ButtonGroup aria-label="Inherited RTL choice" defaultValue="one">
            <ButtonGroupButton value="one">Inherited one</ButtonGroupButton>
            <ButtonGroupButton value="two">Inherited two</ButtonGroupButton>
          </ButtonGroup>
        </div>
        <ButtonGroup
          aria-label="Filters"
          selectionMode="multiple"
          variant="standard"
          value={filters}
          onChange={(_event, next) => setFilters(next)}
        >
          <ButtonGroupButton value="direct">Direct</ButtonGroupButton>
          <ButtonGroupButton value="baggage">Baggage</ButtonGroupButton>
        </ButtonGroup>
        <p data-testid="selected-filters">{filters.join(',')}</p>
        <ButtonGroup aria-label="RTL appearance" dir="rtl" defaultValue="one">
          <ButtonGroupButton value="one">One</ButtonGroupButton>
          <ButtonGroupButton value="two">Two</ButtonGroupButton>
        </ButtonGroup>
        <ButtonGroup aria-label="Disabled group" disabled>
          <ButtonGroupButton value="one">Disabled option</ButtonGroupButton>
        </ButtonGroup>
        <ButtonGroup aria-label="Actions" selectionMode="none">
          <ButtonGroupButton value="one" onClick={() => setClicks((value) => value + 1)}>
            Grouped action
          </ButtonGroupButton>
        </ButtonGroup>
      </section>
      <section>
        <h2>Busy buttons and links</h2>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setClicks((value) => value + 1);
          }}
        >
          Find flights
        </Button>
        <Button onClick={() => setLoading(false)}>Finish loading</Button>
        <Button component="div" onClick={() => setClicks((count) => count + 1)}>
          Custom element action
        </Button>
        <Button
          href="/typography"
          ref={linkRef}
          onClick={(event) => {
            event.preventDefault();
            linkRef.current?.setAttribute('data-ref-checked', 'true');
          }}
        >
          All articles
        </Button>
        <Button component={Link} href="/typography">
          Next link button
        </Button>
        <Button href="/typography" disabled>
          Disabled link
        </Button>
        <p data-testid="essentials-clicks">{clicks}</p>
      </section>
      <section>
        <h2>Disclosure</h2>
        <Collapsible trigger={<Button>Travel details</Button>} keepMounted>
          <TextField label="Retained travel note" defaultValue="Initial note" />
          <p>Extra details</p>
        </Collapsible>
      </section>
      <Collapsible trigger={<Button>Locked disclosure</Button>} onOpenChange={() => false}>
        <p>Protected details</p>
      </Collapsible>
      <Collapsible trigger={<Button>Disabled disclosure</Button>} disabled>
        <p>Disabled details</p>
      </Collapsible>
      <section>
        <h2>Modal sheets</h2>
        <BottomSheet
          aria-label="Passengers"
          trigger={<Button>Open passengers</Button>}
          open={bottomOpen}
          onOpenChange={(next) => setBottomOpen(next)}
          onClose={(_event, reason) => setSheetReason(reason)}
          keepMounted
          initialFocus={fieldRef}
          header={
            <Typography component="h2" variant="titleLarge">
              Passengers
            </Typography>
          }
          actions={<Button onClick={() => setBottomOpen(false)}>Done passengers</Button>}
        >
          <TextField label="Passenger note" inputRef={fieldRef} defaultValue="Retained passenger" />
          <Divider />
          <SideSheet
            aria-label="Nested settings"
            trigger={<Button>Nested settings</Button>}
            header={
              <Typography component="h2" variant="titleLarge">
                Nested settings
              </Typography>
            }
          >
            <TextField label="Nested setting" />
          </SideSheet>
        </BottomSheet>
        <SideSheet
          aria-label="Travel settings"
          trigger={<Button>Open settings</Button>}
          ref={sideRef}
          onClose={(_event, reason) => setSheetReason(reason)}
          header={
            <Typography component="h2" variant="titleLarge">
              Travel settings
            </Typography>
          }
        >
          <TextField label="Settings note" />
          <Button onClick={() => sideRef.current?.setAttribute('data-ref-checked', 'true')}>Check sheet ref</Button>
          <Autocomplete label="Settings destination" options={['Paris', 'Rome']} defaultValue="Rome" />
        </SideSheet>
        <SideSheet aria-label="RTL settings" dir="rtl" trigger={<Button>RTL settings</Button>}>
          <p>RTL content</p>
        </SideSheet>
        <BottomSheet
          aria-label="Protected passengers"
          trigger={<Button>Protected passengers</Button>}
          disableEscapeKeyDown
          disableSwipe
          onClose={(event, reason) => {
            if (protect && reason === 'backdropClick') {
              event.preventDefault();
            }
          }}
        >
          <Button onClick={() => setProtect(false)}>Allow dismissal</Button>
        </BottomSheet>
        <div ref={hostRef} data-testid="sheet-custom-container" />
        <BottomSheet
          aria-label="Custom sheet"
          trigger={<Button>Custom sheet</Button>}
          container={() => hostRef.current}
        >
          <p>Custom container</p>
        </BottomSheet>
        <ThemeProvider colorScheme="dark" data-testid="dark-sheet-theme">
          <SideSheet aria-label="Dark settings" trigger={<Button>Dark settings</Button>}>
            <p>Dark settings content</p>
          </SideSheet>
        </ThemeProvider>
        <p data-testid="sheet-reason">{sheetReason}</p>
      </section>
      <section>
        <h2>Standard sheet</h2>
        <SideSheet
          variant="standard"
          defaultOpen
          aria-label="Inline settings"
          header={
            <Typography component="h3" variant="titleLarge">
              Inline settings
            </Typography>
          }
        >
          <TextField label="Inline setting" />
        </SideSheet>
        <Button>Outside standard sheet</Button>
      </section>
      <section>
        <h2>Notifications</h2>
        <Button onClick={() => setNotice(true)}>Show notification</Button>
        <Button onClick={() => setTimed(true)}>Show timed notification</Button>
        <Snackbar
          message="Travel preferences saved"
          open={notice}
          onClose={(_event, reason) => {
            setNoticeReason(reason);
            setNotice(false);
          }}
          showCloseButton
          action={
            <Button variant="text" onClick={() => setNotice(false)}>
              Undo
            </Button>
          }
        />
        <Snackbar
          message="Timed notification"
          notificationsLabel="Timed notifications"
          open={timed}
          autoHideDuration={1200}
          disableWindowBlurListener
          onClose={(_event, reason) => {
            setNoticeReason(reason);
            setTimed(false);
          }}
          showCloseButton
        />
        <Button onClick={() => setProtectedOpen(true)}>Show protected notification</Button>
        <Snackbar
          notificationsLabel="Protected notifications"
          message="Protected notification"
          open={protectedOpen}
          onClose={() => false}
          showCloseButton
        />
        <Button onClick={() => setProtectedOpen(false)}>Hide protected notification</Button>
        <p data-testid="notice-reason">{noticeReason}</p>
      </section>
      <section>
        <h2>Autocomplete migration options</h2>
        <Autocomplete
          label="Clearable destination"
          options={['Paris', 'Rome']}
          defaultValue="Rome"
          clearOnEscape
          selectOnFocus
          onInputChange={(_event, _value, reason) => setClearReason(reason)}
        />
        <Autocomplete label="Preserved destination" options={['Paris', 'Rome']} defaultValue="Rome" />
        <p data-testid="autocomplete-clear-reason">{clearReason}</p>
        <Button onClick={() => setDialog(true)}>Open autocomplete dialog</Button>
        <Dialog open={dialog} role="dialog" onClose={() => setDialog(false)}>
          <DialogTitle>Destination editor</DialogTitle>
          <DialogContent>
            <Autocomplete label="Dialog preserved city" options={['Paris', 'Rome']} defaultValue="Rome" />
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
