# Releases: where to run each step

The npm package is `@flaut-travel/react-md3e`. Its GitHub repository is
`flaut-org/react-md3e`: the npm organization and GitHub owner deliberately differ.
Only packages/react-md3e is published; the root and Next fixture remain private.

**Publishing from a developer's computer is not required.** The recommended flow below prepares
versions and publishes every release, including the first alpha, through GitHub Actions. Maintainers
review/merge PRs in GitHub. The first publication uses a temporary npm token; subsequent releases
use npm Trusted Publishing (OIDC) after the package exists.

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

## First release entirely through CI

### 1. GitHub UI: make the release tooling available

Commit/push the npm-scope and workflow changes through a normal PR into main. Enable Actions if
GitHub asks. In **Settings → Actions → General**, enable **Allow GitHub Actions to create and approve
pull requests**. This allows a release PR to be created; the bot does not approve/merge it.

Keep RELEASE_ENABLED unset until the first-publication credential is ready. Leave the committed
initial major changeset and alpha pre.json in place: CI will turn version 0.0.0 into 1.0.0-alpha.1.
**Do not run version-packages locally in this CI-first path.** If a reviewed version PR has already
prepared alpha.1, do not version again; the workflow can publish that prepared main commit instead.

### 2. npm UI: create a temporary first-publication token

The first npm package must exist before its package Settings can be used to configure a Trusted
Publisher. For the initial publication, open **npmjs.org → profile → Access Tokens → Generate New
Token** and create a granular token:

- Packages and scopes: **Read and write (publish and stage)**, restricted to the `@flaut-travel` scope.
  The scope permission must cover creating the new react-md3e package, not only existing packages.
- Enable **Bypass two-factor authentication** for noninteractive publication when required by npm.
- Choose a short expiration. The account must already have permission to publish in flaut-travel.
- Organization-administration permission alone does not grant package publication permission.

If npm/account policy does not permit a CI publishing token, use the local first-publication
alternative below, then return to the OIDC setup. Do not place a token in source, a changeset, or
an Actions repository variable. Do not send it in chat.

### 3. GitHub UI: store the token and enable Release

In **Settings → Secrets and variables → Actions → Secrets**, create a **repository secret**:

```text
NPM_BOOTSTRAP_TOKEN = the temporary npm token
```

The release job's setup-node configures npmjs.org authentication, and this secret is supplied as
NODE_AUTH_TOKEN only to the Changesets step. It is not given to PR CI or the verification job.

In the **Variables** tab, create an **Actions repository variable** (not a secret):

```text
RELEASE_ENABLED = true
```

### 4. GitHub UI → CI runner: prepare the first version PR

Open **Actions → Release → Run workflow**, select **main**, then click **Run workflow**.
This starts .github/workflows/release.yml. The runner verifies the exact commit with npm run check,
then sees the pending initial changeset and opens/updates **changeset-release/main** with
**1.0.0-alpha.1**, CHANGELOG.md, archived prerelease notes, fixture dependency and package-lock.json.

Wait for the workflow and inspect its logs/PR. This preparation run does not publish while a version
PR is still pending. Review and merge the generated PR when ready. No local login, npm publish,
version-packages, Git tag or GitHub Release command is needed in this path.

### 5. CI: publish the reviewed alpha

Merging the version PR into main starts **Release** again automatically. It verifies the merged
commit, builds/packs the UI package, publishes **@flaut-travel/react-md3e@1.0.0-alpha.1** to npm,
pushes its tag, and creates a GitHub **prerelease** using the matching changelog entry.

Inspect **Actions → Release → the run for the merged main commit**, then check **GitHub → Releases**
and the package page on npmjs.org. If the automatic run did not start, launch **Release → Run
workflow → main**. Do not launch it on a feature or release-PR branch; those branches are skipped.

### 6. npm UI: configure token-free publication

On **npmjs.org → @flaut-travel/react-md3e → Settings → Trusted publishing**, add GitHub Actions:

| Field                | Value                                                               |
| -------------------- | ------------------------------------------------------------------- |
| Organization or user | **flaut-org** — the GitHub owner, not flaut-travel                  |
| Repository           | react-md3e                                                          |
| Workflow filename    | release.yml — filename only, no .github/workflows/ prefix           |
| Environment          | Leave blank; the workflow has no named environment                  |
| Allowed actions      | Allow direct **npm publish**; stage-only permission is insufficient |

Then, in **GitHub UI**, delete the NPM_BOOTSTRAP_TOKEN repository secret; in **npm UI**, revoke that
temporary token. Subsequent runs use the existing id-token: write permission and npm's OIDC
credential discovery. Keep RELEASE_ENABLED=true. No permanent NPM_TOKEN secret is needed.

A newly configured Trusted Publisher must complete its first successful automated publication
within two days. Configure it when ready for the next genuine alpha/beta release. A no-op run of
Release does not validate it. Recreate an expired configuration if needed. After token removal,
check that the next publication succeeds through OIDC; public OIDC publications get npm provenance.

The repository does not configure external account settings or perform these UI steps for you.
Do not change the GitHub repository URL/owner just to match the npm organization name.

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

## Optional local bootstrap instead of a temporary CI token

This is an alternative to the CI-first bootstrap, not a second publication of the same version.
Keep RELEASE_ENABLED unset. **Local terminal**, release branch, repository root:

```sh
asdf install
asdf exec npm ci
asdf exec npm run version-packages
asdf exec npm run release:check
asdf exec npm exec -- playwright install chromium
asdf exec npm run check
```

Commit/review/merge the prepared candidate through a PR. **Local terminal**, updated main at the
exact reviewed release commit:

```sh
asdf exec npm login --registry=https://registry.npmjs.org
asdf exec npm run release:check
asdf exec npm publish --workspace=@flaut-travel/react-md3e --access public --tag alpha --registry=https://registry.npmjs.org
asdf exec npm run changeset -- git-tag
# For the prepared first alpha only:
git push origin '@flaut-travel/react-md3e@1.0.0-alpha.1'
```

This publishes publicly. **GitHub UI → Releases → Draft a new release:** choose that tag, copy the
matching CHANGELOG.md notes, and enable Set as a pre-release. Then follow the npm/GitHub UI OIDC
setup above and set RELEASE_ENABLED=true. Do not also trigger a second publish for the same bytes.

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
