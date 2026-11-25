# Search and SearchBar

Search implements Material 3 Expressive **contained** search: a persistent round bar and a separate
rounded results surface. `SearchBar` is its independently usable input. Both compose Base UI and
render their bars on the server; interactive behavior hydrates. Styles and springs are compiled CSS,
and ThemeProvider remains an RSC-compatible CSS scope.

A consumer client component owns filtering, fetching, result selection and routing:

```tsx
'use client';

import { useState } from 'react';
import { Button, List, ListItem, Search } from '@flaut-travel/react-md3e';

export function DestinationSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const results = ['Paris', 'Rome'].filter((city) => city.toLowerCase().includes(query.toLowerCase()));

  return (
    <Search
      label="Search destinations"
      value={query}
      open={open}
      onChange={(_event, next) => setQuery(next)}
      onOpenChange={(next) => setOpen(next)}
      statusText={`${results.length} destinations`}
    >
      <List aria-label="Destinations">
        {results.map((city) => (
          <ListItem
            key={city}
            primary={
              <Button
                variant="text"
                onClick={() => {
                  setQuery(city);
                  setOpen(false);
                }}
              >
                {city}
              </Button>
            }
          />
        ))}
      </List>
    </Search>
  );
}
```

Import both components/types from the root or `/search`. Component and ThemeProvider styles load automatically. For a search app bar, pass Search
as the direct child of `AppBar variant="search"`; `/app-bar/styles.css` includes the Search family.
See [AppBar](app-bar.md) for its spacing, alignment and scrolled colors.
`SearchBar` belongs to Search's ownership directory but is an intentional public composition part.

## Shared input API

| Prop                             | Contract                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `label`                          | Required nonempty accessible name; also the default placeholder                    |
| `placeholder`                    | Optional different visible hint; keep its meaning aligned with the accessible name |
| `value`, `defaultValue`          | Controlled/uncontrolled freeform query, always a string                            |
| `onChange(event, value, reason)` | Native event with `input` or `clear` reason                                        |
| `onSearch(event, value)`         | Enter outside IME composition; return false or prevent default to cancel           |
| `name`, `form`                   | Native form name and optional external form owner                                  |
| `disabled`, `readOnly`           | Native input states; Search does not open in either state                          |
| `fullWidth`                      | Fill available width; Search's bar caps at 720px plus outer margins                |
| `leading`, `trailing`            | React content; default decorative search glyph, or `leading={null}` to omit it     |
| `disableClearable`, `clearText`  | Hide query clear action or localize its accessible label                           |
| `inputProps`                     | Native input attributes/events except owned type, role, value, naming and state    |
| `inputRef`                       | Native persistent input ref; root `ref` targets the enclosing div                  |

