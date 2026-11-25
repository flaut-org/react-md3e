import '@flaut-travel/react-md3e/app-bar/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';

import Link from 'next/link';
import { AppBar, IconButton, Search, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { IconButtonDemo } from './icon-button-demo/icon-button-demo.component';

const icon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
  </svg>
);
const navigation = (
  <IconButton aria-label="Navigation" variant="standard">
    {icon}
  </IconButton>
);
const actions = (
  <>
    <IconButton aria-label="Save" variant="standard">
      {icon}
    </IconButton>
    <IconButton aria-label="More" variant="standard">
      {icon}
    </IconButton>
  </>
);
const forest = createTheme({
  sourceColor: '#386a20',
  typography: { brandFontFamily: 'Georgia, serif', plainFontFamily: 'Arial, sans-serif' },
  shape: { medium: 18 },
});

export default function ComponentsPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <AppBar
        title={<h1 className="fixture-title">AppBar and IconButton</h1>}
        position="static"
        navigationIcon={navigation}
        actions={actions}
        data-testid="server-app-bar"
      />
      <main>
        <section className="fixture-bars">
          <h2>App bar variants</h2>
          <AppBar
            variant="search"
            position="static"
            navigationIcon={navigation}
            actions={
              <IconButton aria-label="Save" variant="standard">
                {icon}
              </IconButton>
            }
            data-testid="bar-search"
          >
            <Search label="Search collection" defaultValue="Saved query">
              <a href="#search-app-bar-result">Search app bar result</a>
            </Search>
          </AppBar>
          <AppBar
            variant="search"
            titleAlign="center"
            position="static"
            navigationIcon={navigation}
            actions={actions}
            data-testid="bar-search-centered"
          >
            <Search
              label="Centered search"
              leading={null}
              disableClearable
              trailing={
                <IconButton aria-label="Voice search" variant="standard">
                  {icon}
                </IconButton>
              }
            >
              <p>Centered search results</p>
            </Search>
          </AppBar>
          <AppBar variant="search" position="static" scrolled data-testid="bar-search-scrolled">
            <Search label="Scrolled search" />
          </AppBar>
          <AppBar
            variant="search"
            position="static"
            dir="rtl"
            navigationIcon={navigation}
            actions={actions}
            data-testid="bar-search-rtl"
          >
            <Search label="RTL collection search">
              <p>RTL search results</p>
            </Search>
          </AppBar>
          <p id="search-app-bar-result">Selected collection result</p>
          {(['small', 'mediumFlexible', 'largeFlexible'] as const).map((variant) => (
            <div key={variant}>
              <AppBar
                title="Collection"
                variant={variant}
                position="static"
                navigationIcon={navigation}
                actions={actions}
                data-testid={`bar-${variant}`}
              />
              <AppBar
                title="Collection"
                subtitle="Recently added"
                variant={variant}
                position="static"
                navigationIcon={navigation}
                actions={actions}
                data-testid={`bar-${variant}-subtitle`}
              />
            </div>
          ))}
          <AppBar
            title="Centered"
            titleAlign="center"
            position="static"
            navigationIcon={navigation}
            actions={actions}
            data-testid="centered-bar"
          />
          <AppBar
            title="المكتبة"
            dir="rtl"
            position="static"
            navigationIcon={navigation}
            actions={actions}
            data-testid="rtl-bar"
          />
          <AppBar title="Scrolled" position="static" scrolled data-testid="scrolled-bar" />
          <AppBar
            title="A longer headline that can wrap across multiple lines without clipping the text"
            variant="largeFlexible"
            position="static"
            data-testid="wrapping-bar"
          />
        </section>
        <section>
          <h2>Icon sizes and widths</h2>
          <div className="fixture-row">
            {(['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
              <IconButton key={size} size={size} aria-label={size} data-testid={`icon-${size}`}>
                {icon}
              </IconButton>
            ))}
          </div>
          <div className="fixture-row">
            {(['narrow', 'default', 'wide'] as const).map((width) => (
              <IconButton
                key={width}
                size="medium"
                width={width}
                aria-label={`${width} width`}
                data-testid={`icon-width-${width}`}
              >
                {icon}
              </IconButton>
            ))}
          </div>
          <div className="fixture-row">
            {(['filled', 'tonal', 'outlined', 'standard'] as const).map((variant) => (
              <IconButton key={variant} variant={variant} aria-label={variant} data-testid={`icon-${variant}`}>
                {icon}
              </IconButton>
            ))}
          </div>
          <span id="external-icon-label">Externally named icon</span>
          <IconButton aria-labelledby="external-icon-label">{icon}</IconButton>
        </section>
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="icons-dark">
          <AppBar title="Dark collection" position="static" />
          <AppBar variant="search" position="static" data-testid="bar-search-dark">
            <Search label="Dark collection search">
              <p>Dark collection results</p>
            </Search>
          </AppBar>
          <IconButton aria-label="Dark icon">{icon}</IconButton>
        </ThemeProvider>
        <IconButtonDemo />
        <Link href="/streaming" prefetch={false}>
          Check request-time streaming
        </Link>
      </main>
    </ThemeProvider>
  );
}
