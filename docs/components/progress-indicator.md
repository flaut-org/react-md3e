# ProgressIndicator

A passive MD3 progress display with linear/circular geometry and flat/wavy appearances. It renders
in RSC and streamed content, using SVG and precompiled CSS. No hooks, client context, observers,
SVG path sampling or animation engine run in the browser. Progress normalization happens during
React rendering; it is ordinary value/ARIA handling, not runtime CSS rule generation.

```tsx
import { ProgressIndicator } from '@flaut-travel/react-md3e';

<ProgressIndicator value={40} aria-label="Uploading files" />;
<ProgressIndicator type="circular" appearance="wavy" value={40} aria-label="Uploading files" />;
<ProgressIndicator variant="indeterminate" appearance="wavy" aria-label="Preparing upload" />;
```

Use LoadingIndicator for short waits where measured progress is unavailable. Use ProgressIndicator
for longer work or when application-provided progress is meaningful. It never estimates progress.

## Wavy linear indeterminate

Combine `type="linear"`, `appearance="wavy"` and `variant="indeterminate"` to show moving waves
instead of flat bars. No value is needed:

```tsx
<ProgressIndicator type="linear" appearance="wavy" variant="indeterminate" aria-label="Searching for flights" />
```

Precompiled styles load automatically from the component import.
Storybook's **Components / ProgressIndicator / Wavy Linear Indeterminate** demonstrates this exact
configuration with its default 4px stroke and 10px container. `thickness={8}` selects the thicker
14px container. The two segments travel forward while their wave phase moves independently;
reduced motion keeps a visible static wave. Colors inherit from ThemeProvider.

## Props

| Prop       | Values/default                                    | Meaning                                                                         |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| type       | linear (default), circular                        | Indicator geometry                                                              |
| variant    | determinate, indeterminate; inferred when omitted | Numeric value selects determinate mode, absent/null selects indeterminate       |
| value      | number, null/undefined                            | Actual operation progress; explicit indeterminate ignores a stale numeric value |
| appearance | flat (default), wavy                              | MD3 active-path appearance                                                      |
| thickness  | 4 (default), 8                                    | Thin or thick track at the nominal size                                         |
| size       | CSS width                                         | Circular diameter (40px flat / 48px wavy), or linear width (default 100%)       |
| min / max  | 0 / 100                                           | Finite range with max greater than min                                          |
| color      | primary (default), secondary, tertiary, inherit   | Active ink color                                                                |

Explicit determinate mode requires a numeric value. Finite values are clamped; NaN, infinities,
invalid ranges and unsupported thicknesses are rejected. The root span forwards ref, DOM props,
className and style. Linear container height is 4/8px flat or 10/14px wavy. Linear values are actual viewport percentages; track gaps stay 4px and wave tiles stay 40px
(20px indeterminate) regardless of width. Circular SVG stroke, wavelength and gap scale with diameter.
This is an explicit responsive web adaptation of native dp measurements.

Round caps, separate remaining tracks and gaps follow MD3 anatomy. Linear determinate progress has
a 4px stop marker, hidden at completion and during indeterminate operation. At zero, the active
path is hidden; at completion, the full active path remains and the track is hidden. Tiny remaining
tracks are hidden when a valid gap cannot fit. Linear geometry mirrors in RTL; circular motion
keeps its clockwise orientation. Wave motion is suppressed near the start/end of determinate
progress to retain a stable empty/complete state.

## Accessibility and server boundaries

Provide aria-label or aria-labelledby; the TypeScript contract requires a name or explicit
aria-hidden={true} for decorative use. Indeterminate mode omits aria-valuenow, while determinate
mode reports the clamped value and actual min/max. aria-valuetext can supply localized text.
The component creates no live region and is not interactive/focusable by default. Apply aria-busy
and loading announcements to the relevant application region rather than announcing every frame.

Base UI Progress was considered: its compound Label/Value context introduces a client boundary.
Direct progressbar semantics are sufficient for this passive RSC component and let streamed
fallbacks render without hydration. There are no keyboard/focus interactions to reproduce.

## Theme and motion

Active ink uses primary and the remaining track uses secondaryContainer. ThemeProvider supplies
light/dark/nested colors. CSS overrides are `--md-progress-active-color`,
`--md-progress-track-color`, and `--md-progress-size`. Component style/size props can override layout.
Value changes transition linear widths and circular dash ranges through the theme's fast effects curve.