The bar is 56px tall, full-round, with bodyLarge input and surfaceContainerHigh/onSurface roles.
Its default width is 360px; it can shrink in narrow containers. Give actions accessible names and
keep trailing content to the MD3 recommendation of at most two icons, or one icon plus an avatar.
The clear action counts toward that space; use `disableClearable` when composing more actions.
Read-only query text has no clear action. The internal input is text with role searchbox,
inputMode/enterKeyHint search; this avoids native search-input Escape/clear behavior conflicting
with modal dismissal. Applications own autocomplete attributes and localization.
The persistent searchbox uses `aria-haspopup="dialog"` and, while open, `aria-controls` to identify
the search view. It omits `aria-expanded`, which the searchbox role does not support in
[WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#searchbox).

## Search view API

| Prop                        | Default              | Contract                                                                       |
| --------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `children`                  | —                    | Arbitrary results/suggestions/filter composition, independently of query state |
| `open`, `defaultOpen`       | uncontrolled, false  | Controlled/uncontrolled expanded view                                          |
| `onOpenChange(open, event)` | —                    | Request callback; false or preventDefault vetoes                               |
| `onClose(event, reason)`    | —                    | Close request before onOpenChange; same veto contract                          |
| `layout`                    | `auto`               | `docked`, `fullScreen`, or auto at the 600px CSS breakpoint                    |
| `keepMounted`               | false                | Retain hidden view and child state after closing                               |
| `disableEscapeKeyDown`      | false                | Ignore Escape dismissal                                                        |
| `backText`, `resultsLabel`  | Back, Search results | Localized action and results-region names                                      |
| `loading`, `loadingText`    | false, Searching…    | Busy state, indeterminate progress and live status                             |
| `statusText`                | empty                | Application-owned polite result-count/status announcement                      |
| `emptyText`                 | —                    | Fallback when no children are supplied, outside loading                        |
| `viewTrailing`              | —                    | Actions in expanded bar; persistent bar uses trailing                          |
| `viewProps`                 | —                    | Native popup div attributes/ref; dialog role/name/modal semantics are owned    |
| `viewInputRef`              | —                    | Native expanded input ref; inputProps apply to both inputs                     |
| `container`                 | nearest theme/portal | Portal element or resolver                                                     |

Close reasons are `escapeKeyDown`, `clickAway`, `backButtonClick`, `programmatic`.
Changing controlled open directly does not emit a request callback. Choosing a result does not
implicitly close or overwrite the query: update both in the consumer when desired. Values survive
closing in either state mode. Keyboard dismissal restores focus to the persistent field without immediately reopening it.
Typing, pasting, committed IME input, Enter or ArrowDown activates search again; query text is
preserved. Pointer Back/click-away releases editing focus instead of restoring a text caret. Leading content on the persistent bar is replaced by Back when expanded.

Base UI Dialog provides modal focus containment, scroll locking, nested overlays, Escape and
outside-press dismissal. Both layouts block the background. The bar stays in the server DOM;
results portal mounts after hydration (also with defaultOpen). keepMounted retains it hidden after
closing. Portal scope resolution matches Dialog/Popover, inheriting the enclosing theme without
client theme context. Custom hosts must preserve the desired theme and avoid clipping or changing
the fixed-position containing block through transforms/containment.

## Keyboard and forms

- Focus the persistent query or click the bar surface to open; initial focus moves to the expanded query.
- Back and scrim close suggestions/results and end pointer editing. Keyboard dismissal (including
  Escape or keyboard activation of Back) restores logical focus to the persistent input. A new
  edit reopens the expanded view; Enter/ArrowDown reopens it without executing a search.
- The exiting query remains available for immediate reactivation: clicking its header, typing,
  Enter/ArrowDown or committing IME input reverses the exit without waiting for the closing motion.
- Tab/Shift+Tab visit native controls within the modal.
- ArrowDown/ArrowUp from the query enter the first/last enabled result action. Native buttons/links
  in results support Up/Down/Home/End; Up at the first returns to the query. Nested widgets handling
  their own keys with preventDefault keep that behavior; editable fields are not intercepted.
- Enter calls onSearch, submits the associated native form once, and focuses the results region
  so the query remains visible without retaining editing focus. Return false/preventDefault cancels
  submission and focus transfer. An IME confirmation Enter does not execute search.
- Search serializes exactly one named hidden input. Its two visible query inputs are unnamed;
  form/reset apply to one shared value even though the popup is portaled. Uncontrolled reset restores
  defaultValue; controlled reset is application-owned. SearchBar uses its ordinary named native input
  and native form submission. SearchBar does not itself move focus after submission.

Use standard Lists with native actions for suggestions or selectable Lists for selection workflows.
Autocomplete has a different selected-item/combobox contract; it remains a separate component.
Search does not implement asynchronous fetching, debouncing, filtering, result highlighting, browser
history, a combobox listbox, or Android predictive-back gestures.

## Motion and adaptation

Docked mode morphs the opaque bar from its actual measured rectangle to the expanded rectangle
(24px outer margins become 12px). Results reveal through opacity and scaleY/translation from
their top edge. The input/header does not fade or scale its text. Text position and icon-slot widths
share one bounded CSS progress value, including a centered persistent label. Its monotonic default
effects spring takes 200ms in both schemes so native text cannot overshoot its clipping boundary.
The registered progress belongs to the popup, keeping Base UI's lifecycle active even when the
source and expanded rectangles are identical. Static box edges supply the input base without
per-frame rounding noise or transition retargeting. Back and the source leading icon
crossfade with rotation; persistent trailing adornments fade and scale into their original positions.
On close, the header returns to
the original rectangle and surface color before the persistent bar becomes visible again; Base UI
transition completion coordinates the handoff, including keepMounted and controlled closes. It caps width at 720px and results height
so the combined view uses at most two-thirds of the viewport, or available space near an edge.
Results scroll internally. Compact/fullScreen mode morphs the measured bar rectangle to the viewport,
with a 72px header and contained round bar/results. Opening and closing use themed MD3 spring tokens
like the other components: slow spatial for full-screen geometry, default spatial for docked geometry,
and effects tokens for opacity.
CSS handles breakpoint changes without replacing the input or losing its query/focus.

A private hook captures anchor coordinates, dimensions and the originating surface color into
CSS custom properties, and updates them on resize/scroll. Opening waits for a layout measurement before Base UI mounts the
view, so the initial CSS state receives the actual bar rectangle. No JS animation loop, WAAPI, runtime CSS rule generation,
style-tag insertion or positioning dependency is added. All motion rules, state selectors and theme
roles are extracted at build time. Native input text metrics are measured with canvas to resolve
center/end alignment; a private inert, aria-hidden DOM picture carries the source adornments during
the transition without mounting their React trees twice. The picture has no duplicate IDs, named
form controls or focus targets. Keyboard dismissal retains the focus frame through exit and native
focus restoration; subsequent blur clears it. Reduced motion disables transitions/progress animation; forced
colors use system colors; Back mirrors in RTL. Geometry changes use ordinary CSS interpolation,
without velocity-preserving retargeting.

## Sources and limits

Reviewed on 2026-11-15:

- [Official Search specs](https://m3.material.io/components/search/specs),
  [guidelines](https://m3.material.io/components/search/guidelines),
  [accessibility](https://m3.material.io/components/search/accessibility): recommended Expressive
  contained style, 56px bar, typography/color roles, compact fullscreen and larger docked layouts,
  results separation, keyboard and focus behavior. The older divided style is intentionally absent.
- [Requested M3E reference](https://matraic.github.io/m3e/#/components/search.html),
  [SearchViewElement.ts at ea07174df53e40e723431fa7df2fa5d0e3a37ab1](https://github.com/matraic/m3e/blob/ea07174df53e40e723431fa7df2fa5d0e3a37ab1/packages/web/src/search/SearchViewElement.ts),
  and its SearchBar/View styles: visual/motion reference for docked scaling, persistent query,
  round contained surfaces and fullscreen rectangle expansion. Original React/CSS implementation;
  no upstream source copied and no M3E dependency. The reference's JS/WAAPI animation is replaced
  with precompiled CSS and the library's existing spring.
- [Base UI Dialog](https://base-ui.com/react/components/dialog) and
  [Input](https://base-ui.com/react/components/input), installed @base-ui/react 1.9.0: interaction
  primitives, rather than coupling freeform search to Autocomplete's selected-value API.

Tests cover production Next RSC/streaming, Storybook, public types, native forms/IME/reset,
controlled/uncontrolled values, keyboard/focus/dismissal, retained state, nested combobox,
responsive geometry/CSS interpolation, themes/containers, RTL, reduced motion and accessibility.
Chromium is verified; other engines and pixel parity with Figma or Android are not claimed.

Search handoff and dismissal reviewed again on 2026-11-25 against the official
[guidelines](https://m3.material.io/components/search/guidelines),
[specifications](https://m3.material.io/components/search/specs) and
[accessibility guidance](https://m3.material.io/components/search/accessibility), rendered in Chromium.
Contained search retains a rounded, persistent bar; activating an entry point opens focused search;
Back releases input focus and dismisses suggestions/results. The web adaptation retains keyboard
focus for accessible modal return, while pointer dismissal ends editing. Keyboard reactivation
never leaves an editable query disconnected from its expanded view. Standalone SearchBar retains
its independent native-input contract. No exact Figma/Android motion parity is claimed.

Regression tests sample opaque headers and measured source/target geometry during docked and
full-screen opening/closing, including wide bars, nested dark themes, and focus return. They also
cover pointer deactivation, keyboard activation without submission, first-character preservation,
paste, committed IME composition, and retained content.

Header content motion was reviewed on 2026-11-25 against the same official guidance and
[AndroidX SearchBar.kt at 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SearchBar.kt).
AndroidX provides a reference for interpolated search geometry and input offsets. The icon
rotation/crossfade and inert adornment picture are web adaptations, not a prescribed Google
choreography; no upstream source was copied. Regression tests inspect intermediate icon/text
positions, final alignment before handoff, and every rendered focus frame across Escape dismissal.
Additional tests observe natural animation frames in both motion schemes, equal-width surfaces and
RTL without advancing or finishing animations. They check native text bounds, return timing and
continuity at unmount, plus pointer, keyboard and IME reactivation during exit. Native text metrics
use the input's border box with each padding/border removed once; its editing-area clientWidth is
not treated as a second border box.
