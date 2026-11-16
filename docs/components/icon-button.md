# IconButton

An MD3 Expressive icon-only action built on Base UI Button. It is a client component for input,
focus handling, and press ripple; it is also server-rendered and usable inside RSC. Styling is
precompiled and follows ThemeProvider without React context.

```tsx
import { IconButton } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/styles.css';

<IconButton aria-label="Save" variant="tonal">
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
  </svg>
</IconButton>;
```

The direct entry is `@flaut-travel/react-md3e/icon-button`. This component accepts an icon from the
consumer; it does not install an icon font or depend on an icon package.

## API

| Prop                                 | Values / behavior                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `variant`                            | filled (default), tonal, outlined, standard                                     |
| `size`                               | extraSmall, small (default), medium, large, extraLarge                          |
| `width`                              | narrow, default (default), wide                                                 |
| `shape`                              | round (default), square                                                         |
| `children`                           | Decorative icon content; hidden from assistive technology                       |
| `aria-label` / `aria-labelledby`     | At least one is required in TypeScript and must be nonempty at runtime          |
| `selected`                           | Controlled toggle state, reflected as aria-pressed; omit for an ordinary action |
| `disableRipple`                      | Disable press animation without losing focus feedback; default false            |
| `type`                               | Native button type; default button                                              |
| `disabled`, `ref`, events, DOM props | Native button behavior and React 19 ref forwarding                              |
| `className`, `style`                 | Standard React composition                                                      |

Use a stable action name for toggle buttons. Own state and callbacks in a consumer client component,
for example `selected={favorite}` and `onClick={() => setFavorite(!favorite)}`. Selection changes
both color and resting shape. Round changes to square; square changes to round. Pressing uses a
smaller corner token. `aria-labelledby` references must point to existing meaningful text.

## Measurements and theme

| Size       | Visual height | Icon | Narrow / default / wide visual width | Square corner     | Pressed corner |
| ---------- | ------------- | ---- | ------------------------------------ | ----------------- | -------------- |
| extraSmall | 32px          | 20px | 28 / 32 / 40px                       | medium / 12px     | small / 8px    |
| small      | 40px          | 24px | 32 / 40 / 52px                       | medium / 12px     | small / 8px    |
| medium     | 56px          | 24px | 48 / 56 / 72px                       | large / 16px      | medium / 12px  |
| large      | 96px          | 32px | 64 / 96 / 128px                      | extraLarge / 28px | large / 16px   |
| extraLarge | 136px         | 40px | 104 / 136 / 184px                    | extraLarge / 28px | large / 16px   |

The actual button occupies at least **48×48px**, while the inner container retains the specified
visual dimensions. This reserves interaction space in layout instead of overlapping neighboring
buttons. Outline widths are 1px for the first three sizes, 2px for large, and 3px for extraLarge.
Color and corner roles inherit the nearest theme, including nested and system-mode themes.

Ordinary filled uses primary/onPrimary; an unselected filled toggle uses surfaceContainer/
onSurfaceVariant. Tonal uses secondaryContainer/onSecondaryContainer and selected secondary/
onSecondary. Outlined uses outlineVariant/onSurfaceVariant and selected inverseSurface/
inverseOnSurface. Standard uses onSurfaceVariant and selected primary. AppBar sets the standard
navigation icon to onSurface and trailing icons to onSurfaceVariant.

Disabled states, hover/focus/press layers, and focus rings use compiled CSS. Shape motion uses the
same sampled Expressive spring as Button. The private ripple hook is shared with Button; it measures
the visual container so the larger interaction target does not distort the ink. See
[Button's ripple contract](button.md#ripple). Reduced motion disables ripple and transitions; forced
colors retain native system contrast and visible focus.

## Sources

Read on 2026-11-15:

- [Official icon-button specifications](https://m3.material.io/components/icon-buttons/specs),
  rendered in a browser: four variants, default filled appearance, width options, shape morphs,
  selected states, and 48px interaction targets.
- [Base UI Button](https://base-ui.com/react/components/button), also verified against installed
  version 1.9.0.
- [AndroidX tokens at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/tree/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens):
  XSmall/Small/Medium/XLargeIconButtonTokens and variant tokens 14_1_0;
  LargeIconButtonTokens v0_11_0 (its Uniform width supplies the default width).

Numeric measurements are adapted to CSS. No upstream component source or SVG icon was copied.
Figma node parity is not claimed.
