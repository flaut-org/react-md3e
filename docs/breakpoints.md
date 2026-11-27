# Application breakpoints

The shared layout scale is a library convention, independent of MD3 component variants. It uses
familiar MUI names without adding MUI System, a client theme context, or JavaScript media observers.

| Name | Default (CSS px) | CSS variable         |
| ---- | ---------------- | -------------------- |
| xs   | 0                | `--md-breakpoint-xs` |
| sm   | 600              | `--md-breakpoint-sm` |
| md   | 900              | `--md-breakpoint-md` |
| lg   | 1200             | `--md-breakpoint-lg` |
| xl   | 1536             | `--md-breakpoint-xl` |

## Configure a theme

Create themes on the server or during the consumer build:

```tsx
import { ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({ breakpoints: { sm: 640, md: 1024 } });

export default function Layout({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
```

`breakpoints` is a partial map merged with defaults. Values must be finite, non-negative numbers
in CSS px, strictly increasing in xs/sm/md/lg/xl order. Unknown keys and invalid scales are rejected.
`theme.breakpoints` is immutable and serializable; `theme.cssVariables` contains all five widths.
`themeToCss(theme, { selector: '.brand[data-md3-theme]' })` exports them alongside the other tokens.

A provider with a theme sets ordinary style attributes; a provider without a theme uses compiled
CSS defaults. Nested providers reset the scale rather than partially inheriting the outer theme.
Portalled components mounted inside the theme scope inherit its CSS variables. An explicit portal
container outside the scope uses the container's theme, as with color tokens.

## Use and override from CSS

```css
.content {
  max-inline-size: var(--md-breakpoint-lg);
  margin-inline: auto;
}

/* For a provider without an inline theme; use sufficient specificity. */
.brand[data-md3-theme] {
  --md-breakpoint-sm: 640px;
  --md-breakpoint-md: 1024px;
}
```

Inline theme tokens take precedence over stylesheet declarations. Prefer `createTheme` or generated
theme CSS rather than `!important`. Normal CSS inheritance and the cascade control all dimensions;
no effect copies values to portal nodes or inserts styles. CSS-authored overrides must use valid
lengths and preserve ordering; generator validation cannot validate the stylesheet cascade.

Dialog supports `maxWidth="md"` (and the other names or false) through these variables. Omitting
maxWidth preserves MD3's 560px width. Its xs cap has a documented 444px minimum because xs=0 denotes
a range starting at zero. See [Dialog](components/dialog.md).

## Responsive rules at build time

CSS variables **cannot** be used in native media-query conditions. `@media (width >= var(--md-breakpoint-md))`
is invalid. Changing a ThemeProvider token updates dimensions immediately, but cannot move a compiled
media-query threshold. See [MDN's custom property restrictions](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties).

Generate native query conditions from the same scale during the build:

```ts
import { createBreakpointQueries, createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({ breakpoints: { md: 1024 } });
const queries = createBreakpointQueries(theme.breakpoints);
// queries.up.md === '(width >= 1024px)'
// queries.down.md === '(width < 1024px)'
```

`up` is inclusive and `down` exclusive, so there is no fractional-pixel gap. Each contains all five
names. The helper validates the scale and returns frozen data; it is exported only from the
server/build `/theme` entry. Do not import this entry into client components. In extracted style
objects, interpolate the query into the at-rule key during build-time evaluation:

```ts
const styles = {
  [`@media ${queries.up.md}`]: { display: 'flex' },
};
```

For plain CSS/CSS Modules, generate `@custom-media --md-up-md (width >= 1024px);` and compile
`@media (--md-up-md)` with [PostCSS Custom Media](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media).
For CSS Modules, the plugin recommends [PostCSS Global Data](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-global-data)
to share the definitions across files. Both are consumer build dependencies, not library or browser
runtime dependencies. Rebuild stylesheets when changing query thresholds. Different nested runtime
themes can have different width caps; they do not create different global media-query rules.

The Next fixture `/breakpoints` verifies server HTML with JavaScript disabled, every Dialog width,
nested defaults, stylesheet overrides, live CSS-variable changes, full-screen precedence, and
viewport bounds. Behavior is currently verified in Chromium.

DatePicker and DateRangePicker use matchMedia only to choose interaction presentation: fine hover
pointers plus the build-time sm width and 480px height select a docked panel. The threshold strings
are generated from the default theme during package builds in internal/picker-media.generated.json.
This is a behavioral capability subscription, independent of runtime CSS scopes; changing a theme's
CSS breakpoint variables does not rewrite these native queries. Explicit picker variant overrides
the capability-based choice. Additional queries check whether the viewport can fit every docked
month at its full width/height plus actions and gutters. A panel that cannot fit falls back to modal,
then full-screen or input mode as needed; an individual month grid is never compressed into a scroll
area. See [date picker behavior](components/date-pickers.md).
