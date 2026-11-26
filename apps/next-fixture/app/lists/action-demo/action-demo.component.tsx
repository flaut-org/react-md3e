'use client';

import { useRef, useState } from 'react';
import { Button, Checkbox, IconButton, List, ListItem, Radio, RadioGroup, Switch } from '@flaut-travel/react-md3e';

export function ActionDemo() {
  const [actions, setActions] = useState(0);
  const [bookmarks, setBookmarks] = useState(0);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [changes, setChanges] = useState(0);
  const [preventExpansion, setPreventExpansion] = useState(false);
  const [showFirst, setShowFirst] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <section>
        <h2>Single-action list</h2>
        <Button variant="text" data-testid="before-action-list">
          Before action list
        </Button>
        <List aria-label="Journey actions" data-testid="single-action-list">
          {showFirst && (
            <ListItem
              ref={rowRef}
              primary="Open journey"
              secondary="A primary action without selection"
              action={{ ref: actionRef, onClick: () => setActions((value) => value + 1) }}
            />
          )}
          <ListItem primary="Another journey" action={{ onClick: () => setActions((value) => value + 1) }} />
          <ListItem
            primary="Unavailable action"
            disabled
            action={{ onClick: () => setActions((value) => value + 1) }}
          />
          <ListItem
            primary="Action without ripple"
            disableRipple
            action={{ onClick: () => setActions((value) => value + 1) }}
          />
        </List>
        <Button variant="text" data-testid="after-action-list">
          After action list
        </Button>
        <p>
          Primary actions: <output data-testid="primary-actions">{actions}</output>
        </p>
        <Button variant="text" onClick={() => setShowFirst((value) => !value)}>
          Toggle first action
        </Button>
        <Button
          variant="text"
          onClick={() => {
            if (rowRef.current?.tagName === 'LI' && actionRef.current?.tagName === 'BUTTON') {
              rowRef.current.dataset.refChecked = 'true';
            }
          }}
        >
          Check action refs
        </Button>
      </section>
      <section>
        <h2>Single-action navigation</h2>
        <List variant="standard" aria-label="Journey links" data-testid="action-links">
          <ListItem primary="Navigation destination" action={{ href: '#list-destination' }} />
          <ListItem primary="Unavailable destination" disabled action={{ href: '#unavailable' }} />
        </List>
        <p id="list-destination">List navigation destination</p>
      </section>
      <section>
        <h2>Multi-action list</h2>
        <Button variant="text" data-testid="before-multi-list">
          Before multi-action list
        </Button>
        <List aria-label="Journey shortcuts" data-testid="multi-action-list">
          <ListItem
            primary="Journey details"
            action={{ href: '#list-destination' }}
            trailingAction={
              <IconButton
                variant="standard"
                aria-label="Bookmark journey"
                onClick={() => setBookmarks((value) => value + 1)}
              >
                ★
              </IconButton>
            }
          />
          <ListItem
            primary="Download guide"
            action={{ onClick: () => setActions((value) => value + 1) }}
            leadingAction={
              <Checkbox
                aria-label="Save guide offline"
                checked={checked}
                onChange={(_event, value) => setChecked(value)}
              />
            }
            trailingAction={
              <IconButton
                variant="standard"
                aria-label="Share guide"
                onClick={() => setBookmarks((value) => value + 1)}
              >
                ↗
              </IconButton>
            }
          />
          <ListItem
            primary="Notification details"
            action={{ onClick: () => setActions((value) => value + 1) }}
            trailingAction={<Switch aria-label="Journey notifications" />}
          />
          <ListItem
            primary="Disabled journey"
            disabled
            action={{ onClick: () => setActions((value) => value + 1) }}
            trailingAction={
              <IconButton
                variant="standard"
                aria-label="Disabled bookmark"
                disabled
                onClick={() => setBookmarks((value) => value + 1)}
              >
                ★
              </IconButton>
            }
          />
        </List>
        <Button variant="text" data-testid="after-multi-list">
          After multi-action list
        </Button>
        <p>
          Supplementary actions: <output data-testid="supplementary-actions">{bookmarks}</output>
        </p>
        <p>
          Offline: <output data-testid="offline-value">{String(checked)}</output>
        </p>
        <RadioGroup aria-label="Notification destination" defaultValue="email">
          <List variant="standard" aria-label="Delivery details" data-testid="radio-actions">
            <ListItem
              primary="Email details"
              action={{ onClick: () => setActions((value) => value + 1) }}
              trailingAction={<Radio value="email" aria-label="Send by email" />}
            />
            <ListItem
              primary="SMS details"
              action={{ onClick: () => setActions((value) => value + 1) }}
              trailingAction={<Radio value="sms" aria-label="Send by SMS" />}
            />
          </List>
        </RadioGroup>
      </section>
      <section>
        <h2>Expandable list</h2>
        <List aria-label="Trip folders" data-testid="expandable-list">
          <ListItem
            id="saved-folder"
            primary="Saved trips"
            expansion={{ keepMounted: true, content: <Button variant="text">Manage saved trips</Button> }}
          />
          <ListItem
            primary="Recent trips"
            expansion={{ defaultOpen: true, content: <p>Recently visited destinations</p> }}
          />
          <ListItem
            primary="Unavailable folder"
            disabled
            expansion={{ content: <Button>Unavailable content</Button> }}
          />
        </List>
      </section>
      <section>
        <h2>Nested expandable list</h2>
        <List variant="standard" aria-label="Destination folders" data-testid="nested-expansion">
          <ListItem
            primary="Europe"
            expansion={{
              defaultOpen: true,
              content: (
                <List aria-label="European regions">
                  <ListItem
                    primary="Portugal"
                    expansion={{
                      content: (
                        <List aria-label="Portuguese cities">
                          <ListItem primary="Lisbon city" action={{ href: '#list-destination' }} />
                          <ListItem primary="Porto city" action={{ href: '#list-destination' }} />
                        </List>
                      ),
                    }}
                  />
                  <ListItem primary="France" expansion={{ content: <p>Paris and Lyon</p> }} />
                </List>
              ),
            }}
          />
        </List>
      </section>
      <section>
        <h2>Controlled expansion</h2>
        <Button variant="text" onClick={() => setOpen((value) => !value)}>
          Toggle controlled folder
        </Button>
        <Button variant="text" onClick={() => setPreventExpansion((value) => !value)}>
          Toggle expansion prevention
        </Button>
        <Button variant="text" onClick={() => setDisabled((value) => !value)}>
          Toggle expansion disabled
        </Button>
        <List aria-label="Controlled folders" data-testid="controlled-expansion">
          <ListItem
            primary="Controlled folder"
            disabled={disabled}
            expansion={{
              open,
              keepMounted: true,
              onOpenChange: (value) => {
                setChanges((count) => count + 1);

                if (preventExpansion) {
                  return false;
                }

                setOpen(value);

                return undefined;
              },
              content: (
                <label>
                  Folder note
                  <input aria-label="Folder note" defaultValue="Keep me" />
                </label>
              ),
            }}
          />
        </List>
        <p>
          Expansion: <output data-testid="controlled-open">{String(open)}</output>
        </p>
        <p>
          Changes: <output data-testid="expansion-changes">{changes}</output>
        </p>
      </section>
    </>
  );
}
