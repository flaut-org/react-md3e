# Tabs

Material 3 primary and secondary tabs organize related content at the same level. The same geometry
works with Material You and Expressive themes; the existing theme's motion scheme controls indicator
springs. Import the family from the root or `/tabs` with automatic CSS loading, including ThemeProvider defaults.

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@flaut-travel/react-md3e/tabs';

<Tabs defaultValue="flights">
  <TabList aria-label="Travel search">
    <Tab value="flights">Flights</Tab>
    <Tab value="hotels">Hotels</Tab>
  </TabList>
  <TabPanel value="flights">Flight search</TabPanel>
  <TabPanel value="hotels">Hotel search</TabPanel>
</Tabs>;
```

## API

| Owner    | Prop                        | Default / contract                                                                                                                                |
| -------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs     | `variant`                   | `primary`; `secondary` gives a full-width, square 2px underline and onSurface active content.                                                     |
| Tabs     | `value`, `defaultValue`     | Controlled/initial string or number. `null` means no active tab. With neither supplied, Base UI selects the first enabled tab after registration. |
| Tabs     | `onChange(event, value)`    | Called for selection changes. Return false or newly prevent the native event to cancel user selection.                                            |
| TabList  | `scrollable`                | false; fixed rows divide available width equally, scrollable rows use intrinsic widths and a 52px leading inset.                                  |
| TabList  | `selectionFollowsFocus`     | false; arrows move focus and Enter/Space select. Set true for automatic activation when content is immediately available.                         |
| TabList  | `loopFocus`                 | true; arrows wrap at the ends. Set false to stop at the first/last tab.                                                                           |
| Tab      | `value`                     | Required stable, unique string or number, matching a panel.                                                                                       |
| Tab      | `label`, `children`         | Visible label. `label` takes precedence over children. Keep labels short and consistent across the row.                                           |
| Tab      | `icon`, `iconPosition`      | Decorative icon; default stacked for primary, inline for secondary. Explicit `top` or logical `start` overrides placement.                        |
| Tab      | `badge`                     | Optional consumer-owned status content. Stacked icons anchor badges with 6px overlap; inline/label badges sit 4px after the content.              |
| Tab      | `disabled`, `disableRipple` | false; disabled tabs cannot activate; arrows may focus them so assistive technology can announce their state.                                     |
| TabPanel | `value`                     | Required matching tab value.                                                                                                                      |
| TabPanel | `keepMounted`               | false; inactive content unmounts. With true, it stays in the DOM with hidden semantics and retains local state.                                   |

All parts accept native attributes, className, style and refs to their div/button elements. Tab
always renders a type=button, so it does not submit a surrounding form. TabList requires aria-label
or aria-labelledby. Icon-only tabs require one of those names as well. Selection, panel roles and
relationships belong to the components. Use explicit values for initial SSR selection; do not rely
on registration fallback when a selected panel must appear before hydration.

Base UI owns controlled/uncontrolled selection, roving focus, arrows, Home/End, disabled-item focus without activation,
automatic fallback when a selected tab disappears or becomes disabled, and tab/panel ID relationships.
Automatic fallback notifications cannot be canceled. User onClick/onFocus handlers can prevent Base
UI activation. Prefer manual activation for slow or fetched content. The consumer owns data loading,
routing and URL synchronization. Labels, panels and values must be composed within the same Tabs;
nested Tabs keep independent selection and presentation. Keep Tab children inside their TabList.

## Presentation and rendering

Primary uses titleSmall, primary active text/icons, a 3px indicator hugging the label minus 2px on
each side (minimum 24px), and rounded upper corners. Secondary uses onSurface active text/icons and
a full-tab 2px primary indicator. Both use surface containers, onSurfaceVariant inactive content,
an outlineVariant 1px divider inside the height, 24px icons, and at least 48px targets. Text-only
rows are 48px; stacked icon/label rows are 64px with a 2px gap; inline icons have an 8px gap.
Fixed rows truncate long labels; use scrollable rows to preserve longer labels and larger sets.

Tabs/TabList/Tab/TabPanel are interactive client entries with server-rendered markup and can be
composed from RSC, including server/streamed panel children. Initial server markup has a static
selected underline (24px primary fallback); Base UI's measured shared indicator replaces it after
hydration. Panel ARIA associations settle when Base UI registers the parts. ThemeProvider stays
server-compatible. Geometry measurements set only a label-width variable; Base UI measures tab
geometry. ResizeObserver tracks font/label width changes. Selection and focus reveal overflow only
inside the owning list, avoiding ancestor page scrolling.

All rules are extracted from typed style objects. UI JavaScript contains no style compiler, theme
generator, rule insertion or animation solver. Indicator translation/width use fast spatial theme
springs; colors and state layers use fast effects. Reduced motion disables transitions and ripple.
Keyboard focus uses a separate inward frame with the large (16px) corner token and 3px secondary
border. Its outer edges align with the tab; a selected tab reserves its indicator height plus 1px
below the frame (4px primary, 3px secondary). A single 500ms ease pulse thickens the border to 6px
and settles back to 3px without moving content. This recording-calibrated focus pulse is independent
of theme indicator springs and is disabled for reduced motion. Forced colors use Highlight for the
frame and preserve selection and disabled text. RTL uses
logical spacing and inherited/explicit HTML direction for Base UI's arrows and local scrolling.

## Focus frame verification

The supplied `Screen Recording 2026-11-23 at 22.57.21.mov` was decoded at 30 sampling points per
second (4.632s, 672×302; the recording itself has variable frame timing). The next recording,
`Screen Recording 2026-11-23 at 22.58.14.mov` (5.658s, 1500×408), documented the incorrect square,
static outline. The first recording and the official primary-tabs state diagram establish rounded
inside geometry, selected-only bottom clearance, and a single inward thickness emphasis.
`tests/tabs-focus.reference.json` records the normalized CSS geometry and motion checkpoints;
intermediate thickness permits pixel quantization. Browser checks sample actual CSSAnimation
playheads and verify fixed bounds/content, blur/re-entry, pointer focus, reduced motion and forced colors.

The numeric focus references are M3E
[FocusRingElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/core/shared/primitives/FocusRingElement.ts),
[FocusRingToken.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/core/shared/primitives/FocusRingToken.ts)
and [MotionToken.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/core/shared/tokens/MotionToken.ts):
3px resting thickness, growth factor 2, 500ms long2 duration and inward placement. The independent
implementation animates border thickness inside a fixed box, avoiding negative outline geometry.
The older Google Material Web focus primitive was also inspected at revision
`b3a10c9f07aad462617ddbf2f57c9114fce82838`; its different 8px peak and two-stage timing were not
used in place of the user-supplied reference. No upstream focus implementation was copied.

## Design sources and adaptations

Inspected on 2026-11-23:

- Official [overview](https://m3.material.io/components/tabs/overview),
  [specs](https://m3.material.io/components/tabs/specs),
  [guidelines](https://m3.material.io/components/tabs/guidelines) and
  [accessibility](https://m3.material.io/components/tabs/accessibility), rendered in Chromium.
  These living pages expose no immutable revision. Measurements, states, hierarchy and scroll inset
  inform the implementation. The official table and AndroidX use the primary role for both indicators;
  secondary's content uses onSurface. Tabs have no separate Expressive pill variant in these sources.
- AndroidX [PrimaryNavigationTabTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/PrimaryNavigationTabTokens.kt)
  and [SecondaryNavigationTabTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SecondaryNavigationTabTokens.kt),
  revision `009564af4f3f92df06e213711cb5327ceabc4e47`, token version v0_162: geometry,
  typography and color references. The current official outlineVariant divider takes precedence over
  the older SecondaryNavigationTabTokens surfaceVariant divider role.
- Requested [M3E documentation](https://matraic.github.io/m3e/#/components/tabs.html), its
  [static page](https://matraic.github.io/m3e/components/tabs.html),
  [TabElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/tabs/TabElement.ts)
  and [TabsElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/tabs/TabsElement.ts),
  revision `e8bf648be92ae30ca11f51645d4d9d0167730a5c`. Label-sized primary indicators,
  primary/secondary hierarchy, disabled semantics and reduced motion were inspected. This library
  uses its own Base UI adapter, typed object styles and theme springs. No source or icon assets were copied.
- [Base UI Tabs](https://base-ui.com/react/components/tabs), installed version 1.9.0, for interaction,
  SSR, registration, indicator geometry and panel persistence contracts.
- Google's [Material 3 Figma kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit)
  is identified, but its nodes were not accessed or visually verified. Figma parity is not claimed.

Web adaptations include explicit composition, a static SSR indicator fallback, native horizontal
scrolling with keyboard reveal, manual activation by default, and precomputed theme springs. Swipe
between panels, animated panel carousels, pagination arrow controls, density presets and vertical tabs
are outside this implementation. The minimum scrollable tab width is 90px; inline padding is 16px.
Badges are arbitrary content; the separate Badge API loads its CSS automatically.
Consumer routing should not turn this content-switching button into a navigation link.

Verification lives in `tabs/tests`, the Next fixture `/tabs` and Storybook Components/Tabs. Browser
coverage is Chromium; other browser engines and platform-native gestures are not claimed.
