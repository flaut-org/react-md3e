# Menu

Menu implements Material 3 Expressive vertical command menus. Load `/menu/styles.css` at the
route/composition boundary and `/theme/styles.css` once. All public parts and their own types are
available from the package root and `/menu`; Base UI remains an implementation detail.

MenuSurface and MenuItemContent are private, passive presentation shared with Autocomplete. They
own extracted surface/item styles and unfolding compensation; Menu retains its own interaction,
context, trigger/group/submenu styles and public API. Autocomplete uses the same presentation with
Combobox listbox semantics rather than mounting a Menu inside the text field.

```tsx
import { Button, Menu, MenuItem, MenuDivider, MenuSubmenu } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/menu/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';

<Menu trigger={<Button>Document actions</Button>}>
  <MenuItem leading="☆" trailing="⌘N">
    New document
  </MenuItem>
  <MenuItem href="/documents">Open documents</MenuItem>
  <MenuDivider />
  <MenuSubmenu label="Export">
    <MenuItem>PDF document</MenuItem>
    <MenuItem>Text document</MenuItem>
  </MenuSubmenu>
</Menu>;
```

This composition can be authored in an RSC. The trigger renders on the server; the portalled menu
content mounts in the browser after its theme/portal container is resolved. Event handlers and
controlled state belong in consumer client components. The trigger must be a native button or a
component forwarding button props and ref, such as Button/IconButton. Its content, handlers and ref
are retained without a second button wrapper. Native non-button triggers are rejected.

## Public API

Menu accepts `open`, `defaultOpen`, `onOpenChange(open,event)`, `onClose(event,reason)`, `disabled`,
`loopFocus` (default true), and `modal` (default true). Closing reasons are escapeKeyDown, clickAway,
triggerClick, focusOut, itemClick, tabKeyDown and programmatic. Returning false or newly preventing
the native callback event cancels a request. Direct controlled prop updates do not synthesize events.

The popup is named by its trigger by default; aria-label/aria-labelledby can supply a separate name.
Native div attributes, ref, style and className apply to the popup. The menu owns its role.

`placement` defaults to bottom-start and accepts top/bottom/left/right, optionally suffixed
-start/-end. Start/end follow direction. `offset` defaults to 4px, `collisionPadding` to 8px and
`positionMethod` to fixed (absolute is available). `anchorEl` accepts an Element, ref, or callback
for separate geometry; the trigger retains focus and ARIA ownership. `container` accepts an
HTMLElement or callback. By default portals use their nearest CSS theme/portal scope. A custom
container uses that container's inherited theme. `finalFocus` accepts a boolean or HTMLElement ref.

`keepMounted` defaults to true so uncontrolled checkbox/radio selections survive closing. Set it
to false for disposable content and keep persistent selections in application-controlled state.
Hidden retained content is excluded from keyboard navigation and the accessibility tree.

- MenuItem performs one action and closes by default. `href`, target, rel and download provide a
  native anchor. `selected` marks an application-owned current destination visually; checkbox and
  radio parts provide setting-selection semantics.
- MenuCheckboxItem accepts checked/defaultChecked and `onChange(event,checked)`. It stays open by
  default for multiple selections.
- MenuRadioGroup accepts value/defaultValue (strings), disabled and `onChange(event,value)`.
  MenuRadioItem requires a string value and closes by default. Radio groups maintain independent
  selection. Both change callbacks support cancellation by false or newly preventing their event.
- All item kinds accept disabled, disableRipple, closeOnClick, textValue, leading, trailing and
  supportingText. Children contain the primary label. onClick receives a React event; false or
  preventDefault cancels activation and dismissal. textValue supplies typeahead text for custom
  JSX labels. Icons are decorative; supporting text is an accessible description and shortcuts do
  not replace or extend the primary accessible name. Content may wrap and grow.
- MenuGroup and MenuRadioGroup accept a visible label, or aria-label/aria-labelledby. MenuDivider
  is a nonfocusable semantic separator. Use dividers within a continuous surface, or `layout="grouped"`
  with direct MenuGroup/MenuRadioGroup children for separate surfaces with a transparent gap.
- MenuSubmenu accepts label, optional leading/textValue, disabled, controlled/uncontrolled open
  state and the same open/close callbacks. It inherits variant/density and can override them.
  Its popup accepts native div props/ref and the shared container/position/focus options. Submenus
  open at inline-end with collision handling; their arrow follows direction.

Menu items must perform one action. Do not put additional buttons, fields or switches inside an
item. Use Autocomplete for text filtering, Popover for arbitrary interactive content and Dialog for
a blocking task. Context-menu gestures, menubars, horizontal menus, baseline legacy styling and
automatic conversion to a bottom sheet are outside this public API. Applications can adapt to a
BottomSheet at their own breakpoints.

## Vertical menu with gap

