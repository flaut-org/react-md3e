# Theme

`createTheme` and `themeToCss` are exported from the separate package `/theme` entry for
server/build use. They return or export serializable MD3 roles and tokens using the official color
algorithms. Do not import the generator into UI components.

ThemeProvider is a context-free CSS scope. Its compiled styles contain default tokens; custom values
can be applied with server-rendered style attributes or a generated stylesheet. CSS color-scheme and
light-dark() select light/dark/system modes without JavaScript listeners. See `docs/theming.md`.

Typography includes 15 baseline and 15 emphasized styles with separate canonical CSS tokens.
createTypography resolves/validates shared font stacks and per-role overrides only in server/build
code; TypeScaleRole stays the 15-role catalog and TypographyTokenRole covers all 30 theme keys.
