import '@flaut-travel/react-md3e/autocomplete/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/dialog/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/list/styles.css';
import '@flaut-travel/react-md3e/search/styles.css';
import '@flaut-travel/react-md3e/text-field/styles.css';

import { Search, SearchBar, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { SearchDemo } from './search-demo/search-demo.component';

const forest = createTheme({ sourceColor: '#386a20', typography: { plainFontFamily: 'Arial, sans-serif' } });

export default function SearchPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main className="search-examples">
        <h1>Material 3 Expressive Search</h1>
        <p>Contained search with docked results and a fullscreen view on compact screens.</p>
        <SearchDemo />
        <section data-testid="server-search">
          <h2>Server composition</h2>
          <SearchBar label="Server search bar" defaultValue="Server-rendered query" />
          <Search label="Server search">
            <p className="search-example-message">Server-created results</p>
          </Search>
        </section>
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="search-dark-theme">
          <section>
            <h2>Nested dark theme</h2>
            <Search label="Dark search">
              <p className="search-example-message">Themed results</p>
            </Search>
          </section>
        </ThemeProvider>
      </main>
    </ThemeProvider>
  );
}
