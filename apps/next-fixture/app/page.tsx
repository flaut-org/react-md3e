import '@flaut-travel/react-md3e/button/styles.css';

import Link from 'next/link';
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { ButtonDemo } from './button-demo/button-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  typography: { brandFontFamily: 'Georgia, serif', plainFontFamily: 'Arial, sans-serif' },
  shape: { medium: 18 },
});

export default function Page() {
  return (
    <main data-fixture="package-consumer">
      <h1>Material 3 Expressive</h1>
      <p>The built package is imported from a React Server Component.</p>
      <ThemeProvider theme={forest} colorScheme="light" className="fixture-card" data-testid="custom-light">
        <h2>Server-created forest theme</h2>
        <div className="fixture-row">
          <Button data-testid="server-button" shape="square">
            Continue
          </Button>
          <Button variant="tonal">Learn more</Button>
          <Button variant="outlined">Later</Button>
        </div>
        <ThemeProvider colorScheme="dark" className="fixture-card" data-testid="nested-dark">
          <Button>Nested dark theme</Button>
        </ThemeProvider>
      </ThemeProvider>
      <ThemeProvider theme={forest} colorScheme="dark" className="fixture-card" data-testid="custom-dark">
        <Button>Dark forest theme</Button>
      </ThemeProvider>
      <ThemeProvider className="fixture-card forest-static" colorScheme="light" data-testid="static-theme">
        <Button>Build-time CSS theme</Button>
      </ThemeProvider>
      <ThemeProvider colorScheme="system" className="fixture-card" data-testid="system-theme">
        <Button>System preference</Button>
      </ThemeProvider>
      <ThemeProvider colorScheme="light" className="fixture-card" data-testid="size-examples">
        <div className="fixture-row">
          {(['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </div>
      </ThemeProvider>
      <ButtonDemo />
      <p>
        <Link href="/switches">Switch examples</Link>
      </p>
      <p>
        <Link href="/badges">Badge examples</Link>
      </p>
      <p>
        <Link href="/calendars">Calendar and date range examples</Link>
      </p>
      <p>
        <Link href="/essentials">Homepage essentials</Link>
      </p>
      <p>
        <Link href="/indicators">Loading and progress indicators</Link>
      </p>
      <p>
        <Link href="/typography">Typography examples</Link>
      </p>
      <p>
        <Link href="/search">Search examples</Link>
      </p>
      <p>
        <Link href="/surfaces">Surface, Shape and Card examples</Link>
      </p>
      <p>
        <Link href="/popovers">Popover and passenger picker examples</Link>
      </p>
      <p>
        <Link href="/fields">TextField and Autocomplete examples</Link>
      </p>
      <p>
        <Link href="/selection-controls">Checkbox, Radio and Avatar examples</Link>
      </p>
      <p>
        <Link href="/lists">List and language/currency examples</Link>
      </p>
      <p>
        <Link href="/dialog">Dialog examples</Link>
      </p>
      <p>
        <Link href="/components">AppBar and IconButton examples</Link>
      </p>
      <Link href="/streaming" prefetch={false}>
        Check request-time streaming
      </Link>
    </main>
  );
}
