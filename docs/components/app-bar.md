# AppBar

A server-compatible MD3 Expressive top app bar. It renders a native header, uses precompiled CSS,
and requires no hydration in its default static mode when rendered from RSC. Opt-in automatic
scrolling adds a private client subscription; layout, labels and actions still render on the server.
Interactive actions can be independent client components such as IconButton.

```tsx
import { AppBar, IconButton } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/app-bar/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';

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

The direct entry is `@flaut-travel/react-md3e/app-bar`. A dedicated Base UI primitive is unnecessary for
this static layout; its interactive children use the relevant primitives.

## API

| Prop                 | Values / behavior                                                      |
| -------------------- | ---------------------------------------------------------------------- |
| `variant`            | small (default), search, mediumFlexible, largeFlexible                 |
| `title`, `subtitle`  | React nodes; appearance follows the corresponding MD3 type roles       |
| `navigationIcon`     | Leading navigation control; typically a standard IconButton            |
| `actions`            | Trailing action controls; the guidelines recommend one or two          |
| `titleAlign`         | start (default), center                                                |
| `position`           | fixed (default), absolute, sticky, static, relative                    |
| `scrolled`           | Surface/elevation override; automatically derived with scroll behavior |
| `children`           | Custom title-area content; Search composition for the search variant   |
| `ref`, DOM props     | Native header props, including dir, aria attributes, and React 19 ref  |
| `className`, `style` | Standard React composition                                             |

MD3 Expressive replaces older medium/large bars with **mediumFlexible/largeFlexible**. Centered
layout is an alignment option rather than a separate obsolete variant. No MD2 variant aliases or
MUI palette-color mappings are added.

The root is a header. Title appearance does not imply a heading level: pass the appropriate h1/h2
with its default margin/font reset, or use a string when the page heading is elsewhere. Navigation
and action controls must provide their own accessible names. `dir="rtl"` changes logical placement.
Centered small bars balance side columns when space allows and preserve room for unequal action
counts on narrower screens. Long titles wrap and can increase the minimum bar height.

## Measurements and theme

| Variant        | Minimum height | With subtitle | Title role      | Subtitle role |
| -------------- | -------------- | ------------- | --------------- | ------------- |
| search         | 64px           | —             | bodyLarge input | —             |
| small          | 64px           | 64px          | titleLarge      | labelMedium   |
| mediumFlexible | 112px          | 136px         | headlineMedium  | labelLarge    |
| largeFlexible  | 120px          | 152px         | displaySmall    | titleMedium   |

The first navigation/action row is at least 64px. Expanded labels have 16px horizontal insets.
They grow instead of clipping long text or larger user typography. Custom children are responsible
for their own typography and layout; the ordinary variant minimum height still applies.

The resting container uses surface, title/navigation use onSurface, and subtitle/trailing standard
icons use onSurfaceVariant. `scrolled` changes the container to surfaceContainer and elevation level 2. Typography, colors, nested modes, and custom font families come from ThemeProvider. Background
and elevation transitions respect reduced motion; forced colors retain a visible boundary.

## Scroll and positioning

```tsx
<AppBar
  title="Your collection"
  subtitle="Recently added"
  variant="largeFlexible"
  position="sticky"
  scrollBehavior="exitUntilCollapsed"
/>
```

| Prop             | Contract                                                                                |
| ---------------- | --------------------------------------------------------------------------------------- |
| `scrollBehavior` | `none` (default), `pinned`, `exitUntilCollapsed`, `enterAlways`                         |
| `scrollTarget`   | HTMLElement, Window, or a client resolver returning either (or null)                    |
| `scrolled`       | Optional explicit surface override; omit to derive it from the target's scroll position |

`none` preserves the original server layout with no scroll controller or subscriptions. An explicit
`scrolled` boolean continues to work without automatic scrolling. Enabling a behavior mounts only a
private client marker inside the native header. Its React 19 callback-ref cleanup owns the passive
listeners, resize/content/font observations, and pending timers. The AppBar entry, root barrel and
style modules remain server-compatible; no mandatory client theme provider is introduced.

- `pinned` preserves the expanded height and derives the surface state from scrolling.
- `exitUntilCollapsed` reduces mediumFlexible/largeFlexible bars to the small layout while scrolling
  down, retaining navigation/actions. It expands as the content returns to its start. Small/search
  bars retain their height in this mode and derive their surface state.
- `enterAlways` first collapses flexible bars, then hides the compact bar when scrolling down. Small
  and search bars hide directly. Upward scrolling reveals the bar and then expands flexible labels.

By default, the nearest ancestor with scrollable vertical overflow owns the behavior; without one,
the window is used. Nested scroll events do not change a window-owned bar. For a separate content
panel, use `scrollTarget={() => panelRef.current}` from a client composition. Resolvers run after
sibling refs attach. Pass `scrollTarget={() => window}` to explicitly select window scrolling.
The selected target must remain mounted; rerender with a new target/resolver when replacing it.
Browser scroll position, including restored positions, drives the initial state after hydration.
Offsets are bounded at the beginning/end to ignore overscroll bounce.

During scrolling, numeric CSS variables directly control height, logical title insets, typography
and the hidden offset. After native scrollend (with a 120ms idle fallback), partial positions settle
to the nearest endpoint using the shared default spatial CSS spring. Starting another scroll reads
the rendered pose before retargeting it. Reduced motion disables settling transitions. There is no
JavaScript animation loop, velocity-based fling simulation, generated stylesheet or CSS rule insertion.

The title, subtitle and custom children each render once. The same label moves into the compact
navigation row; heading IDs, input values and child state survive collapse. The expanded height is
measured from natural contents. Compact height grows for wrapping text, larger typography and tall
controls, rather than clipping them. Resizing, content changes and theme/font changes remeasure the
same label. Centered labels reserve balanced side widths, and logical insets support RTL.
A focused action or input keeps the bar visible; keyboard focus entering a hidden bar reveals it
immediately. Search continues to own its dialog and focus restoration.

Automatic behaviors reserve the expanded height in an outer positioning frame. The native header
shrinks within that space, preserving document scroll range and avoiding scroll-anchor feedback or
content jumps. The unused portion does not intercept pointer events. Native `ref`, DOM attributes,
className and style continue to target the actual header; the frame owns fixed/sticky positioning.
An inactive frame is layout-transparent, so enabling, disabling or changing a behavior at runtime
preserves the header and children. Before JavaScript, the expanded server layout remains usable.

Fixed and absolute bars are removed from normal flow. Reserve the appropriate content offset in the
application; no automatic spacer is inserted. Sticky bars stick to their nearest scrolling ancestor
at the block start. Fixed/sticky bars use z-index 1100; applications own their overlay stacking.

## Search app bar

```tsx
import { AppBar, IconButton, Search } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/app-bar/styles.css';

