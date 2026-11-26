'use client';

import { useRef, useState } from 'react';
import { Chip, ChipSet } from '@flaut-travel/react-md3e/chip';
import { ThemeProvider } from '@flaut-travel/react-md3e/theme-provider';

const luggageIcon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M8 3h8v3h3v15H5V6h3zm2 3h4V5h-4z" />
  </svg>
);
const arrowIcon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="m7 10 5 5 5-5z" />
  </svg>
);

export function ChipDemo() {
  const [selected, setSelected] = useState(false);
  const [changes, setChanges] = useState(0);
  const [actions, setActions] = useState(0);
  const [recipients, setRecipients] = useState(['Alex', 'Disabled recipient', 'Sam', 'Robin']);
  const [filters, setFilters] = useState(['Nonstop', 'Baggage']);
  const [submitted, setSubmitted] = useState('');
  const [refs, setRefs] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <section>
        <h2>Actions and selection</h2>
        <ChipSet aria-label="Travel actions">
          <Chip kind="assist" label="Set reminder" icon="+" onClick={() => setActions((value) => value + 1)} />
          <Chip kind="suggestion" label="Explore flights" onClick={() => setActions((value) => value + 1)} />
          <Chip kind="assist" label="Disabled action" disabled onClick={() => setActions((value) => value + 1)} />
        </ChipSet>
        <p data-testid="chip-actions">{actions}</p>
        <ChipSet aria-label="Fare filters">
          <Chip
            kind="filter"
            label="Include baggage"
            icon={luggageIcon}
            selected={selected}
            onSelectedChange={(_event, next) => {
              setSelected(next);
              setChanges((value) => value + 1);
            }}
            ref={rootRef}
            slotProps={{ action: { ref: actionRef } }}
          />
          <Chip kind="filter" label="Flexible dates" />
          <Chip kind="filter" label="Stops" trailingIcon={arrowIcon} />
          <Chip kind="filter" label="Veto selection" onSelectedChange={() => false} />
          <Chip kind="filter" label="Prevent selection" onSelectedChange={(event) => event.preventDefault()} />
          <Chip kind="filter" label="Prevent click" onClick={(event) => event.preventDefault()} />
          <Chip
            kind="filter"
            label="Prevent slot click"
            slotProps={{ action: { onClick: (event) => event.preventDefault() } }}
          />
          <Chip
            kind="input"
            label="Slot action"
            slotProps={{
              action: { 'aria-label': 'Activate slot action', 'onClick': () => setActions((value) => value + 1) },
            }}
          />
        </ChipSet>
        <p data-testid="chip-changes">{changes}</p>
        <button type="button" onClick={() => setSelected((value) => !value)}>
          Toggle selected externally
        </button>
        <button
          type="button"
          onClick={() =>
            setRefs(rootRef.current instanceof HTMLDivElement && actionRef.current instanceof HTMLButtonElement)
          }
        >
          Check chip refs
        </button>
        <p data-testid="chip-refs">{String(refs)}</p>
      </section>
      <section>
        <h2>Removable input and filter chips</h2>
        <ChipSet aria-label="Recipients">
          {recipients.map((label) => (
            <Chip
              key={label}
              kind="input"
              label={label}
              avatar={label.slice(0, 1)}
              disabled={label === 'Disabled recipient'}
              onClick={() => setActions((value) => value + 1)}
              onDelete={() => setRecipients((values) => values.filter((value) => value !== label))}
            />
          ))}
        </ChipSet>
        <button type="button" onClick={() => setRecipients(['Alex', 'Disabled recipient', 'Sam', 'Robin'])}>
          Reset recipients
        </button>
        <ChipSet aria-label="Applied filters">
          {filters.map((label) => (
            <Chip
              key={label}
              kind="filter"
              label={label}
              defaultSelected
              onDelete={() => setFilters((values) => values.filter((value) => value !== label))}
            />
          ))}
        </ChipSet>
        <div className="fixture-row">
          <Chip kind="input" label="Remove-only token" onDelete={() => setActions((value) => value + 1)} />
          <Chip kind="input" label="Protected token" onDelete={(event) => event.preventDefault()} />
          <Chip
            kind="input"
            label="Protected by slot"
            onDelete={() => setActions((value) => value + 1)}
            slotProps={{ deleteButton: { onClick: (event) => event.preventDefault() } }}
          />
          <Chip kind="input" label="Locked token" readOnly onDelete={() => setActions((value) => value + 1)} />
          <Chip kind="input" label="Selectable input" defaultSelected={false} />
          <Chip
            kind="input"
            label={<strong>Complex recipient</strong>}
            onDelete={() => setActions((value) => value + 1)}
            deleteLabel="Remove complex recipient"
          />
        </div>
      </section>
      <section>
        <h2>Shapes, elevation and disabled states</h2>
        <ChipSet aria-label="Expressive chips">
          <Chip kind="filter" label="Expressive filter" shape="expressive" data-testid="expressive-filter" />
          <Chip kind="filter" label="Expressive icon" shape="expressive" defaultSelected icon={luggageIcon} />
          <Chip kind="input" label="Expressive input" shape="expressive" defaultSelected={false} />
        </ChipSet>
        <ChipSet aria-label="Elevated chips">
          <Chip kind="assist" label="Elevated assist" variant="elevated" icon="+" />
          <Chip kind="suggestion" label="Elevated suggestion" variant="elevated" />
          <Chip kind="filter" label="Elevated filter" variant="elevated" defaultSelected />
          <Chip kind="assist" label="Dragged assist" dragged />
        </ChipSet>
        <ChipSet aria-label="Disabled chips">
          <Chip kind="assist" label="Disabled assist" disabled icon="+" />
          <Chip kind="filter" label="Disabled filter" disabled defaultSelected />
          <Chip
            kind="input"
            label="Disabled input"
            disabled
            avatar="AM"
            onDelete={() => setActions((value) => value + 1)}
          />
          <Chip kind="suggestion" label="Disabled elevated" disabled variant="elevated" />
        </ChipSet>
        <ChipSet aria-label="Disabled set" disabled>
          <Chip kind="filter" label="Disabled by set" />
          <Chip kind="assist" label="Disabled set action" />
        </ChipSet>
        <div className="fixture-row">
          <Chip kind="filter" label="No ripple chip" disableRipple />
          <Chip
            kind="input"
            label="A long recipient name that must be truncated without growing the token beyond its container"
            readOnly
            style={{ maxWidth: 180 }}
          />
        </div>
        <ThemeProvider colorScheme="dark">
          <ChipSet aria-label="Dark chips">
            <Chip kind="assist" label="Dark assist" variant="elevated" />
            <Chip kind="filter" label="Dark selected" defaultSelected />
            <Chip kind="input" label="Dark recipient" avatar="AM" onDelete={() => setActions((value) => value + 1)} />
          </ChipSet>
        </ThemeProvider>
      </section>
      <section>
        <h2>Keyboard navigation and direction</h2>
        <div dir="rtl">
          <ChipSet aria-label="Inherited RTL chips">
            <Chip kind="filter" label="RTL first" icon={luggageIcon} />
            <Chip kind="filter" label="RTL disabled" disabled />
            <Chip kind="filter" label="RTL last" />
            <Chip
              kind="input"
              label="RTL recipient"
              avatar="R"
              onClick={() => setActions((value) => value + 1)}
              onDelete={() => setActions((value) => value + 1)}
            />
          </ChipSet>
        </div>
        <ChipSet aria-label="Vertical chips" orientation="vertical" loopFocus={false}>
          <Chip kind="assist" label="Vertical first" />
          <Chip kind="assist" label="Vertical last" />
        </ChipSet>
      </section>
      <section>
        <h2>Native form actions</h2>
        <form
          id="chip-form"
          onSubmit={(event) => {
            event.preventDefault();

            const { submitter } = event.nativeEvent;

            setSubmitted(String(new FormData(event.currentTarget, submitter).get('intent')));
          }}
        >
          <Chip kind="assist" label="Submit reminder" type="submit" name="intent" value="reminder" />
        </form>
        <Chip kind="suggestion" label="Submit external" type="submit" form="chip-form" name="intent" value="external" />
        <p data-testid="chip-submitted">{submitted}</p>
      </section>
    </>
  );
}
