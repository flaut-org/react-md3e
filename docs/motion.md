# Motion schemes

`createTheme({ motionScheme: 'expressive' | 'standard' })` selects the official MD3 motion scheme.
The default is expressive. This setting is independent of `variant`, which selects the color palette
algorithm. Standard is a restrained spring scheme, not the legacy duration/easing motion system.

```tsx
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({ sourceColor: '#9a91e0', motionScheme: 'standard' });

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Button>Continue</Button>
      {children}
    </ThemeProvider>
  );
}
```

Call createTheme on the server or in build scripts. ThemeProvider stays a plain CSS scope without
hooks, React context, observers, or an animation runtime. `themeToCss` exports motion alongside the
other theme tokens, so custom motion schemes can be delivered entirely as static CSS. Importing a
component never imports the spring sampler or color generator.

## Six springs per scheme

Each scheme has fast, default, and slow spatial/effects springs. Spatial springs animate position,
size, scale, corner radii, and shape morphing. Effects springs animate color, opacity, and elevation
without overshoot. Effects parameters are identical in both official schemes.

| Spring          | Expressive damping / stiffness | Standard damping / stiffness | Expressive / standard duration |
| --------------- | ------------------------------ | ---------------------------- | ------------------------------ |
| fast spatial    | 0.6 / 800                      | 0.9 / 1400                   | 350 / 350ms                    |
| default spatial | 0.8 / 380                      | 0.9 / 700                    | 500 / 500ms                    |
| slow spatial    | 0.8 / 200                      | 0.9 / 300                    | 650 / 750ms                    |
| fast effects    | 1 / 3800                       | 1 / 3800                     | 150 / 150ms                    |
| default effects | 1 / 1600                       | 1 / 1600                     | 200 / 200ms                    |
| slow effects    | 1 / 800                        | 1 / 800                      | 300 / 300ms                    |

Durations and the sampled easing generator follow the pinned m3e web reference below. They replace
our previous 0.001-settling-time conversion; the AndroidX physical parameters are unchanged.

`theme.motion.fast.spatial`, for example, exposes damping, stiffness, duration in milliseconds, and a
precomputed CSS easing string. The entire motion object is immutable and JSON-serializable.
Expressive fast spatial has a visible bounce; standard spatial can have a very small overshoot.

## CSS tokens and overrides

Every spring exports four CSS variables. For fast spatial:

```css
.component {
  transition:
    transform var(--md-sys-motion-spring-fast-spatial-duration) var(--md-sys-motion-spring-fast-spatial-easing),
    opacity var(--md-sys-motion-spring-fast-effects-duration) var(--md-sys-motion-spring-fast-effects-easing);
}
```

The corresponding `-damping` and `-stiffness` variables record the physical parameters. CSS does not
solve springs from these numbers: the browser uses `-duration` and `-easing`. Overriding metadata
alone does not recalculate a curve. Change the preset through createTheme, or override the actual
CSS duration/easing together for a deliberate custom transition.

Nested ThemeProviders reset all motion tokens to the default expressive scheme unless supplied a
different theme. Portals mounted inside their theme scope inherit motion, just like colors and
breakpoint widths. A custom portal container outside that scope uses the container's theme.
An inline `theme` takes precedence over stylesheet declarations; use generated theme CSS when you
want the normal stylesheet cascade to control overrides. Updating a client-rendered ThemeProvider
selects already-computed CSS values without generating rules or solving springs in the browser.

## Component mapping

- AppBar directly follows native scroll position through measured height/offset variables. Partial
  positions settle with default spatial springs for container height, label insets and typography;
  surface/elevation changes use fast effects. Reduced motion disables settling. A new scroll reads
  the rendered pose before retargeting; no JavaScript frame loop or velocity-based fling is added.

- NavigationRail width, row geometry and label reveal use default spatial; bar/rail selection uses
  fast spatial, with fast effects for focused inline selection. Drawer indicator surfaces fade without
  stretching. Modal navigation entry uses default spatial, baseline drawer exit fast effects, and
  scrims default effects. The shared 500ms focus emphasis matches the inspected M3E focus primitive.
  Drawer entry animates a registered reveal progress with that spatial spring; its rendered translation
  clamps progress to 0–1 so an edge-bound sheet never detaches from its viewport edge. Swipe displacement
  follows the primitive directly while dragging and settles with the selected spring on release.
  This spatial constraint is a web adaptation, not a
  replacement for expressive springs or a prohibition on overshoot in other components. Modal rail
  width retains its spring overshoot while its start edge stays anchored.
  Native intrinsic-size interpolation keeps glyphs unscaled. See [Navigation](components/navigation.md)
  for synchronized frames and the official recording’s measured width trajectory and timing limits.

