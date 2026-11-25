import Link from 'next/link';
import { Avatar, List, ListItem, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { SelectionDemo } from './selection-demo/selection-demo.component';
import { LanguageCurrencyDemo } from './language-currency-demo/language-currency-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  typography: { plainFontFamily: 'Arial, sans-serif' },
  shape: { large: 20 },
});

export default function ListsPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <h1>MD3 Expressive lists</h1>
        <section>
          <h2>Static server list</h2>
          <List data-testid="static-list" disablePadding>
            <ListItem primary="One-line row" leading="★" />
            <ListItem
              primary="Two-line row"
              secondary="Supporting text"
              leading={<Avatar>AB</Avatar>}
              leadingKind="avatar"
            />
            <ListItem
              primary="Three-line row"
              secondary="Supporting text with room to wrap"
              overline="Overline"
              lines={3}
            />
          </List>
        </section>
        <section>
          <h2>Standard layout</h2>
          <List variant="standard" data-testid="standard-list">
            <ListItem primary="Standard row" />
            <ListItem primary="Another row" />
          </List>
        </section>
        <SelectionDemo />
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="list-dark-theme">
          <List selectionMode="single" aria-label="Dark list" defaultValue="selected">
            <ListItem value="selected" primary="Dark selected row" />
            <ListItem value="other" primary="Dark unselected row" />
          </List>
        </ThemeProvider>
        <section>
          <h2>Language and currency picker</h2>
          <LanguageCurrencyDemo />
        </section>
        <p>
          <Link href="/streaming" prefetch={false}>
            Check request-time streaming
          </Link>
        </p>
      </main>
    </ThemeProvider>
  );
}
