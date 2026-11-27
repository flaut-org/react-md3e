# @flaut-travel/react-md3e

## 1.0.0-alpha.3

### Minor Changes

- b0ccf00: Add opt-in AppBar scroll behavior: pinned surfaces, exitUntilCollapsed flexible headers, and enterAlways quick return for all variants. Automatically detect the nearest scroll container or accept an explicit element/window target, preserve title/input DOM and native header refs, and use extracted theme springs for settling with reduced-motion support. Static AppBar stays server-compatible without a scroll controller. Mark the four app bar variants and scrolling support as implemented.
- efc2635: Automatically load extracted component and ThemeProvider CSS through static implementation imports.
  Root named imports and component subpaths retain CSS tree-shaking, shared assets and RSC boundaries.
  Keep explicit CSS exports for compatibility and add a CSS-free native Node export graph.
  Add a /theme-provider subpath for compositions that use only component subpaths.
  Next Webpack root imports require Next's optimizePackageImports setting for CSS pruning;
  fully qualified component subpaths work without that setting.
- dc6dda0: Add Material 3 Expressive Menu with standard/vibrant colors, action and link items, checkbox/radio selection, labeled groups, dividers and nested submenus. Include keyboard/typeahead navigation, controlled state and cancellation, theme-preserving portals, collision handling, reduced-motion/forced-color styles and an explicit `/menu/styles.css` entry.
- a7c19a3: Add Material 3 SegmentedButton and ButtonSegment with single/multiple selection, accessible radio/checkbox semantics, keyboard navigation, native form values and reset, selection indicators, RTL, disabled/read-only states, ripple and precompiled theme-aware styles. Export the components from the root and /segmented-button, with explicit /segmented-button/styles.css loading.
- a151b6f: Add Material 3 primary and secondary Tabs, TabList, Tab and TabPanel with fixed/scrollable rows, icons and badges, controlled/uncontrolled selection, accessible keyboard navigation, RTL, persistent panels and theme-driven standard/Expressive indicator motion. Export the family from the package root and `/tabs`, with explicit `/tabs/styles.css`.
- f941706: Add ListItem primary button/link actions, independent leading/trailing action slots, and controlled or uncontrolled nested expansion. Preserve static RSC rendering and existing selection modes; add action keyboard navigation, compiled state/ripple feedback, official List Expand color/shape tokens, and reduced-motion support.
- 6b59088: Add NavigationBar, NavigationRail, NavigationDrawer and their shared NavigationItem. Include baseline and flexible bars, baseline and expandable Expressive rails, standard/modal drawers and rails, controlled/uncontrolled destination selection, native links, focus and ripple feedback, RTL and reduced motion. Export separate JavaScript/type/CSS entries with server-compatible layouts and Base UI modal behavior.
- b1f67d7: Add SplitButton with four color styles, five sizes, connected shape transitions and the prescribed
  standard-motion chevron. Reuse Button and Menu for primary actions, dropdown content, keyboard/focus
  behavior and shared styling, with explicit `/split-button/styles.css` dependency loading.
- 9ca2855: Add Material 3 Expressive Toolbar and ToolbarOverflow with docked and floating layouts, standard/vibrant scoped component colors, horizontal/vertical floating placement, FAB composition, expansion, scroll behavior and accessible keyboard navigation. Include server-compatible layout, automatic CSS and public `/toolbar` and `/toolbar/styles.css` entries. Add optional local color tokens to Button, IconButton, Divider and Fab without changing their standalone defaults.
- a1ca12e: Add Fab, ExtendedFab and FabMenu/FabMenuItem with Material 3 Expressive sizes and color roles,
  native button/link support, lowered elevation, collapsible extended labels, and coordinated
  floating menu motion. Reuse Button and Menu for interaction, focus, keyboard navigation and ripple.
  Publish individual JavaScript/types and build-time CSS entries with their dependency closures.
- 7025993: Add Material 3 Slider with standard, centered and range variants, five Expressive sizes, horizontal/vertical layouts, stops, value indicators and optional inset icons. Include Base UI pointer/keyboard behavior, controlled/uncontrolled values, native form inputs, change vetoes, RTL, reduced motion and forced colors. Export Slider and its types from the root and /slider, with explicit /slider/styles.css loading.
- dc6dda0: Add Menu layout="grouped" with separate MenuGroup/RadioGroup surfaces and transparent gaps. Preserve text/icon size while menu surfaces unfold, retain leading icons on visually selected command items, and provide grouped examples with keyboard, RTL and reduced-motion coverage.
- 3962922: Add a server-compatible Material Badge with small notification dots and large count/status labels,
  RTL icon placement, error/onError theme colors, count limits and Unicode-aware label truncation.
  Support controlled visibility with theme spring transitions, reduced motion, forced colors, native
  span refs and badge slot props. Export Badge from the package root and /badge with a separate
  /badge/styles.css entry.
- 79790ba: Add public Material 3 Chip and ChipSet components with assist, filter, input and suggestion types,
  outlined/elevated states, optional Expressive selection shapes, accessible keyboard navigation,
  selection and removal. Passive input chips remain server-compatible and component CSS loads
  automatically through root or subpath imports. Autocomplete now uses the shared input Chip instead
  of its private chip styling while preserving Combobox behavior.
- 9ddca1a: Add a Material Switch composed with Base UI, with controlled/uncontrolled state, native form
  integration, keyboard and pointer activation, RTL-aware dragging, optional handle icons, and
  disabled/read-only states. Use extracted CSS for Material state colors, handle sizing, ripple,
  standard/Expressive spring transitions, reduced motion and forced colors. Export Switch from the
  package root and /switch with a separate /switch/styles.css entry.
