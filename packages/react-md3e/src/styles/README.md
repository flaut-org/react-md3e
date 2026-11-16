# Styles

Colocated `*.styles.ts` files define objects checked with `satisfies StyleObject` from
`style-object.types.ts`. Its csstype properties support CSS variables, nested selectors, conditional
rules, and keyframes without accepting arbitrary misspelled property keys. Type-level examples live
in `packages/react-md3e/src/styles/tests/style-object.types.tsx`. The type is internal authoring tooling, not a runtime/public API.

Linaria css tags interpolate the complete objects only as extraction markers. WyW/Vite evaluates
them at build time; distributed modules export class strings and `styles.css` contains all rules.
Consumers import that stylesheet once. The public styled factory and runtime sx compatibility are
not implemented. See `docs/styling-contract.md`.

`theme-tokens.ts` holds shared build-time color and typography references with default-theme
fallbacks, plus the static Expressive spring sampling. Helpers preserve precise object types through
`satisfies StyleObject`; they are evaluated during CSS extraction and do not enter UI JavaScript.
