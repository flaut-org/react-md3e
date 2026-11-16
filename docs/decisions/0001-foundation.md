# 0001: Repository foundation

Status: accepted foundation, 2026-11-14. Its empty-package restrictions are superseded by
`0003-theme-and-button.md` on 2026-11-15.

## Context

Flaut currently uses React, Next.js, MUI, and Emotion. The new library should own Material 3
Expressive appearance and its update pace, preserve useful API conventions, and avoid runtime CSS
generation and styling-induced hydration.

The user explicitly deferred components until the repository foundation is prepared. The first
consumer milestone is the complete homepage, rather than a site-wide primitive swap.

## Decisions

- Use npm workspaces with one library package and a private Next.js integration fixture.
- Use TypeScript, ESM output, exact dependency versions, and a committed root lockfile.
- Pin the exact Node.js 26 LTS runtime in `.tool-versions`. Install locally with asdf; CI uses
  `actions/setup-node` with `node-version-file: .tool-versions` (updated 2026-11-15).
- Name library component implementations `component-name.component.tsx`.
- Keep React and React DOM as peers; initially support React 19.
- Use Base UI for applicable interaction primitives.
- Use native MD3 names/values where its specification differs from MD2.
- Make `sx` optional and accept migration to colocated static styles.
- Require build-time CSS and server-compatible styling without client theme context.
- Preserve module boundaries with an unbundled TypeScript build. Add a CSS build pipeline only when
  its compiler is selected and validated.
- Add real production Next/Turbopack and HTTP streaming checks from the beginning.
- Keep the package entry empty during this milestone. Do not implement tokens or controls.
- Add CI validation without publication or deployment automation.

## Consequences

The fixture and artifact checks provide a working development baseline. They cannot prove the
behavior or styling cost of components that do not exist yet.

Native MD3 values require explicit consumer changes. MUI source can still be adapted with
appropriate provenance. Base UI is an intentional behavioral dependency; a third-party styled MD3
library is not part of the architecture.

## Tooling compatibility

TypeScript 6 is pinned because the selected typescript-eslint release supports TypeScript versions
below 6.1. ESLint 10 is used with its compatible React hooks plugin. The current jsx-a11y release
does not declare ESLint 10 support and is not installed; component-level accessibility behavior
checks will be added with real controls.
