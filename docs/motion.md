# Motion schemes

`createTheme({ motionScheme: 'expressive' | 'standard' })` selects the official MD3 motion scheme.
The default is expressive. This setting is independent of `variant`, which selects the color palette
algorithm. Standard is a restrained spring scheme, not the legacy duration/easing motion system.

```tsx
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import '@flaut-travel/react-md3e/theme/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';

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

| Spring          | Expressive damping / stiffness | Standard damping / stiffness |
| --------------- | ------------------------------ | ---------------------------- |
| fast spatial    | 0.6 / 800                      | 0.9 / 1400                   |
| default spatial | 0.8 / 380                      | 0.9 / 700                    |
| slow spatial    | 0.8 / 200                      | 0.9 / 300                    |
| fast effects    | 1 / 3800                       | 1 / 3800                     |
| default effects | 1 / 1600                       | 1 / 1600                     |
| slow effects    | 1 / 800                        | 1 / 800                      |

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
- Full-screen Search geometry uses slow spatial.
- State-layer opacity, color, elevation and most fades use fast effects. Sheet scrims and Search fades
  use default effects. Ripple growth uses slow effects and its fade uses fast effects; pointer delay
  and minimum press lifetime remain interaction timing rather than motion scheme settings.
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

The numerical spring parameters are official MD3/AndroidX values. The conversion is independently
implemented: unit mass, zero initial velocity, a unit step, and normalized displacement tolerance
0.001. Underdamped duration uses an exponential envelope so the first target crossing cannot end the
animation prematurely. Critically damped springs use a monotonic settling check at millisecond
resolution. Each curve contains 81 equally spaced samples and exact zero/one endpoints.

These durations and sampled curves are a documented web adaptation, not fixed durations mandated by
Google or an exact implementation of Compose's distance-dependent settling algorithm. CSS linear()
provides native interpolation. This implementation does not preserve physical velocity when a
transition is interrupted or retargeted, and does not simulate gesture springs at runtime. Base UI
continues to own interaction and transition lifecycle behavior.

## Sources and verification

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
