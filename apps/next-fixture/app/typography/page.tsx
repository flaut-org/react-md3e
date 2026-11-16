import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/surface/styles.css';
import '@flaut-travel/react-md3e/typography/styles.css';

import Link from 'next/link';
import { Surface, ThemeProvider, Typography } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import type { TypeScaleRole } from '@flaut-travel/react-md3e';
import { TypographyDemo } from './typography-demo/typography-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  typography: {
    brandFontFamily: 'Georgia, serif',
    plainFontFamily: 'Arial, sans-serif',
    bodyLarge: { fontSize: 18, lineHeight: 28 },
    bodyLargeEmphasized: { fontSize: 18, lineHeight: 28, fontWeight: 600 },
  },
});
const roles = Object.keys(forest.typography).filter((role) => !role.endsWith('Emphasized')) as TypeScaleRole[];

export default function TypographyPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <Typography component="h1" variant="displaySmall">
          Material 3 typography
        </Typography>
        <Typography component="p">Native semantics with independent MD3 styling.</Typography>
        <section aria-label="Type scale" className="typography-gallery">
          {roles.map((variant) => (
            <div key={variant} className="typography-example-row">
              <Typography component="p" variant={variant} data-testid={`type-${variant}`}>
                {variant}
              </Typography>
              <Typography component="p" variant={variant} emphasized data-testid={`type-${variant}-emphasized`}>
                {variant} emphasized
              </Typography>
            </div>
          ))}
        </section>
        <section>
          <Typography component="h2" variant="titleLarge" data-testid="semantic-heading">
            A second-level section
          </Typography>
          <Typography component="p" variant="bodyLarge" data-testid="rich-text">
            Choose <strong>direct flights</strong>, travel <em>today</em>, <b>bold</b> and <i>italic</i>.
            <Typography component="span" variant="inherit" data-testid="inherited-text">
              {' '}
              Inherited metrics.
            </Typography>
          </Typography>
          <Typography component="strong" variant="labelLarge" emphasized data-testid="semantic-strong">
            Important label
          </Typography>
          <Typography component="em" variant="bodySmall" data-testid="semantic-em">
            An emphasized word
          </Typography>
          <Typography component={Link} href="/" variant="bodyLarge" color="primary" data-testid="custom-link">
            Return home
          </Typography>
          <Typography component="p" noWrap className="typography-truncated" data-testid="truncated-text">
            A long destination name that should be truncated while remaining available in the DOM.
          </Typography>
          <Typography component="p" align="end" data-testid="logical-alignment" dir="rtl">
            محاذاة النص
          </Typography>
          <Surface color="primaryContainer" className="typography-example-pad">
            <Typography data-testid="inherited-color">Inherited surface content color</Typography>
            <Typography component="p" color="onPrimaryContainer" data-testid="explicit-color">
              Explicit theme color
            </Typography>
          </Surface>
          <ThemeProvider
            theme={forest}
            colorScheme="dark"
            className="typography-example-pad"
            data-testid="typography-dark"
          >
            <Typography component="p" color="primary" emphasized data-testid="dark-text">
              Dark theme type
            </Typography>
          </ThemeProvider>
          <ThemeProvider colorScheme="light" className="forest-static typography-example-pad">
            <Typography variant="bodyLarge" emphasized data-testid="static-type">
              Build-time theme CSS
            </Typography>
          </ThemeProvider>
        </section>
        <TypographyDemo />
      </main>
    </ThemeProvider>
  );
}
