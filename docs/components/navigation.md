# Navigation bar, rail and drawer

`NavigationBar`, `NavigationRail`, `NavigationDrawer` and their shared `NavigationItem` implement
primary destination navigation. Import the roots from the package root or `/navigation-bar`,
`/navigation-rail`, `/navigation-drawer`; each family entry also exports NavigationItem and its types.
Each family and ThemeProvider load their precompiled CSS automatically.

```tsx
import { NavigationBar, NavigationItem } from '@flaut-travel/react-md3e/navigation-bar';

<NavigationBar aria-label="Main destinations" defaultValue="home">
  <NavigationItem value="home" icon={<HomeIcon />} selectedIcon={<FilledHomeIcon />}>
    Home
  </NavigationItem>
  <NavigationItem value="saved" icon={<SavedIcon />}>
    Saved
  </NavigationItem>
  <NavigationItem value="account" icon={<AccountIcon />}>
    Account
  </NavigationItem>
</NavigationBar>;
```

## Selection and destination semantics

Every root requires a nonempty `aria-label` or `aria-labelledby`. `value`, `defaultValue` and
`onChange(event, value)` support controlled/uncontrolled string or number values; null means no
current destination. With neither value supplied, selection starts empty. Prefer an explicit
initial value for the current route. Activating the current item does not deselect it or notify
again. Changes can be canceled by returning false or newly preventing the native event. Preventing
the item's own click also cancels selection. Filtering a destination does not clear its value.

Alternatively, supply `selected` on items without `value` to let the router own current-route
presentation. Types reject combining the two selection contracts on one item. Unique values and
the application’s routing policy belong to the consumer.

NavigationItem uses a native button by default and always has type=button. `href` renders a native
anchor; `component` supports compatible router components that forward native props and refs.
Links keep native context menus, Enter activation, downloads and new-tab behavior. Modified clicks,
download links and non-self targets do not change current-destination state in the original page.
Canceled root selection also prevents link navigation. Disabled links have no href and leave the
Tab order. Disabled buttons use Base UI Button semantics.

Navigation is a named navigation landmark; the current item has `aria-current="page"`. These are
destinations, without tab/panel, listbox or toggle semantics. Tab visits each enabled item. Rail and
drawer additionally support Up/Down and Home/End, skipping disabled items, wrapping at the ends and
moving focus without selection. Space/Enter activate buttons; links preserve native Enter behavior
and native Space scrolling. Arrow reveal scrolls only the owning navigation container.

`label` takes precedence over inline children. `icon`, `selectedIcon` and `badge` provide decorative
icon and consumer-owned status slots. If there is no visible label, supply an accessible name;
official guidance recommends short visible labels for all destinations. Keep slots noninteractive.
The ordinary inline label supplies the accessible text; a separate aria-hidden visual copy is used
for stacked labels so cross-fading does not announce the destination twice. Badge content can supply
additional accessible text; the separate Badge component's indicator is decorative, so include its
meaning in the item's name when appropriate with automatically loaded Badge CSS.
`disableRipple` keeps focus feedback. Native attributes, className, style and element refs are supported.

## NavigationBar

| Prop         | Default / behavior                                     |
| ------------ | ------------------------------------------------------ |
| variant      | flexible; baseline retains the taller Material You bar |
| iconPosition | auto; top stacks labels, start places them inline      |
| position     | static; fixed/sticky pin to the logical bottom edge    |

The flexible container is 64px high before the safe-area inset. Vertical items use a 56×32px pill,
24px icons, 4px indicator-to-label gap, labelMedium and 6px top/bottom space. Horizontal items use
40px pills, 20px inline padding, 4px icon-label gap and 12px top/bottom space. Vertical targets divide
the available width; horizontal items hug their content and are centered with 8px outer item insets.
Bar labels stay on one line; native horizontal overflow preserves long authored labels rather than
silently inserting ellipses. Use short labels and the recommended 3–5 destinations.

