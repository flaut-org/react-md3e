# Floating action buttons

`Fab`, `ExtendedFab`, `FabMenu` and its `FabMenuItem` actions implement the Material 3 Expressive
floating action family. Import from the root or `/fab`, `/extended-fab` and `/fab-menu`. Load each
used family's `/styles.css` entry at its composition boundary; dependencies are included.

```tsx
<Fab aria-label="Create document"><AddIcon /></Fab>
<ExtendedFab startIcon={<EditIcon />}>Compose</ExtendedFab>
<FabMenu label="Create" closeLabel="Close create menu" icon={<AddIcon />}>
  <FabMenuItem icon={<DocumentIcon />}>Document</FabMenuItem>
  <FabMenuItem icon={<FolderIcon />}>Folder</FabMenuItem>
</FabMenu>
```

## Buttons

| Component/size                  | Container | Icon | Corner | Label         | Extended inset / icon gap |
| ------------------------------- | --------- | ---- | ------ | ------------- | ------------------------- |
| Fab small (legacy)              | 40px      | 24px | 12px   | —             | —                         |
| Fab regular / ExtendedFab small | 56px      | 24px | 16px   | titleMedium   | 16px / 8px                |
| medium                          | 80px      | 28px | 20px   | titleLarge    | 26px / 12px               |
| large                           | 96px      | 36px | 28px   | headlineSmall | 28px / 16px               |

Fab defaults to `regular`; ExtendedFab defaults to `small`. These are the current MD3 names:
the legacy 40px Fab `small` is retained explicitly but is no longer recommended. The old baseline
extended FAB's labelLarge typography is superseded by small/titleMedium. The large icon uses the
current specification's 36px, correcting the older AndroidX token's 32px TODO.

`color` is primaryContainer (default), secondaryContainer, tertiaryContainer, primary, secondary,
tertiary or legacy surface. Container names are explicit and are not aliases for tone colors.
`lowered` changes resting/hover elevation from 3/4 to 1/2. Focus and press retain resting elevation;
the rounded rectangle does not morph on press. Disabled styling, native refs/forms, `href`,
target/rel/download and ripple reuse Button. Fab requires aria-label or aria-labelledby; its icon
is decorative. Tooltip composes separately. Applications own placement and scroll behavior.
Use one primary floating action per screen, normally at the bottom trailing edge with 16px margins
(24px on larger windows). FAB menus group related actions rather than primary navigation.

ExtendedFab takes a text label and optional `startIcon`. `extended={false}` requires an icon and
keeps the accessible name while collapsing to the matching Fab size. Plain string labels supply
that name; complex labels need aria-label/aria-labelledby when collapsed. Intrinsic width,
padding and label opacity interpolate with CSS; there is no DOM measurement or runtime styling.
The minimum width matches the container height, including for short text-only labels.
The leading icon area centers SVG and text/font icons at the size-specific icon size; collapsed
buttons keep equal leading and trailing insets in both directions.

## FAB menu

FabMenu owns its toggle, accepts 2–6 flat FabMenuItem actions (fragments/conditional items allowed),
and opens above its trailing edge. It accepts regular/medium/large and primary/secondary/tertiary.
The closed button uses the family container role; opening changes it to a 56px circular close
button with the tone role and 20px close icon. The close button shares the original FAB's **top
trailing corner**, including for larger sizes. The layout reserves the original button's size.

Items hug their content, with 56px minimum height, 24px leading/trailing insets, 24px icons,
titleMedium labels, 8px icon gaps, full corners and 4px between items. The button/item gap is 8px.
RTL mirrors alignment and icon placement. Long labels can wrap rather than truncate. The viewport
constrains and scrolls the popup; the close button stays outside its scrolling area.

This API intentionally adapts native floating-pill presentation to the web. Official web guidance
uses FAB + Menu; this implementation composes the existing Menu and MenuItem, retaining their
menu/menuitem semantics, keyboard navigation, typeahead, outside/Escape/Tab dismissal, canceled
activation and focus restoration. Pointer opening initially focuses Menu; keyboard opening selects
an item. It does not copy Android's initial focus on the close button. Native web Menu styling can
also be composed directly with Fab as its trigger.

`open`, `defaultOpen`, `onOpenChange` and `onClose` follow Menu's cancelable native-event contract.
`label` names the closed toggle and popup; `closeLabel` (default "Close menu") names the expanded
toggle. `fabProps` supplies native button props/ref and disableRipple; the toggle always has
type="button". `menuProps` supplies remaining popup options, including naming, container, offset,
collision padding, keepMounted, modal and finalFocus. Native div props/ref apply to the wrapper.
Actions use FabMenuItem's native link and cancelable onClick support, not nested menus or settings
controls. Item disabled state and disableRipple remain independently available.
Disabled items remain discoverable by keyboard and cannot activate, following Menu's behavior.