- Tabs indicator position and width use fast spatial springs; text/state layers use fast effects.
  Scroll reveal uses immediate local scrolling and never moves page ancestors. The keyboard focus
  frame has a separate recording-calibrated 500ms ease pulse (3px → 6px → 3px), keeping its outer
  edges fixed. This explicit reference choreography is shared by both schemes; reduced motion
  retains a static 3px frame. See [Tabs](components/tabs.md).

- SplitButton corner morphs and its reused Menu use the inherited fast springs. The prescribed
  chevron rotation always uses standard fast spatial, scoped through the shared spring CSS tokens
  on that icon. It is sampled at build time, mirrors inward in RTL and respects reduced motion.
  See [SplitButton](components/split-button.md).

- Menu and Autocomplete unfolding, plus Menu active/inactive corners, use fast spatial; opacity/colors
  use fast effects. An inherited scale is bounded at 0.001–1.05; inverse transforms on item bodies
  keep glyphs and icons at their natural size while surfaces and row centers expand. Grouped surfaces
  share the same progress. CSS owns enter/exit and Base UI retains exiting content. See the frame
  analysis in [Menu](components/menu.md).

- Slider handle thickness and value labels use fast spatial; colors use fast effects.
  Current values position tracks and handles directly during input, without a JavaScript spring.
  Handle-facing track corners stay fixed at the bounds. Value labels grow from their handle-facing
  edge, clamp the scale to 0–1 and defer hiding until the closing spring finishes; interrupted
  animations reverse the same CSSAnimation from its current playhead. See the frame analysis in [Slider](components/slider.md).

- Buttons, IconButton, ButtonGroup, list item shapes, snackbar movement and small popups use fast spatial.
- Switch handle position and press/selection size use fast spatial; pointer dragging follows input
  directly and settles through CSS on release. Track/handle/icon colors and state layers use fast effects.
- Dialog transforms, Collapsible height, Shape morphing, sheet movement and docked Search use default spatial.
- Calendar period paging follows the requested MUI/m3e carousel choreography: opaque adjacent
  grids travel a full viewport width. Its 375ms monotonic cubic-bezier(0.35, 0.8, 0.4, 1) matches
  the MUI recording, with `--md-calendar-slide-duration` / `--md-calendar-slide-easing` overrides.
  This deliberate exception to theme springs avoids overshooting a page boundary. Weekday headings
  stay fixed; the outgoing frame is inert. RangeCalendar reuses Calendar's transition.
- Full-screen Search geometry uses slow spatial. Search headers stay opaque during rectangle
  morphing; results and scrims fade. Input offsets and icon slots share a bounded registered progress
  on the popup using default effects (200ms). This deliberate monotonic adaptation prevents native
  input clipping and avoids a separate text-transition tail. Icon transforms share that timing;
  leading icons crossfade/rotate and source trailing adornments fade/scale during the same lifecycle.
  The source bar returns after exit completion with text/icons already aligned, and keyboard dismissal
  retains the focus frame through native focus restoration. Pointer/edit activation can reverse an
  in-progress exit immediately.
- State-layer opacity, color, elevation and most fades use fast effects. Sheet scrims and Search fades
  use default effects. Ripple follows m3e's independent choreography: 450ms linear expansion and
  350ms opacity fade with cubic-bezier(0, 0, 0.2, 0.1). These fixed timings apply in both schemes;
  theme springs do not control this explicit reference effect. Touch-scroll delay stays 150ms.
- Shape's existing `--md3e-shape-morph-duration` and `--md3e-shape-morph-easing` overrides take precedence
  over the inherited motion scheme.

