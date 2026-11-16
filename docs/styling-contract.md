# Styling contract

Status: requirements accepted; Linaria extraction implemented for all current components, including
Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, BottomSheet, SideSheet and Snackbar. See
`decisions/0002-styling-engine.md` for evidence and remaining scope.

## Required behavior

All CSS rules, selectors, media queries, theme rules, keyframes, and predefined variants are
generated at build time and delivered as normal CSS assets. No browser CSS rule generation, style
insertion registry, or Emotion-style hydration is allowed.

`styled` must be usable in a server-importable `*.styles.ts` module without `'use client'`, React
context, or a client-only theme provider. Its use must not introduce a client boundary into a
presentational component.

This does not prohibit normal server rendering or JavaScript for interactive component behavior.
Choosing a precompiled class or forwarding a value to an existing CSS variable is different from
generating CSS rules. Prop functions that calculate dynamic values must be identified explicitly; do
not describe their browser execution as zero work.

## Authoring

Current authoring uses typed objects in colocated `*.styles.ts`, checked with
`satisfies StyleObject` (csstype). Linaria `css` tags only interpolate these objects as extraction
markers; WyW/Vite turns them into static CSS. Nested selectors, media queries, custom properties,
and keyframes share the same checked object format. Do not use untyped catch-all string keys. CSS
types check property names and modeled values; they do not validate every possible CSS string. A
public `styled` factory is not implemented. A future styled API must meet the same server boundary
requirements; do not build a new compiler or runtime MUI compatibility resolver.

`sx` is optional convenience. Moving styles out of JSX is an accepted migration cost. There is no
foundation requirement for arbitrary `sx` callbacks, MUI System aliases, or runtime merging of style
objects.

Use static variants, attributes, and selectors for finite states. Use CSS custom properties for
genuine runtime values when necessary. Keep responsive layout in CSS where possible. Do not use
browser media-query hooks merely to choose presentation styles.

## Theme

Represent reference, system, and component tokens explicitly. Generate light/dark token sets ahead
of time. Prefer CSS custom properties that can change through a root selector without regenerating
rules or rerendering server presentation.

A small theme preference controller may run on the client to handle user preference and system mode.
It is separate from style generation and must not be required by static presentation. The consumer's
initial theme strategy must account for first-paint flashes.

Theme helpers such as spacing or breakpoints may be pure build-time functions. Do not reintroduce
MUI's client context by importing its theme utilities into the library.

## Distribution and consumption

Build and distribute the library's own CSS. Standard consumption of implemented components must not
require the consumer to scan the library's source or install its compiler.

Consumer-authored `styled` extensions are a separate integration: they may require the same compiler
in the consumer's build. Document that requirement honestly. Precompiling the library does not
automatically compile a consumer's `styles.ts`.

Define CSS loading, ordering, scope, cascade layers, and per-component splitting when the engine is
chosen. Never configure `sideEffects: false` for a package that imports CSS.

## Compiler acceptance evidence

Before accepting a compiler, verify all of the following in the production fixture:

1. A presentational component imports `styled` from a server module without a client directive or
   runtime theme context.
2. Light/dark styles, a responsive condition, an interaction state, and a static variant become CSS
   files at build time.
3. The consumer imports the built package rather than source aliases.
4. Next.js dev and production Turbopack builds both work.
5. A styled Suspense fallback and delayed content stream without missing styles or order dependent
   flashes, including after client navigation.
6. Server-only presentation does not add a client boundary. Inspect the browser chunks and
   manifests; do not infer this from the absence of a handwritten directive.
7. The emitted client artifacts do not contain a runtime CSS engine. List any remaining
   class-selection or dynamic-variable helper and explain its purpose.
8. Consumer-authored `styled` extensions work under their documented integration.

The Button/theme slice now verifies emitted CSS, UI graph isolation, production Next/Turbopack and
Storybook consumption, scoped/system themes, interaction without style insertion, and streamed
styled content. Base UI and pointer-origin ripple justify the Button client boundary; ThemeProvider
and its style module retain their server boundary. Consumer-authored styled extraction and
exhaustive flash/order analysis are not yet implemented or claimed.