## Motion and boundaries

Button size/shape and icon changes use fast spatial springs; color/opacity use fast effects.
Each menu item's intrinsic width expands from its trailing edge; the content is clipped rather
than scaled, so glyphs retain their dimensions. Stagger thresholds are computed **at build time**
from the AndroidX slow-effects visibility counter and emitted for the finite 2–6 item cases. They
reference the shared slow-effects duration. Opening reveals bottom to top; closing reverses this
order. Popup visibility retains the DOM through the last item exit because Base UI observes the
popup's own transition lifecycle. All finite transitions honor reduced motion. Forced colors retain
button/item boundaries and focus. No UI spring solver, style insertion or mandatory provider is added.

Fab/ExtendedFab and the shared private FabButton are passive server-compatible wrappers around
Button's existing client boundary. FabMenu owns actual open state and is a client entry; its item
wrapper stays passive and delegates to MenuItem. Root exports remain server importable.

## Sources

Read/rendered in Chromium on 2026-11-23:

- Official FAB [overview](https://m3.material.io/components/floating-action-button/overview),
  [specs](https://m3.material.io/components/floating-action-button/specs),
  [guidelines](https://m3.material.io/components/floating-action-button/guidelines),
  [accessibility](https://m3.material.io/components/floating-action-button/accessibility).
- Official Extended FAB [overview](https://m3.material.io/components/extended-fab/overview),
  [specs](https://m3.material.io/components/extended-fab/specs),
  [guidelines](https://m3.material.io/components/extended-fab/guidelines).
- The official [Extended FAB measurement illustration](https://lh3.googleusercontent.com/9IwzFk5XDN4m9vzImfQxg0mR1AtQJ86eAkPH3xC5h2GPFNLw5Wqd0VWHGgMOUOSFF32Iv3M3ypdaXDq9lJRUf9xBuZXQcPS3iw7oWPLa3zqV_A=s0)
  verifies 8/12/16px icon-label gaps, rather than the older generated token values 8/16/20px.
- Official FAB Menu [overview](https://m3.material.io/components/fab-menu/overview),
  [specs](https://m3.material.io/components/fab-menu/specs),
  [guidelines](https://m3.material.io/components/fab-menu/guidelines),
  [accessibility](https://m3.material.io/components/fab-menu/accessibility).
- AndroidX [FloatingActionButton.kt](https://github.com/androidx/androidx/blob/33b3d2d28722bf91670634ab0e707192330de497/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingActionButton.kt),
  [FloatingActionButtonMenu.kt](https://github.com/androidx/androidx/blob/33b3d2d28722bf91670634ab0e707192330de497/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingActionButtonMenu.kt)
  and FAB/ExtendedFab/FabMenu token tables (v0_14_0) at that revision. Numerical data and semantic
  motion assignments informed the independent CSS implementation.
- [m3e FAB](https://matraic.github.io/m3e/components/fab.html) and
  [FAB Menu](https://matraic.github.io/m3e/components/fab-menu.html), source revision
  [54bb59c2a8270dd6fde905b68761d3e968cad81a](https://github.com/matraic/m3e/tree/54bb59c2a8270dd6fde905b68761d3e968cad81a/packages/web/src).
  Official measurements and Kotlin corrections of stale generated gap/icon tokens take precedence
  over differing m3e values (including its large 20px icon gap). No m3e/AndroidX implementation or icon source was copied.

See [Button](button.md), [Menu](menu.md) and [motion](../motion.md) for reused behavior, provenance,
Figma access and sampled-spring limitations. Exact Figma/video parity, physical velocity
preservation and untested browsers are not claimed.

Colocated behavior/type checks exercise native forms/links/refs, current size and color tokens,
controlled cancellation, repeated/interrupted opening, keyboard focus, typeahead, RTL, dark portals,
viewport scrolling, reduced motion, forced colors, RSC and streaming. Motion samples cover both
schemes and verify unscaled glyphs and complete exits. Open-popup axe checks exclude Base UI's
visually hidden focus sentinels, whose purpose is to redirect Tab immediately. Package checks verify
CSS dependency closure, passive wrappers and absence of a UI spring solver. Browser evidence is
limited to Chromium; intrinsic-width interpolation uses the browser's `interpolate-size` support.
