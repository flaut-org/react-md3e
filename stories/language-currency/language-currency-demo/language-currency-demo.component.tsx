'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
} from '@flaut-travel/react-md3e';

const languages = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'uk', label: 'Українська', flag: '🇺🇦' },
];
const currencies = [
  { value: 'EUR', label: 'Euro', flag: '🇪🇺' },
  { value: 'USD', label: 'US dollar', flag: '🇺🇸' },
  { value: 'UAH', label: 'Ukrainian hryvnia', flag: '🇺🇦' },
  { value: 'JPY', label: 'Japanese yen', flag: '🇯🇵' },
];

/** Consumer composition: filtering and locale/currency policy do not enter the UI package. */
export function LanguageCurrencyDemo() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('EUR');
  const [query, setQuery] = useState('');

  return (
    <>
      <Button onClick={() => setOpen(true)}>Choose language and currency</Button>
      <p data-testid="locale-selection">
        {language} / {currency}
      </p>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth className="locale-picker-dialog" role="dialog">
        <DialogTitle>Language and currency</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose your preferred language and currency.</DialogContentText>
          <div className="locale-picker-columns">
            <section>
              <h3 id="locale-language-heading">Language</h3>
              <List
                selectionMode="single"
                value={language}
                onValueChange={setLanguage}
                selectionIndicator="checkmark"
                aria-labelledby="locale-language-heading"
                disablePadding
              >
                {languages.map((entry) => (
                  <ListItem key={entry.value} value={entry.value} primary={entry.label} leading={entry.flag} />
                ))}
              </List>
            </section>
            <section>
              <h3 id="locale-currency-heading">Currency</h3>
              <label className="fixture-dialog-field" htmlFor="locale-currency-search">
                Find currency
                <input id="locale-currency-search" value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
              <List
                selectionMode="single"
                value={currency}
                onValueChange={setCurrency}
                selectionIndicator="checkmark"
                aria-labelledby="locale-currency-heading"
                disablePadding
              >
                {currencies
                  .filter((entry) => `${entry.label} ${entry.value}`.toLowerCase().includes(query.toLowerCase()))
                  .map((entry) => (
                    <ListItem
                      key={entry.value}
                      value={entry.value}
                      primary={entry.label}
                      secondary={entry.value}
                      leading={entry.flag}
                    />
                  ))}
              </List>
            </section>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
