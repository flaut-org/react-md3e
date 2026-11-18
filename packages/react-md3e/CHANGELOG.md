# @flaut-travel/react-md3e

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
