# Releases: where to run each step

The npm package is `@flaut-travel/react-md3e`. Its GitHub repository is
`flaut-org/react-md3e`: the npm organization and GitHub owner deliberately differ.
Only packages/react-md3e is published; the root and Next fixture remain private.

**Publishing from a developer's computer is not required.** The recommended flow prepares versions
and publishes releases through GitHub Actions. Maintainers review/merge PRs in GitHub. The package
already exists following the initial alpha.1 bootstrap; subsequent publications use npm Trusted
Publishing (OIDC) exclusively. The only package registry is npmjs.org. GitHub Releases and canonical
Git tags remain part of release bookkeeping.

## Execution locations

| Action                                                    | Where                           | Workflow/command                                                         |
| --------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| Install dependencies, develop, test changes               | Local terminal, repository root | `asdf install`, `asdf exec npm ci`, `asdf exec npm run check`            |
| Add a feature release note                                | Local terminal, repository root | `asdf exec npm run changeset`; commit its .md file with the change       |
| Add a release note without a local checkout               | GitHub UI, feature PR branch    | Create `.changeset/<unique-name>.md`; example below                      |
| Validate a PR/main commit                                 | CI, automatic                   | **CI**, `.github/workflows/ci.yml`                                       |
| Rerun validation manually                                 | GitHub UI                       | **Actions → CI → Run workflow → select branch → Run workflow**           |
| Prepare versions, changelog, lockfile, fixture dependency | CI                              | **Release**, `.github/workflows/release.yml`, `npm run version-packages` |
| Review/merge the generated version PR                     | GitHub UI                       | PR from `changeset-release/main`                                         |
| Build, pack, publish, push tag, create GitHub Release     | CI                              | **Release**, `.github/workflows/release.yml`, `npm run release:ci`       |
| Start/retry release automation manually                   | GitHub UI                       | **Actions → Release → Run workflow → main → Run workflow**               |
| Request alpha/beta/stable transitions                     | Local terminal, feature branch  | Channel commands below; commit state changes and open a PR               |
| Configure credentials and enable automation               | npm/GitHub UI                   | Settings described below; no terminal command                            |

Commands marked local are run from the **repository root**, not packages/react-md3e. asdf installs
Node from .tool-versions locally. On CI, actions/setup-node reads node-version-file: .tool-versions;
the YAML runs npm directly. Do not copy local `asdf exec` commands into the Actions UI: the UI starts
a workflow, and its run steps execute the commands on the runner.

The workflows must first be committed/pushed to main to appear in Actions. Their display names are
**CI** (ci.yml) and **Release** (release.yml), not filenames of additional unpublished workflows.
The Release workflow accepts only main, the public canonical repository, and RELEASE_ENABLED=true.
There is no separate alpha.yml, beta.yml, publish.yml, or bootstrap.yml.

## Channels

| Package version | npm dist-tag | Git tag                                  | GitHub Release |
| --------------- | ------------ | ---------------------------------------- | -------------- |
| `1.0.0-alpha.1` | `alpha`      | `@flaut-travel/react-md3e@1.0.0-alpha.1` | Prerelease     |
| `1.0.0-beta.1`  | `beta`       | `@flaut-travel/react-md3e@1.0.0-beta.1`  | Prerelease     |
| `1.0.0`         | `latest`     | `@flaut-travel/react-md3e@1.0.0`         | Stable         |

Changesets 3.0.3 and changesets/action@v2 manage release PRs and notes. Our version wrapper starts
new channels at .1 and resets the counter for alpha → beta; later versions increment normally.
The publisher explicitly selects the matching npm dist-tag in its packed publish plan. A new npm
package may also receive latest on its first publication; until the stable release exists, install
an explicit channel or version. Git tags, npm aliases and GitHub's prerelease flag are independent.

**Consumer terminal**, in the consuming application's directory:

```sh
npm install @flaut-travel/react-md3e@alpha
npm install @flaut-travel/react-md3e@beta
npm install @flaut-travel/react-md3e@1.0.0-alpha.1
# After the first stable release:
npm install @flaut-travel/react-md3e
```

## Trusted Publishing setup: npm/GitHub UI

On **npmjs.org → @flaut-travel/react-md3e → Settings → Trusted publishing**, configure:

| Field                | Value                                                                        |
| -------------------- | ---------------------------------------------------------------------------- |
| Organization or user | flaut-org — the GitHub owner                                                 |
| Repository           | react-md3e                                                                   |
| Workflow filename    | release.yml — no .github/workflows/ prefix                                   |
| Environment          | Leave blank; the workflow has no named environment                           |
| Allowed actions      | Allow npm publish; stage-only permission cannot perform a direct publication |

**GitHub UI → Settings → Secrets and variables → Actions → Variables:** set RELEASE_ENABLED=true.
In **Settings → Actions → General**, enable **Allow GitHub Actions to create and approve pull
requests** so Changesets can create the version PR. The bot does not approve or merge it.

The release job has id-token: write and uses the Node/npm versions pinned by .tool-versions and
packageManager. It does not load NPM_BOOTSTRAP_TOKEN, NODE_AUTH_TOKEN or NPM_TOKEN. setup-node does
not create a token-based registry configuration for this job. The publisher requires the GitHub
OIDC environment and rejects token fallback, so a successful publication validates Trusted Publishing.
Do not introduce a named GitHub environment without updating the matching npm configuration.

