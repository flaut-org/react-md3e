# Typography

Typography renders native or custom React elements with precompiled MD3 text styles. The component
has no hooks, theme context, client directive or style calculation. A static RSC use needs no
component hydration; a consumer client component can use normal native events and React 19 refs.
Base UI is unnecessary for text presentation without interaction behavior.

```tsx
import { Typography } from '@flaut-travel/react-md3e/typography';

export function TripHeading() {
  return (
    <>
      <Typography component="h1" variant="displaySmall">
        Plan your trip
      </Typography>
      <Typography component="h2" variant="titleLarge">
        Destinations
      </Typography>
      <Typography component="p" variant="bodyLarge">
        Fly <strong>direct</strong> and leave <em>today</em>.
      </Typography>
      <Typography component="span" variant="labelLarge" emphasized>
        Recommended
      </Typography>
    </>
  );
}
```

Import the component/types from the package root or `/typography`; precompiled CSS loads automatically. Typography follows the ordinary component ownership/files/tests conventions.

## API

| Prop                                                  | Default     | Meaning                                                                   |
| ----------------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| `variant`                                             | `bodyLarge` | One of 15 MD3 roles below, or `inherit`                                   |
| `component`                                           | `span`      | HTML tag or custom React component; independent of visual variant         |
| `emphasized`                                          | false       | Select the role's emphasized token set; has no effect for variant inherit |
| `color`                                               | `inherit`   | Any named MD3 ColorRole or inherited content color                        |
| `align`                                               | `inherit`   | start, end, left, right, center, justify, inherit                         |
| `noWrap`                                              | false       | white-space nowrap, hidden overflow and ellipsis                          |
| `className`, `style`, `children`, native props, `ref` | —           | Forwarded to the chosen component; native attributes/ref types follow it  |

The five visual role families are display, headline, title, body and label, each in Large/Medium/Small:
`displayLarge` through `labelSmall`. Legacy MUI h1/body1/caption variants are intentionally absent.
Emphasized is a separate boolean, rather than another set of variant names.

The component resets its own margin to zero and inherits color/alignment by default. It does not
apply paragraph spacing, automatic heading levels, ARIA roles or tab stops. Use native h1–h6 in the
appropriate document hierarchy; label styles do not automatically create an HTML label. Choose
component="label" and htmlFor when labeling an input. A custom component must forward className and
applicable attributes/ref to its DOM node; its own RSC/client boundary still applies.

Font family, size, line-height, weight and tracking come from the selected visual style. Changing
component to strong/b does not override that MD3 weight; select an emphasized role when needed.
Nested ordinary strong/b and em/i preserve the browser's semantic bold/italic treatment. Typography
leaves font-style alone, including when rendering em/i. `variant="inherit"` inherits the five font
metrics explicitly and does not select a role. MD3 emphasized styles and HTML em represent different
choices; neither automatically implies the other.

noWrap retains complete accessible/DOM text. Ellipsis needs a constrained block or inline-block box:
for example component="p" with an inline-size from a compiled consumer class. It does not change an
inline span into a block or choose a width. Logical start/end alignment follows the current direction;
text itself remains in normal browser flow. Rem metrics respect the document root font size. Native
forced-color adjustment is retained instead of forcing arbitrary palette colors.

## Theme and all 30 styles

createTheme now returns 30 immutable styles in theme.typography: the existing 15 baseline keys,
and 15 paired keys such as bodyLargeEmphasized. TypeScaleRole remains the 15-role visual catalog;
TypographyTokenRole includes all 30 theme keys. TypographyOptions is also exported from the root
and /theme.

```tsx
import { createTheme, themeToCss } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({
  typography: {
    brandFontFamily: 'Georgia, serif',
    plainFontFamily: 'Arial, sans-serif',
    bodyLarge: { fontSize: 18, lineHeight: 28 },
    bodyLargeEmphasized: { fontSize: 18, lineHeight: 28, fontWeight: 600 },
  },
});

const css = themeToCss(theme, { selector: '.brand' });
```

Each optional role override accepts fontFamily, fontSize, lineHeight, fontWeight and letterSpacing.
Dimensions/tracking are numbers in CSS px; output tokens use rem. Font size/line-height must be
positive, weight must be 1–1000, tracking must be finite (negative is allowed), and font-family
strings must not be empty. Unknown roles/properties and invalid metrics throw at generation time.
Baseline and emphasized overrides are independent; setting bodyLarge does not silently change
bodyLargeEmphasized. Shared brand/plain font stacks apply to both sets.

Brand fonts apply to display/headline/titleLarge; plain fonts apply to the remaining roles, including
their emphasized counterparts. Emphasis has its own weight and tracking data, not a universal bold
weight added to the baseline. Existing components retain their baseline tokens unless their own
styles explicitly select emphasized typography.

Baseline CSS names remain unchanged, for example --md-sys-typescale-body-large-size. Emphasized names
use the canonical --md-sys-typescale-emphasized-body-large-size prefix, with the same font, size,
line-height, weight and tracking suffixes. ThemeProvider supplies either generated values as a CSS
scope or a consumer can export static themeToCss output. Nested providers and color schemes work
through ordinary CSS inheritance. Outside a provider, compiled default token fallbacks apply.

The CSS compiler expands every variant/emphasis/color/alignment selector at build time; UI JS only
forwards attributes and a class string. Color generation, token resolution and numerical tables stay
out of the component import graph. Font files remain application-owned; the package does not fetch
Roboto, synthesize custom font assets, or configure variable-font axes.

## Sources and verification

Reviewed on 2026-11-15:

- [MD3 applying type](https://m3.material.io/styles/typography/applying-type) and
  [type scale/tokens](https://m3.material.io/styles/typography/type-scale-tokens): five role families,
  three sizes, baseline/emphasized sets and theme-based metrics.
- [Google Material3 Typography](https://developer.android.com/reference/kotlin/androidx/compose/material3/Typography):
  role naming, independent text styles and their emphasized counterparts.
- [AndroidX TypeScaleTokens.kt, revision 160825094a81825468a95b115bfb1b541e549856](https://github.com/androidx/androidx/blob/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt),
  token version v0_103, and sibling TypefaceTokens.kt: numerical emphasized metrics and font/weight
  families. The source labels its emphasized definitions as awaiting generated tokens; these values
  are pinned here rather than dynamically following AndroidX. Baseline metrics retain the library's
  existing measurements. Numerical token facts are transcribed; no upstream implementation is copied.

Tests cover all 30 computed styles, custom metrics/fonts, theme colors and inheritance, HTML heading
semantics and rich text, native/custom props and refs, truncation, RTL, root font sizing, native forced
colors, static exports, no-JS RSC rendering, streaming, Storybook and automated accessibility. Package
validation checks a react-server import and rejects generation code in the UI module graph. Chromium
is covered; Figma pixel parity and other browser engines are not claimed.
