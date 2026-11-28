# Working in react-md3e

Read `README.md`, `docs/architecture.md`, and the relevant design or migration document before
changing the package. Treat the user's current instructions as the source of task scope.

## Product contract

- Build an independent Material 3 Expressive React library named `@flaut-travel/react-md3e`.
- Use Base UI (`@base-ui/react`) for applicable interaction and accessibility primitives. Keep its
  implementation details inside our components.
- Use familiar MUI prop conventions where they fit MD3. Use native MD3 names and values where the
  designs differ; do not add MD2 aliases or silently map `contained` to `filled`.
- `sx` is optional convenience, not a foundation requirement. Colocate extracted styles in
  `*.styles.ts` when a CSS compiler is chosen.
- CSS must be generated at build time. Do not add runtime rule generation, style insertion, Emotion,
  MUI, or a mandatory client theme provider.
- Styling must never force `'use client'`. Only actual state, event handling, browser APIs, or
  interactive primitives justify a client entry point. A styled client component remains a client
  component; a server component must stay importable from RSC.
- The foundation milestone is complete. Button, IconButton, AppBar, Dialog, List/ListItem, Checkbox, Radio/RadioGroup, Avatar, TextField, Autocomplete, Chip/ChipSet, Search/SearchBar, Popover, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, BottomSheet, SideSheet, Snackbar, LoadingIndicator, ProgressIndicator, and ThemeProvider are implemented. Keep changes
  scoped to the user's requested components; do not expand the full MUI catalog.

## Structure and public API

- `packages/react-md3e` is the only publishable package. `apps/next-fixture` is a private consumer
  that imports its built package, never a TypeScript path alias to its source.
- `src/tokens`, `src/theme`, `src/styles`, `src/internal`, and `src/components` have distinct
  responsibilities documented in their READMEs and `docs/architecture.md`.
- Organize component implementation files as an ownership tree. A component used only by one
  parent lives in a named subdirectory under that parent. A component shared by multiple component
  implementations belongs at the top component level in its own directory; do not duplicate it or
  promote it solely for hypothetical future reuse. Public composition parts follow their semantic
  owner even when supplied through children.
- Component files use `component-name.component.tsx`, with their own styles/types in the same
  directory. Keep shared family styles with their owner. An `index.ts` marks an intentional export
  boundary; private child components do not require a barrel. See `docs/component-structure.md`.
- Context modules live in `contexts/*.context.ts` next to their owning component. A context shared
  by child branches belongs to their nearest common component owner.
- Component behavior and type tests live in the owner's `tests` directory, not a repository-wide
  tests tree. Hook/style/theme tests likewise live beside those modules in `tests`. Package-wide
  consumer checks belong in `packages/react-md3e/tests`; cross-component fixture integration belongs
  beside its route or in `apps/next-fixture/tests`. Exclude every source `tests` directory from library
  builds and packed artifacts.
- Internal React hooks live in `src/internal/hooks` and use kebab-case `*.hook.ts` filenames,
  for example `use-ripple.hook.ts`. Hook functions retain React naming such as `useRipple`.
- Export only intentional public APIs. Do not re-export all of Base UI or expose internal DOM
  structure as a promise of MUI compatibility.
- Preserve module boundaries and `'use client'` directives in distributed JS. Never put
  `'use client'` on the package root barrel to make a build pass.
- ESM is the initial output. Omit JS/TS file extensions in source imports and re-exports, including
  type imports. Keep CSS and JSON asset extensions explicit. Vite writes `.js` paths into emitted
  JavaScript; `scripts/finalize-declarations.mjs` resolves and normalizes emitted declaration paths
  for Node ESM. Do not reintroduce source extensions to fix a distribution issue.
- Keep CSS side effects in package metadata; `sideEffects: false` would allow CSS to be lost.
- CSS loads automatically through static implementation imports generated from Vite metadata. Keep
  the root barrel free of stylesheet imports and preserve component CSS tree-shaking. Record CSS-only
  composition dependencies in componentCss(). ThemeProvider loads its scope automatically. Preserve
  the CSS-free native Node export graph, directives and source maps. Explicit CSS exports remain
  compatibility entries; `/styles.css` is an opt-in aggregate. See `docs/css-loading.md`.
- Runtime dependencies must be intentional. React and React DOM are peer dependencies. The styling
  compiler and color/token generation tools belong in development tooling. The isolated theme
  generator bundle is the intentional public server/build utility.
