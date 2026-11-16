# Creating a Material 3 theme

`createTheme` implements the token-based workflow described in Google's
[Material Theme Builder article](https://m3.material.io/blog/material-theme-builder) and the
[official builder repository](https://github.com/material-foundation/material-theme-builder).
Components reference semantic roles instead of hard-coded palette values. One configuration produces
light and dark schemes, tonal palettes, typography, and shape tokens.

## Create and apply

Call the generator in server code or a build script:

```tsx
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import '@flaut-travel/react-md3e/styles.css';

const theme = createTheme({
  sourceColor: '#386a20',
  typography: {
    brandFontFamily: 'Georgia, serif',
    plainFontFamily: 'Arial, sans-serif',
  },
});

export default function Page() {
  return (
    <ThemeProvider theme={theme} colorScheme="system">
      <Button variant="filled">Continue</Button>
      <Button variant="tonal">Learn more</Button>
    </ThemeProvider>
  );
}
```

`ThemeProvider` is a regular div with a CSS scope. It has no hooks, context, client directive,
effect, or style insertion registry. In an RSC it renders HTML and CSS-variable values with no
provider hydration. Passing a different `theme` into a client-rendered scope updates ordinary React
style properties, not CSS rules.

`colorScheme` accepts `light`, `dark`, or `system` (default). CSS `color-scheme` and `light-dark()`
choose the corresponding values, including changes to the system preference. Nested providers reset
the theme and select their own scheme. A provider without `theme` uses the compiled default Material
theme.

The color generator is exported separately from `/theme`; importing Button or ThemeProvider does not
import it. Do not call `createTheme` in a client render or on each button render. Storybook receives
precomputed JSON themes rather than running color generation in the browser.

## Options

| Option                          | Meaning                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `sourceColor`                   | Opaque `#rrggbb` seed; default `#6750a4`                                                                              |
| `variant`                       | Google's `tonalSpot` (default) or `expressive` palette algorithm                                                      |
| `contrastLevel`                 | System-scheme contrast level from -1 to 1; default 0                                                                  |
| `keyColors`                     | Optional primary, secondary, tertiary, neutral, neutralVariant, and error key colors                                  |
| `schemes.light`, `schemes.dark` | Explicit overrides of recognized MD3 semantic color roles                                                             |
| `customColors`                  | Named extra colors with optional harmonization, enabled by default                                                    |
| `typography`                    | Brand/plain font stacks and per-role baseline/emphasized TypeStyle overrides                                          |
| `shape`                         | MD3 extraSmall, small, medium, large, largeIncreased, extraLarge, extraLargeIncreased and extraExtraLarge radii in px |

The `expressive` color algorithm is a palette choice; it is not what makes the Button an Expressive
component. Button shape, size, selection, states, and motion are implemented separately.

```ts
const theme = createTheme({
  sourceColor: '#6750a4',
  keyColors: { secondary: '#006c4c', tertiary: '#845400' },
  customColors: {
    success: { value: '#008544', harmonize: true },
  },
  shape: { medium: 18 },
});
```

Custom color names are lower-case kebab-case. For example:

```ts
const theme = createTheme({
  sourceColor: '#6750a4',
  customColors: {
    'success': { value: '#008544' },
    'brand-fixed': { value: '#123456', harmonize: false },
  },
});
```

Key colors generate tonal palettes; they are not assigned directly to the primary/secondary role.
For exact role values, use a scheme override and keep the matching foreground roles readable. Only
generated, unmodified role pairs inherit the generator's contrast behavior.

The generator uses Google's Material Color Utilities 0.4.0 and the 2025 color specification. It
includes current tone-based surface containers and fixed accents. It does not recreate the older
Surface 1–5 elevation overlay export from the 2021 article.

## Returned tokens

The result is an immutable, JSON-serializable object containing `schemes.light`, `schemes.dark`,
`palettes`, `customColors`, `typography`, `shape`, and `cssVariables`. Palettes expose standard tone
samples; scheme roles are resolved independently for light and dark mode by Google's algorithm.

Typography includes 15 baseline MD3 roles and 15 paired emphasized roles, such as bodyLarge and
bodyLargeEmphasized. Brand fonts apply to display/headline/titleLarge; plain fonts apply to other
roles in both sets. Each role can override fontFamily, fontSize, lineHeight, fontWeight and
letterSpacing through options.typography. Baseline/emphasized overrides are independent. Dimensions
are px in the object and emitted as rem tokens; emphasized CSS names use
--md-sys-typescale-emphasized-<role>-<property>. Font assets remain consumer-owned; variable-font axes
are outside this implementation. See [Typography](components/typography.md) for examples, validation
and source provenance.

Example CSS references:

```css
.callout {
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
  border-radius: var(--md-sys-shape-corner-medium);
  font-family: var(--md-sys-typescale-body-large-font);
}
.success {
  color: var(--md-custom-color-success-on-color);
  background: var(--md-custom-color-success-color);
}
```

There are no MUI palette aliases, spacing/breakpoint system, component style overrides, runtime `sx`
resolver, or context-based `useTheme` API.

## Export a custom theme as build-time CSS

`ThemeProvider theme={theme}` supports server-created themes using style attributes. To deliver
custom token values entirely as CSS, generate a stylesheet in the consumer's build:

```js
import { writeFile } from 'node:fs/promises';
import { createTheme, themeToCss } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({ sourceColor: '#386a20' });
await writeFile('app/brand.css', themeToCss(theme, { selector: '.brand' }));
```

Import that CSS after the library stylesheet, then use
`<ThemeProvider className="brand" colorScheme="system">`. No theme object or color utility needs to
reach the browser. The Next.js fixture exercises this path as well as a server-created inline theme.

Modern browsers with CSS `light-dark()`, `color-mix()`, and `linear()` support are required. Browser
behavior is currently verified in Chromium; other engines need their own coverage.

Surface and Card use the corner scale directly. The Expressive additions largeIncreased (20px),
extraLargeIncreased (32px) and extraExtraLarge (48px) can be overridden through createTheme alongside
the existing radii. Shape's 35 decorative silhouettes use their fixed official geometry; they inherit
theme colors rather than the container corner scale. See components/surface.md and components/shape.md.