`layout` is standard by default. `layout="grouped"` gives each direct MenuGroup/MenuRadioGroup its
own surface and inserts a fixed 2px transparent gap. The first group's top corners and last group's
bottom corners follow the active container shape; the inner group corners are small/8px. Each group
retains 4px content padding. A contour shadow follows the separate surfaces without filling the gap.
The groups share one menu's focus navigation and typeahead; a group is not an independent popup.
Submenus use their own standard layout by default and can opt into grouped separately.

```tsx
<Menu trigger={<Button>Vertical menu with gap</Button>} layout="grouped">
  <MenuGroup aria-label="Main actions">
    <MenuItem leading="◎">Item 1</MenuItem>
    <MenuItem leading="▣" trailing="⌘C">
      Item 2
    </MenuItem>
    <MenuItem leading="✎" selected>
      Item 3
    </MenuItem>
  </MenuGroup>
  <MenuGroup aria-label="More actions">
    <MenuSubmenu label="Item 4" leading="☁">
      <MenuItem>Send to device</MenuItem>
    </MenuSubmenu>
  </MenuGroup>
</Menu>
```

The Next `/menus` route and Storybook **Vertical menu with gap**, **Vibrant menu with gap** and
**Right to left with gap** show this composition. Visually selected command items retain their
leading icon; checkbox/radio items use a checkmark for their checked state.

The official guidelines describe gaps as an Android treatment and recommend dividers on web.
This web adaptation was explicitly requested with the supplied grouped-menu screenshot and video.
Prefer one or two gaps and short menus. Use standard layout and dividers for long scrolling menus;
grouped menus still scroll if the viewport becomes too small, preserving access to all commands.

## Expressive appearance and motion

The standard color style uses surfaceContainerLow, onSurface labels and onSurfaceVariant icons/
supporting text; selection uses tertiaryContainer/onTertiaryContainer. Vibrant uses
tertiaryContainer/onTertiaryContainer, with tertiary/onTertiary selection. Disabled labels/icons use
38% of the corresponding content color. Checked items add a checkmark in place of their leading
icon and change color and shape; selection never depends on color alone.

The container has 4px padding, 2px item spacing and level-3 elevation. Active corners are large/16px;
an inactive parent revealing a submenu morphs to small/8px when focus/pointer enters the child.
Items use extraSmall/4px inner corners, medium/12px selected corners and rounded outer edges.
Labels/trailing text use labelLarge (14/20), supporting text bodySmall (12/16), icons 20px,
horizontal insets 16px and element spacing 12px. This follows the rendered Expressive common token
table rather than the older baseline AndroidX menu geometry.

Default item targets are at least 48px, a web accessibility adaptation of the 44px visual height.
`density` is 0, -1, -2 or -3 (48/44/40/36px minimum height) for fine pointers. Coarse pointers retain
48px targets. Text wrapping can increase these heights. Width is 112–280px, constrained to the
available viewport; scrollable popups are capped at 480px and available height, with a thin scrollbar
and keyboard scrolling. CSS style can override sizing within the collision constraints.

Menus unfold vertically from the positioning anchor. Surface height and row spacing change while
text and icons retain their dimensions: each item body applies the inverse of the surface's vertical
scale. Group captions use the same compensation. A registered inherited CSS number keeps these
transforms synchronized without measuring text or generating rules in JavaScript. Scale is bounded
at 0.001–1.05, allowing the selected theme's subtle overshoot while preventing a flipped surface or
division by zero. Expansion and corner morphs use shared fast spatial springs; opacity/colors use
fast effects. This matches the token assignment in the pinned AndroidX Menu implementation and the
requested m3e reference. Base UI retains closing content until transitions finish. Reduced
motion disables finite transitions; forced colors preserve selection, focus rings and separators.
No runtime rule insertion, observer for styling or browser spring solver is added.

With the library's generated Expressive curve, expansion reaches 90% at approximately 83ms and first
crosses full height at 98ms. Its 421ms CSS duration includes the subsequent bounce and settling tail;
it is not the time spent expanding to full height. The slower default spatial spring would take
approximately 153ms to reach 90%. These numbers describe this library's zero-velocity CSS adaptation,
not fixed Menu durations mandated by Google. The selected theme can override both duration and easing.

## Unfolding reference analysis

Both requested Google recordings were decoded in Chromium at 60fps, including every frame:

| Reference                                                                                                                                                                  | Frames | Native dimensions | Duration | SHA-256                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- | -------- | ------------------------------------------------------------------ |
| [Guidelines 20](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlna20p-GM3_Menus_Guidelines%2020_IA_v02.mp4?alt=media) | 240    | 1004×924          | 4s       | `a4f313fc29998b71b9c6fbcbf9bd1b3617ce6c4f20a9cecf032105978eb9603e` |
| [Guidelines 22](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnelhq-GM3_Menus_Guidelines%2022_IA_v02.mp4?alt=media) | 315    | 1004×864          | 5.25s    | `73211a9dcf5b0f13e18a5665e8135c003c3650781eac835fc5ef5eabc372c39f` |