Linear waves use precompiled tiled SVG masks moved by native CSS. Circular waves are sampled
into compatible cubic SVG paths at library build time; CSS interpolates nine phase keyframes per
cycle. No path generation or requestAnimationFrame loop executes in the browser. CSS `d: path()`
support enables circular waves; without it, the ordinary SVG path remains a readable flat fallback.
The clipped linear wave ends approximate native round caps. Determinate geometry remains tied to the supplied value; unknown
linear progress uses two staggered forward passes, matching MUI's 2100ms cycle and 1150ms stagger.
The primary edges animate from -35%/0% to 100%/190% with cubic-bezier(0.65, 0.815, 0.735, 0.395);
secondary edges animate from -200%/0% to 107%/108% with cubic-bezier(0.165, 0.84, 0.44, 1).
Each pass reaches its offscreen endpoint at 60% of its cycle and holds only while invisible.
The 1150ms stagger is expressed as an equivalent -950ms phase offset, starting directly in the
continuous two-pass cycle. Both appearances use the same whole-track coordinates; wave texture
never changes the movement's coordinate system.

The SVG container animates four typed CSS percentage variables declared with static `@property`
rules. Both active rectangles inherit their edge positions. Two intersected gradient masks remove
these intervals plus 4px from the remaining track, preserving transparent gaps even when the
passes overlap. This uses native browser CSS interpolation and masking; there is no JavaScript
property registration, frame loop or rule insertion. Determinate x/width transitions are disabled
for these moving edges, and generic spatial spring overrides cannot reverse the passes.
This requires browser support for CSS registered custom properties and mask compositing; browser
regressions cover Chromium. The declarations belong only to the ProgressIndicator CSS entry.

Circular indeterminate progress combines
a 1568ms continuous outer turn, a 5332ms inner winding with eight 135-degree fast spatial spring
steps, and a synchronized 1333ms spring-driven arc expansion/contraction. Both flat and wavy
circular appearances inherit the motion scheme. Linear indeterminate choreography is fixed in both
schemes. The 1s wave phase remains a continuous texture movement;
it is separate from the spring-driven winding and sweep.
These finite frame sequences and dash timings are web adaptations, not an exact port of AndroidX's
native draw/physics implementation or a claim of pixel-perfect Figma equivalence.

Reduced motion freezes indeterminate activity in a visible partial state and stops wave phases and
value transitions. It preserves progress semantics and the current determinate value. Forced colors
use Highlight/GrayText. Standard motionScheme is not a substitute for reduced-motion preferences.

## Sources and checks

- [MUI LinearProgress source](https://github.com/mui/material-ui/blob/5eb2eeeb399f5b4edfee73a77deabdbe8ebef275/packages/mui-material/src/LinearProgress/LinearProgress.js):
  two staggered segments, cycle timing, easing and edge coordinates. Adapted under MIT;
  attribution and the original license ship in the package. No MUI/Emotion runtime is used.
- [m3e progress indicator reference](https://matraic.github.io/m3e/#/components/progress-indicator.html),
  inspected at [revision 10b8db2](https://github.com/matraic/m3e/blob/10b8db2fcd0686e2b9c6753616194275fa50bdc8/packages/web/src/progress-indicator/CircularProgressIndicatorElement.ts):
  layered outer rotation, staged inner winding and arc choreography. This implementation uses the
  library's own theme spring curves and CSS/SVG geometry, not m3e's runtime drawing loop.
- [Google Progress indicators](https://m3.material.io/components/progress-indicators/overview) and
  [official Android guidance](https://github.com/material-components/material-components-android/blob/master/docs/components/ProgressIndicator.md).
- [AndroidX ProgressIndicator.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ProgressIndicator.kt)
  and [WavyProgressIndicator.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WavyProgressIndicator.kt).
  CircularProgressIndicatorTokens gives 40/48px sizes, 4px thickness/gap and 1.6px wave amplitude;
  LinearProgressIndicatorTokens gives 4px thickness/gap/stop, 10px wavy height and 3px amplitude.
  Thick tracks are the documented 8dp expressive configuration. Numerical design data only; no
  AndroidX rendering implementation is bundled.
- [MDN: CSS SVG d property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/d).

Next `/indicators` and `/streaming` and Storybook Components/ProgressIndicator cover all modes,
controlled state, themes and RTL. Tests cover server HTML with JS disabled, boundaries/custom
ranges, waveform motion, circular spring winding, reduced motion, forced colors, accessibility,
declarations and distribution. Linear regression checks compare both segment edges against 43
native browser samples from MUI, trace three cycles for backward movement/visible stops and
resets, and rasterize the actual track masks at multiple widths and overlapping phases.
Browser coverage is currently Chromium.