The baseline bar is 80px high, with 64×32px pills, 12px top/16px bottom spacing and an onSurface,
bold selected label. It always uses vertical items. Flexible selected labels use secondary when
stacked and onSecondaryContainer when inline. Both use secondaryContainer indicators,
onSecondaryContainer active icons, onSurfaceVariant inactive content and surfaceContainer surfaces.

Auto uses a native media query generated through createBreakpointQueries from the default theme’s
sm=600px breakpoint. Runtime breakpoint-variable overrides do not rewrite that compiled condition;
explicitly control iconPosition when the application has different responsive rules. No client
media/style observer is installed. Fixed/sticky positioning is opt-in, with safe-area bottom padding.

## NavigationRail

```tsx
<NavigationRail
  id="main-rail"
  aria-label="Main destinations"
  expanded={expanded}
  value={destination}
  onChange={(_event, next) => setDestination(next)}
  header={
    <IconButton
      aria-label="Toggle navigation"
      aria-controls="main-rail"
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      <MenuIcon />
    </IconButton>
  }
>
  <NavigationItem value="home" icon={<HomeIcon />}>
    Home
  </NavigationItem>
  <NavigationItem value="saved" icon={<SavedIcon />}>
    Saved
  </NavigationItem>
</NavigationRail>
```

The expressive appearance defaults to a 96px collapsed rail and a 220–360px expanded rail whose
width hugs its contents. An ancestor `--md-navigation-rail-expanded-width` can choose an explicit
width within those limits. Standard expansion is controlled by `expanded`, keeping the same DOM,
selection and focus. Native intrinsic-size interpolation animates width without an observer.
Expanded labels can wrap and increase row height. Wrapping is enabled after expansion settles so
words stay on one line during the reveal. Type is never shrunk and labels are not replaced with
ellipses. Use short one-word labels, or an
intentional line break when needed.

Collapsed rows have a 64px minimum height and 4px between items, 56×32px indicators, 24px icons,
labelMedium, 4px indicator-label gap and secondary selected labels. Expanded rows have a 56px
minimum height, labelLarge, 8px icon-label gap, onSecondaryContainer selected labels and 20px outer
item insets; icons start at 36px. `indicator="content"` (default) hugs icon/label/status;
`fullWidth` fills the width inside those insets. Collapsed targets span the rail; expanded content
targets hug their pills, so the unused row space neither highlights nor activates a destination.
The same expansion progress moves the outer inset from target padding to margin, keeping icons
and stacked labels anchored. Shared navigation defaults use zero-specificity selectors so loading
another family's CSS later cannot reset those insets or alignment. Badges move
from the upper icon corner to after the inline label, with an 8px web spacing adaptation.

Top padding is 44px, bottom padding 8px. Optional header/footer accept application controls; the
header has 8px between controls and 40px before destinations. Its 4px menu-button inset centers this
library's 48px interactive target on the destination icons. Embedded FABs use level-0 elevation,
or level 1 on hover. Compose ExtendedFab with
`extended={expanded}` if desired. `alignment` is start (default), center or end, applying to the
destination block while the header stays above it. Give the rail a bounded parent height to fill.
Default standard surfaces use AndroidX's surface role; `--md-navigation-rail-container-color` can
apply the official optional surfaceContainer fill.

`appearance="baseline"` keeps the Material You 80px rail, 56px minimum targets, 4px block padding
and bold onSurface selected labels. It cannot expand. `hideWhenCollapsed` hides a standard expressive
rail when expanded is false; keep a menu trigger available elsewhere in that composition.

`variant="modal"` renders a hidden-when-closed expanded rail. It uses open/defaultOpen and the modal
contract below; expanded is not a separate modal state. Its surface is surfaceContainer, inward
corners are 16px and elevation is level 2. A persistent collapsed rail behind a modal can be composed
by the application with shared controlled selection. Automatic responsive rail/drawer replacement
is application layout policy and is not inferred from viewport observers.

## NavigationDrawer and modal contract

Google retains navigation drawer as a baseline component and recommends expanded rail after the
Expressive update. This library preserves that distinction.