- Author styles as objects checked with `satisfies StyleObject` from
  `src/styles/style-object.types.ts`. Linaria `css` tags wrap the objects only as build-time
  extraction markers. Do not write rules as CSS template strings or add an unrestricted string index
  that bypasses property validation.
- Linaria `css` tags in `*.styles.ts` compile through WyW/Vite. Read
  `docs/decisions/0002-styling-engine.md` before changing the pipeline. The distributed UI imports
  class-name strings and ordinary CSS, not Linaria or a styling runtime.
- Generate themes through the separate `/theme` entry in server/build code. Color utilities are
  build dependencies bundled only into that entry. Keep them out of the UI module graph.
- ThemeProvider is a CSS scope without hooks or React context. Preserve its RSC compatibility.
- Finite transitions use the shared --md-sys-motion-spring-* tokens. Generate standard/expressive
  curves in create-motion.ts at build/server time, never in UI code. Honor prefers-reduced-motion;
  circular progress indicator windup and sweeps also use these curves. Linear indeterminate
  progress owns two monotonic staggered passes; do not apply overshooting springs to their edges.
  LoadingIndicator owns a fixed,
  video-calibrated monotonic choreography; do not apply overshooting theme springs to its rotation.
  Continuous carrier rotations, texture phases, and interaction timers keep their own cycle timing.
  See docs/motion.md.
- Shared layout widths use theme.breakpoints and --md-breakpoint-* CSS variables. Generate native
  media conditions from the same scale at build time with createBreakpointQueries; var() is invalid
  in native @media conditions. Do not add client style observers. See docs/breakpoints.md.

## Design and source provenance

- Use official MD3 specifications, Google's Figma kit, and versioned AndroidX references. Record
  exact source URLs, revisions when available, and adaptations in design documents.
- Figma access and visual conformance must be verified, never implied. A design token generator or
  an expressive color scheme alone does not implement MD3 Expressive.
- Use CSS for predefined states, media queries, and motion where appropriate. Account for keyboard
  focus, reduced motion, forced colors, and RTL when relevant to a component.
- MUI source may be adapted. Record copied source provenance and preserve its copyright and license
  notices; remove runtime coupling to MUI's styling and theme providers.

## Migration scope

- The first consumer milestone is Flaut's complete homepage, including header, footer, search form,
  loading/error states, mobile overlays, and shared locale-layout UI.
- Use `docs/migration/homepage.md` for the audited inventory and migration sequence.
- Keep Flaut-specific fetching, analytics, currency, search, and calendar-price behavior in the
  application. Do not move business logic into this library.
- Charts and a complete icon package are later work. Existing calendar behavior may stay in the
  application; adding React Aria to this library is not part of the agreed foundation.

## Formatting and linting

- `.prettierrc.yaml` is the formatting source of truth. Preserve the user's complete configuration,
  including 120-column print width, two spaces, semicolons, single quotes, and consistent property
  quoting. Do not reintroduce a second formatter configuration or conflicting ESLint formatting rules.
- `eslint.config.mjs` uses eslint-config-airbnb-extended as its base for JavaScript, TypeScript,
  React, accessibility, and imports, with React Hooks checks and the existing library restrictions.
  `eslint-config-prettier/flat` follows the shared presets; only the explicit project control-flow and
  spacing rules follow it. ESLint 9 matches Airbnb Extended's declared peer range.
- Require braces for all `if`/`else` and loop bodies, including single statements. Nonempty blocks
  span multiple lines. Keep blank lines between declaration groups and operations, around blocks,
  and before returns; related consecutive declarations may stay together. Run `npm run lint:fix`
  followed by `npm run format` when applying these rules.
- Prefer positive conditional blocks for optional work. Keep functions focused and extract geometry,
  calculations, or DOM creation when mixing them obscures the main flow; see the ripple helpers.
- Type-aware linting uses `tsconfig.eslint.json` to cover source, fixture, stories, tests, and tooling.
  Public package types are also checked as consumers under NodeNext and Bundler with
  `skipLibCheck: false`. Build before standalone linting so public imports and generated files exist.
  Keep exceptions scoped to actual ESM, build-time dependency, or test/controller requirements; explain
  them in the config and `docs/tooling.md`. Prefer correcting code over disabling unrelated rules.

## Verification

- Follow [UI quality workflows](docs/testing/ui-quality.md) and its checklist for user-facing UI changes.
  Verify in a real browser and actually view the resulting images with available vision tooling;
  typecheck, lint and unit-test success alone cannot establish UI quality.
