# LoadingIndicator

An MD3 Expressive indicator for short operations, typically under five seconds. The indeterminate
form cycles through seven official silhouettes: softBurst, cookie9Sided, pentagon, pill, sunny,
cookie4Sided and oval. A numeric value selects the determinate circle-to-soft-burst morph.

```tsx
import { LoadingIndicator } from '@flaut-travel/react-md3e';

<LoadingIndicator aria-label="Loading flights" />;
<LoadingIndicator variant="contained" aria-label="Updating results" />;
<LoadingIndicator value={45} aria-label="Preparing preview" />;
```

ThemeProvider loads its defaults automatically, or component token fallbacks apply without a provider.
The direct JS import is `/loading-indicator`; it never imports the color generator or an animation
engine. All geometry and keyframes are extracted at library build time. This component has no
hooks or client directive and works in RSC and streamed Suspense fallbacks before hydration.

## Props

| Prop      | Values/default                                  | Meaning                                                                                |
| --------- | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| variant   | uncontained (default), contained                | Optional primaryContainer surface and onPrimaryContainer ink                           |
| value     | number, null/undefined (default)                | Numeric values are determinate; absent/null runs the seven-shape loop                  |
| min / max | 0 / 100                                         | Finite range; max must be greater than min                                             |
| size      | CSS width, default 48px                         | Scales the 48px frame and nominal 38px rotor proportionally                            |
| color     | primary (default), secondary, tertiary, inherit | Theme role or inherited ink; contained secondary/tertiary use matching container pairs |

Finite values are clamped to the range. NaN, infinities, invalid ranges and overflowing ranges are
rejected. `ref`, `className`, `style`, DOM attributes and events forward to the root span. A numeric
value changes the actual morph and its accessible value; it does not imply measured time remaining.

Provide `aria-label` or `aria-labelledby`. Use `aria-hidden={true}` for a decorative indicator whose
surrounding control/region already announces loading. The type contract requires one of these.
The root uses progressbar semantics; indeterminate mode omits aria-valuenow. No live region is
created, so frequent updates do not produce duplicate announcements. Manage aria-busy on the
application's loading region where appropriate.

These passive indicators use direct native ARIA semantics rather than Base UI Progress's client
context for compound Label/Value parts. There is no input, focus, keyboard or dismissal behavior to
delegate. This preserves the library's RSC/no-hydration contract for passive loading presentation.

## Theme and motion

Color roles and shape corners inherit from ThemeProvider. Component overrides are
`--md-loading-indicator-size`, `--md-loading-indicator-color`, and
`--md-loading-indicator-container-color`. Inline size/style props take precedence over defaults.

The indeterminate choreography is calibrated against the supplied screen recording and the m3e
reference. It combines a constant outer turn with a monotonic inner winding and contour morph.
Both timelines last 4666ms. Inner rotation and morph share `cubic-bezier(0.34, 0.88, 0.34, 1)`:
rapid forward acceleration, a quick shape change, and a long deceleration into the next pose.
There is no angular overshoot, reverse turn, or spring rebound. The outer turn keeps the silhouette
moving forward while the inner winding slows down.

| Cycle position | Shape        | Inner angle |
| -------------- | ------------ | ----------- |
| 0%             | softBurst    | 0deg        |
| 14%            | cookie9Sided | 154deg      |
| 29%            | pentagon     | 309deg      |
| 43%            | pill         | 463deg      |
| 57%            | sunny        | 617deg      |
| 71%            | cookie4Sided | 771deg      |
| 83%            | oval         | 926deg      |
| 100%           | softBurst    | 1080deg     |

The intervals are intentionally unequal. At the loop boundary, three complete inner turns plus
one outer turn preserve the visible orientation. Generic theme spring easing does not retime this
fixed loading choreography: both motion schemes retain the same forward trajectory.

The nominal rotor is 38/48 of the frame. Its indeterminate silhouette uses the reference's 0.842
inset scale. Build-time sampling normalizes the actual silhouette bounds and matches vertex phases
against cookie4Sided. It preserves shape-specific radial extents as the form changes, rather than
forcing every silhouette into an equal-radius circle. The shared Shape component is unaffected.
The contours come from the existing official catalog; no m3e runtime or animation loop is used.
The determinate path uses a paused CSS timeline to select a circle-to-soft-burst contour and
counterclockwise orientation from the actual value. Changes snap to the selected contour; the
component does not invent an animated value between application updates.

Reduced motion freezes the indeterminate loop and rotation while retaining a visible shape.
Determinate progress remains accurate through its original paused timeline with no running motion. Forced
colors use system colors and a contained boundary. The component is never focusable by default.

A Button can opt into this indicator through its existing loadingIndicator prop:

```tsx
<Button loading loadingIndicator={<LoadingIndicator size={20} color="inherit" aria-hidden />}>
  Save journey
</Button>
```

Both CSS families load automatically from their component imports. Button retains its lightweight default
spinner, so ordinary Button pages do not pay for the seven-shape choreography.

## Sources and checks

- [m3e loading indicator reference](https://matraic.github.io/m3e/#/components/loading-indicator.html),
  inspected at [revision 10b8db2](https://github.com/matraic/m3e/blob/10b8db2fcd0686e2b9c6753616194275fa50bdc8/packages/web/src/loading-indicator/LoadingIndicatorElement.ts):
  unequal shape intervals, monotonic easing, inner angles, inset scale and layered winding.
  Only choreography parameters are transcribed; geometry normalization/alignment is independently
  implemented over the existing official contours. No Lit, m3e controller or runtime dependency is used.
- [Google Loading indicator](https://m3.material.io/components/loading-indicator/overview) and
  [official Android guidance](https://github.com/material-components/material-components-android/blob/master/docs/components/LoadingIndicator.md).
- [AndroidX LoadingIndicator.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/LoadingIndicator.kt),
  shapes, determinate configuration and loop timing; LoadingIndicatorTokens v0_7_0 gives 48/38 sizes
  and primary/container role pairs. Numerical/shape data only; no AndroidX animation implementation
  is bundled. Shared contours retain their existing Apache notices and license.

Next `/indicators`, `/streaming`, and Storybook Components/LoadingIndicator demonstrate usage.
Tests cover semantics, clamping, server output with JavaScript disabled, actual shape morphing,
controlled updates, theme inheritance, reduced motion, forced colors and CSS/runtime isolation.
The supplied 604x364 recording (5.508s) was decoded at 60 sample positions per second, retaining
actual frame timestamps. Radial contour harmonics measured rotation on cookie4Sided, oval and pill;
the reference curve fit has approximately 0.05–0.14deg RMS error on these intervals. The colocated
`tests/loading-motion.reference.json` contains numerical measurements only, without the video.
Browser regressions check measured relative angles, dense forward-only winding through two full
loops, resistance to overshooting theme overrides, and rendered contour profiles at sixteen video
phases. Profile values encode half-pixel radii around the recorded center every two degrees;
phase offsets align the arbitrary recording start and are not animation parameters.
Browser coverage is Chromium; Figma parity and velocity-preserving morphing are not claimed.