<AppBar
  variant="search"
  position="sticky"
  navigationIcon={
    <IconButton aria-label="Open navigation" variant="standard">
      ☰
    </IconButton>
  }
  actions={
    <IconButton aria-label="More options" variant="standard">
      ⋮
    </IconButton>
  }
>
  <Search label="Search collection" emptyText="Start typing to search" />
</AppBar>;
```

The search variant uses `children` in place of the heading; `title` and `subtitle` are ignored.
Supply the existing `Search` directly as its child. Search owns query/open state, forms, keyboard
navigation, clear/back actions, focus restoration and docked/full-screen results. Its props and
application-owned results follow the [Search contract](search.md). A bare SearchBar supplies only
an input and does not implement the recommended expanding search view.

The header remains server-compatible and does not import Search's client implementation.
Only an explicitly enabled scroll behavior adds the private scroll subscription. Pass the Search composition from a server page, or from
a consumer client component when controlled query/results behavior is needed. Search stays owned
by its existing feature directory.

Use `navigationIcon` and `actions` for controls outside the search surface; use Search's `leading`
and `trailing` for controls inside. Omit the internal search glyph with `leading={null}` when
appropriate. `titleAlign="center"` centers the persistent query and placeholder; it does not change
the expanded view's text alignment. Actions must have accessible names. The application decides
whether its external navigation controls should also appear inside the expanded search view.

The row is 64px high with a 56px round search surface, 4px outer insets and 8px gaps to outside
controls. The search fills the remaining inline space, overriding standalone Search's width and
24px anchor margins. With no outside control, the empty column and its gap leave a 12px inset.
Logical spacing works in RTL and narrow containers. Unlike flexible title variants, the search
variant never creates a second label row or reserves subtitle height.

The resting header uses surface and the persistent search uses surfaceContainer. `scrolled` sets
the header to surfaceContainer and the search to surfaceContainerHighest without a shadow.
Leading and trailing icons use onSurfaceVariant. The expanded Search view keeps its own typography,
colors, geometry and theme inheritance. Reduced-motion and forced-colors handling remain in the
shared Search implementation. `/app-bar/styles.css` includes Search, SearchBar, IconButton and ripple
styles; additional result components need their own family CSS. JavaScript exports remain CSS-free.

All four current Material variants and automatic scroll behaviors are available; AppBar is marked
implemented in the README. Platform adaptations and visual verification limits are listed below.

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

Search app bar reviewed on 2026-11-25 against the same official
[specifications](https://m3.material.io/components/app-bars/specs) and
[guidelines](https://m3.material.io/components/app-bars/guidelines). The specs page was rendered
in Chromium, including its search measurements and flat/on-scroll color diagrams: 64px row,
56px search, 4px outside padding, 8px gaps and surfaceContainer/surfaceContainerHighest mapping.
This web adaptation reuses contained Search instead of copying Android source. The expanded
query retains leading alignment; centered alignment applies to the persistent field. Google's
Figma kit was not accessed for this addition; pixel parity is not claimed.

Colocated Chromium tests cover server HTML without JavaScript, streamed composition, field sizing
and spacing, theme colors, RTL, narrow widths, keyboard navigation, query persistence, clear/back,
focus restoration, responsive full-screen results, forced colors, reduced motion and accessibility.
Storybook includes search, centered-search and scrolled-search examples.

Automatic scrolling reviewed on 2026-11-25 against the official
[Material app-bar behavior guidance](https://m3.material.io/components/app-bars/guidelines),
[Compose scroll-behavior documentation](https://developer.android.com/develop/ui/compose/components/app-bars#scrolling),
and `PinnedScrollBehavior`, `EnterAlwaysScrollBehavior`, `ExitUntilCollapsedScrollBehavior` and
`settleAppBar` in the pinned AndroidX AppBar.kt linked above. These inform the behavior names,
directional collapse/return, compact minimum and endpoint settling. Original web implementation;
no AndroidX implementation code was copied. Native browser scrolling supplies momentum; Android's
nested-scroll consumption, drag-to-fling and velocity-preserving physics are not replicated.

Scroll tests cover all three modes, progress/settling, window/nested/explicit targets, surface
overrides, cleanup and runtime switching, single title DOM, focus reveal and Search restoration,
wrapped RTL labels, resize, reduced motion, forced colors, accessibility, server fallback and Storybook.

Search app-bar transitions share Search's measured, opaque header handoff. They do not replace the
bar with a fading popup: only the results fade. Pointer dismissal releases editing focus; keyboard
return reactivates search on input or Enter. See [Search motion and keyboard behavior](search.md).
