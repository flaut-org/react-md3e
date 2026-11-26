# List and ListItem

MD3 Expressive lists support non-interactive presentation, single/multiple actions, single/multiple
selection, and expandable rows. Standard and segmented are visual styles, independent of behavior.
Static lists render server-compatible ul/li; action, expansion and selection rows introduce client implementations. Theme colors,
typography, shapes, states, and motion are precompiled CSS.

```tsx
import { List, ListItem } from '@flaut-travel/react-md3e';

<List>
  <ListItem primary="Lisbon" secondary="Portugal" leading="L" leadingKind="avatar" />
  <ListItem primary="Saved journey" overline="Recently added" secondary="A weekend away" lines={3} />
</List>;
```

The `/list` entry also exports both components and their types. Supply a visible primary label via
primary or inline children. Give every selectable item a unique, stable, nonempty string value.

## Choosing the Base UI primitive

Google's current web accessibility spec requires selectable lists to use **listbox/option**, for
both single and multiple selection. Radio and checkbox use the shared private SelectionIndicator presentation; additional
interactive form controls must not be nested inside options. They are different platform roles in
the Android columns of Google's table.

The implementation adapts **Base UI ToggleGroup + Toggle** through their render API. This pair
provides single/multiple state, native press behavior, vertical roving focus, Home/End, looping and
disabled-item handling without requiring a popup or combobox input. The adapter replaces group/
pressed semantics with listbox, option and aria-selected, suppressing aria-pressed. A radio-style
single selection cannot be cleared by activating its selected item again.

RadioGroup/Radio and CheckboxGroup/Checkbox are appropriate for actual form-control groups, but
their native roles and keyboard behavior differ from this web listbox pattern. Select requires its
popup/positioner context, and Combobox uses input-based virtual focus. Neither is used as a fake
inline list. No Base UI internals are imported.

A small entry-focus adapter keeps one external tab stop on the first enabled selected option,
including after filtering or programmatic value changes. Base UI retains focus navigation while
inside the group. The adapter observes option state/tab-stop attributes, disconnects on unmount,
and neither reads styles nor uses private Base UI attributes/imports.

## Selection

```tsx
'use client';

import { useState } from 'react';
import { List, ListItem } from '@flaut-travel/react-md3e';

export function Currencies() {
  const [currency, setCurrency] = useState('EUR');

  return (
    <List
      selectionMode="single"
      value={currency}
      onValueChange={setCurrency}
      selectionIndicator="checkmark"
      aria-label="Currency"
    >
      <ListItem value="EUR" primary="Euro" secondary="EUR" leading="€" />
      <ListItem value="USD" primary="US dollar" secondary="USD" leading="$" />
    </List>
  );
}
```

| List prop                              | Values / contract                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| selectionMode                          | none (default), single, multiple                                                       |
| variant                                | segmented (default), standard; both use current Expressive tokens                      |
| disablePadding                         | Remove the default 8px web list block padding; default false                           |
| value / defaultValue                   | Single: string or null; multiple: readonly string array; omitted value is uncontrolled |
| onValueChange                          | Single: string; multiple: string array; no Base UI event details leak into the API     |
| selectionIndicator                     | Single: radio (default) or checkmark; multiple: checkbox                               |
| controlPosition                        | end (default), start                                                                   |
| disabled                               | Disable all options and remove them from keyboard navigation                           |
| readOnly                               | Keep selection visible and focusable, but reject changes                               |
| aria-label / aria-labelledby           | A nonempty accessible name is required for selectable lists                            |
| ref, className, style, native ul props | Apply to the ul root; ref is HTMLUListElement                                          |

The type union rejects values on static lists, mismatched single/multiple value shapes, and checkbox
visuals on single selection. Grouping labels and search fields belong outside the listbox; all its
items should be selectable ListItem rows with values. Do not mix static items into a selectable
listbox. A selected item can be temporarily filtered out without discarding its value.

selectionMode="none" has no row selection and can contain informational, action or expandable rows.
readOnly on a selectable list instead presents
locked selection with aria-readonly on the listbox. They have different semantics and server costs.