Guidelines 20 shows two aligned surfaces expanding together with a small gap. The outer menu
corners are larger than the corners adjoining the gap. Guidelines 22 shows the same vertical
unfolding on a continuous surface. Width stays fixed while row centers spread apart. Text fades
in at almost its settled size, rather than being vertically stretched with the whole popup.

For example, dark label-pixel runs in Guidelines 22 (native source pixels):

| Frame / time | Running text y / height | Walking text y / height | Difference in text centers |
| ------------ | ----------------------- | ----------------------- | -------------------------- |
| 64 / 1.067s  | 433 / 21                | 514 / 22                | 81.5px                     |
| 68 / 1.133s  | 440 / 20                | 533 / 22                | 94px                       |
| 90 / 1.500s  | 440 / 21                | 535 / 22                | 95.5px                     |

Measurements have pixel/antialiasing tolerance. Opening is visible around frames 57–58 and settles
around frame 80; closing around frames 133–138 fades and compresses back toward the anchor.
The recordings establish the unfolding geometry and enter/exit lifecycle, but do not identify a
spring token or mandate a fixed duration. The implementation uses fast spatial and fast effects,
as assigned by the pinned AndroidX source. The recordings' subtle settling does not establish that
the slower default spring should be substituted. Exact recording timing, Figma parity,
velocity-preserving physical springs and pixel-perfect video reproduction are not claimed.

## Interaction and accessibility

Base UI 1.9.0 Menu owns focus, typeahead, dismissal, pointer/touch behavior and submenu safe areas.
Enter/Space and Up/Down open the menu. Up/Down move focus, Home/End visit endpoints and text keys
perform typeahead. Disabled commands can receive focus but cannot activate, following official
Material accessibility guidance. Enter/Space select a command, Escape closes the active level and
returns focus appropriately, and Tab dismisses the menu. Commands within a submenu close the whole
tree. Horizontal arrows open/close submenus and reverse in RTL. Hover can open submenus; the root
opens through its button. Outside press/focus dismiss subject to the controlled/cancellation contract.

The default modal menu blocks outside pointer actions and locks desktop page scrolling while open.
`modal={false}` permits normal outside interaction. Nested menus and menus inside dialogs retain
the Base UI popup tree, so Escape dismisses the active menu before its parent dialog. Portals inherit
CSS variables without a client theme provider. ThemeProvider remains RSC-compatible.

## Sources and verification

Read on 2026-11-20:

- Official rendered [overview](https://m3.material.io/components/menus/overview),
  [specs](https://m3.material.io/components/menus/specs),
  [guidelines](https://m3.material.io/components/menus/guidelines) and
  [accessibility](https://m3.material.io/components/menus/accessibility), including the expanded
  Menus – Common token table. The living reference identifies the November 2025 Expressive update.
- AndroidX [MenuTokens.kt](https://github.com/androidx/androidx/blob/33b3d2d28722bf91670634ab0e707192330de497/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MenuTokens.kt),
  v0_210, inspected to distinguish the baseline corner/elevation/color mappings from Expressive.
- AndroidX [Menu.kt](https://github.com/androidx/androidx/blob/33b3d2d28722bf91670634ab0e707192330de497/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Menu.kt#L1827-L1839),
  at the same revision, explicitly assigns FastSpatial/FastEffects to both menu popup paths.
  Its uniform 0.8–1 scale is not copied: this component keeps the requested recording's vertical
  unfolding and unchanged glyph dimensions while following the official spring-token assignment.
- The requested [m3e Autocomplete reference](https://matraic.github.io/m3e/#/components/autocomplete.html)
  and its related [Menu examples](https://matraic.github.io/m3e/components/menu.html).
  [MenuElement.ts](https://github.com/matraic/m3e/blob/54bb59c2a8270dd6fde905b68761d3e968cad81a/packages/web/src/menu/MenuElement.ts)
  and [MenuItemElementBase.ts](https://github.com/matraic/m3e/blob/54bb59c2a8270dd6fde905b68761d3e968cad81a/packages/web/src/menu/MenuItemElementBase.ts)
  informed the independent CSS adaptation. Official updated colors, spacing and 48px web targets
  take precedence over differences in that reference. No source implementation or icon was copied.
- [Base UI Menu](https://base-ui.com/react/components/menu) and the installed 1.9.0 source/types
  supply interaction primitives. Public conventions follow the library's existing Menu-independent
  Popover API and familiar MUI names where appropriate; no MUI dependency is introduced.
- Google's [Figma kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit)
  returned HTTP 403 during inspection. No Figma node inspection or pixel-perfect parity is claimed.

`/menus`, `/streaming` and Storybook Components/Menu consume the built package. Colocated browser
and type tests cover keyboard/typeahead, disabled items, cancelable state, native links, selection
persistence, nested/RTL menus, pointer paths, viewport scrolling, theme inheritance, dialogs and
accessibility preferences. Package checks verify extracted CSS dependency closure, client/server
boundaries and packed declaration consumers. Browser verification is Chromium.
