# Contributing

Install Node.js with `asdf install` using the exact Node.js 26 LTS version in `.tool-versions`. Use
its bundled npm; run `asdf exec npm ci` to install dependencies. Keep `.tool-versions`,
`package.json` runtime constraints, and Node.js types aligned when updating the runtime. Changes to
dependencies include the root `package-lock.json`. Dependencies use exact versions.

Read `AGENTS.md` and the relevant architecture or migration document. Public documentation and
source identifiers use English. Add public component exports only with their implementations and
documented behavior.

Library components use an ownership tree: private components are nested under their parent, and
components reused by multiple parents live at the top component level. Each component implementation
uses `component-name.component.tsx`, with its styles/types alongside it. Contexts belong in the
owner's `contexts` directory; tests belong in its `tests` directory. Package/fixture integration
checks stay with their package/application. Read [the complete structure contract](docs/component-structure.md).

Internal React hooks live in `packages/react-md3e/src/internal/hooks`. Hook files use kebab-case
`*.hook.ts` names, for example `use-ripple.hook.ts`; the exported function remains `useRipple`.
Keep these hooks private unless their public API is explicitly introduced.

Source imports and re-exports omit JS/TS file extensions; CSS and JSON assets retain theirs.
ESLint enforces this for value and type imports. The library build adds ESM-compatible paths to
JavaScript and declarations; see [module resolution](docs/module-resolution.md). Public package
consumer checks cover both NodeNext and Bundler with `skipLibCheck: false`.

Install Chromium once with `asdf exec npm exec -- playwright install chromium`. Before submitting a
change, run:

```sh
asdf exec npm run check
```

Formatting uses the exact `.prettierrc.yaml` configuration (120 columns, two spaces, semicolons,
single quotes, consistent property quoting). Run `npm run format` to apply it. ESLint is based on
`eslint-config-airbnb-extended`; Prettier owns formatting through `eslint-config-prettier/flat`.
Explicit ESLint rules require braces and multiline nonempty blocks, plus blank lines around declaration
and control-flow groups. Related consecutive declarations may remain together. Prefer positive
conditional blocks and small helpers for optional work. Apply fixes with `npm run lint:fix`, then
`npm run format`.
See [tooling](docs/tooling.md) for the supported versions and scoped adaptations.

For focused work, use the commands in the root README. Build the package before standalone linting, type-checking, or
building the consumer fixture because these checks resolve distributed entry points. `npm run check`
performs the initial build automatically.

When changing components, include their relevant keyboard, focus, controlled-state, and visual
checks. A change to the styling pipeline also needs production Next/Turbopack, RSC boundary, emitted
CSS, and client bundle evidence. Explain what was actually verified.

Use official design references and record adaptations. Keep inherited copyright and license notices
when copying source. Base UI is a dependency, not a replacement for our design API.

User-facing package changes include a changeset: `asdf exec npm run changeset`. Documentation and
internal tooling changes can omit it. Use the release wrappers for versioning; only the UI package
is publishable. `npm run pack` creates a local tarball for review. Read [Releases](docs/releases.md)
for alpha/beta/stable, the first npm publication, OIDC, GitHub Releases, and recovery.
