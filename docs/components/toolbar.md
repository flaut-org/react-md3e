# Toolbar

Toolbar implements MD3 Expressive docked and floating action panels. Import `Toolbar` and
`ToolbarOverflow` from the root or `/toolbar`. CSS loads automatically; `/toolbar/styles.css`
is the compatibility entry. It is independent of AppBar and does not add MUI's AppBar spacer.
Existing AppBar APIs are unchanged. The library has no separate BottomAppBar API to migrate.

```tsx
import { Toolbar, IconButton, Divider, Button, Fab } from '@flaut-travel/react-md3e';

<Toolbar aria-label="Document actions" primaryAction={<Button>Publish</Button>}>
  <IconButton variant="standard" aria-label="Undo">
    ↶
  </IconButton>
  <Divider orientation="vertical" flexItem />
  <Button variant="text">Preview</Button>
</Toolbar>;

<Toolbar
  variant="floating"
  color="vibrant"
  orientation="vertical"
  aria-label="Canvas tools"
  fab={<Fab aria-label="Create">+</Fab>}
>
  <IconButton variant="standard" aria-label="Draw">
    D
  </IconButton>
  <IconButton variant="tonal" selected aria-label="Select">
    S
  </IconButton>
</Toolbar>;
```

## API and composition

| Prop                                | Values and behavior                                                                                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`                           | `docked` (default), `floating`                                                                                                                                       |
| `color`                             | `standard` (default), `vibrant`; MD3 color roles, independent of the theme generation algorithm                                                                      |
| `orientation`                       | Horizontal by default; vertical is floating-only                                                                                                                     |
| `children`, `leading`, `trailing`   | Arbitrary ReactNode composition; no extraction or cloning of child props                                                                                             |
| `primaryAction`                     | Persistent embedded action. With this slot, children join the leading region. Docked layouts center the primary action between equal-width leading/trailing columns. |
| `fab`, `fabPosition`                | Floating-only, separate existing Fab and logical `start`/`end` placement (default end). Use Fab's regular size to enable its 56→80px expansion.                      |
| `fullWidth`                         | Docked-only; true by default. Floating panels always size to their content and available space.                                                                      |
| `shape`, `dense`                    | Docked-only; square (default) or rounded, regular 64px or compact 48px container with 48px targets                                                                   |
| `align`                             | `start`, `center`, `end`, `space-between`, `responsive`. Docked defaults to responsive; floating defaults to center.                                                 |
| `elevation`                         | Floating-only, 0–3, default 3 from the Android/MD3 floating container token                                                                                          |
| `position`                          | `static` by default, `sticky`, `fixed`, `absolute`                                                                                                                   |
| `placement`                         | `bottom` by default, `top`, `start`, `end`; affects positioned panels and exit direction                                                                             |
| `expanded`, `defaultExpanded`       | Floating-only controlled/initial expansion; initial default true                                                                                                     |
| `onExpandedChange(expanded, event)` | Observes scroll/focus expansion requests; return false to cancel. The application owns controlled state.                                                             |
| `scrollBehavior`                    | `none` (default), `hide`, floating-only `collapse`                                                                                                                   |
| `scrollTarget`                      | Element/window or resolver returning either after hydration. Defaults to nearest vertically scrolling ancestor, then window.                                         |
| `scrollThreshold`                   | Positive finite directional distance, default 40px from AndroidX                                                                                                     |
| `keyboardNavigation`, `loopFocus`   | Both true by default. False navigation renders a passive named `group` with ordinary native tab order.                                                               |
| Native props/ref                    | Div attributes, accessible name, `dir`, className, style, event handlers and outer placement-frame ref                                                               |

Supply a nonempty `aria-label` or `aria-labelledby`. Both TypeScript variants reject incompatible
docked/floating props. Runtime validation also rejects vertical docked panels, invalid thresholds
and collapsed/collapse-on-scroll panels without a persistent primary action or FAB.

For viewport overlays use `position="fixed"`. For editor/panel overlays use `position="absolute"`
inside a positioned parent. Use static docked panels in documents, tables and editor layouts.
Sticky top/bottom placement follows native CSS sticky rules. Horizontal floating panels leave 16px and vertical panels 24px around
their containing block and account for top/bottom safe areas. CSS max sizes prevent their surface
from filling the viewport; constrained vertical surfaces scroll locally. Extremely small parents
must still accommodate an accessible 48px control plus padding. The application owns overlap
between multiple overlays, z-index coordination and space reserved for fixed docked panels.

Docked regions wrap when necessary. A container query uses the theme's build-time `sm` breakpoint
(600px by default) for evenly distributed compact layouts, with centered content at larger widths.
Changing runtime breakpoint variables cannot move a compiled query threshold. Explicit alignment
and ordinary CSS composition remain available. MD3 guidelines explicitly allow smaller toolbars with extra-small controls in limited vertical space,
and rounded in-page docked toolbars on web/large screens. Dense 48px geometry and 16px corners are
web choices using existing target and shape tokens; the guidelines do not prescribe these exact values.

## Scoped colors and tokens

No global theme token is remapped. The Toolbar scope supplies component-specific CSS properties
consumed by the existing Button, IconButton, Divider and Fab styles. State layers/ripples continue
to use each control's current content color, with existing 8% hover, 10% focus/press and 38%
disabled content. Disabled filled backgrounds and forced-color behavior retain those components'
existing rules. Focus indicators remain visible and use the inherited theme's secondary role.

| Element                   | Standard                                  | Vibrant                                 |
| ------------------------- | ----------------------------------------- | --------------------------------------- |
| Container                 | surfaceContainer                          | primaryContainer                        |
| Standard icon/text button | primary                                   | onPrimaryContainer                      |
| Filled action             | primary / onPrimary                       | primary / onPrimary                     |
| Tonal/toggle, unselected  | Transparent / primary                     | Transparent / onPrimaryContainer        |
| Tonal/toggle, selected    | secondaryContainer / onSecondaryContainer | surfaceContainer / onSurface            |
| Divider                   | outlineVariant                            | outlineVariant                          |
| Adjacent FAB              | secondaryContainer / onSecondaryContainer | tertiaryContainer / onTertiaryContainer |

Outlined/elevated buttons retain their own variant roles; controls such as TextField, Checkbox,
Switch, Slider, SegmentedButton and custom components retain their own presentation and semantics.
ButtonGroup's Button children inherit the same local button roles. There is no Select API in the
library; native select or an application-owned select works through arbitrary children. Menu and
Tooltip remain the existing implementations. There is no toolbar-specific duplicate of a control.

These override points are CSS custom properties, scoped through ordinary CSS/className/style:

| Property (`--md-comp-toolbar-` prefix)               | Default                                              |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `container-color`, `content-color`                   | Color roles above                                    |
| `selected-container-color`, `selected-content-color` | Selected roles above                                 |
| `fab-container-color`, `fab-content-color`           | FAB roles above                                      |
| `container-size`                                     | 64px                                                 |
| `docked-container-padding`                           | 16px inline                                          |
| `floating-container-padding`                         | 8px                                                  |
| `item-spacing`                                       | 4px floating/group spacing                           |
| `docked-item-spacing`                                | 8px, the centered docked configuration               |
| `external-margin`                                    | 16px floating                                        |
| `floating-fab-between-space`                         | 8px                                                  |
| `docked-container-shape`                             | 0px                                                  |
| `floating-container-shape`                           | full corner token                                    |
| `container-shadow`                                   | Shared elevation level 3 shadow at default elevation |

Integration adds optional `--md-comp-button-{text-color,tonal-container-color,tonal-color,
tonal-selected-container-color,tonal-selected-color,filled-unselected-container-color,
filled-unselected-color}` and equivalent `--md-comp-icon-button-*` variables, including
`standard-selected-color`. Divider reads `--md-comp-divider-color`. FAB reads
`--md-comp-fab-{container-color,color,container-size,container-shape,elevation,hover-elevation}`. Standalone fallbacks retain
their previous values. Toolbar uses 56px/large corners for the regular adjacent FAB while expanded,
80px/large-increased while collapsed; shared Fab owns its interaction and disabled behavior. Adjacent toolbar FABs use elevation 2,
hover 3 from the pinned AndroidX toolbar FAB helpers; standalone FAB defaults remain 3/4.
The 20px collapsed corner uses the existing medium FAB shape as a web adaptation.
Its outer frame reserves the maximum cross-axis size to avoid shifting static neighboring content.

All roles reference the current CSS theme, including light/dark, source-color palettes, custom
roles and contrast levels. No client color calculations or theme provider hooks are involved.

## Overflow

```tsx
<Toolbar variant="floating" aria-label="Document commands">
  <ToolbarOverflow
    label="More commands"
    actions={[
      {
        id: 'share',
        priority: 2,
        control: (
          <Button variant="text" onClick={share}>
            Share
          </Button>
        ),
        menuItem: <MenuItem onClick={share}>Share</MenuItem>,
      },
    ]}
  />
