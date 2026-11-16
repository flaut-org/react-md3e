# Releases

The package is published publicly to **npmjs.org** as `@flaut-org/react-md3e`.
GitHub Releases contain the changelog and a Git tag; they are separate from the npm registry.
Only `packages/react-md3e` is publishable. The workspace root and Next fixture remain private.

Changesets **3.0.3** manages release notes and version plans; `changesets/action@v2` creates release
PRs and GitHub Releases. Use the repository wrappers below to keep prerelease numbering, the
private consumer dependency, and package-lock.json synchronized. Node comes from `.tool-versions`
through asdf locally and `actions/setup-node` in both workflows.

## Channels

| Package version | npm dist-tag | Git tag                               | GitHub Release |
| --------------- | ------------ | ------------------------------------- | -------------- |
| `1.0.0-alpha.1` | `alpha`      | `@flaut-org/react-md3e@1.0.0-alpha.1` | Prerelease     |
| `1.0.0-beta.1`  | `beta`       | `@flaut-org/react-md3e@1.0.0-beta.1`  | Prerelease     |
| `1.0.0`         | `latest`     | `@flaut-org/react-md3e@1.0.0`         | Stable         |

Our version wrapper starts each channel at `.1`, rather than Changesets' usual `.0`, and resets
its counter when moving alpha → beta. Further releases increment normally: alpha.2, beta.2, etc.
The publisher forces the planned npm tag to match the version, including before the first stable
release. Changesets' default plan can otherwise select latest for an existing prerelease-only package.

For a brand-new npm package, the registry may also assign latest to its first publication. Until
1.0.0 exists, consumers should explicitly install `@alpha`, `@beta`, or an exact version. Subsequent
prereleases use their own channel; stable publication sets latest. These aliases are independent
from Git tags and GitHub's prerelease flag.

```sh
npm install @flaut-org/react-md3e@alpha
npm install @flaut-org/react-md3e@beta
npm install @flaut-org/react-md3e@1.0.0-alpha.1
# After the first stable release:
npm install @flaut-org/react-md3e
```

## One-time bootstrap

Nothing is published just by committing these files. Release automation remains disabled until
`RELEASE_ENABLED=true`, the canonical repository is public, and the workflow runs on main.
Changing repository visibility is a maintainer action, separate from this implementation.

1. Push the repository and change `flaut-org/react-md3e` to public when ready.
2. Confirm you control the `flaut-org` scope on **npmjs.org** and can publish a public package there.
3. Under GitHub Settings → Actions → General, enable **Allow GitHub Actions to create and approve
   pull requests**. This permits the release PR; the bot does not approve or merge it.
4. Keep `RELEASE_ENABLED` unset while bootstrapping the first package. The committed alpha state and
   initial major changeset prepare `1.0.0-alpha.1`. On a release preparation branch, run:

   ```sh
   asdf install
   asdf exec npm ci
   asdf exec npm run version-packages
   asdf exec npm run release:check
   asdf exec npm exec -- playwright install chromium
   asdf exec npm run check
   ```

   Review/commit the version, CHANGELOG.md, .changeset state, fixture dependency and lockfile together.
   Merge that PR through normal CI. Do not run version-packages again before publishing that candidate.

5. The first npm package must exist before its npm Trusted Publisher can be configured. From the
   exact reviewed main commit with version `1.0.0-alpha.1`, publish once using your npm login/2FA:

   ```sh
   asdf exec npm login --registry=https://registry.npmjs.org
   asdf exec npm run release:check
   asdf exec npm publish --workspace=@flaut-org/react-md3e --access public --tag alpha --registry=https://registry.npmjs.org
   ```

   prepack builds the package. Verify the package/version and dist-tags in npm. This command performs
   an actual public publication; do it only when the reviewed candidate is ready.

6. Create/push its tag from that same main commit and create its GitHub Release as a **prerelease**.
   Use the corresponding CHANGELOG.md entry as release notes:

   ```sh
   asdf exec npm run changeset -- git-tag
   git push origin '@flaut-org/react-md3e@1.0.0-alpha.1'
   ```

   In GitHub Releases, choose that exact tag, enter the release notes, and enable **Set as a pre-release**.

7. On npmjs.org → package → Settings → Trusted publishing, add GitHub Actions with:

   - Organization/user: `flaut-org`
   - Repository: `react-md3e`
   - Workflow filename: `release.yml`
   - Environment: leave blank (the workflow does not name an environment).

   This uses GitHub-hosted runners and OIDC (`id-token: write`). No NPM_TOKEN secret is required.
   npm generates provenance for public packages published from public repositories through OIDC.
   Follow npm's current expiry/validation instructions when creating the trusted publisher.

