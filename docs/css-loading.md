# Automatic component CSS

Import components from the package root or their subpaths. Their implementation modules load
precompiled CSS automatically; consumers need no stylesheet imports, compiler plugin or source scanning.

```tsx
// app/page.tsx — a React Server Component
import { Button, Checkbox, ThemeProvider } from '@flaut-travel/react-md3e';

export default function Page() {
  return (
    <ThemeProvider colorScheme="light">
      <Button>Continue</Button>
      <Checkbox aria-label="Accept terms" />
    </ThemeProvider>
  );
}
```

`import { Button } from '@flaut-travel/react-md3e/button'` loads the same styles. A production
bundler with tree-shaking includes the used implementations and their CSS dependencies. The root
barrel has no stylesheet imports. `sideEffects: ['**/*.css']` preserves the CSS of retained modules
while allowing unrelated JavaScript and its CSS imports to be removed.

ThemeProvider automatically loads its default scope, color-scheme declarations and theme variables.
It remains a server-compatible CSS scope without hooks or React context. Components without a
provider still have their existing token fallbacks. Color generation stays in the separate `/theme`
server/build utility, which imports no CSS.

## Dependencies and ordering

Vite 7 and Linaria/WyW continue to extract private per-module assets with `cssCodeSplit: true` and
`preserveModules: true`. The existing `componentCss()` build plugin reads the final
`viteMetadata.importedCss` after Vite removes pure CSS chunks. It generates ordinary static imports
in the modules that own those assets, with relative paths to their canonical extracted files.
It does not attach a component's entire dependency closure to a public JavaScript barrel.

Ordinary JavaScript dependencies bring their own styles: Button includes its loading spinner and
ripple; Checkbox includes shared selection-control and SelectionIndicator presentation;
Autocomplete includes TextField, chips, MenuSurface/MenuItemContent and selection presentation.
Shared assets keep the same URLs and are deduplicated by the consumer bundler.

Public composition parts passed through ReactNode can be absent from an owner's import graph.
The build-time `compositionCssDependencies` table attaches Search's CSS closure to AppBar's
implementation, and the complete Menu closure to SplitButton's implementation. This preserves the
existing family contracts without importing another interaction implementation just for its CSS.
New composition-only dependencies must be recorded in this table.

Traversal uses stable import and metadata order, with declared composition dependencies before the
owner. Existing `use client` directives stay first, ahead of every import. Whole unmapped lines are
inserted after the directive prologue; existing source-map columns and source deltas remain intact.
The emitted maps and their Node equivalents are checked against each other at original source
locations. Repeated Vite consumer builds check deterministic assets and CSS order.

Custom `themeToCss` output should follow the default scope in the cascade. Prefer a distinct custom
class such as `.brand-theme` on ThemeProvider (or a more specific selector) instead of depending on
framework chunk order for equal-specificity overrides. Application-authored component overrides
likewise need deliberate specificity/layer ordering. No runtime rules, registry, style insertion,
DOM styling engine or extra hydration is introduced.

## Next.js Webpack root imports

Next.js 16.4.6 Webpack traverses all exports of an RSC barrel before pruning unused CSS. A plain
root import consequently collects unrelated component CSS even with `sideEffects` set correctly;
rewriting the emitted barrel as direct re-exports does not change that behavior. Enable Next's
package-import optimization for root named imports:

```ts
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: ['@flaut-travel/react-md3e'],
  },
};
```

