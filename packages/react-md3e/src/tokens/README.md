# Tokens

`material-tokens.ts` defines supported system roles, palette tone samples, and the baseline MD3 type
scale. Source provenance is in `docs/components/button.md` and `docs/theming.md`. The default theme
JSON is generated during the build and is not committed.

Token/color generation runs in build/server code. No generator is imported by the compiled Button or
ThemeProvider module graph.
