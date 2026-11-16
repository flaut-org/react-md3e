'use client';

import { useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@flaut-travel/react-md3e';
import type { TextFieldControl } from '@flaut-travel/react-md3e';

const cities = [
  { code: 'PAR', name: 'Paris' },
  { code: 'ROM', name: 'Rome' },
  { code: 'KBP', name: 'Kyiv' },
  { code: 'TYO', name: 'Tokyo' },
  { code: 'SPO', name: 'São Paulo' },
];

export function FieldsDemo() {
  const [text, setText] = useState('');
  const [city, setCity] = useState<(typeof cities)[number] | null>(cities[0]!);
  const [selected, setSelected] = useState<string[]>(['Paris']);
  const [query, setQuery] = useState('');
  const [reason, setReason] = useState('');
  const [inputReason, setInputReason] = useState('');
  const [form, setForm] = useState('');
  const [remoteOptions, setRemoteOptions] = useState<string[]>([]);
  const [remoteQuery, setRemoteQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TextFieldControl>(null);
  const destinationRef = useRef<TextFieldControl>(null);

  return (
    <>
      <section>
        <h2>TextField states</h2>
        <div className="fixture-row">
          <TextField
            label="Traveler"
            ref={fieldRef}
            inputRef={inputRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            helperText="Enter your full name"
            inputProps={{ maxLength: 30 }}
          />
          <TextField label="Filled traveler" variant="filled" placeholder="Alex Morgan" />
          <TextField
            label="Price"
            type="number"
            defaultValue="25"
            InputProps={{ startAdornment: '€', endAdornment: 'EUR' }}
          />
          <TextField label="Invalid name" error defaultValue="?" helperText="Use the name on your passport" />
          <TextField label="Disabled name" disabled defaultValue="Unavailable" />
          <TextField label="Read-only name" readOnly defaultValue="Saved name" />
          <TextField label="Notes" multiline rows={3} defaultValue="A window seat, please." />
          <TextField label="RTL name" dir="rtl" defaultValue="علي" />
          <TextField aria-label="Search journeys" placeholder="Search journeys" />
        </div>
        <p data-testid="traveler-value">{text}</p>
        <Button onClick={() => inputRef.current?.focus()}>Focus traveler</Button>
        <Button
          onClick={() => {
            fieldRef.current?.setAttribute('data-ref-checked', String(inputRef.current?.tagName === 'INPUT'));
            destinationRef.current?.setAttribute('data-ref-checked', 'true');
          }}
        >
          Check field refs
        </Button>
      </section>
      <section>
        <h2>Native form</h2>
        <form
          aria-label="Booking form"
          onSubmit={(event) => {
            event.preventDefault();
            setForm(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
          }}
        >
          <div className="fixture-row">
            <TextField label="Email" name="email" type="email" required />
            <TextField label="Form notes" name="notes" multiline defaultValue="Window seat" />
            <TextField label="Excluded field" name="excluded" disabled defaultValue="hidden" />
            <Autocomplete
              label="Booking city"
              name="city"
              required
              options={[
                { label: 'Paris', value: 'PAR' },
                { label: 'Rome', value: 'ROM' },
              ]}
            />
          </div>
          <Button type="submit">Submit booking</Button>
        </form>
        <p data-testid="booking-values">{form}</p>
      </section>
      <section data-testid="object-autocomplete">
        <h2>Object options</h2>
        <Autocomplete
          label="Destination"
          options={cities}
          value={city}
          inputRef={destinationRef}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.code}
          getOptionKey={(option) => option.code}
          getOptionDisabled={(option) => option.code === 'TYO'}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          onChange={(_event, next, nextReason) => {
            setCity(next);
            setReason(nextReason);
          }}
          onInputChange={(_event, _next, nextReason) => setInputReason(nextReason)}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText="Search for a destination"
              InputProps={{ ...params.InputProps, startAdornment: '✈' }}
            />
          )}
          renderOption={(props, option) => (
            <div {...props}>
              {option.name}
              <span aria-hidden="true"> {option.code}</span>
            </div>
          )}
        />
        <p data-testid="selected-city">{city?.code ?? 'none'}</p>
        <p data-testid="selection-reason">{reason}</p>
        <p data-testid="input-reason">{inputReason}</p>
        <Button onClick={() => setCity({ code: 'ROM', name: 'Rome' })}>Choose Rome from code</Button>
      </section>
      <section data-testid="controlled-query">
        <h2>Independent input state</h2>
        <Autocomplete
          label="City query"
          options={['Paris', 'Rome', 'Kyiv']}
          inputValue={query}
          onInputChange={(_event, next) => setQuery(next)}
        />
        <p data-testid="query-value">{query}</p>
        <Button onClick={() => setQuery('Ky')}>Set query from code</Button>
      </section>
      <section data-testid="multiple-autocomplete">
        <h2>Multiple choices</h2>
        <Autocomplete
          multiple
          label="Visited cities"
          options={['Paris', 'Rome', 'Kyiv', 'Oslo']}
          value={selected}
          onChange={(_event, next, nextReason) => {
            setSelected(next);
            setReason(nextReason);
          }}
          filterSelectedOptions
        />
        <p data-testid="selected-cities">{selected.join(',')}</p>
      </section>
      <section>
        <h2>Restrictions and focus</h2>
        <div className="fixture-row">
          <Autocomplete label="Disabled destination" options={['Paris', 'Rome']} defaultValue="Paris" disabled />
          <Autocomplete label="Locked destination" options={['Paris', 'Rome']} defaultValue="Paris" readOnly />
          <Autocomplete multiple label="Locked choices" options={['Paris', 'Rome']} defaultValue={['Paris']} readOnly />
          <Autocomplete label="Fixed destination" options={['Paris', 'Rome']} defaultValue="Paris" disableClearable />
          <Autocomplete label="Focus destination" options={['Paris', 'Rome']} openOnFocus autoHighlight />
          <Autocomplete label="RTL destination" options={['القاهرة', 'عمان']} dir="rtl" />
        </div>
      </section>
      <section data-testid="remote-autocomplete">
        <h2>Server filtering</h2>
        <Autocomplete
          label="Remote destination"
          inputValue={remoteQuery}
          onInputChange={(_event, next, nextReason) => {
            if (nextReason === 'input' || nextReason === 'clear' || nextReason === 'selectOption') {
              setRemoteQuery(next);
            }
          }}
          options={remoteOptions}
          loading={loading}
          filterOptions={(options) => options}
          loadingText="Finding destinations…"
          noOptionsText="No destinations found"
        />
        <Button
          onClick={() => {
            setRemoteOptions(['Remote Paris', 'Remote Rome']);
            setLoading(false);
          }}
        >
          Resolve suggestions
        </Button>
        <Button
          onClick={() => {
            setRemoteOptions([]);
            setLoading(false);
          }}
        >
          Return empty suggestions
        </Button>
      </section>
      <Button onClick={() => setDialogOpen(true)}>Open destination dialog</Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} role="dialog">
        <DialogTitle>Destination picker</DialogTitle>
        <DialogContent>
          <Autocomplete label="Dialog destination" options={['Nested Paris', 'Nested Rome']} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
