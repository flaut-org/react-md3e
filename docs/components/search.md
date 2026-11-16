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

Import both components/types from the root or `/search`. Import `/styles.css` once at the app root.
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
closing in either state mode. A restored bar receives focus without reopening; a new click/focus
opens it again. Leading content on the persistent bar is replaced by Back when expanded.

Base UI Dialog provides modal focus containment, scroll locking, nested overlays, Escape and
outside-press dismissal. Both layouts block the background. The bar stays in the server DOM;
results portal mounts after hydration (also with defaultOpen). keepMounted retains it hidden after
closing. Portal scope resolution matches Dialog/Popover, inheriting the enclosing theme without
client theme context. Custom hosts must preserve the desired theme and avoid clipping or changing
the fixed-position containing block through transforms/containment.

## Keyboard and forms

- Focus the persistent query or click the bar surface to open; initial focus moves to the expanded query.
- Back, Escape and scrim close with focus restored to the persistent input.
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

Docked mode expands the bar horizontally (24px outer margins become 12px), then reveals results
through opacity and scaleY/translation from their top edge. It caps width at 720px and results height
so the combined view uses at most two-thirds of the viewport, or available space near an edge.
Results scroll internally. Compact/fullScreen mode morphs the measured bar rectangle to the viewport,
with a 72px header and contained round bar/results. Both opening and closing use the same sampled
400ms Expressive spatial spring as the existing library; opacity uses short easing transitions.
CSS handles breakpoint changes without replacing the input or losing its query/focus.

A private hook measures only anchor coordinates and dimensions into CSS custom properties, and
updates them on resize/scroll. Opening waits for a layout measurement before Base UI mounts the
view, so the initial CSS state receives the actual bar rectangle. No JS animation loop, WAAPI, runtime CSS rule generation,
style-tag insertion or positioning dependency is added. All motion rules, state selectors and theme
roles are extracted at build time. Reduced motion disables transitions/progress animation; forced
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