LoadingIndicator uses its own video-calibrated monotonic winding/morph curve and fixed stage
intervals. Both motion schemes keep this continuous choreography forward-only; generic overshooting
spring tokens must not reverse the angle. See [LoadingIndicator](components/loading-indicator.md).
Circular indeterminate ProgressIndicator uses fast spatial for its inner winding and default spatial
for arc sweeps. Linear indeterminate progress instead uses two monotonic passes with a 2100ms cycle
and 1150ms stagger, following MUI's choreography. Segment edges reset offscreen; generic theme
springs and determinate value transitions must not move them backward. CSS registered percentage
variables animate their edges and keep the remaining track's transparent gaps in sync, including
when the segments overlap. These continuous linear passes keep their own timing in both schemes.
Continuous carrier rotations and wave texture phases retain constant speed. The CSS `linear()`
function in a spring token is a sampled physical curve, not the constant-speed `linear` keyword.
Skeleton pulse/wave cycles, tooltip opening delays and snackbar reading time retain their own timing.
`prefers-reduced-motion: reduce` disables finite transitions and the existing loading motion regardless
of the selected scheme. Standard is not a substitute for reduced-motion support.

## Web adaptation and limits

Spring tokens define timing, not permission to violate geometry. Each transition needs a spatial
contract: allowed trajectory envelope, edge attachment, containment and relationships with neighboring
elements. A drawer may travel offscreen toward its anchoring edge during entry/exit; it must not pass
the settled position into the viewport and expose a gap behind that edge. Validate actual bounding
rectangles throughout normal/reduced motion and interrupted transitions. Computed transforms, correct
endpoints and a generic clipping report alone cannot establish this contract. See the
[spatial constraints workflow](testing/ui-quality.md) for reusable recording/assertion utilities.

The numerical spring parameters are official MD3/AndroidX values. The CSS conversion adapts
matraic/m3e `SpringEasing.ts` at revision `7520f333699ceeaaf9eb7704a54fe28e14cf08af` (MIT).
It samples a unit-mass, zero-initial-velocity step at 1,001 points over each fixed web duration,
keeps extrema, then splits the most inaccurate segments until at most 32 stops remain. Output
uses four decimal places for displacement and two for stop percentages. The final displacement
is forced to one, including any residual settling jump at the end, exactly as in that reference.

Only the module placement, function order, strict index checks, naming and formatting were adapted.
The sampler is bundled into the separate server/build theme entry. It never runs in the UI graph.
Our existing separate `-duration` and `-easing` CSS variables retain their public contract; m3e's
runtime CSS feature detection, composite token names and cubic-bezier fallback are not imported.
This library already requires native CSS `linear()` support for spring motion.

The timings are a web adaptation, not Compose's distance-dependent settling algorithm. CSS does
not preserve physical velocity when a transition is interrupted or retargeted, and this library does
not simulate gesture springs at runtime. Base UI continues to own interaction and transition lifecycle.