| ListItem prop                          | Behavior                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| primary / children                     | Inline primary label; primary takes precedence                                              |
| secondary, overline                    | Optional supporting text and overline                                                       |
| leading, leadingKind                   | Decorative leading slot; icon (default), avatar, image, video                               |
| trailing, trailingKind                 | Trailing text (default) or decorative icon                                                  |
| lines                                  | 1, 2, 3 minimum-height/alignment configuration; inferred from secondary/overline if omitted |
| value                                  | Opts the row into its parent selection group; required for selectable rows                  |
| disabled, readOnly                     | disabled restricts interactive rows; readOnly only applies to selection                     |
| disableRipple                          | Suppress press ripple without removing focus feedback                                       |
| textValue                              | Plain typeahead label for custom primary markup; ordinary text is inferred                  |
| divider                                | Optional decorative divider with 16px logical insets                                        |
| ref, className, style, native li props | Apply to the li surface; ref is HTMLLIElement                                               |
| action                                 | Native button props, or native anchor props with required href; primary action only         |
| leadingAction / trailingAction         | Independent interactive slots on action/expansion rows; never hidden from assistive tech    |
| expansion                              | Disclosure configuration; mutually exclusive with action and value                          |

Selected state comes from the parent value, not a second selected/checked prop on ListItem. The
interactive option is a native type=button inside a presentation li. Name/description ARIA props
on ListItem are forwarded to that option. Each row has one selection interaction; the indicator is
aria-hidden. Keep slots non-interactive and include any meaningful icon/image information in the
visible label or accessible name. Flags used solely as visual hints should be decorative.

List is an application selection component, not a native radio/checkbox form field. Read its
selected values through callbacks; form submission, validation and resetting application state stay
in the consumer. There is no automatic locale navigation, fetching, sorting, filtering, or currency
policy in the package. The examples demonstrate those composition boundaries.

## Single-action lists and navigation

```tsx
<List>
  <ListItem primary="Open journey" action={{ onClick: openJourney }} />
  <ListItem primary="Visit Lisbon" action={{ href: '/destinations/lisbon' }} />
  <ListItem primary="Unavailable journey" disabled action={{}} />
</List>
```

`action` makes the row's primary area a native button (default `type="button"`) or anchor.
The whole row is the target when supplementary slots are absent. Clicking, pressing Enter/Space
or navigating never sets `aria-selected`, `aria-pressed`, or a persistent selected appearance.
Links retain native destinations, targets, downloads and modified-click behavior. Disabled links
lose their href and tab stop, announce `role="link"`/`aria-disabled`, and reject primary/auxiliary clicks.
Space also activates enabled primary links, as required by Material's action-list keyboard guidance.

Put action handlers and action-element refs in `action`. ListItem's existing DOM props and ref still
belong to its li. Native li events bubble normally; an li `onClick` is not the primary-action API.
The row's `aria-label`, `aria-labelledby` and `aria-describedby` describe the primary action; values
inside `action` take precedence. Visible primary and supporting text supply the default accessible name.
Decorative content in primary/secondary/leading/trailing must contain no nested interactive elements.

## Multi-action lists

```tsx
<List>
  <ListItem
    primary="Weekend in Lisbon"
    secondary="Open details or save independently"
    action={{ href: '/journeys/lisbon' }}
    trailingAction={
      <IconButton variant="standard" aria-label="Save Lisbon" onClick={saveJourney}>
        {bookmarkIcon}
      </IconButton>
    }
  />
  <ListItem
    primary="Travel guide"
    action={{ onClick: openGuide }}
    leadingAction={<Checkbox aria-label="Keep guide offline" />}
    trailingAction={<Switch aria-label="Guide notifications" />}
  />
</List>
```

Supplementary controls are DOM siblings of the primary button/link, each owning its own focus,
ripple and state layer. They never trigger `action.onClick`; no stopPropagation workaround is needed.
The existing decorative slots keep their semantics, including aria-hidden leading visuals. Use
`leadingAction`/`trailingAction` for IconButton, Checkbox, Switch, Radio within RadioGroup, and other
independently named native controls. A control's checked state belongs to that control, not to the row.
Use a selection List with decorative indicators when the whole row selects a list value instead.

