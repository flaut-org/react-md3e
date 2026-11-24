'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  NavigationBar,
  NavigationRail,
  NavigationDrawer,
  NavigationItem,
  Button,
  IconButton,
  ExtendedFab,
} from '@flaut-travel/react-md3e';
import type { NavigationValue } from '@flaut-travel/react-md3e';

function SampleIcon({ filled = false }: { readonly filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m3 10 9-7 9 7v10h-6v-6H9v6H3Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function NavigationDemo() {
  const [value, setValue] = useState<NavigationValue | null>('one');
  const [changes, setChanges] = useState(0);
  const [cancelChange, setCancelChange] = useState(false);
  const [preventClick, setPreventClick] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [cancelClose, setCancelClose] = useState(false);
  const [disableEscape, setDisableEscape] = useState(false);
  const [disableSwipe, setDisableSwipe] = useState(false);
  const [closeReason, setCloseReason] = useState('none');
  const [refs, setRefs] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const itemRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const modalRef = useRef<HTMLElement>(null);

  return (
    <>
      <section>
        <h2>Controlled selection</h2>
        <NavigationBar
          aria-label="Controlled navigation"
          value={value}
          iconPosition="top"
          ref={rootRef}
          data-testid="controlled-navigation"
          onChange={(event, next) => {
            if (cancelChange) {
              event.preventDefault();

              return false;
            }

            setValue(next);
            setChanges((count) => count + 1);

            return true;
          }}
        >
          <NavigationItem value="one" ref={itemRef} icon={<SampleIcon />} selectedIcon={<SampleIcon filled />}>
            One
          </NavigationItem>
          {!filtered && (
            <NavigationItem
              value="two"
              onClick={(event) => {
                if (preventClick) {
                  event.preventDefault();
                }
              }}
              icon={<SampleIcon />}
            >
              Two
            </NavigationItem>
          )}
          <NavigationItem value="disabled" disabled icon={<SampleIcon />}>
            Unavailable
          </NavigationItem>
          <NavigationItem value="three" disableRipple icon={<SampleIcon />}>
            Three
          </NavigationItem>
        </NavigationBar>
        <output data-testid="navigation-value">{String(value)}</output>
        <output data-testid="navigation-changes">{changes}</output>
        <label>
          <input type="checkbox" checked={cancelChange} onChange={(event) => setCancelChange(event.target.checked)} />
          Cancel navigation changes
        </label>
        <label>
          <input type="checkbox" checked={preventClick} onChange={(event) => setPreventClick(event.target.checked)} />
          Prevent item click
        </label>
        <button type="button" onClick={() => setValue('two')}>
          Select two externally
        </button>
        <button type="button" onClick={() => setValue(null)}>
          Clear navigation
        </button>
        <button type="button" onClick={() => setFiltered(!filtered)}>
          Filter second destination
        </button>
        <button
          type="button"
          onClick={() =>
            setRefs(
              rootRef.current?.tagName === 'NAV' &&
                itemRef.current instanceof HTMLButtonElement &&
                linkRef.current instanceof HTMLAnchorElement,
            )
          }
        >
          Check navigation refs
        </button>
        <output data-testid="navigation-refs">{String(refs)}</output>
      </section>
      <section>
        <h2>Native links</h2>
        <NavigationBar
          aria-label="Link navigation"
          defaultValue="first"
          iconPosition="start"
          data-testid="link-navigation"
        >
          <NavigationItem ref={linkRef} value="first" href="#first" icon={<SampleIcon />}>
            First link
          </NavigationItem>
          <NavigationItem value="second" href="#second" icon={<SampleIcon />}>
            Second link
          </NavigationItem>
          <NavigationItem value="external" href="#external" target="_blank" icon={<SampleIcon />}>
            New tab
          </NavigationItem>
          <NavigationItem href="#disabled" disabled icon={<SampleIcon />}>
            Disabled link
          </NavigationItem>
          <NavigationItem component={Link} href="#router" value="router" icon={<SampleIcon />}>
            Router link
          </NavigationItem>
        </NavigationBar>
        <NavigationBar aria-label="Route-controlled navigation" iconPosition="top">
          <NavigationItem href="#route" selected icon={<SampleIcon />}>
            Current route
          </NavigationItem>
          <NavigationItem href="#another" icon={<SampleIcon />}>
            Another route
          </NavigationItem>
        </NavigationBar>
      </section>
      <section>
        <h2>Expandable rail</h2>
        <div style={{ display: 'flex', blockSize: 600 }}>
          <NavigationRail
            aria-label="Expandable rail"
            id="fixture-navigation-rail"
            expanded={expanded}
            defaultValue="home"
            data-testid="expandable-rail"
            header={
              <>
                <IconButton
                  aria-label="Toggle rail"
                  aria-controls="fixture-navigation-rail"
                  aria-expanded={expanded}
                  variant="standard"
                  onClick={() => setExpanded(!expanded)}
                >
                  ≡
                </IconButton>
                <ExtendedFab extended={expanded} lowered startIcon={<SampleIcon />}>
                  Compose
                </ExtendedFab>
              </>
            }
          >
            <NavigationItem value="home" icon={<SampleIcon />} selectedIcon={<SampleIcon filled />}>
              Home
            </NavigationItem>
            <NavigationItem value="disabled" disabled icon={<SampleIcon />}>
              Disabled rail destination
            </NavigationItem>
            <NavigationItem value="saved" icon={<SampleIcon />}>
              Saved
            </NavigationItem>
            <NavigationItem value="account" icon={<SampleIcon />}>
              Account
            </NavigationItem>
          </NavigationRail>
          <div
            style={{ flex: 1, minInlineSize: 0, padding: 24, background: 'var(--md-sys-color-surface-container-low)' }}
          >
            Content beside the rail
          </div>
        </div>
      </section>
      <section>
        <h2>Modal navigation</h2>
        <label>
          <input type="checkbox" checked={cancelClose} onChange={(event) => setCancelClose(event.target.checked)} />
          Cancel drawer close
        </label>
        <label>
          <input type="checkbox" checked={disableEscape} onChange={(event) => setDisableEscape(event.target.checked)} />
          Disable drawer Escape
        </label>
        <label>
          <input type="checkbox" checked={disableSwipe} onChange={(event) => setDisableSwipe(event.target.checked)} />
          Disable drawer swipe
        </label>
        <NavigationDrawer
          aria-label="Modal destinations"
          open={open}
          onOpenChange={setOpen}
          defaultValue="inbox"
          ref={modalRef}
          keepMounted
          disableEscapeKeyDown={disableEscape}
          disableSwipe={disableSwipe}
          onClose={(_event, reason) => {
            setCloseReason(reason);

            return !cancelClose;
          }}
          trigger={<Button>Open navigation drawer</Button>}
          header={<span>Mail</span>}
          footer={
            <>
              <input aria-label="Kept drawer input" defaultValue="saved" />
              <Button onClick={() => setOpen(false)}>Close navigation drawer</Button>
            </>
          }
        >
          <NavigationItem value="inbox" icon={<SampleIcon />}>
            Inbox
          </NavigationItem>
          <NavigationItem value="saved" icon={<SampleIcon />}>
            Saved mail
          </NavigationItem>
          <NavigationItem value="disabled" disabled icon={<SampleIcon />}>
            Disabled destination
          </NavigationItem>
        </NavigationDrawer>
        <output data-testid="drawer-close-reason">{closeReason}</output>
        <NavigationRail
          variant="modal"
          aria-label="Modal rail destinations"
          trigger={<Button>Open modal rail</Button>}
          defaultValue="home"
        >
          <NavigationItem value="home" icon={<SampleIcon />}>
            Home
          </NavigationItem>
          <NavigationItem value="saved" icon={<SampleIcon />}>
            Saved
          </NavigationItem>
        </NavigationRail>
        <div dir="rtl">
          <NavigationDrawer
            aria-label="RTL modal destinations"
            trigger={<Button>Open RTL navigation</Button>}
            defaultValue="first"
          >
            <NavigationItem value="first" icon={<SampleIcon />}>
              ראשי
            </NavigationItem>
            <NavigationItem value="second" icon={<SampleIcon />}>
              שמורים
            </NavigationItem>
          </NavigationDrawer>
        </div>
      </section>
    </>
  );
}