Ripple geometry and presentation also adapt the pinned m3e `RippleElement.ts`: the disk radius is
the distance from the origin to the farthest corner; it expands from scale 0 to 4 without translating,
uses 20px blur and 0.1 opacity, holds until release, and starts fading immediately on release. While
ink is present, the host does not stack a second solid pressed layer; its hover/focus layer remains.
When ripple is disabled or suppressed, the static pressed layer remains available. This
replaces the translating disk, spring timing and 225ms minimum hold. The React controller, coordinate
normalization for scaled surfaces, primary-pointer filtering, Enter/assistive activation, touch-scroll
delay, cancellation and suppression under reduced motion/forced colors remain ours. m3e instead
starts touch immediately, listens to Space and shortens motion under reduced motion. Its public
manual-radius, centered and unbounded ripple APIs are not added to our private hook. See
[Button's ripple contract](components/button.md#ripple). MIT attribution and the full license ship
with the package in `THIRD_PARTY_NOTICES.md` and `licenses/m3e.txt`.

## Sources and verification

The 2026-11-24 Figma audit read prototype transitions across all 33 pages of the
[Material 3 Design Kit copy](https://www.figma.com/design/069YnUCbHFX6TEmu4G6aLS/Material-3-Design-Kit--Community-?node-id=55141-14251).
The committed `src/theme/tests/fixtures/figma-motion-inventory.json` records 40,487 inspected nodes
and 5,158 transition records, including repeated instances. Of these, 4,995 use legacy Smart Animate,
200ms and cubic-bezier(0.2, 0, 0, 1). Menu/list variants also use ease-in-out/ease-out at 200/300ms;
LoadingIndicator's step prototype uses 400ms. These prototype transitions contain no independent
standard/expressive spring profiles. `get_motion_context` returned no keyframe nodes for the
inspected Navigation and Button representatives. Prototype easing is not evidence that both MD3
spring schemes should be replaced with the same 200ms curve.

All twelve exported spring curves and durations are checked for exact equality against output
from the unmodified pinned m3e module (`src/theme/tests/fixtures/m3e-springs.reference.json`).
Storybook browser tests additionally sample synchronized animation playheads at ten checkpoints
from 0 to 750ms against an independent Runge–Kutta physical reference. Values at/after the web
cutoff are one; the 0.003 displacement tolerance covers curve reduction. Screenshots and measured
positions are attached to tests. This verifies the shared profiles inherited by components, not
every component's choreography.

For ripple, the unmodified m3e source was bundled with esbuild and Lit 3.3.2 outside this package.
Seventeen reference PNGs and measured styles were captured in Chromium at DPR 1 on a 200×100px
surface: off-center, centered and corner growth; persistent hold; and four fade playheads. They live
in `src/internal/hooks/tests/fixtures/m3e-ripple`. Storybook tests drive the real Button/useRipple
handlers, isolate its ink layer from the independent shape/state layer, and compare the same
seventeen frames in both schemes. An additional reference frame composes the original StateLayerElement
and RippleElement to check the hover layer beneath the ink, without the duplicate pressed overlay.
Pointer/touch tests cover root and nested state layers plus static reduced-motion/disableRipple feedback.
Ink-only frames allow at most one 8-bit channel value of difference per pixel. The composite scene
permits at most two channel values on up to 0.1% of pixels: local capture has two such pixels out of
20,000 at the lower-left rounded edge (opacity compositing versus color-mix antialiasing). These
scoped comparisons do not claim pixel parity for entire components, colors or all host geometries.

The Figma MCP Starter quota was exhausted before prototype video/frame capture. Figma playback
parity remains unverified. The m3e source and frame comparison are the requested replacement
reference, not evidence of Figma playback parity or official-spec compliance.

Read on 2026-11-24 at m3e revision `7520f333699ceeaaf9eb7704a54fe28e14cf08af`:

- [SpringEasing.ts](https://github.com/matraic/m3e/blob/7520f333699ceeaaf9eb7704a54fe28e14cf08af/packages/web/src/theme/SpringEasing.ts):
  both schemes, fixed durations, sampled curves and reduction algorithm.
- [ThemeElement.ts](https://github.com/matraic/m3e/blob/7520f333699ceeaaf9eb7704a54fe28e14cf08af/packages/web/src/theme/ThemeElement.ts):
  actual `linear()` versus fallback selection; the sampled branch is the reference for current Chromium.
- [RippleElement.ts](https://github.com/matraic/m3e/blob/7520f333699ceeaaf9eb7704a54fe28e14cf08af/packages/web/src/core/shared/primitives/RippleElement.ts),
  [RippleToken.ts](https://github.com/matraic/m3e/blob/7520f333699ceeaaf9eb7704a54fe28e14cf08af/packages/web/src/core/shared/primitives/RippleToken.ts)
  and [PressedController.ts](https://github.com/matraic/m3e/blob/7520f333699ceeaaf9eb7704a54fe28e14cf08af/packages/web/src/core/shared/controllers/PressedController.ts):
  geometry, CSS, durations and input lifecycle; adaptations are listed above.

Storybook loads local Roboto 400/500/600/700 files through its private development dependency.
Its browser check verifies the actual Chromium platform fonts for Latin and Cyrillic text, including
the custom-font flag, rather than accepting the CSS font-family declaration as proof. The themed
Georgia/Arial typography customization example remains intentional.

Read on 2026-11-17:

- [Google: motion physics system](https://m3.material.io/styles/motion/overview/how-it-works) and
  [specifications](https://m3.material.io/styles/motion/overview/specs): two schemes, spatial/effects
  roles, three speeds, and web adaptation guidance.
- [AndroidX ExpressiveMotionTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)
  and [StandardMotionTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt),
  token version v0_14_0. Only numerical parameter data was transcribed; no AndroidX animation implementation is bundled.

The Next fixture `/motion` and Storybook Foundations/Motion demonstrate both schemes. The Storybook
motion toolbar also applies to existing component stories independently of brand and color scheme.
Tests cover parameter values, curve endpoints, monotonic effects, numerical reference points,
actual browser overshoot, static CSS before JavaScript, switching, nested scopes, portals, overrides,
reduced motion, and absence of runtime rule generation. Browser coverage is currently Chromium.
