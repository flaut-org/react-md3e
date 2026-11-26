import { useState } from 'react';
import { Button, Checkbox, IconButton, List, ListItem } from '@flaut-travel/react-md3e';
import type { ListVariant } from '@flaut-travel/react-md3e';
import { starIcon } from '../../example-icons';

export function SingleActionExample({ variant = 'segmented' }: { readonly variant?: ListVariant | undefined }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <List variant={variant}>
        <ListItem
          primary="Open saved trip"
          secondary="The entire row is one action"
          action={{ onClick: () => setCount(count + 1) }}
        />
        <ListItem primary="Unavailable trip" disabled action={{}} />
      </List>
      <p>Opened {count} times</p>
    </>
  );
}

export function MultiActionExample({ variant = 'segmented' }: { readonly variant?: ListVariant | undefined }) {
  const [opened, setOpened] = useState(0);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <List variant={variant}>
        <ListItem
          primary="Weekend in Lisbon"
          secondary="Open details or save independently"
          action={{ onClick: () => setOpened(opened + 1) }}
          trailingAction={
            <IconButton aria-label="Save Lisbon" variant="standard" selected={saved} onClick={() => setSaved(!saved)}>
              {starIcon}
            </IconButton>
          }
        />
        <ListItem
          primary="Download travel guide"
          action={{ onClick: () => setOpened(opened + 1) }}
          leadingAction={<Checkbox aria-label="Keep guide offline" />}
        />
      </List>
      <p>
        Opened {opened} times; saved: {String(saved)}
      </p>
    </>
  );
}

export function ExpandableExample({
  variant = 'segmented',
  nested = false,
  controlled = false,
}: {
  readonly variant?: ListVariant | undefined;
  readonly nested?: boolean;
  readonly controlled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const content = nested ? (
    <List aria-label="Regions">
      <ListItem
        primary="Portugal"
        expansion={{
          content: (
            <List aria-label="Cities">
              <ListItem primary="Lisbon" action={{ href: '#lisbon' }} />
              <ListItem primary="Porto" action={{ href: '#porto' }} />
            </List>
          ),
        }}
      />
    </List>
  ) : (
    <p>Additional trip information, including any React content.</p>
  );

  return (
    <>
      {controlled && (
        <Button variant="text" onClick={() => setOpen(!open)}>
          Toggle from outside
        </Button>
      )}
      <List variant={variant}>
        <ListItem
          primary="European trips"
          expansion={{ content, ...(controlled ? { open, onOpenChange: setOpen } : { defaultOpen: nested }) }}
        />
        <ListItem primary="Weekend trips" expansion={{ content: <p>Independent folder content</p> }} />
      </List>
    </>
  );
}
