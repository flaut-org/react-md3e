# 0002: Styling compiler selection

Status: accepted for the Button/theme slice, 2026-11-15; authoring amended by
[0004](0004-button-behavior-and-object-styles.md).

## Decision

Use Linaria 8 `css` tags in `*.styles.ts`, extracted by WyW 2 through Vite 7. CSS rules, variants,
theme defaults, and motion curves become `dist/styles.css`. The distributed style modules export
class-name strings; they do not import a styling engine.

Vite preserves UI modules. The preserve-directives plugin retains future client directives without
adding one to the root. The Node/build theme factory is a separate bundled entry.

Do not build a custom CSS compiler, runtime `sx` resolver, or MUI System adapter. A public styled
factory is outside this slice. Linaria's React styled API remains a possible future consumer
integration, but is not installed or represented as zero JavaScript.

## Evidence

- The actual Button and ThemeProvider styles compile from TypeScript, with light/dark colors,
  pseudo-classes, sizes, selected state, media queries, and a sampled spring.
- UI artifacts contain only class strings and React component logic. Package checks follow their
  imports and reject Linaria, WyW, color utilities, rule insertion, or the theme factory.
- Both Next.js/Turbopack and Storybook consume the compiled package without source aliases.
- Production browser checks cover custom/nested/system themes and styled Suspense fallback and
  content, including a client navigation.
- Interaction changes do not insert style elements.

## Limits

The selected API is class-based CSS-in-JS extraction, not a new public styled abstraction.
Consumer-authored styled extraction, additional browsers, and exhaustive CSS ordering/flash analysis
remain separate acceptance work. The current coverage does not prove every future component's RSC
boundary automatically.

References: [Linaria](https://github.com/callstack/linaria),
[WyW Vite integration](https://github.com/Anber/wyw-in-js), and
[the contract](../styling-contract.md).
