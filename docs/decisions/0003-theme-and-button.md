# 0003: MD3 theme and first Button

Status: accepted, 2026-11-15. Supersedes the empty-package restriction of the foundation milestone.
The native-only Button and missing-ripple decisions below are superseded by
[0004](0004-button-behavior-and-object-styles.md); they describe the original slice.

## Decisions

- Follow the Theme Builder workflow: source/key colors, semantic light/dark roles, tonal palettes,
  extra-color harmonization, typography, and static design tokens.
- Use official Material Color Utilities 0.4.0 with the 2025 color specification. Keep the generator
  in the separate `/theme` entry and expose serializable output, not MCU instances.
- Bundle that entry independently: the published upstream package contains extensionless ESM imports
  that raw Node cannot resolve, whereas the bundler resolves them correctly.
- Keep color utilities and Linaria in build dependencies. Neither is imported by the distributed
  Button or ThemeProvider graph.
- ThemeProvider is a CSS-variable scope, not React context. CSS `light-dark()` and `color-scheme`
  handle light/dark/system modes. Static custom theme CSS is also supported.
- Implement the first Button on native HTML. No behavior hook or Base UI wrapper is needed for its
  current API, which keeps presentational buttons server-compatible.
- Use MD3 appearances, five Expressive sizes, two shapes, and controlled toggle selection.
- Add Storybook React/Vite using the built package and precomputed theme data. Next.js remains the
  separate production RSC and streaming integration fixture.

## Evidence and limits

Unit checks cover token generation, contrast, overrides, harmonization, immutability, and CSS
export. Browser checks cover themed styles, dimensions, nested/system modes, native keyboard and
form behavior, streamed CSS, Storybook, and accessibility.

The initial API does not include image color extraction, emphasized type styles, arbitrary
MUI-compatible theme fields, pointer-origin ripples, or velocity-preserving spring simulation. It
does not require a runtime CSS engine. See the theming and Button documentation for usage and the
exact supported surface.