```tsx
<NavigationDrawer
  aria-label="Mail navigation"
  trigger={<Button>Open navigation</Button>}
  header="Mail"
  defaultValue="inbox"
>
  <NavigationItem value="inbox" icon={<InboxIcon />} badge="24">
    Inbox
  </NavigationItem>
  <NavigationItem value="outbox" icon={<OutboxIcon />}>
    Outbox
  </NavigationItem>
</NavigationDrawer>
```

Drawer variant is modal by default; standard renders inline on the server, without a dialog or
focus trap. Both use 360px width, 16px logical end corners, 12px outer row insets, full-width 336×56px
indicators at the default width, 16px internal insets, 24px icons, 12px icon-label gaps and labelLarge.
Header typography is titleSmall; the 56px minimum header slot, 12px block padding and optional footer
are explicit web composition defaults. Standard surfaces use surface; modal surfaces use
surfaceContainerLow and level-1 elevation. Short trailing badge labels align after the item label.
Other sections/headings/dividers can be composed as children; import their family CSS separately.

Modal drawer/rail use Base UI Drawer for portals, focus containment/restoration, scroll locking,
outside/Escape dismissal, swipe dismissal and exit retention. A named dialog contains the named
navigation landmark. They open from logical start, including inherited RTL. The 32% scrim retains
at least 56px on small viewports. Modal width variables must be inherited by the portal host;
ordinary style/ref props apply to the nav inside the dialog.

Shared modal props: open/defaultOpen, trigger, onOpenChange(open,event),
onOpenChangeComplete(open), onClose(event,reason), keepMounted, disableEscapeKeyDown, disableSwipe,
container, initialFocus and finalFocus. Return false or newly prevent an event to cancel dismissal.
Triggers must forward props/ref. Focus targets accept booleans or HTMLElement refs. Modal bodies
mount after hydration inside the nearest CSS theme/portal scope. Selection persists outside the
portal lifecycle; keepMounted additionally preserves child input state. Closing after navigation
and moving focus to a destination heading are application responsibilities, because only the
application knows when its routed content is ready. A controlled header/footer close button can
update open directly.

## Motion, architecture and verification

Server layout modules and typed extracted style objects remain server-compatible. The shared
NavigationSelection boundary owns selection state; NavigationItem owns Base UI Button/native link
events and ripple. NavigationPanel is the Base UI modal adapter shared by drawer and rail. No theme
context, style insertion, animation solver, or new dependency is added. Each public CSS entry
contains shared navigation/item/ripple presentation; compiler and theme generator code stays out
of the UI graph. The package root has no client directive.

Rail width, row geometry and label reveal use inherited default spatial springs. A registered CSS
number shares that progress with the label phases: stacked opacity falls to zero at progress 0.5,
then inline opacity rises, using AndroidX's quadratic `4 × (progress − 0.5)²` and logical label offset.
Indicators on bar
and rail grow from scaleX(0) to 1 with fast spatial; focused inline indicators use fast effects,
matching M3E's non-bouncing keyboard selection. Glyphs never scale. Drawer indicators fade without
stretching, as a baseline surface. State layers use 8% hover/10% focus/press. Other color/opacity transitions use fast
effects, scrims default effects. Modal entry uses default spatial; baseline drawer exit uses fast
effects, following AndroidX. Drawer reveal and swipe settling retain these inherited springs, but
registered private CSS progress/length properties project the rendered translation onto the legal
offscreen-to-open interval. This is a **web-specific spatial invariant**: an edge-attached drawer may
move outside its anchoring edge while entering/leaving, but must never move inward past its resting
edge and expose a temporary gap. For LTR the left edge stays at or left of viewport x=0; for RTL the
right edge stays at or right of the viewport right edge. The translation is additionally bounded by
the closed position. This projection does not disable expressive motion or change spring tokens on
other components. Reduced motion removes both private-property transitions; swipe tracking stays
direct while dragging and settles with the selected spring on release.

