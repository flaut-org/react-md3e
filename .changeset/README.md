# Changesets

Run `asdf exec npm run changeset` for user-facing package changes. Select only
`@flaut-travel/react-md3e`. Documentation/tooling-only changes do not require a release.

Use `npm run version-packages`, not the raw version command: our wrapper starts each
prerelease channel at `.1` and refreshes the npm lockfile. The initial major changeset
and alpha prerelease state prepare the first release as `1.0.0-alpha.1`.

See [release instructions](../docs/releases.md) for setup, alpha/beta/stable transitions,
bootstrap publishing, and recovery. Never edit consumed prerelease files just to bump a version.