This is a Next experimental setting and is required for the verified Webpack root-import CSS
isolation. The fixture and CI exercise that configuration. Turbopack and Vite prune root imports
without this setting. See [Next's package-import documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports)
and [its documented RSC barrel limitation](https://nextjs.org/blog/next-14-2).

Alternatively, use only component subpaths, including the new `/theme-provider` entry. This works
in Webpack without `optimizePackageImports` and without importing any CSS manually:

```tsx
import { Button } from '@flaut-travel/react-md3e/button';
import { Checkbox } from '@flaut-travel/react-md3e/checkbox';
import { ThemeProvider } from '@flaut-travel/react-md3e/theme-provider';
```

`npm run build:webpack-subpaths` verifies this independent production configuration. Avoid mixing
a root UI import into that composition when using Webpack without the optimization.

## Native Node and SSR compatibility

Native Node rejects `.css` imports with `ERR_UNKNOWN_FILE_EXTENSION`. To preserve ordinary Node
imports and the existing native `--conditions=react-server` checks without a loader, the same build
also emits a CSS-free ESM graph under `dist/node`. Its implementation, relative imports and client
directives are identical; only automatic CSS imports are absent. Source maps point to the same
original files. This duplicates the UI JavaScript in the package archive, not the application bundle.

UI export conditions are ordered `types`, `module`, `browser`, `node`, `import`, `default`:

- Vite, Next Webpack and Next Turbopack select the styled `module`/`browser` graph. Both the server
  and browser builds can collect static CSS without changing React's server/client boundaries.
- Native Node, including `react-server`, selects the CSS-free `node` graph. The existing limitation
  remains: raw Node does not interpret React client references, so its `react-server` checks import
  server-only implementations; Next verifies mixed compositions and the package root.
- Other CSS-aware bundlers use the styled `import`/`default` graph. A bundler that includes `node`
  but neither `module` nor `browser` must enable `module` during dependency resolution to collect
  automatic CSS. Do not enable `module` in native Node without a CSS loader.

The `/theme` generator is unchanged and always directly importable in Node. An externalized SSR
Node dependency intentionally selects the CSS-free graph; its paired client build must process the
styled graph to emit CSS. An HTML-only Node renderer without any CSS-aware bundling step must use
explicit CSS exports or its own asset pipeline. Native Node cannot deliver styles by itself.

References: [Node conditional exports](https://nodejs.org/api/packages.html#conditional-exports),
[Vite SSR conditions and externalization](https://vite.dev/config/ssr-options).

## Migrating explicit styles

Remove manual library CSS imports from routes, layouts and reusable compositions. ThemeProvider
loads `/theme/styles.css`'s assets automatically; each used component brings its own styles.
Storybook stories and the Next/Vite fixtures demonstrate this usage.

All existing `/<component>/styles.css` and `/theme/styles.css` exports remain available, including
their transitive/composition closures. `/styles.css` remains an optional aggregate for the full
catalog. These entries preserve older consumers and support non-bundled HTML asset pipelines.
Avoid mixing the aggregate or legacy family wrappers with automatic imports: consumer bundlers
can deduplicate canonical assets, but wrappers can change ordering, and the aggregate intentionally
defeats component CSS tree-shaking.

Next can prefetch linked routes and retain CSS after navigation. Initial requests, route changes,
streaming and lazy imports are tested separately. Framework chunk merging and retention are outside
the library's ordering contract; no claim is made that navigation unloads unused CSS.

## Verification

`npm run check` includes packed-asset/import/source-map checks, native Node and react-server imports,
strict public types, Next App Router production builds with Turbopack and Webpack, independent Vite
root/subpath/composition/lazy production builds, Storybook, HTTP and Chromium checks.

The acceptance fixtures render Button, Checkbox and ThemeProvider without manual imports, including
with browser JavaScript disabled. Tests reject unrelated Shape, Calendar, Slider, Menu and AppBar
styles from the Button/Checkbox routes, count shared ripple/theme output, check CSSOM duplication,
and enforce CSS byte budgets. Other routes verify transitive/shared and composition-only styles,
portals, client navigation and styled streamed content. Vite root and subpath builds must have equal
CSS byte counts. Browser checks preserve the existing Chromium-only support claim.

The 2026-11-25 Vite reference measurement uses identical markup for automatic root imports and a
compatibility case selecting the CSS-free Node graph plus explicit theme/Button/Checkbox CSS entries:

| Consumption                   | CSS bytes | CSS gzip bytes | Application JS bytes |
| ----------------------------- | --------: | -------------: | -------------------: |
| Automatic root imports        |    37,642 |          5,874 |              244,169 |
| Automatic subpath imports     |    37,642 |          5,828 |              244,169 |
| Legacy explicit CSS reference |    37,642 |          5,794 |              244,169 |

The JavaScript measurement includes React and fixture hydration. Automatic imports add no application
JavaScript or raw CSS; differing CSS order costs 80 gzip bytes against the explicit reference. Isolated
root imports without ThemeProvider emit 13,582 CSS bytes for Button and 10,002 for Checkbox;
ThemeProvider alone emits 15,516. The existing extracted CSS catalog is unchanged; the new ThemeProvider subpath adds only a
compatibility CSS wrapper. The native Node graph adds approximately 325 kB of uncompressed JavaScript
to the package archive, plus its source maps; consumer bundlers select only one graph.