The shared masking viewport uses `overflow: clip` rather than `hidden`: clipping must not create a
programmatically scrollable ancestor that autofocus can shift to reveal offscreen RTL content.
The inner navigation body retains its own vertical scrolling. Modal rail width reveal remains
edge-anchored and keeps its existing spring overshoot on its **free inward edge**; that width growth
does not detach the fixed anchoring edge and is not prohibited by the drawer's translation contract.
Drawer and modal rail share the registered private swipe-length proxy. Rail swipe translation is
projected onto its directional offscreen-to-rest interval **after** spring interpolation, including
the starting/ending width-reveal states. This prevents the same attachment defect on a canceled
short swipe without clamping expressive rail width growth. `[NR-001]` records a physically displaced
rail immediately before touch release and checks the complete sampled spring return in both
directions/schemes and normal/reduced motion. Its independently declared 0.05px anchor tolerance
detects the observed 0.24px rail gap; it does not change other components' tolerances or imply a wide
visible strip at that subpixel magnitude.

The focus frame uses the reference’s 3→6→3px, 500ms ease emphasis:
inward with 12px corners for stacked items and outward around inline pills with a 2px resting gap. This explicit focus
choreography is independent of theme springs. Reduced motion disables transitions/ripple/pulse;
forced colors preserve current, disabled and focused states.

The official Guidelines 27 rail expansion recording was decoded in Chromium, with 60 requested
samples per second. Repeated decoded frames limit onset accuracy to about 33ms. At a fixed scanline
in an 800×689 canvas, the adjacent content boundary travels 181→317px, peaking at 319px. The measured
checkpoints and source URL are committed in navigation-rail/tests/navigation-motion.reference.json.
The browser test synchronizes actual CSSAnimation playheads to those elapsed times, compares the
normalized width trajectory for the expressive scheme and captures both schemes. Its 0.14 normalized
tolerance accounts for onset/frame cadence; this is trajectory evidence, not a pixel-parity claim.
The standard scheme is checked independently for endpoints and label/icon geometry.

Official rail Guidelines 32 (hidden modal), 27 (expansion), 30 (content gesture) and selection
recordings were inspected as contact sheets and intermediate frames. Storybook captures include
enabled/current, hover, focus, pressed, disabled, baseline, flexible/inline, expanded, RTL and modal
states. Measurements are compared with official dimension/state diagrams; source colors are mapped
through the consumer theme. Colocated browser tests cover SSR without JavaScript, streamed children,
native links, keyboard selection/focus, cancellation, refs, modal lifecycle, RTL, reduced motion,
forced colors, touch swipe/opt-out and automated accessibility. Coverage is Chromium.

Verification limits are separate from the implemented API:

- Inaccessible reference: Figma's community page returned HTTP 403 in the browser; its component
  nodes were not inspected.
- Visual differences: examples use independent sample SVGs and available browser fonts rather
  than Google's recording assets. Header/footer slots and viewport-safe dimensions are web
  composition defaults documented above. Pixel parity is not claimed.
- Unverified motion: sub-frame opacity, exact modal/selection kinetics, badge re-anchoring and
  variable-font/icon morphs have not been matched to an event-timestamped reference. Other browser
  engines and platform-native gestures remain unverified. Predictive back and velocity-preserving
  retargeting are not implemented.

Modal drawers slide; hidden modal rails reveal their width while their icons stay anchored,
following the official Guidelines 32 recording. Native intrinsic-size interpolation and wrapping
labels replace AndroidX's layout measurement code; modern `interpolate-size` support is required
for the intrinsic width transition. Rail label wrapping also requires native custom-property style queries.

The spatial regression `[ND-001]` records actual native bounding rectangles before entry and exit;
`[ND-002]` records interrupted and repeated transitions. Both assert component-specific attachment
and travel envelopes with the shared spatial utilities, paired geometry coverage and frame-gap
checks, across LTR/RTL, both motion schemes and desktop/compact sizes. The extended suite repeats
the same contracts with reduced motion. These recordings test the complete sampled trajectory,
not only computed transform or a final screenshot; they do not claim sub-frame sampling or Figma parity.

## Sources

Inspected 2026-11-23–24:

