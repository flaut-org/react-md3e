# Slider

Slider provides Material 3 standard, centered and range selection with five Expressive sizes.
Import Slider and its public types from the root or `/slider`, with automatic CSS loading. ThemeProvider loads theme defaults.

```tsx
import { Slider } from '@flaut-travel/react-md3e/slider';

<Slider label="Volume" defaultValue={40} step={5} marks valueLabelDisplay="auto" />;
```

This example can be composed in an RSC. Event handlers and formatting functions belong to consumer
client components. The component itself renders HTML on the server and hydrates for interaction.

```tsx
// Inside a consumer client component:
<Slider
  label="Price range"
  variant="range"
  value={price}
  onChange={(_event, next) => setPrice(next)}
  getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
/>
```

## Values and interaction

`variant="standard"` is the default and fills the track from min to the selected scalar value.
`centered` fills from the midpoint of min/max to a scalar value on either side. Its initial value
defaults to the midpoint; use a symmetric negative/positive range when the midpoint represents zero.
`range` uses exactly two values, defaults to [min,max], and fills between its two handles.
Range inputs accept a readonly pair; change callbacks receive a mutable [number,number] pair.

Use value for controlled state or defaultValue for uncontrolled state. min/max default to 0/100,
step to 1, and shiftStep to 10. Bounds and increments must be finite, max must exceed min, and
increments must be positive. Base UI clamps values to the bounds and sorts range values. Choose
initial values that match the step grid. Range handles cannot cross; minStepsBetweenValues (default 0) sets their minimum separation in step units and must fit the bounds and initial selection.

`onChange(event,value,activeThumb)` runs during pointer movement, track selection and keyboard input.
Returning false or newly preventing that event cancels the change. `onChangeCommitted(event,value)`
runs when an accepted change commits: after releasing a pointer, or for a keyboard/input change.
Canceled or unchanged interactions do not commit. These callbacks expose native DOM events rather
than Base UI event details; the commit event is not necessarily an input change event.

Tab visits each native range input in document order. Arrows change by step, Shift+Arrows and Page
Up/Down use shiftStep, and Home/End select the allowed extremes. RTL reverses horizontal arrows and
pointer mapping; vertical sliders increase upward. A track press selects the closest handle and
dragging updates immediately. Keyboard large-step bindings follow the Base UI/MUI web convention
instead of Material's Space+Arrow platform binding.

## Presentation

| size                 | Track thickness | Handle length | Outer track corner |
| -------------------- | --------------- | ------------- | ------------------ |
| extraSmall (default) | 16px            | 44px          | small / 8px        |
| small                | 24px            | 44px          | small / 8px        |
| medium               | 40px            | 52px          | medium / 12px      |
| large                | 56px            | 68px          | large / 16px       |
| extraLarge           | 96px            | 108px         | extraLarge / 28px  |

The handle is 4px thick, narrowing to 2px on focus/press; each target is at least 48×48px. Separate
track segments leave a minimum 6px gap beside the handle and use fixed 2px inner corners, including
at min/max. Only container-facing edges use the outer corner token; moving a handle to a bound does
not change or animate its track corner. End stop dots
identify the inactive track's bounds. Colors are primary/onPrimary for active track/stops and
secondaryContainer/onSecondaryContainer for inactive track/stops. Disabled active content uses
38% onSurface and the inactive track 12%, without fading the whole component.

`orientation` is horizontal (default) or vertical. Horizontal sliders fill their container, including
24px target space at each end; vertical sliders default to 240px and accept a CSS height through
style/className. Material recommends horizontal range sliders to reduce cognitive load. Native
div attributes, style, className and ref belong to the root. There is no public composition or Base
UI part API.

`marks` is false by default, true for every step, or an array of `{ value, label? }` entries. Custom
marks are visual references; step still controls snapping. Avoid crowded stop scales. Automatic
and custom marks are limited to 1001 positions; use a sparse array for fine-grained values. Custom
values must be finite and within min/max; duplicate values are deduplicated. Mark labels are
decorative and do not replace the slider's accessible name.

`valueLabelDisplay` is off by default, auto during a pointer press/drag or keyboard focus, or on for persistent
labels. Auto shows one range label at a time; on intentionally allows both. The label has a 48×44px
minimum pill and inverseSurface/inverseOnSurface colors. `valueLabelFormat(value,index)` customizes
its content. `locale` (default en-US) and `format` provide deterministic Intl.NumberFormat output.
Use getAriaValueText(value,index) to customize the spoken value independently of visible JSX.

An optional decorative `icon` is supported only by standard medium/large/extraLarge sliders, with
24/24/32px sizes. CSS container queries move it to the inactive segment when the active segment is
too short. No application icon catalog or JavaScript layout observer is added.

## Accessibility, forms and rendering

Supply label, aria-label, aria-labelledby or getAriaLabel. A range additionally requires getAriaLabel
to distinguish both handles. Visible labels and native range inputs are associated before hydration.
The native inputs own slider roles, values, orientation and focus; inputRef points to the first one.
`disabled` removes interaction and native form submission while preserving selected appearance.

