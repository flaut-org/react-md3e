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
linting so a fresh clone needs no pre-existing generated files or dist output. CI runs this command;
Node is still read from `.tool-versions`.

The accessibility label rule recognizes Checkbox and Radio as custom control components, because
they contain Base UI's native label-associated inputs. This preserves checks for missing labels in
examples that compose these controls inside standard HTML labels.

SearchBar has a local accessibility-lint exception for pointer-focus delegation on its visual surface;
its native input/actions provide keyboard interaction. SearchView's named results region locally
allows a bubbling keyboard handler to navigate native child actions without changing their semantics.
These exceptions do not disable rules for other components.
