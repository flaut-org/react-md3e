# 0005: Extensionless source imports

Status: accepted, 2026-11-15. Supersedes the source `.js` spelling in 0004 at the user's request.

## Decisions

- Omit JS/TS file extensions from source imports and re-exports, including type imports.
  Keep CSS/JSON asset extensions explicit, as clarified by the user.
- Keep standard ESM output and public package exports. Vite already supplies explicit `.js`
  module specifiers in emitted JavaScript and preserves client boundaries.
- Normalize declaration module specifiers after `tsc` using TypeScript's parser and resolver.
  Resolve actual declarations rather than blindly appending `.js`, so directory indexes work.
  This is a build-only step using the existing compiler dependency.
- Enforce source spelling with ESLint and verify public package types under NodeNext and Bundler
  with `skipLibCheck: false`. No runtime resolver or consumer compiler integration is required.

## Evidence

The package build, native Node imports, consumer type checks, and production Next/Storybook fixtures
must pass with extensionless source imports. Invalid button variants must remain type errors.
