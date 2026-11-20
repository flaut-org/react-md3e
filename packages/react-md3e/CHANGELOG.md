# @flaut-travel/react-md3e

## 1.0.0-alpha.3

### Minor Changes

- dc6dda0: Add Material 3 Expressive Menu with standard/vibrant colors, action and link items, checkbox/radio selection, labeled groups, dividers and nested submenus. Include keyboard/typeahead navigation, controlled state and cancellation, theme-preserving portals, collision handling, reduced-motion/forced-color styles and an explicit `/menu/styles.css` entry.
- a7c19a3: Add Material 3 SegmentedButton and ButtonSegment with single/multiple selection, accessible radio/checkbox semantics, keyboard navigation, native form values and reset, selection indicators, RTL, disabled/read-only states, ripple and precompiled theme-aware styles. Export the components from the root and /segmented-button, with explicit /segmented-button/styles.css loading.
- 7025993: Add Material 3 Slider with standard, centered and range variants, five Expressive sizes, horizontal/vertical layouts, stops, value indicators and optional inset icons. Include Base UI pointer/keyboard behavior, controlled/uncontrolled values, native form inputs, change vetoes, RTL, reduced motion and forced colors. Export Slider and its types from the root and /slider, with explicit /slider/styles.css loading.
- dc6dda0: Add Menu layout="grouped" with separate MenuGroup/RadioGroup surfaces and transparent gaps. Preserve text/icon size while menu surfaces unfold, retain leading icons on visually selected command items, and provide grouped examples with keyboard, RTL and reduced-motion coverage.
- 3962922: Add a server-compatible Material Badge with small notification dots and large count/status labels,
  RTL icon placement, error/onError theme colors, count limits and Unicode-aware label truncation.
  Support controlled visibility with theme spring transitions, reduced motion, forced colors, native
  span refs and badge slot props. Export Badge from the package root and /badge with a separate
  /badge/styles.css entry.
- 9ddca1a: Add a Material Switch composed with Base UI, with controlled/uncontrolled state, native form
  integration, keyboard and pointer activation, RTL-aware dragging, optional handle icons, and
  disabled/read-only states. Use extracted CSS for Material state colors, handle sizing, ripple,
  standard/Expressive spring transitions, reduced motion and forced colors. Export Switch from the
  package root and /switch with a separate /switch/styles.css entry.

### Patch Changes

- dc6dda0: Correct submenu highlight corners at menu and group edges by identifying the last menu item independently of portalling and focus-management nodes. Preserve checked and selected item shapes.
- 79b2746: Align Autocomplete with Expressive Menu surfaces, option typography, selection shapes and colors,
  and fast unfolding animations. Reuse shared Menu presentation and ripple while preserving combobox
  focus, filtering, selection, form submission and custom option rendering.
- dc6dda0: Use the fast spatial spring for Menu opening and closing, matching AndroidX's token assignment and
  making expansion more responsive while preserving text and icon dimensions.
- 7025993: Keep Slider handle-facing track corners unchanged at the bounds. Restore value indicators on repeated presses of an already-focused handle and play their CSS animation forward/backward from the handle-facing edge, preserving interrupted motion and reduced-motion behavior.

## 1.0.0-alpha.2

### Minor Changes

- 5599399: Add server-compatible LoadingIndicator and ProgressIndicator with CSS-only motion, accessible progress ranges, contained/uncontained morphing shapes, linear/circular flat and wavy tracks, themes, reduced motion and separate component CSS entries.

  Match LoadingIndicator to the recorded forward-only winding and morph choreography. Use two monotonic staggered passes for linear indeterminate progress, with synchronized transparent track gaps; keep theme spatial springs for circular indeterminate movement and reduced-motion support for both.

- fdd7558: Add configurable theme breakpoints with CSS variables and build-time media query helpers. Dialog supports xs/sm/md/lg/xl and false maxWidth values, inherits scoped width tokens through portals, and preserves its default MD3 width.
- 457bc1d: Add independent standard/expressive motion schemes with the six MD3 spring tokens, build-time CSS curves, themed component transitions, and reduced-motion support. Expressive is the default.

### Patch Changes

- be2372a: Add explicit per-component CSS exports and a separate theme stylesheet. Component CSS includes its shared dependencies while unused families, including Shape geometry, stay off routes that do not import them. Keep the full stylesheet as a compatibility opt-in and preserve CSS-free server-safe JavaScript exports.

## 1.0.0-alpha.1

### Major Changes

- f37998b: Introduce the Material 3 Expressive React library: themed components, build-time CSS,
  server-compatible presentation, accessible Base UI interactions, and typed public exports.

### Patch Changes

- 2adb779: Preserve controlled Autocomplete query updates made while its popup is closing instead of resetting them to the previous selection after the animation.