name/form are passed to the native range inputs, including explicit external form ownership. A
range submits two entries with the same name; read them with FormData.getAll(). Reset controlled
application values in the form's onReset; remount uncontrolled sliders when restoring defaultValue
is required. No separate hidden form copy, required validation or internal reset policy is added.

Base UI 1.9.0 Slider owns pointer/touch behavior, keyboard input, focus, native values and commit
lifecycle. Own CSS uses inherited logical direction even before JavaScript. Styling is build-time
object CSS; UI JavaScript supplies only values/geometry and formats labels. Handle size and label
transforms use fast spatial springs; colors use fast effects. Pointer positions update
directly. Reduced motion disables finite motion. Forced colors retain track outlines, handles,
stop dots and keyboard focus using system colors. ThemeProvider stays an RSC-compatible CSS scope.

Automatic value indicators use native focus and Base UI's dragging state as well as its active
index, so pressing the same focused handle again reopens its label without requiring a value change.
They scale from a point 6px beyond the handle-facing edge (bottom center for horizontal sliders,
the corresponding side for vertical sliders). A registered CSS number keeps scale within 0–1
without mirroring at a spring overshoot. A native CSSAnimation plays the extracted scale keyframes
forward on open and backward on close, retaining the current playhead when interrupted. The label
stays present until the reverse animation finishes. Reduced motion removes this animation and
settles immediately, including when the preference changes during interaction. JavaScript only
controls playback and presence; no animation timer, spring solver or runtime stylesheet is added.

## Value-indicator video analysis

The requested [Google reference video](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tddmn-GM3-Components-Sliders-4-1-v01.mp4?alt=media)
was decoded frame by frame in Chromium: 599 frames at 60fps, 656×600px, 9.9833 seconds.
SHA-256: `473d6a9ffa151bb2a0dd94d5796398cd666475dd903a0209ac4fe77524c5f185`.

| Frame | Time   | Dark indicator bounds in source pixels |
| ----- | ------ | -------------------------------------- |
| 98    | 1.633s | Absent                                 |
| 99    | 1.650s | x=340, y=253, 6×3                      |
| 102   | 1.700s | x=308, y=187, 70×63                    |
| 115   | 1.917s | x=295, y=159, 96×88                    |
| 255   | 4.250s | x=504, y=181, 74×69 during close       |
| 262   | 4.367s | x=540, y=257, 1×1 before disappearing  |
| 263   | 4.383s | Absent                                 |

The opening center stays at x≈343 while the bottom moves upward from ≈256 to ≈247; closing moves
back toward the handle. Measurements use a dark-fill threshold and have pixel/antialiasing tolerance.
The 96×88px settled pill corresponds to the 48×44 CSS-pixel indicator. Its anchor informed the 6px
offset beyond the bottom edge. Geometry and the enter/exit lifecycle follow the reference; easing
and duration still inherit the library's selected theme springs rather than reproducing a fixed
video timeline or claiming pixel-perfect parity.

## Sources and verification

Read on 2026-11-19:

- Official rendered [overview](https://m3.material.io/components/sliders/overview),
  [specs](https://m3.material.io/components/sliders/specs),
  [guidelines](https://m3.material.io/components/sliders/guidelines) and
  [accessibility](https://m3.material.io/components/sliders/accessibility). Living references supply
  the three variants, five sizes, inset-icon restrictions and interaction guidance.
- AndroidX [SliderTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SliderTokens.kt),
  version v2_3_5, and [Slider.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Slider.kt).
  Numerical/color roles inform XS geometry, handle gaps, inner corners, disabled states and value
  indicators. Larger dimensions come from the official rendered size table.
- Requested [M3E Slider](https://matraic.github.io/m3e/#/components/slider.html), inspected through
  [SliderElement.ts](https://github.com/matraic/m3e/blob/f5bf147ce86c68ee7f8aec15767042a907028a22/packages/web/src/slider/SliderElement.ts)
  and [SliderThumbElement.ts](https://github.com/matraic/m3e/blob/f5bf147ce86c68ee7f8aec15767042a907028a22/packages/web/src/slider/SliderThumbElement.ts).
  Split tracks, handle feedback, value pills, ticks and vertical layout informed this independent
  React/CSS implementation. No upstream implementation or icon asset was copied.
- [Base UI Slider](https://base-ui.com/react/components/slider), installed 1.9.0 source/types;
  MUI-style value, callback, marks, shiftStep and value-label prop conventions are adapted without
  a MUI dependency. Google's [Figma kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit)
  was not accessible for node inspection; Figma parity is not claimed.

Web adaptations include CSS pixels for dp, equal cross-axis targets, clipped CSS track segments,
CSS container-query icon placement, native range inputs and the shared precomputed spring curves.
The library does not claim platform haptics, velocity-preserving springs or pixel-perfect parity.

Storybook Components/Slider and the Next `/sliders` fixture demonstrate all variants and sizes.
Colocated type, Node and browser checks cover values, validation, forms, controlled state, change
vetoes, pointer/touch, keyboard, RTL, labels, extracted CSS, RSC/streaming and accessibility preferences.
Browser verification is Chromium.
