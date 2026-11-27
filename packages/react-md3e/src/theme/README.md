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

The shared default application breakpoint scale lives in internal/breakpoints.ts, independent of
the generator, and is also used by picker capability queries. create-breakpoints.ts validates custom
scales. createTheme serializes the selected scale into
--md-breakpoint-xs/sm/md/lg/xl tokens. createBreakpointQueries exports native up/down conditions
only from /theme for build-time CSS authoring. Never put var() in media query conditions or install
client-side style observers to imitate them. See docs/breakpoints.md.

MotionScheme selects standard/expressive independently of the color variant. create-motion.ts
converts the six official springs to CSS linear() data only in server/build code. ThemeProvider
inherits/resets the resulting CSS tokens without runtime physics or context. See docs/motion.md.
