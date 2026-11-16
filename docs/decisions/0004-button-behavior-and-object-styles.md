# 0004: Base UI Button, ripple, and typed object styles

Status: accepted, 2026-11-15. Amends 0002 and 0003 at the user's request.
The source import spelling decision below is superseded by
[0005](0005-extensionless-source-imports.md).

## Decisions

- Compose Base UI Button rather than maintaining a parallel native-only behavior implementation. Its
  hooks and the pointer/keyboard ripple justify a client Button entry point. Keep the package root,
  ThemeProvider, and all style modules free of client directives.
- Preserve native button public props, ref forwarding, form behavior, and controlled selection.
  Support both decorative startIcon and endIcon in logical DOM order.
- Author every component/theme/ripple rule as a checked object using csstype-based StyleObject.
  Linaria tags mark whole objects for build-time extraction; do not write rules in CSS strings. No
  styled runtime or custom compiler is introduced.
- Implement press ripple as private interaction code plus static CSS keyframes/transitions.
  JavaScript computes geometry and manages transient ink nodes/timers, never stylesheet rules.
  Support mouse, touch delay/cancel, keyboard, assistive click, cleanup, and disableRipple. Reduced
  motion and forced colors retain static focus/state feedback.
- Keep relative .js source specifiers for emitted ESM. Vite already compiles the corresponding
  TypeScript on demand; ordinary npm consumers receive compiled JS, declarations, and CSS.

## Verification

Production Next and Storybook exercise SSR, RSC imports and streaming, Base UI interaction, icon
order in RTL, pointer-origin growth, keyboard centering, touch cancellation, and animation opt-out.
Type examples reject misspelled CSS properties and invalid modeled values, including nested rules.
Package inspection verifies preserved client directives, server-only theme imports, and absence of
style/color generation runtimes in the UI graph. Bare Node's react-server condition does not
implement client references, so it is used only for truly server-compatible modules; Next verifies
mixed root exports.
