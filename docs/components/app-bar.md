# AppBar

A server-compatible MD3 Expressive top app bar. It renders a native header, uses precompiled CSS,
and requires no hooks, context, effects, or hydration when rendered from RSC. Interactive actions
can be independent client components such as IconButton.

```tsx
import { AppBar, IconButton } from '@flaut-org/react-md3e';
import '@flaut-org/react-md3e/styles.css';

<AppBar
  title="Your collection"
  subtitle="Recently added"
  variant="mediumFlexible"
  position="static"
  actions={
    <IconButton aria-label="Add to collection" variant="standard">
      +
    </IconButton>
  }
/>;
```

The direct entry is `@flaut-org/react-md3e/app-bar`. A dedicated Base UI primitive is unnecessary for
this static layout; its interactive children use the relevant primitives.

## API

| Prop                 | Values / behavior                                                     |
| -------------------- | --------------------------------------------------------------------- |
| `variant`            | small (default), mediumFlexible, largeFlexible                        |
| `title`, `subtitle`  | React nodes; appearance follows the corresponding MD3 type roles      |
| `navigationIcon`     | Leading navigation control; typically a standard IconButton           |
| `actions`            | Trailing action controls; the guidelines recommend one or two         |
| `titleAlign`         | start (default), center                                               |
| `position`           | fixed (default), absolute, sticky, static, relative                   |
| `scrolled`           | Controlled surface/elevation state; default false                     |
| `children`           | Custom title-area content replacing title and subtitle                |
| `ref`, DOM props     | Native header props, including dir, aria attributes, and React 19 ref |
| `className`, `style` | Standard React composition                                            |

MD3 Expressive replaces older medium/large bars with **mediumFlexible/largeFlexible**. Centered
layout is an alignment option rather than a separate obsolete variant. No MD2 variant aliases or
MUI palette-color mappings are added.

The root is a header. Title appearance does not imply a heading level: pass the appropriate h1/h2
with its default margin/font reset, or use a string when the page heading is elsewhere. Navigation
and action controls must provide their own accessible names. `dir="rtl"` changes logical placement.
Centered small bars balance side columns when space allows and preserve room for unequal action
counts on narrower screens. Long titles wrap and can increase the minimum bar height.

## Measurements and theme

| Variant        | Minimum height | With subtitle | Title role     | Subtitle role |
| -------------- | -------------- | ------------- | -------------- | ------------- |
| small          | 64px           | 64px          | titleLarge     | labelMedium   |
| mediumFlexible | 112px          | 136px         | headlineMedium | labelLarge    |
| largeFlexible  | 120px          | 152px         | displaySmall   | titleMedium   |

The first navigation/action row is at least 64px. Expanded labels have 16px horizontal insets.
They grow instead of clipping long text or larger user typography. Custom children are responsible
for their own typography and layout; the ordinary variant minimum height still applies.

The resting container uses surface, title/navigation use onSurface, and subtitle/trailing standard
icons use onSurfaceVariant. `scrolled` changes the container to surfaceContainer and elevation level 2. Typography, colors, nested modes, and custom font families come from ThemeProvider. Background
and elevation transitions respect reduced motion; forced colors retain a visible boundary.

## Scroll and positioning

`scrolled` is explicit application state. AppBar installs no scroll listener or observer and does
not animate collapse/expansion. A client wrapper may track its own scroll container and pass the
boolean. The Sticky Storybook example demonstrates that composition without changing the standalone
AppBar's server boundary.

Fixed and absolute bars are removed from normal flow. Reserve the appropriate content offset in the
application; no automatic spacer is inserted. Sticky bars stick to their nearest scrolling ancestor
at the block start. Fixed/sticky bars use z-index 1100; applications own their overlay stacking.

Search app bars require a separate search interaction design and are outside this component's current
variants. Built-in collapsing scroll behavior is also outside this implementation.

## Sources

Read on 2026-11-15:

- [Official app-bar specifications](https://m3.material.io/components/app-bars/specs) and
  [guidelines](https://m3.material.io/components/app-bars/guidelines), rendered in a browser:
  flexible replacements, alignment, titles/subtitles, colors, and action guidance.
- [AndroidX tokens at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/tree/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens):
  AppBarTokens, AppBarSmallTokens, AppBarMediumFlexibleTokens, and AppBarLargeFlexibleTokens
  14_0_0.
- [AndroidX AppBar layout reference at the same revision](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AppBar.kt):
  top-row and expanded-label placement.

Measurements are adapted to CSS px/rem and web layout. No AndroidX implementation source was copied;
Figma node parity is not claimed.
