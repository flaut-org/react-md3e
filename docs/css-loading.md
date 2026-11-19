# Route-level component CSS

Import the theme scope once, then import styles only for the component families used by a route or
composition. CSS is compiled by the library; consumers need no Linaria/WyW plugin or source scanning.

```tsx
// app/layout.tsx
import '@flaut-travel/react-md3e/theme/styles.css';
```

```tsx
// app/page.tsx — an RSC, without a client directive
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/button/styles.css';

export default function Page() {
  return (
    <ThemeProvider>
      <Button>Continue</Button>
    </ThemeProvider>
  );
}
```

Every UI subpath has a CSS export: `/button/styles.css`, `/icon-button/styles.css`,
`/calendar/styles.css`, `/range-calendar/styles.css`,
`/app-bar/styles.css`, `/dialog/styles.css`, `/list/styles.css`, `/checkbox/styles.css`,
`/radio/styles.css`, `/radio-group/styles.css`, `/avatar/styles.css`, `/text-field/styles.css`,
`/autocomplete/styles.css`, `/popover/styles.css`, `/surface/styles.css`, `/card/styles.css`,
`/shape/styles.css`, `/search/styles.css`, `/typography/styles.css`, `/skeleton/styles.css`,
`/divider/styles.css`, `/tooltip/styles.css`, `/collapsible/styles.css`, `/button-group/styles.css`, `/segmented-button/styles.css`,
`/bottom-sheet/styles.css`, `/side-sheet/styles.css`, and `/snackbar/styles.css`.

A family includes its public composition parts and transitive presentation dependencies. For example,
Button includes loading and ripple; Card includes Surface and its action/content/media parts;
Autocomplete includes TextField, row presentation, selection indicators and chips. Importing the
family does not require manually discovering these internal files. Dependencies shared by several
families reference the same private CSS assets. Framework bundlers resolve the ordinary CSS imports;
internal hashed filenames are not a public API.

The theme stylesheet contains the default ThemeProvider scope and light/dark/system declarations.
It does not include component families. Custom `createTheme`/`themeToCss` output can override its
variables as before; load custom theme CSS after the default scope. Component styles have no copy
of the default theme variables. Use a ThemeProvider scope for portal inheritance.

JavaScript exports remain CSS-free. Named imports from the package root are supported without pulling
all styles through barrel side effects. Raw Node/server theme utilities still work without a CSS
loader; server-compatible presentation does not gain hydration. Importing CSS is an explicit consumer
choice, supported in Next server route files and normal Vite/Storybook modules.

## Migrating the full stylesheet

Remove `import '@flaut-travel/react-md3e/styles.css'` from the application root. Add the theme stylesheet
there and the used family styles at each route or reusable consumer composition. Styling a deferred
component still requires its CSS: import the family at its owner or in the server shell if it must
be styled before streamed content appears. Exercise client navigation as well as direct loads.

The legacy `/styles.css` export remains an explicit all-components compatibility aggregate. It is
not imported automatically and is not used by the Next fixture or Storybook preview. Avoid mixing
it with granular imports, since doing so defeats route-level isolation. Individual Storybook stories
import their own families; only theme CSS is global to the preview.

Next may prefetch styles for linked routes and retain CSS after client navigation. Those framework
behaviors do not make the library a runtime CSS engine or imply that every route needs every family.
Use an appropriate routing/prefetch policy when measuring initial requests.

## Build and verification

Vite 7 `cssCodeSplit: true` extracts private per-module assets. A build-only plugin reads the emitted
chunk import graph and Vite CSS metadata to produce family entrypoints. It includes synchronous and
asynchronous composition dependencies, deduplicates asset paths, and preserves dependency-before-owner
order. It then removes generated CSS imports from UI JS, leaving loading to the explicit CSS exports.
This does not parse styles, generate rules in the browser, or infer usage from HTML.

`sideEffects: ['**/*.css']` keeps CSS imports alive. No component, state, variant, theme rule, media
query or keyframe is pruned based on an initial render. Shape geometry stays exclusively behind the
Shape CSS entry unless the compatibility aggregate is explicitly imported.

Package checks traverse the actual packed CSS imports, verify their paths and dependencies, and
reject Shape from Button/Autocomplete. Production HTTP and no-JavaScript browser tests verify styled
Button markup and absence of Shape rules on a Button page, while `/surfaces` still receives Shape.
The interaction/streaming/Storybook suites verify dependent states and route transitions.