- Before testing any UI component or reading implementation results, complete **UI Invariant Discovery**
  in that workflow. Independently derive testable geometry, layout, motion, visual, state, interaction
  and integration invariants from accessible official sources, purpose, public contract, spatial
  relationships, user interactions and general UI quality requirements. Record constraints, justified
  exceptions, requirement sources/rationale and verification methods before observing behavior.
  Preserve the dated initial inventory and append justified revisions; existing code, snapshots and
  passing assertions cannot define correctness. Record gaps or conflicting sources explicitly.
- Investigate observed anomalies even when assertions pass. Distinguish source-supported intended
  behavior, confirmed defects and unconfirmed anomalies; unexplained behavior is neither automatically
  acceptable nor automatically a bug. Retain evidence, competing explanations and follow-up checks;
  unresolved anomalies leave affected claims UNVERIFIED, while confirmed violations remain FAIL.
- Inspect intermediate normal/reduced-motion states and integration with other components. Substantial
  component changes require independent QA via [ui-qa](.codex/agents/ui-qa.toml) or a separate session,
  followed by fixes and independent re-verification. Supply the original requirements to the reviewer.
- Before testing motion, define the permitted trajectory and spatial relationships from the component's
  contract: allowed overshoot/undershoot, viewport or parent anchoring, gaps, overlaps, clipping and coupled
  movement. Assert actual intermediate bounding rectangles with the shared spatial constraints utility;
  a correct transform or endpoint is insufficient. Overshoot is not globally forbidden. Check recording
  completeness/cadence and inspect native frames; missing samples mean UNVERIFIED, never motion PASS.
- Add a regression test for each discovered user-facing defect when feasible, with requirement IDs in
  [the specification inventory](docs/testing/ui-requirements.json). Never weaken assertions/thresholds,
  hide failures through skip/only/expected-failure markers, or add unjustified retries to pass CI.
- Never automatically approve new/changed visual baselines. Generate candidates only with the explicit
  update command, then obtain human image/diff review. Accept either an independent collaborator's
  Approve or the PR author's explicit maintainer confirmation through a Comment review containing
  only `/approve-ui-baselines`, with write access and the current head commit. Author confirmation
  must be reported as maintainer signoff. Agents must not submit either form of baseline signoff.
  Report every unexecuted check as UNVERIFIED in the final report; a screenshot's existence is not
  evidence that it was visually inspected.

- `.tool-versions` is the source of truth for the exact Node.js 26 LTS release. Install with
  `asdf install` locally and use `asdf exec` when the shell does not resolve the pinned runtime. CI
  uses `actions/setup-node` with `node-version-file: .tool-versions`. Keep npm metadata, runtime
  constraints, and Node.js types aligned.
- Install with `npm ci` after the lockfile exists. Keep exact dependency versions and commit
  lockfile changes with dependency changes.
- `npm run check` runs formatting, package build, linting, type checks, package validation,
  Next/Turbopack and Storybook builds, theme/HTTP tests, and Chromium browser/accessibility tests.
  Install the test browser with `npm exec -- playwright install chromium` locally (CI uses
  `--with-deps`). Storybook starts with `npm run storybook`.
- `npm run build` builds only the package. `npm run dev` builds it before starting Next. Run
  `npm run dev:library` separately when iterating on package source.
- Add behavior tests when components arrive. Do not substitute snapshots for keyboard, focus,
  controlled-state, RSC, or streaming checks.
- Record actual evidence for CSS extraction and server boundaries. Keep Figma parity, untested
  browsers, consumer-authored styled factories, and velocity-preserving motion outside claims unless
  they have been implemented and verified.
- User-facing changes to the publishable package must include a new `.changeset/<unique-name>.md`
  in the same change, covering new components/APIs, behavior, styles, exports, and dependency changes.
  Select only `@flaut-travel/react-md3e`: use `minor` for additive features, `patch` for fixes, and
  `major` for breaking changes. Documentation-, test-, or internal-tooling-only changes that do not
  affect the published package need no changeset. Add pending notes at the `.changeset` root; do not
  edit consumed `.changeset/pre` notes or bump versions/changelogs manually for a feature change.
- CI validates changes. Changesets 3 and `.github/workflows/release.yml` manage npmjs.org releases
  and GitHub Releases after a maintainer enables RELEASE_ENABLED on the public canonical repository.
  Read docs/releases.md before release work. Use version-packages and release:alpha/beta/stable wrappers;
  never invoke raw changeset version/publish to bypass channel/lockfile handling. Only the UI package
  is publishable. Publishing, tagging/pushing and changing visibility/settings require user authorization.