- Official Material 3 [rail specs](https://m3.material.io/components/navigation-rail/specs),
  [guidelines](https://m3.material.io/components/navigation-rail/guidelines),
  [accessibility](https://m3.material.io/components/navigation-rail/accessibility);
  [bar specs](https://m3.material.io/components/navigation-bar/specs),
  [guidelines](https://m3.material.io/components/navigation-bar/guidelines),
  [accessibility](https://m3.material.io/components/navigation-bar/accessibility);
  [drawer specs](https://m3.material.io/components/navigation-drawer/specs),
  [guidelines](https://m3.material.io/components/navigation-drawer/guidelines),
  [accessibility](https://m3.material.io/components/navigation-drawer/accessibility), rendered in Chromium,
  including expanded token tables and original full-resolution measurement/state diagrams.
- AndroidX revision `0fb269260ea4c1e7b27b58500699ab07cefdca83`:
  [WideNavigationRail.kt](https://github.com/androidx/androidx/blob/0fb269260ea4c1e7b27b58500699ab07cefdca83/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt),
  [NavigationRail.kt](https://github.com/androidx/androidx/blob/0fb269260ea4c1e7b27b58500699ab07cefdca83/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationRail.kt),
  [ShortNavigationBar.kt](https://github.com/androidx/androidx/blob/0fb269260ea4c1e7b27b58500699ab07cefdca83/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ShortNavigationBar.kt),
  [NavigationBar.kt](https://github.com/androidx/androidx/blob/0fb269260ea4c1e7b27b58500699ab07cefdca83/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt),
  [NavigationItem.kt](https://github.com/androidx/androidx/blob/0fb269260ea4c1e7b27b58500699ab07cefdca83/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationItem.kt),
  [NavigationDrawer.kt](https://github.com/androidx/androidx/blob/0fb269260ea4c1e7b27b58500699ab07cefdca83/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationDrawer.kt).
  Token files in the same revision’s tokens/ directory: NavigationBarTokens,
  NavigationBarHorizontalItemTokens, NavigationBarVerticalItemTokens, NavigationRailCollapsedTokens,
  NavigationRailExpandedTokens, NavigationRailColorTokens, NavigationRailHorizontalItemTokens,
  NavigationRailVerticalItemTokens, NavigationRailBaselineItemTokens (all v0_11_0), and
  NavigationDrawerTokens (v0_210). The newer official bar dimension diagram’s 20px inline inset takes
  precedence over AndroidX's 16px horizontal-item token.
- M3E revision `e8bf648be92ae30ca11f51645d4d9d0167730a5c`, used as an additional web reference;
  no separate reference was attached to this request:
  [NavRailElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/nav-rail/NavRailElement.ts),
  [NavBarElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/nav-bar/NavBarElement.ts),
  [NavItemElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/nav-bar/NavItemElement.ts),
  [SelectionIndicatorElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/core/shared/primitives/SelectionIndicatorElement.ts),
  [FocusRingElement.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/core/shared/primitives/FocusRingElement.ts),
  [DrawerContainerToken.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/drawer-container/styles/DrawerContainerToken.ts),
  [DrawerContainerStyle.ts](https://github.com/matraic/m3e/blob/e8bf648be92ae30ca11f51645d4d9d0167730a5c/packages/web/src/drawer-container/styles/DrawerContainerStyle.ts).
- [Base UI Button](https://base-ui.com/react/components/button),
  [Drawer](https://base-ui.com/react/components/drawer), installed 1.9.0 source and types.
- [Google’s Material 3 Figma kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit):
  access attempted and denied (403). No component implementation or icon source was copied;
  numerical measurements are independently adapted to static CSS and the existing motion tokens.

Spatial-constraint correction inspected 2026-11-28: the pinned AndroidX `NavigationDrawer.kt` above
uses `MotionSchemeKeyTokens.DefaultSpatial` for open and anchored drag settling and `FastEffects`
for close (lines 351–355 in that revision). Those mappings are preserved. The browser-specific
edge-attachment envelope and registered-property projection are explicitly our web adaptation;
no claim is made that Material prescribes this CSS mechanism or forbids all spring overshoot.
