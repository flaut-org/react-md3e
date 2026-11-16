'use client';

import { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, List, ListItem, Search, SearchBar, TextField } from '@flaut-org/react-md3e';

const destinations = ['Paris', 'Porto', 'Prague', 'Rome', 'Tokyo'];

export function SearchDemo() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const [formValue, setFormValue] = useState('');
  const [reason, setReason] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [protectedView, setProtectedView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLInputElement>(null);
  const viewRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const matches = destinations.filter((city) => city.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    rootRef.current?.setAttribute('data-hydrated', 'true');
  }, []);

  return (
    <>
      <section data-testid="controlled-search">
        <h2>Destinations</h2>
        <form
          id="destination-search-form"
          onSubmit={(event) => {
            event.preventDefault();
            setFormValue(String(new FormData(event.currentTarget).get('destination')));
          }}
        >
          <Search
            ref={rootRef}
            inputRef={barRef}
            viewInputRef={viewRef}
            viewProps={{ id: 'destination-search-view', ref: popupRef }}
            label="Search destinations"
            name="destination"
            form="destination-search-form"
            value={query}
            open={open}
            onChange={(_event, next, nextReason) => {
              setQuery(next);
              setReason(nextReason);
            }}
            onOpenChange={(next) => setOpen(next)}
            onClose={(_event, next) => setCloseReason(next)}
            onSearch={(_event, next) => setSubmitted(next)}
            loading={loading}
            statusText={`${matches.length} destinations`}
            emptyText="No destinations found"
          >
            {!loading &&
              (matches.length ? (
                <List aria-label="Destinations">
                  {matches.map((city) => (
                    <ListItem
                      key={city}
                      primary={
                        <Button
                          variant="text"
                          onClick={() => {
                            setQuery(city);
                            setOpen(false);
                          }}
                        >
                          {city}
                        </Button>
                      }
                    />
                  ))}
                </List>
              ) : (
                <p className="search-example-message">No destinations found</p>
              ))}
            <Button variant="text" disabled>
              Unavailable destination
            </Button>
            <Button variant="text" onClick={() => setLoading((next) => !next)}>
              Toggle loading
            </Button>
            <Button
              variant="text"
              onClick={() => {
                rootRef.current?.setAttribute('data-ref-checked', 'true');
                barRef.current?.setAttribute('data-ref-checked', 'true');
                viewRef.current?.setAttribute('data-ref-checked', 'true');
                popupRef.current?.setAttribute('data-ref-checked', 'true');
              }}
            >
              Check search refs
            </Button>
          </Search>
        </form>
        <p data-testid="search-query">{query}</p>
        <p data-testid="search-change-reason">{reason}</p>
        <p data-testid="search-close-reason">{closeReason}</p>
        <p data-testid="search-submitted">{submitted}</p>
        <p data-testid="search-form-value">{formValue}</p>
        <Button onClick={() => setOpen(true)}>Open search from code</Button>
        <Button onClick={() => setQuery('Rome')}>Set query from code</Button>
      </section>
      <section data-testid="standalone-search">
        <h2>Standalone bar and native form</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setFormValue(String(new FormData(event.currentTarget).get('q')));
          }}
        >
          <SearchBar label="Standalone search" name="q" defaultValue="Initial query" />
          <Button type="submit">Submit standalone</Button>
          <Button type="reset">Reset standalone</Button>
        </form>
        <SearchBar label="Read-only search" readOnly defaultValue="Paris" />
        <SearchBar label="Disabled search" disabled defaultValue="Rome" />
        <SearchBar label="No clear action" disableClearable defaultValue="Tokyo" />
      </section>
      <section data-testid="retained-search">
        <h2>Uncontrolled query, retained content and form reset</h2>
        <form id="retained-search-form" onSubmit={(event) => event.preventDefault()}>
          <Search label="Retained search" name="q" defaultValue="Initial" keepMounted>
            <TextField label="Retained note" defaultValue="My note" />
          </Search>
          <Button type="reset">Reset retained</Button>
        </form>
      </section>
      <section>
        <h2>Dismissal policy</h2>
        <Search
          label="Protected search"
          disableEscapeKeyDown
          onClose={(event, next) => {
            if (protectedView && next === 'clickAway') {
              event.preventDefault();
            }
          }}
        >
          <Button onClick={() => setProtectedView(false)}>Allow outside close</Button>
        </Search>
      </section>
      <section>
        <h2>Layouts and composition</h2>
        <Search label="Docked search" layout="docked">
          <p className="search-example-message">Docked results</p>
        </Search>
        <Search label="Fullscreen search" layout="fullScreen">
          <p className="search-example-message">Fullscreen results</p>
        </Search>
        <Search label="Nested controls search">
          <Autocomplete label="Result filter" options={['Paris', 'Rome']} />
        </Search>
        <Search label="RTL search" dir="rtl">
          <Button variant="text">نتيجة البحث</Button>
        </Search>
        <div ref={hostRef} data-testid="search-custom-container" />
        <Search label="Custom container search" container={() => hostRef.current}>
          <p>Custom portal</p>
        </Search>
        <Search label="Disabled view" disabled />
        <Search label="Readonly view" readOnly defaultValue="Paris" />
      </section>
    </>
  );
}