8. Add the GitHub **Actions repository variable** `RELEASE_ENABLED` with value `true` when ready for
   subsequent automated releases. This is a variable, not a secret. The release workflow can now
   run on main pushes or manually through Actions → Release → Run workflow.

The setup does not create an npm organization, publish a package, change repository visibility,
configure npm Trusted Publishers, or change GitHub account/repository settings for you.

## Regular changes and release PRs

For user-facing package changes, add a changeset with an English release note:

```sh
asdf exec npm run changeset
```

Select only `@flaut-org/react-md3e`, and choose patch/minor/major. After 1.0.0, use normal SemVer:
patch for compatible fixes, minor for compatible additions, major for breaking changes. During the
initial 1.0.0 prerelease series, additional changes accumulate toward 1.0.0; the first major changeset
has already selected that target. Tests/docs-only work can omit a changeset.

Merge the feature PR. The Release workflow verifies that exact main commit with `npm run check`,
then opens/updates `changeset-release/main` with versions and notes. Review and merge that release PR
when ready. The next main run verifies the candidate, builds/packs it, publishes to the matching npm
channel, and creates its Git tag/GitHub Release. Alpha/beta releases are marked prerelease.

The workflow serializes releases, preserves pending runs, and grants registry OIDC only in the
release job after verification. It never runs with write credentials on a fork PR. All Node setup
steps read `.tool-versions`. Check PR status before merging: GitHub restricts workflows triggered by
GITHUB_TOKEN-created commits, so a bot-created release PR may need a manually dispatched CI check
on its branch or an approved repository GitHub App integration. The release workflow also performs
its own full verification of the merged commit.

## Alpha → beta → stable

On a normal feature/maintenance branch based on the current main:

```sh
# Changes alpha to beta and adds a promotion changeset:
asdf exec npm run release:beta
```

Commit the changed .changeset files and merge the PR. Automation prepares `1.0.0-beta.1` as a release
PR. Additional beta changesets produce beta.2, beta.3, and so on. The base stays 1.0.0.

When beta is ready:

```sh
asdf exec npm run release:stable
```

Commit the exit state and merge the PR. Automation prepares `1.0.0`, includes the accumulated
prerelease notes, and removes pre.json. Review .changeset/pre notes before exiting; remove or edit
notes that are only relevant between prereleases. Never delete them merely to advance a counter.
The stable release is published with latest and without the GitHub prerelease flag.

For a later prerelease series (for example 1.1.0-alpha.1), run `npm run release:alpha`, add a minor
changeset, and merge those changes together. Use a separate prerelease branch/workflow strategy if
stable maintenance must continue concurrently; the current automation intentionally targets main.

## Local commands and recovery

- `npm run version-packages`: prepare versions/notes, start new channels at .1, synchronize the
  fixture and refresh the lockfile offline. Does not publish, commit or push.
- `npm run release:check`: validate a prepared version, channel, registry, changelog and lockfile.
- `npm run test:release`: exercise real Changesets alpha/beta/stable transitions in temporary Git
  repositories and validate channel plans; no publishing or network registry access.
- `npm run release`: CI-only publisher; validates the candidate, overrides the publish plan's tag,
  packs the publishable library and passes the artifact to Changesets. It preserves Changesets'
  output contract so the Action can create GitHub tags/releases. Local calls are refused.

Use the wrappers instead of raw `changeset version` and `changeset publish`. Keep .changeset/pre.json
and .changeset/pre tracked. Publishing a version is immutable: never reuse it for different bytes.
On a failed workflow, inspect npm and GitHub before retrying. Rerun **Release on the same reviewed main
commit** when it remains the tip. Already published versions are skipped, and a missing local Git tag
can be recreated. Do not create an empty new version merely to repair GitHub metadata.

If a tag was already pushed but its GitHub Release was not created, create that Release manually
from the existing tag and matching changelog, with the correct prerelease flag. The Action does not
fully reconcile existing tags/releases after every partial failure. If main has advanced, recover
from the original release commit/tag; do not tag newer source as the older npm version. Dist-tag
repair, if needed, can be done with an authenticated maintainer npm session after checking versions.
Disable automation by unsetting RELEASE_ENABLED. This leaves ordinary read-only CI enabled.

References: [Changesets prereleases](https://changesets.dev/guide/prereleases),
[Changesets automation](https://changesets.dev/guide/automating),
[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/),
[npm distribution tags](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/).