Keep the existing bootstrap token while validating OIDC if desired; this workflow never reads it.
After a successful token-free release, delete NPM_BOOTSTRAP_TOKEN from GitHub's Actions secrets,
and revoke the actual token in **npm UI → Access Tokens**. These are two separate actions.
First-ever package creation needs a separate bootstrap because the Trusted Publisher configuration
belongs to an existing npm package; this OIDC-only workflow does not bootstrap new packages.

**GitHub UI → Actions → Release → Run workflow → main:** leaving the current channel state intact
runs the normal verified Changesets flow. If a version PR is pending, review/check/merge it first;
the resulting main run performs the actual OIDC publication. Do not version a second time locally.

## Regular releases: local change, GitHub review, CI publication

**Local terminal**, feature branch, repository root:

```sh
asdf exec npm run changeset
```

Select only @flaut-travel/react-md3e and choose patch/minor/major. Commit the generated .changeset
file with the feature and open a PR. Tests/docs-only changes can omit a release note. During the
initial 1.0.0 prerelease series, changes accumulate toward the target selected by the initial major
changeset. After 1.0.0, use normal SemVer for compatible fixes/additions/breaking changes.

**GitHub UI alternative**, feature PR branch: create a uniquely named file such as
.changeset/improve-button-focus.md using **Add file → Create new file**, with:

```md
---
'@flaut-travel/react-md3e': patch
---

Improve keyboard focus behavior for buttons.
```

Use release notes describing the actual change. Merge the feature PR in GitHub. **CI / release.yml**
opens/updates the version PR. Review/merge that PR in **GitHub UI**; **CI / release.yml** publishes
and creates the tag/Release. Do not run the version or publish commands locally as well.

For manual execution/retry, use **GitHub UI → Actions → Release → Run workflow → main**. It is the
same process as the main push trigger, not a separate unverified publish shortcut. The workflow
serializes releases and performs its own full checks before the release job. It does not run with
write credentials on fork PRs.

If a bot-created release PR lacks CI checks, use **GitHub UI → Actions → CI → Run workflow**, select
**changeset-release/main**, and run it. ci.yml has workflow_dispatch and can verify that branch.
GitHub's handling of GITHUB_TOKEN-created events can suppress automatic PR checks. Inspect the PR
checks before merging; repository policy may require a GitHub App integration for required checks.

## Alpha → beta → stable: request locally, version/publish in CI

**Local terminal**, on a normal maintenance branch based on the latest main, repository root:

```sh
# Change alpha to beta and create a promotion changeset:
asdf exec npm run release:beta
```

Commit the .changeset state/files, push the branch and open a PR. **GitHub UI:** merge the request
PR. **CI / release.yml:** prepare the version PR for 1.0.0-beta.1. **GitHub UI:** review/merge that
version PR. **CI / release.yml:** publish beta and create a GitHub prerelease. Later changesets
produce beta.2, beta.3, etc. Do not run this channel command inside the Actions UI.

To finish the series, **local terminal**, maintenance branch, repository root:

```sh
asdf exec npm run release:stable
```

Review the accumulated .changeset/pre notes and commit the exit state. **GitHub UI:** merge that
PR, then review/merge the generated stable version PR. **CI / release.yml:** publish 1.0.0 to latest
and create a stable GitHub Release. The version PR removes pre.json and includes accumulated notes.

For a later prerelease series, **local terminal**, maintenance branch: run npm run release:alpha,
add the appropriate minor/major changeset, then commit and open a PR. The current workflow targets
main; use a separate branch/workflow strategy if stable maintenance must continue concurrently.

## Diagnostics and recovery: choose the correct location

**GitHub UI:** inspect the failed Release run and npm/GitHub version/tag before retrying. Use
**Actions → Release → Run workflow → main** only if the reviewed release commit is still main's
tip. Already published versions are skipped; a missing local Git tag can be recreated. Never reuse
a published version for different source bytes or create a new version just to repair metadata.

If the tag already exists but its GitHub Release is missing, use **GitHub UI → Releases → Draft a
new release** with the existing tag, matching changelog and correct prerelease flag. This recovery
is manual: the Action does not fully reconcile every partial failure. If main has advanced, recover
from the original release commit/tag; do not tag newer source with the older npm version.

**Local terminal**, repository root: npm run release:check validates a prepared candidate without
publishing; npm run test:release exercises real version transitions and offline packing in temporary
repositories. **CI only:** npm run release is the publisher invoked by release:ci, not a local
maintenance command. Use wrappers instead of raw changeset version/publish so the fixture, lockfile,
numbering and npm channel stay synchronized. Keep prerelease state/files tracked.

**GitHub UI → Settings → Secrets and variables → Actions → Variables:** unset RELEASE_ENABLED to
disable release automation. Read-only CI remains enabled.

References: [Changesets prereleases](https://changesets.dev/guide/prereleases),
[Changesets automation](https://changesets.dev/guide/automating),
[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/),
[npm granular tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens/).

## Failing checks block releases

A failed test in CI is a release blocker. release.yml reuses ci.yml in its verify job, including
parallel validation, builds and production tests, and its release job has needs: verify. A failed verify
skips version PR creation/publication for that run; do not bypass it with continue-on-error.
Fix the cause, merge the fix, and run Release on the corrected main commit.
Rerunning an old failed commit does not include a local fix.

In GitHub UI, open the failed CI or Release run, then the failing named job (under verify for Release).
The aggregate check job lists all prerequisite results. Failed browser runs upload test-results/
(including retained Playwright traces) and any playwright-report/ as a playwright-shard-<index>-<attempt>
artifact on the run's summary page.
Download the artifact for diagnostics; run-attempt suffixes distinguish it.