- 6184ffe: Add Material plain/rich Tooltip variants with React content, named nonmodal rich actions, headline/action slots,
  persistent activation, long press input, optional carets and explicit anchor spacing. Preserve existing plain
  Tooltip APIs and add disableInteractive as an alias. Correct empty controlled content and apply Material tokens,
  shared spring motion, viewport-aware layout and focus-safe dismissal.
- b0ccf00: Add the Material 3 Expressive search AppBar variant, composing the existing Search for query input and docked/full-screen results. Support inside/outside actions, centered text, RTL and scrolled container colors while preserving AppBar's server boundary. Include Search dependencies in the AppBar CSS entry.

  Remove the unsupported aria-expanded attribute from Search's searchbox; retain its dialog relationship through aria-haspopup and aria-controls.

- 8869310: Add localized section masks to date and range fields, with automatic digit advancement, section selection,
  deletion and clipboard editing while preserving Temporal validation. Keep empty labels stationary when
  calendar buttons receive focus and keep calendar height stable across year/month/day transitions.

  Add Popover's optional collisionStrategy="shift" and use it to keep docked calendar grids fully visible,
  including inside dialogs. Fall back to modal/input presentation when the viewport cannot fit a complete
  calendar. Render range preview dashes continuously across each week without cell-boundary seams.

- 8869310: Add Temporal-based DateField, DateRangeField, DatePicker and DateRangePicker, including localized
  numeric entry, shared validation, native ISO form values, docked/responsive/modal presentation,
  range input layouts, confirmation/cancellation and accessible keyboard/focus behavior. Reuse
  Calendar, RangeCalendar, TextField, Popover and Dialog with extracted, automatically loaded CSS.
  Share month/year availability predicates with RangeCalendar without changing existing date values
  or Calendar callback contracts.

### Patch Changes

- a1ca12e: Center text and font icons within ExtendedFab's leading icon area and apply the size-specific
  icon font size, keeping collapsed icons centered with equal insets in LTR and RTL.
- 79790ba: Correct Input Chip removal to use a 24px circular icon-button state layer, ripple and focus surface
  around its 18px close icon while preserving the larger invisible touch target. Keep text clear of
  the hover surface in LTR and RTL, highlight the whole chip for primary actions, and preserve
  Autocomplete removal and focus behavior. Align text-only assist/filter/suggestion padding with
  current MD3 measurements and identify input chip examples consistently.
- b0ccf00: Keep the search header opaque while morphing from and back to its measured bar rectangle, animate suggestions/results separately, and retain the source handoff through the closing transition. Match the originating surface color and support bars wider than the docked view without stretching text. Pointer dismissal releases editing focus; keyboard dismissal restores focus and allows typing, paste, IME completion or Enter to reactivate search with the query preserved.
- f941706: Center leading and trailing List action controls and their state layers within their slots by distributing the existing inline padding equally, including RTL layouts. Preserve slot widths, primary text placement and independent control interactions.
- efc2635: Keep indeterminate linear progress properties registered after Webpack minifies zero units, preserving smooth flat and wavy segment interpolation.
- dc6dda0: Correct submenu highlight corners at menu and group edges by identifying the last menu item independently of portalling and focus-management nodes. Preserve checked and selected item shapes.
- a151b6f: Correct Tab keyboard focus to use a rounded inward frame, keep the selected indicator clear, and pulse once from 3px to 6px and back according to the supplied Material reference. Preserve fixed layout, reduced-motion support and forced-color visibility.
- b0ccf00: Keep the Search focus frame continuous when Escape restores keyboard focus. Animate Back/Search
  icon changes, centered query alignment and persistent trailing adornments before returning to the
  source bar, honoring reduced motion and retaining a single interactive adornment tree.
- b0ccf00: Synchronize Search text and icon-slot motion with one bounded 200ms transition. Prevent clipped
  text on expansion, repeated transition retargeting and incorrect centered alignment on dismissal.
  Allow pointer, keyboard and committed IME input to reactivate Search during its closing transition.
- 79b2746: Align Autocomplete with Expressive Menu surfaces, option typography, selection shapes and colors,
  and fast unfolding animations. Reuse shared Menu presentation and ripple while preserving combobox
  focus, filtering, selection, form submission and custom option rendering.
- 8869310: Share default breakpoint constants between theme generation and date picker media queries through
  a plain TypeScript module. Remove the generated picker media JSON dependency so source checks no
  longer require that build artifact. Existing breakpoint values and picker behavior are unchanged.
- dc6dda0: Use the fast spatial spring for Menu opening and closing, matching AndroidX's token assignment and
  making expansion more responsive while preserving text and icon dimensions.
- 7025993: Keep Slider handle-facing track corners unchanged at the bounds. Restore value indicators on repeated presses of an already-focused handle and play their CSS animation forward/backward from the handle-facing edge, preserving interrupted motion and reduced-motion behavior.
- 044ac69: Align standard and expressive shared spring durations and sampled curves with the pinned m3e web reference. Update the shared press ripple to use the same stationary blurred expansion, hold and immediate release fade, avoiding a duplicate solid pressed layer while preserving keyboard, touch-scroll, cancellation and static reduced-motion/disableRipple feedback.
- 6b59088: Keep collapsed NavigationRail labels centered under their icons regardless of navigation stylesheet load order. Match expanded content-sized navigation targets to their visible pills, so hovering or clicking unused row space does not activate a destination; retain full-width targets for the fullWidth indicator. Prevent focus from scrolling the clipped modal rail during its width reveal.

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
