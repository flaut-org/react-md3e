# Badge

Badge displays a small notification dot or a large count/status label. It is available from the
package root and `/badge`, with an explicit `/badge/styles.css` entry. It is a passive Server
Component with no hooks, client directive, runtime style generation or additional dependency.
Base UI has no applicable interaction primitive for this presentation component.

```tsx
import { Badge, IconButton } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/badge/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';

export function Inbox() {
  return (
    <IconButton variant="standard" aria-label="Inbox, 12 unread messages">
      <Badge badgeContent={12}>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M3 4h18v16H3zm2 3v2l7 4 7-4V7l-7 4z" />
        </svg>
      </Badge>
    </IconButton>
  );
}
```

Wrap the **icon**, inside the destination or button. The wrapper preserves the anchor's dimensions;
it does not assign an icon size. The default placement follows Material's top-trailing offsets:
small badges overlap 6px horizontally and vertically; large badges overlap 12px horizontally and
14px vertically. Labels expand toward the trailing edge without moving their leading edge.
Logical positioning mirrors automatically in RTL. Avoid clipped containers and collisions with
adjacent text; use a small badge when space is limited. Without children, the badge renders inline.

## API

| Prop                                           | Contract                                                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `children`                                     | Anchor content, normally an icon; omit for a standalone badge                                          |
| `badgeContent`                                 | Number or localized string; null/undefined means no label                                              |
| `variant`                                      | Material `small` or `large`; inferred as large when content is supplied, small otherwise               |
| `max`                                          | Largest numeric count before `+`, default 999; floored and limited to 0–999; non-finite values use 999 |
| `showZero`                                     | Display a numeric zero; false by default                                                               |
| `invisible`                                    | Hide the indicator while preserving its anchor; false by default                                       |
| `slotProps.badge`                              | Native span attributes, className, style and ref for the decorative indicator                          |
| `ref`, `className`, `style`, native span props | Apply to the outer span                                                                                |

Small badges ignore label content. Large badges have a 16px minimum height/width, 4px inline padding
and labelSmall typography. Small badges are 6px circles. Both use full corners and error/onError
theme roles in standard and Expressive themes. Custom semantic color variants and arbitrary anchor
positions are intentionally absent, following Material's color and placement guidance.

Numeric counts are nonnegative integers: fractional values are floored, negative/non-finite counts
are hidden. Empty large labels are hidden. Numeric zero follows showZero; the string `"0"` is an
explicit text label. Counts above max become e.g. `999+`. Text is trimmed and limited to four Unicode
grapheme clusters, with an ellipsis replacing the fourth cluster on longer labels. Strings let the
application supply localized digits/status text; an accessible description can retain the full count.
The component uses native Intl.Segmenter for grapheme boundaries.

badgeContent, max, showZero, invisible and slotProps.badge follow familiar MUI naming. The Material
variant names small/large replace MUI's dot/standard names; this is not a complete MUI Badge adapter.
There is no styling provider, sx engine or arbitrary element replacement API.

## Accessibility and motion

The indicator is always aria-hidden and never creates a live region or an additional focus target.
Put its meaning **after the destination name** in the button/link's accessible name, including the
visible label for voice control. For example, `Inbox, 12 unread messages` or `Inbox, new notification`.
For an abbreviated count, use `Inbox, 999+ unread messages` and an aria-describedby reference to
`1250 unread messages in total`. This preserves both the visible label and the precise count.
Applications own clearing/hiding notifications when a destination is
selected, and announcements of subsequent updates when needed. A standalone badge also needs its
meaning conveyed by accompanying accessible text.

Visibility changes use the shared fast spatial spring for scale and fast effects spring for opacity.
Reduced motion disables both transitions; the inherited standard/Expressive motion scheme controls
their curves. Forced colors use Highlight/HighlightText with a CanvasText outline. The badge does not
capture pointer input or alter the parent's keyboard, focus, disabled or selected behavior.

## References and verification

Read on 2026-11-19:

- Official Material [overview](https://m3.material.io/components/badges/overview),
  [specifications](https://m3.material.io/components/badges/specs),
  [guidelines](https://m3.material.io/components/badges/guidelines) and
  [accessibility](https://m3.material.io/components/badges/accessibility), verified in the rendered site.
- AndroidX [BadgeTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/BadgeTokens.kt)
  (token version v0_103) and
  [Badge.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Badge.kt)
  at commit `009564af4f3f92df06e213711cb5327ceabc4e47`: numerical dimensions, padding, colors,
  typography and placement. CSS and React code are independently authored; no AndroidX implementation is copied.
- [MUI Badge API](https://mui.com/material-ui/api/badge/) for prop naming only; no MUI code is copied.
- [WCAG Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) for matching
  visible counts in the destination name and supplying precise overflow counts as descriptions.

Logical CSS placement, count limits/truncation, decorative semantics and visibility springs are
documented web adaptations. Browser layout uses CSS pixels for Material dp measurements. Theme font
metrics may change the width of multi-character badges. Figma parity and AndroidX layout-boundary
clamping are not claimed; consumers own the available room around their icon.

Components/Badge stories cover small/large badges, counts, zero, text, standalone use, IconButton
composition and RTL. The `/badges` Next fixture adds controlled updates, refs and nested light/dark
themes; `/streaming` includes a request-time badge. Colocated tests cover public types, formatting,
server markup, RTL placement, interaction preservation, motion preferences and accessibility.
