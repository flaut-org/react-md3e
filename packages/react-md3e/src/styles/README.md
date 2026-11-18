# Styles

Colocated `*.styles.ts` files define objects checked with `satisfies StyleObject` from
`style-object.types.ts`. Its csstype properties support CSS variables, nested selectors, conditional
rules, keyframes, and typed `@property --*` registration descriptors without accepting arbitrary misspelled property keys. Type-level examples live
in `packages/react-md3e/src/styles/tests/style-object.types.tsx`. The type is internal authoring tooling, not a runtime/public API.

Linaria css tags interpolate the complete objects only as extraction markers. WyW/Vite evaluates
them at build time; distributed modules export class strings and component CSS entries contain
only their dependency closure. Consumers import theme CSS once and component CSS at the owning
composition boundary. CSS `@property` registrations likewise stay with their owning component;
there is no JavaScript registration call. The public styled factory and runtime sx compatibility are
not implemented. See `docs/styling-contract.md`.

`theme-tokens.ts` holds shared build-time color and typography references with default-theme
fallbacks, plus the static Expressive spring sampling. Helpers preserve precise object types through
`satisfies StyleObject`; they are evaluated during CSS extraction and do not enter UI JavaScript.
