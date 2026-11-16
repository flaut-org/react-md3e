'use client';

import { useRef, useState } from 'react';
import { Button, List, ListItem } from '@flaut-org/react-md3e';

export function SelectionDemo() {
  const [currency, setCurrency] = useState('EUR');
  const [interests, setInterests] = useState<string[]>(['nature']);
  const [query, setQuery] = useState('');
  const list = useRef<HTMLUListElement>(null);
  const item = useRef<HTMLLIElement>(null);
  const currencies = [
    { value: 'EUR', primary: 'Euro', secondary: 'EUR' },
    { value: 'USD', primary: 'US dollar', secondary: 'USD' },
    { value: 'UAH', primary: 'Ukrainian hryvnia', secondary: 'UAH' },
    { value: 'JPY', primary: 'Japanese yen', secondary: 'JPY', disabled: true },
  ];

  return (
    <>
      <section>
        <h2>Currencies</h2>
        <label htmlFor="currency-filter">
          Filter currency
          <input id="currency-filter" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <List
          ref={list}
          selectionMode="single"
          value={currency}
          onValueChange={setCurrency}
          selectionIndicator="checkmark"
          aria-label="Currency"
          data-testid="currency-list"
        >
          {currencies
            .filter((entry) => `${entry.primary} ${entry.secondary}`.toLowerCase().includes(query.toLowerCase()))
            .map((entry) => (
              <ListItem
                key={entry.value}
                value={entry.value}
                primary={entry.primary}
                secondary={entry.secondary}
                disabled={entry.disabled ?? false}
                ref={entry.value === 'EUR' ? item : undefined}
              />
            ))}
        </List>
        <p>
          Currency: <span data-testid="selected-currency">{currency}</span>
        </p>
        <Button onClick={() => setCurrency('USD')}>Select USD from code</Button>
        <Button
          onClick={() => {
            list.current?.setAttribute('data-ref-checked', 'true');
            item.current?.setAttribute('data-ref-checked', 'true');
          }}
        >
          Check list refs
        </Button>
      </section>
      <section>
        <h2>Interests</h2>
        <List
          selectionMode="multiple"
          value={interests}
          onValueChange={setInterests}
          aria-label="Interests"
          controlPosition="start"
          data-testid="interests-list"
        >
          <ListItem value="nature" primary="Nature" />
          <ListItem value="food" primary="Food" />
          <ListItem value="museums" primary="Museums" />
          <ListItem value="disabled" primary="Disabled interest" disabled />
        </List>
        <p>
          Interests: <span data-testid="selected-interests">{interests.join(',')}</span>
        </p>
      </section>
      <section>
        <h2>Radio indicator and locked states</h2>
        <Button>Before language list</Button>
        <List selectionMode="single" aria-label="Default language" defaultValue="fr" data-testid="radio-list">
          <ListItem value="en" primary="English" />
          <ListItem value="es" primary="Español" />
          <ListItem value="fr" primary="Français" />
          <ListItem value="de" primary="Deutsch" disabled />
        </List>
        <List
          selectionMode="single"
          aria-label="Read-only language"
          defaultValue="fr"
          readOnly
          data-testid="readonly-list"
        >
          <ListItem value="en" primary="English" />
          <ListItem value="fr" primary="Français" />
        </List>
        <List selectionMode="multiple" aria-label="Disabled group" defaultValue={['one']} disabled>
          <ListItem value="one" primary="Selected disabled row" />
          <ListItem value="two" primary="Unselected disabled row" />
        </List>
        <List selectionMode="multiple" aria-label="Locked row" defaultValue={['one']}>
          <ListItem value="one" primary="Read-only row" readOnly />
          <ListItem value="two" primary="Without ripple" disableRipple />
        </List>
        <List selectionMode="single" aria-label="RTL language" defaultValue="ar" dir="rtl" data-testid="rtl-list">
          <ListItem value="ar" primary="العربية" leading="ع" />
          <ListItem value="en" primary="English" leading="E" />
        </List>
      </section>
    </>
  );
}