The primary content remains the largest area. Supplementary wrappers reserve at least 48×48px;
their contents must preserve that minimum target and their own accessible name.
IconButton targets stretch to their row's height, following the official measurements guidance;
their themed icon/container presentation stays owned by IconButton. Row `disabled`
disables the primary action and makes supplementary areas inert. Disabled appearance of supplied
controls remains consumer-owned: pass their `disabled` prop too. Arbitrary expanded content is not
disabled by disabling its disclosure trigger.

The supplementary slot distributes its existing 16px inline padding budget evenly: 8px on each
side of the control, preserving slot width and label placement. This centers the control's hit target
and circular hover/ripple surface between the primary action and the row edge, including in RTL.
Previously the full budget was on the outside edge, leaving a 16px/0px split. The main action keeps
its row-shaped state layer; IconButton and Checkbox keep their own independent state-layer shapes.
This padding split is a web composition decision for the library's 48px control targets, based on the
[official common List measurements](https://m3.material.io/components/lists/specs)
(16px insets, 12px gaps); it is not a separate Material slot-padding token or Figma parity claim.

Tab enters the first enabled action. Arrows traverse enabled actions in DOM order: Down/Right go
forward, Up/Left go backward, with wrapping. Home/End reach the boundaries. Native Tab exits the
action group; after leaving, its entry returns to the first available action. Leading controls
precede the primary action, and trailing controls follow it. The keyboard controller registers
through client rows, so List itself and static rows retain their server boundary. It handles
streamed/removed/disabled controls and disconnects when the last action row unmounts.

Control-specific keyboard handlers take precedence. RadioGroup keeps its WAI-ARIA arrow/selection
contract; Checkbox/Switch keep their native activation keys rather than receiving synthetic Enter
toggles. Inputs, text editing, modified keys and consumer-prevented events are left to their owners.
This is an explicit web adaptation of Material's general action-key table, not a second selection model.

## Expand and collapse

```tsx
<List>
  <ListItem
    primary="European trips"
    expansion={{
      defaultOpen: true,
      content: (
        <List aria-label="Countries">
          <ListItem primary="Portugal" expansion={{ content: <p>Lisbon and Porto</p> }} />
        </List>
      ),
    }}
  />
</List>
```

For controlled expansion, use `expansion={{ open, onOpenChange: setOpen, content }}`. No new public
component or root List mode is needed. `value`, `action` and `expansion` are mutually exclusive
in the ListItem type union. Runtime selection context rejects action/disclosure rows inside a listbox.

| expansion field | Contract                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- |
| content         | Required arbitrary React content, including nested List and form controls                          |
| open            | Controlled boolean; takes precedence over defaultOpen                                              |
| defaultOpen     | Initial uncontrolled state; defaults to false                                                      |
| onOpenChange    | `(open: boolean, event: Event) => void \| boolean`; return false or newly preventDefault to cancel |
| keepMounted     | Keep content/state in the DOM after closing; defaults to false                                     |
| panelProps      | Native div props/ref for the panel, including optional id, role and accessible labels              |

Base UI Collapsible owns state, trigger/panel association, measured height and exit lifecycle.
The trigger has stable SSR/hydration IDs, `aria-expanded` and `aria-controls`. The native li encloses
both the action header and panel, preserving valid list markup. The indicator is decorative; its
chevron rotates while its round background changes with expansion. Opening never selects the row.
The expanded surface uses large corners, including in standard lists.

Hidden and closing panels are immediately inert and aria-hidden, including with keepMounted;
closed content cannot receive keyboard focus. Default unmounting resets child state. Use keepMounted
at each ancestor when nested expansion or form state must survive closing. Multiple siblings may
open independently: Material specifies no web single-open group policy. Nested lists own their own
arrow-navigation groups; Tab enters revealed controls in document order. A panel has no implicit
region role, preventing excessive landmarks in deep nesting; consumers can name a region via panelProps.

Height uses the existing default spatial spring; corner/chevron changes use fast spatial and color
uses fast effects. CSS handles reduced motion, RTL layout and forced colors. No spring solver,
style insertion, new dependency or client theme context enters the UI graph.

### Expand tokens and web adaptations

The rendered official specs page's `design-system-data` was inspected on 2026-11-26: system
`designSystems/20543ce18892f7d9`, dsdb **41.1.12**, system revision **7989** (2026-05-27),
token set `md.comp.list.expand`, revision **d34f**. These are token-dataset revisions, not an
AndroidX or Figma revision. References below retain the exact token suffixes:

| `md.comp.list.expand.` suffix                     | Official reference             |
| ------------------------------------------------- | ------------------------------ |
| expanded.list-item.container.color                | md.sys.color.surface           |
| expanded.list-item.segmented.container.color      | md.sys.color.surface           |
| collapsed.list-item.trailing-icon.container.color | md.sys.color.surface           |
| expanded.list-item.trailing-icon.container.color  | md.sys.color.surface-container |
| collapsed.list-item.trailing-icon.icon.color      | md.sys.color.on-surface        |
| expanded.list-item.trailing-icon.icon.color       | md.sys.color.on-surface        |
| container.shape                                   | md.sys.shape.corner.large      |
| trailing-icon.shape                               | md.sys.shape.corner.full       |

CSS uses these system roles, and component color/shape overrides use their kebab-case
`--md-comp-list-expand-*` names. Icon colors stay onSurface in both states; disabled foregrounds
use the common List treatment. Expanded segmented and standard surfaces share surface.

The expand set supplies color/shape, but no separate spacing, icon-size or motion tokens. The row
keeps common List insets (16px inline/10px block), the List glyph size (20px), and the existing small
IconButton visual-container size (40px) for the noninteractive indicator. Panel content reuses common
List insets; nested List removes redundant block padding. These dimensions and default/fast spring
choices are documented web composition decisions, not invented expand-token values.

Google illustrates a parent-child container transform extending across the screen. This library
implements an inline vertical disclosure within the allocated List width. Full-screen scene
transitions and exact frame parity with Google's video/Figma kit are not implemented or claimed.
This remains a List extension, sharing its layout, surface, corner tokens and state presentation;
it is not styled as an independent Accordion.

## Appearance and interaction

Current ListTokens 29.0.0 use surface for item containers and secondaryContainer/onSecondaryContainer
for selected rows. Other primary text uses onSurface, supporting/overline/trailing text and icons
use onSurfaceVariant. Disabled foregrounds use onSurface at 38%; disabled surfaces and state layers
follow the pinned tokens. Shapes and type roles inherit the nearest CSS theme, including nested
light/dark/system scopes.

| Measurement                                 | Current default                                          |
| ------------------------------------------- | -------------------------------------------------------- |
| Minimum one/two/three-line height           | 56 / 72 / 88px                                           |
| Inline / block inset                        | 16 / 10px                                                |
| Content gaps / segment gap                  | 12 / 2px                                                 |
| Segmented corners                           | 4px inner, 16px outer; selected rows use 16px all around |
| Standard corners                            | Rectangular unselected, 16px selected                    |
| Expressive icon / avatar                    | 20 / 40px                                                |
| Image / small video                         | 56×56 / 100×56px; themed small (8px) corners             |
| Label / supporting / overline+trailing type | bodyLarge / bodyMedium / labelSmall                      |

Three-line rows align content to the top. Text can wrap and increase height; it is not silently
clipped or measured by JavaScript. The whole selectable row exceeds the 48px minimum target.
Selection is indicated by shape, color, and a radio dot, checkbox tick or checkmark.

Tab enters a selected option, or the first enabled option when nothing is selected. Up/Down move
focus; Home/End jump to the first/last enabled option; Space/Enter commit selection. Arrows do not
change the value on their own. Typing finds primary labels, with accent-insensitive prefix matching
and repeated-character cycling. Native Tab leaves the group; disabled options are skipped.

Hover/press state layers and an inset focus ring use compiled CSS. The existing private ripple
controller is shared with Button; geometry/lifetime work inserts no CSS rules. Shape transitions use
the sampled Expressive fast spatial spring. Reduced motion disables ripple/transitions; forced
colors retain selected contrast and visible focus. Modern :has() support is required alongside the
existing light-dark/color-mix/linear support contract.

## Reuse and boundaries

List/ListItem wrappers, their nested static implementations, shared SelectionIndicator, and ListItemContent presentation
remain server modules. ActionListItem, SelectableList and SelectableListItem are client boundaries for interaction,
with an interaction-only context. ThemeProvider remains a server CSS scope.

Menu and Autocomplete reuse the private content layout, slots, typography and token helpers.
Their adapters retain their own menuitem/option, highlighting, popup and keyboard
semantics; nesting this listbox inside a menu or autocomplete list is not the reuse mechanism.
Swiping (Android Views only), tree/select-all selection and virtualization are outside this slice.

The Next fixture provides /lists, including a responsive two-column language/currency Dialog with
independent values and a currency filter. Storybook includes Components/List, Components/ListItem,
and Examples/Language and currency. Both consumers include single actions, navigation, multiple
actions, expansion, nested expansion and controlled expansion. These examples use local data; Flaut has not been migrated.

## Provenance and verification

Read on 2026-11-15:

- [MD3 Lists specs](https://m3.material.io/components/lists/specs), including the expanded common
  token table, [guidelines](https://m3.material.io/components/lists/guidelines), and
  [accessibility](https://m3.material.io/components/lists/accessibility), rendered in a browser.
- [AndroidX ListTokens.kt revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ListTokens.kt),
  version 29.0.0; CheckboxTokens.kt, RadioButtonTokens.kt and ListItem.kt at the same revision.
  Current selected secondary-container roles take precedence over older baseline diagrams.
- [Base UI ToggleGroup](https://base-ui.com/react/components/toggle-group),
  [Toggle render API](https://base-ui.com/react/components/toggle), and installed 1.9.0 source.

Rechecked on 2026-11-26:

- All three official MD3 List pages above rendered in Chromium, including their embedded expand
  token dataset. The [specs mirror](https://www.getbook.com/en/book/material-design-3/components/lists/specs)
  was checked as a fallback; the official rendered page/data remains authoritative.
- [Material Web List](https://material-web.dev/components/list/): native button/link behavior and
  configurable item semantics. Its baseline styling does not override current Expressive tokens.
- [Google's Android Views List guidance](https://github.com/material-components/material-components-android/blob/master/docs/components/List.md)
  (master as read on that date), for anatomy, minimum targets and state-layer context; no Android API/source copied.
- [Base UI Collapsible](https://base-ui.com/react/components/collapsible) and installed 1.9.0 public API,
  [WAI-ARIA Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).
- [Google Material Icons keyboard_arrow_down SVG, revision d3d4aca5a7cf50bc68bbd401cefa708e364194e8](https://github.com/google/material-design-icons/blob/d3d4aca5a7cf50bc68bbd401cefa708e364194e8/src/hardware/keyboard_arrow_down/materialicons/24px.svg).
  Path coordinates are normalized, the empty viewport path is omitted, and List CSS supplies size,
  color and motion. Apache 2.0 attribution and license are included with the package.

The follow-up audit covers the requested action/disclosure functionality. It does not certify full
MD3 visual parity: the full-screen container transform, Figma frame comparison and engines other
than Chromium remain unverified/unimplemented as described above. The repository has no committed
pixel-baseline comparison infrastructure; browser tests attach new-state screenshots and assert
theme colors, shapes, focus, layout and reduced-motion values instead of claiming screenshot parity.

Measurements are independently adapted to CSS px/rem. No MUI/AndroidX implementation source was
copied; Figma parity is not claimed. Checks cover NodeNext/Bundler declarations, static modules
under react-server, pre-hydration HTML, streaming, real Next/Storybook builds, keyboard interaction,
controlled/uncontrolled selection, filtering, ripple, themes, RTL and automated accessibility in
Chromium.

The standalone [Checkbox](checkbox.md) and [Radio/RadioGroup](radio.md) own form semantics. List
reuses their decorative indicator without creating form controls. Use [Avatar](avatar.md) in an
avatar leading slot (`leading={<Avatar>AB</Avatar>}`, `leadingKind="avatar"`); plain text in that slot
is also wrapped in Avatar. List only reserves the default 40px slot.
