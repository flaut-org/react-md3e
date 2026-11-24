# Formatting and linting

## Prettier

The single configuration is [`.prettierrc.yaml`](../.prettierrc.yaml), containing the exact settings
requested for this repository. It uses 120 columns, two spaces, semicolons, single quotes, trailing
commas, consistent object-property quoting, and LF line endings. Prettier owns all formatting.
`.editorconfig` agrees on spaces and line endings; `.prettierignore` excludes generated artifacts.

Run `asdf exec npm run format` to format and `asdf exec npm run format:check` to validate.

## ESLint

[`eslint.config.mjs`](../eslint.config.mjs) uses
[eslint-config-airbnb-extended](https://github.com/eslint-config/airbnb-extended) 3.3.0 base and
TypeScript presets, with its React/accessibility plugins and presets for TSX. React Hooks checks
also cover standalone `*.hook.ts` hooks. ESLint 9.39.5 satisfies the preset's declared `^9.0.0` peer range;
ESLint 10 is outside that range. Versions and the npm lockfile are pinned without peer overrides.

`eslint-config-prettier/flat` follows the shared presets, disabling conflicting formatting rules.
The explicit project control-flow and spacing rules follow it so they remain active.
The shared `tsconfig.eslint.json` supplies type information for library source, Next fixture,
Storybook, tests, and build tooling. It does not replace package or consumer type checking.
`packages/react-md3e/tests/types-consumer` imports public package entries using NodeNext and Bundler profiles with
`skipLibCheck: false` to catch broken declarations and imprecise public types.

The Airbnb base remains active with these documented adaptations:

- React 19 uses automatic JSX and TypeScript props instead of React-in-scope imports, PropTypes,
  or function defaultProps. Native accessibility, hook, and component checks remain enabled.
- Named exports support the library public API and Storybook CSF.
- Source JS/TS imports and re-exports omit extensions, including type imports. CSS and JSON assets
  keep theirs. Vite and the declaration finalizer write explicit file/index paths in the package.
- Workspaces declare build/test dependencies at the root. Development dependency imports are
  allowed in configs, stories, scripts, tests, extracted style files, and the separately bundled
  theme generator. Runtime source retains dependency checks and the MUI/Emotion/Next restrictions.
- ES2022 supports `for...of` without a regenerator polyfill. Inherited-key iteration, labels, and
  with-statements stay restricted.
- Scripts and tests allow sequential awaits for startup polling, stream reads, and ordered checks.
- The CSS authoring type test intentionally imports a private type across workspace boundaries.
- The ripple controller may mutate its private `press` records; other parameter-mutation checks
  remain enabled.

## Readable control flow

The repository enforces three existing ESLint rules:

| Rule                                                                                                       | Project setting                                                           |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [`curly`](https://eslint.org/docs/latest/rules/curly)                                                      | `all`: braces for every conditional and loop body                         |
| [`@stylistic/curly-newline`](https://eslint.style/rules/curly-newline)                                     | Nonempty blocks have line breaks after `{` and before `}`                 |
| [`@stylistic/padding-line-between-statements`](https://eslint.style/rules/padding-line-between-statements) | Blank lines around declaration groups, around blocks, and before `return` |

Related adjacent `const`/`let`/`var` declarations may stay together. Existing blank lines between
separate declaration groups are preserved. The previous `newline-before-return` preference is now
covered by the padding rule rather than a second overlapping rule. These settings work with the
unchanged Prettier configuration; `curly: all` is also explicitly supported by eslint-config-prettier.

```ts
const width = surface.clientWidth;
const height = surface.clientHeight;

if (width && height) {
  const geometry = measureRipple(surface, point);

  applyGeometry(geometry);
}
```

For optional behavior, prefer a positive conditional block and keep the work inside it focused.
Separate measuring/calculating geometry from DOM creation and lifecycle orchestration when they
obscure the main flow. This is a code-organization guideline, not something whitespace rules can
fully enforce. Ripple `start` now delegates measurement to `measureRipple`, node setup to
`createRippleInk`, and only attaches the node and records the active press itself.

Use `asdf exec npm run lint:fix` followed by `asdf exec npm run format` to apply both structure and
formatting. ESLint validates the result again in `npm run check`.

Run `asdf exec npm run lint` or `asdf exec npm run lint:fix` after an initial `npm run build`.
Import resolution checks the same built package that consumers use. `npm run check` builds before
linting so a fresh clone needs no pre-existing generated files or dist output. CI runs the same
checks as separate jobs, as described below. Node is still read from `.tool-versions`.

The accessibility label rule recognizes Checkbox and Radio as custom control components, because
they contain Base UI's native label-associated inputs. This preserves checks for missing labels in
examples that compose these controls inside standard HTML labels.

SearchBar has a local accessibility-lint exception for pointer-focus delegation on its visual surface;
its native input/actions provide keyboard interaction. SearchView's named results region locally
allows a bubbling keyboard handler to navigate native child actions without changing their semantics.
These exceptions do not disable rules for other components.

## Browser test synchronization

For client navigation, scope actions to DOM belonging to the destination route. A click on a Next
Link does not guarantee that a streamed destination has replaced the old page; identical trigger
names can otherwise match the departing page. The Dialog integration test waits for /streaming and
uses its streaming-ready region. Each route must also import the CSS families used by its streamed
content; a prior page's stylesheet must not be required for correct presentation.

When a Playwright test runs AxeBuilder against a Storybook iframe, use the Storybook global
`a11y.manual:!true` in that iframe's URL globals. The addon and AxeBuilder share an axe instance;
concurrent automatic/manual scans can throw "Axe is already running". This setting is scoped to the
explicitly scanned iframe; the awaited AxeBuilder scan and its violation assertions still run, and
automatic Storybook accessibility checks remain enabled elsewhere. `!true` is Storybook's boolean
URL encoding, not the string "true".

## CI job graph

[CI](../.github/workflows/ci.yml) runs on main pushes, pull requests and manual dispatches. It is also
reused by Release's `verify` job, so release verification follows the same dependencies and checks.
The local `npm run check` command remains the sequential full validation entry point.

1. **Install dependencies** restores an exact `node_modules` cache or runs `npm ci` on a miss, then
   saves the result before downstream jobs start. The key includes the runner OS/architecture, pinned
   Node version, `.npmrc`, lockfile and workspace manifests. Root and workspace-local `node_modules` directories
   are cached together, including workspace links. There are no partial-key fallbacks.
2. **Build package** runs once and uploads `dist` plus generated theme JSON/CSS for this workflow run.
   Lint, public TypeScript consumers, package validation and unit tests require those built exports.
   Moving this build after unit tests would break a clean checkout.
3. **TypeScript**, **Lint**, **Prettier** and **Package validation** run in parallel. Matrix fail-fast
   is disabled so each check can report its own result.
4. **Unit tests** runs `test:unit` and `test:release` only after all four checks pass. `test:http` is
   separate because it starts a production Next.js server; `npm test` still runs both unit and HTTP tests.
5. **Build fixture** and **Build storybook** run in parallel after unit tests. They consume the package
   artifact and upload their production output. The fixture archive includes hidden `.next` files,
   preserves permissions/links and excludes the compiler cache.
6. **HTTP integration tests** and **Playwright** run in parallel against those production artifacts.
   Playwright needs both app builds because its servers use `next start` and the static Storybook
   preview. Running it alongside those builds would require building the apps a second time in the
   browser job. Chromium/system dependencies are installed only in the Playwright job.
7. **check** always runs and succeeds only when every preceding job succeeded. Failed, skipped or
   cancelled prerequisites make this aggregate check fail. It retains the existing required-check name.

Every downstream npm job uses the local
[restore-dependencies action](../.github/actions/restore-dependencies/action.yml), which configures
Node and restores the install job's exact cache key. A missing cache fails explicitly instead of
silently running a second install. Release's publication job uses the same dependency cache after
verification. Build artifacts are scoped to the current workflow run, retained for one day and
replaced when their producer is rerun; downstream-only retries reuse the existing artifacts.
Failed Playwright jobs retain browser diagnostics for seven days.

Cache restore/save behavior follows the official
[actions/cache guidance](https://github.com/actions/cache/blob/main/caching-strategies.md).