</Toolbar>
```

Each action has a unique stable `id`, a `control` ReactNode and an explicitly authored `menuItem`
ReactElement. MenuCheckboxItem/MenuRadioItem are valid representations. `overflow` is `auto`
(default), `always` or `never`; higher numeric priority remains visible longer. Declaration order
breaks ties and controls visual order. The application shares state and event handlers between the
two representations; uncontrolled state is not copied from one React tree into another.

ResizeObserver observes both available space and action sizes. A stable intrinsic size prevents
feedback loops when controls leave layout, and a reserved 48px trigger slot prevents jumps when
the menu becomes necessary. Removed actions never remain in the menu. Hidden controls remain
mounted for measurement but are inert and aria-hidden, so there is one accessible representation.
The existing Menu owns popup keyboard navigation, portal focus, dismissal and activation.
Never-overflow actions retain local scrolling when even they cannot fit. Keyboard focus reveals
controls within local scroll areas without scrolling page ancestors. Arbitrary children outside
ToolbarOverflow are not automatically converted to menu items. Keep the default interactive toolbar
when composing automatic overflow; passive groups are intended for native tab order/static content.

## Expansion, scrolling and focus

Collapse hides the secondary regions; an embedded primary action or separate FAB remains available.
The component does not infer an action from unknown children or convert the primary action into a
toggle. A controlled application can give that action `aria-expanded` and its own expand handler.
Uncontrolled expansion reacts to scroll direction; reverse scrolling reveals the secondary actions.
`hide` and `collapse` are mutually exclusive scroll modes. Programmatic scrolling also follows the
chosen target. The default threshold accumulates distance within one direction, avoiding jitter.

Automatic changes pause while focus is inside the panel or its trigger has an open popup.
Uncontrolled collapsed panels reveal their secondary actions when keyboard/assistive focus enters
the surviving action; this adapts AndroidX accessibility expansion to web focus. Controlled owners
provide an explicit expand action when they keep the panel collapsed. Explicit
controlled collapse transfers focus to the surviving primary action/FAB before marking secondary
content inert. Hidden panels become inert immediately. Focused dynamic removals choose the next
enabled control, the preceding control, then the empty root. Detached actions do not accumulate in
the focus controller. A menu owns its own portal focus; applications should avoid externally
collapsing an arbitrary custom popup that has not implemented dismissal when its trigger disappears.

Base UI Toolbar supplies the interactive root and semantics. A DOM focus adapter supports native
and custom ReactNode descendants without forcing them through wrappers or adding public Base UI
props to Button/TextField. It maintains one remembered tab stop, skips disabled/inert/hidden
controls, and extends navigation with Home/End. Horizontal arrows respect computed RTL; vertical
arrows use Up/Down. Tab/Shift+Tab leave the group. Text inputs, native selects, contenteditable,
comboboxes, sliders and spinbuttons retain all their own editing keys. Mark custom widgets with
`data-md3-toolbar-arrow-keys="native"` when their semantics are not represented by a native/ARIA
editing role. WAI-ARIA recommends placing an arrow-consuming field last; Tab then exits naturally.

Finite size/translation/corner transitions use existing fast spatial spring tokens; opacity uses
fast effects. There is no UI spring solver or animation loop. Inert updates precede exit animation;
visibility changes after the effects transition. Reduced motion disables these transitions. CSS
intrinsic-size interpolation is the web adaptation; native velocity-preserving retargeting is not
claimed. Fixed/absolute floating panels do not participate in main-content layout.

## Server boundaries and distribution

Toolbar's implementation file is server-compatible and owns native layout, slots and compiled CSS.
The default keyboard behavior adds the private ToolbarBehavior client boundary around the already
server-created composition. Scroll subscriptions and controlled/uncontrolled state live there.
`keyboardNavigation={false}` with no scroll or controlled behavior renders a native named group
without a ToolbarBehavior instance. Interactive children keep their own client boundaries.
ToolbarOverflow is a separate client component for measurement and Menu state. ThemeProvider
remains a CSS-only server scope. SSR markup uses deterministic expansion state and makes initially
collapsed regions inert before hydration. Framework-specific code stays in the Next fixture.

Vite preserves client directives, emits ordinary CSS and a separate CSS-free native Node graph.
The root barrel has no stylesheet import. The explicit toolbar CSS closure includes composition
dependencies for Fab and Divider plus the Overflow/Menu/IconButton branch. A Button-only consumer
does not load Toolbar CSS or JavaScript. No runtime dependency was added.

## Sources, visual review and limits

Read on 2026-11-26:

- Official MD3 [overview](https://m3.material.io/components/toolbars/overview),
  [specs](https://m3.material.io/components/toolbars/specs),
  [guidelines](https://m3.material.io/components/toolbars/guidelines) and
  [accessibility](https://m3.material.io/components/toolbars/accessibility).
  Chromium rendered the client-only specs, including its color-role lists and measurement diagrams.
  The supplied [specs mirror](https://www.getbook.com/en/book/material-design-3/components/toolbars/specs)
  was also checked; its floating measurements image confirms 64px, 8px ends, 4px gaps, 56px FAB and 8px FAB separation.
- Android Material Components revision `ca5b9e4ca22b23adc8f50e178f267793ac741ca4`:
  [docked/floating overview](https://github.com/material-components/material-components-android/blob/ca5b9e4ca22b23adc8f50e178f267793ac741ca4/docs/components/DockedFloatingToolbars.md),
  [DockedToolbar](https://github.com/material-components/material-components-android/blob/ca5b9e4ca22b23adc8f50e178f267793ac741ca4/docs/components/DockedToolbar.md),
  [FloatingToolbar](https://github.com/material-components/material-components-android/blob/ca5b9e4ca22b23adc8f50e178f267793ac741ca4/docs/components/FloatingToolbar.md),
  token sets v34.0.0 in [docked tokens](https://github.com/material-components/material-components-android/blob/ca5b9e4ca22b23adc8f50e178f267793ac741ca4/lib/java/com/google/android/material/dockedtoolbar/res/values/tokens.xml),
  [floating tokens](https://github.com/material-components/material-components-android/blob/ca5b9e4ca22b23adc8f50e178f267793ac741ca4/lib/java/com/google/android/material/floatingtoolbar/res/values/tokens.xml),
  [standard colors](https://github.com/material-components/material-components-android/blob/ca5b9e4ca22b23adc8f50e178f267793ac741ca4/lib/java/com/google/android/material/resources/res/values/standard_toolbar_tokens.xml),
  [vibrant colors](https://github.com/material-components/material-components-android/blob/ca5b9e4ca22b23adc8f50e178f267793ac741ca4/lib/java/com/google/android/material/resources/res/values/vibrant_toolbar_tokens.xml).
- AndroidX revision `1b7fa70578d3045e52d699228a6c9e4d6490cb87`:
  [FloatingToolbar.kt](https://github.com/androidx/androidx/blob/1b7fa70578d3045e52d699228a6c9e4d6490cb87/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingToolbar.kt)
  for fast spatial motion, 40px scroll threshold, primary-action collapse, logical FAB placement and
  56→80px FAB sizing. [Compose guidance](https://developer.android.com/develop/ui/compose/components/floating-toolbar)
  distinguishes collapse from whole-panel hiding. AndroidX currently defaults plain floating elevation
  to 0 and with-FAB to 1, while the Android token is level 3; this API uses level 3 with explicit 0–3 override. Its standard FAB container currently uses
  primaryContainer; this library follows the MD3 FAB table, secondaryContainer for Standard,
  tertiaryContainer for Vibrant.
- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) for keyboard grouping;
  [MUI Toolbar API](https://mui.com/material-ui/api/toolbar/) for children/native props/ref conventions only.

The MD3 specs color diagram names primary for standard non-selected standard buttons; Android's
v34 overlay instead uses onSurfaceVariant. This implementation follows the MD3 diagram for that
role and the shared selection roles for tonal toggles. Divider retains its existing outlineVariant
role because the toolbar sets do not provide a different divider token. Explicit
placement, overflow priority policy, focus adapters, threshold-based hiding, dense/rounded docked
configuration and CSS shadows are documented web decisions, not copied Android runtime behavior.
No Android/MUI source implementation was copied.

Google's kit is file `069YnUCbHFX6TEmu4G6aLS`, Toolbars page `58295:22726`. MCP listed its page on
2026-11-26, then rejected the subtree read because the Starter account quota was exhausted.
Figma dimensions and pixel parity are **unverified**. Browser measurements, computed role/state
colors, source diagrams and locally rendered light/vibrant/vertical/collapsed-FAB captures provide
the visual evidence. Toolbar captures are review artifacts, while numerical geometry and interaction
assertions are regression tests. The [shared UI quality workflow](../testing/ui-quality.md) now provides
screenshot comparisons and baseline review; its initial baseline inventory covers other components.
Screen-reader user testing, Safari/Firefox and pixel comparison of every official Figma state
remain unverified. The component is not labeled fully visually verified.

Owner tests cover server rendering/validation, overflow distribution, public union types, native
refs/attributes, Chromium geometry and colors, custom/dynamic themes, disabled states, roving focus,
editing keys, RTL, expansion, focus restoration, parent resizing and dynamic controls, nested/window
scrolling, reduced motion, forced colors, hydration/streaming and axe. Next RSC examples live at
`/toolbars`, `/toolbars/server` and `/streaming`; Storybook covers the public configurations.

Validation on 2026-11-26: `npm run check` passed, including formatting, package build, lint,
both consumer type-resolution modes, package/native Node/directive/source-map checks, Next
Turbopack and Webpack production builds, Vite and Storybook builds, 44 unit tests, 14 HTTP tests
under each Next bundler, 5 release-tooling tests, and 449 Chromium tests under each Next bundler.
Toolbar contributes 5 owner unit tests and 25 browser scenarios, including axe and rendered review
captures. Actual Flight references confirm that `/toolbars/server` adds no library client modules.
The existing Vite Button/Checkbox root and subpath consumers both contain 37,958 CSS bytes and
244,169 JavaScript bytes; their CSS excludes Toolbar. These checks do not establish Figma parity.
