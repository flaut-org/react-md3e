import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const workspace = fileURLToPath(new URL('../../', import.meta.url));
const { releaseMetadata, versionPackages, changeChannel, checkRelease, applyDistTag } = await import(
  pathToFileURL(path.join(workspace, 'scripts/release.mjs')).href
);
const lib = 'packages/react-md3e/package.json';

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'react-md3e-release-'));

  for (const file of ['package.json', 'package-lock.json', lib, 'apps/next-fixture/package.json']) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await cp(path.join(workspace, file), path.join(root, file));
  }

  const pkg = JSON.parse(await readFile(path.join(root, lib), 'utf8'));

  pkg.version = '0.0.0';
  await writeFile(path.join(root, lib), JSON.stringify(pkg));
  await mkdir(path.join(root, '.changeset'));
  await cp(path.join(workspace, '.changeset/config.json'), path.join(root, '.changeset/config.json'));
  await writeFile(
    path.join(root, '.changeset/initial.md'),
    "---\n'@flaut-org/react-md3e': major\n---\n\nInitial library release.\n",
  );
  await symlink(path.join(workspace, 'node_modules'), path.join(root, 'node_modules'), 'dir');
  execFileSync('git', ['init', '--initial-branch=main', root], { stdio: 'pipe' });
  execFileSync('git', ['add', '.changeset', 'package.json', 'package-lock.json', 'packages', 'apps'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Release test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'Fixture'],
    {
      cwd: root,
      stdio: 'pipe',
    },
  );

  return root;
}

async function addPatch(root) {
  await writeFile(
    path.join(root, '.changeset/patch.md'),
    "---\n'@flaut-org/react-md3e': patch\n---\n\nFix a component.\n",
  );
}

test('release channels map to explicit npm tags and monorepo Git tags', () => {
  assert.deepEqual(releaseMetadata('1.0.0-alpha.1'), {
    version: '1.0.0-alpha.1',
    distTag: 'alpha',
    prerelease: true,
    gitTag: '@flaut-org/react-md3e@1.0.0-alpha.1',
  });
  assert.equal(releaseMetadata('1.0.0-beta.1').distTag, 'beta');
  assert.equal(releaseMetadata('1.0.0').distTag, 'latest');
  assert.equal(releaseMetadata('1.0.0').prerelease, false);

  for (const version of ['0.0.0', '1.0.0-alpha.0', '1.0.0-rc.1', '1.0.0-beta.01', '1.0.0+local', 'garbage']) {
    assert.throws(() => releaseMetadata(version));
  }
});

test('real Changesets transitions alpha.1 → alpha.2 → beta.1 → beta.2 → stable, preserving lock and notes', async () => {
  const root = await fixture();

  try {
    await changeChannel('alpha', root);
    await assert.rejects(() => checkRelease(root));
    await versionPackages(root);
    assert.equal((await checkRelease(root)).version, '1.0.0-alpha.1');
    await addPatch(root);
    await versionPackages(root);
    assert.equal((await checkRelease(root)).version, '1.0.0-alpha.2');
    await changeChannel('beta', root);
    await assert.rejects(() => checkRelease(root), /channel/);
    await versionPackages(root);
    assert.equal((await checkRelease(root)).version, '1.0.0-beta.1');
    await addPatch(root);
    await versionPackages(root);
    assert.equal((await checkRelease(root)).version, '1.0.0-beta.2');
    await assert.rejects(() => changeChannel('alpha', root));
    await changeChannel('stable', root);
    await versionPackages(root);
    assert.equal((await checkRelease(root)).version, '1.0.0');
    await addPatch(root);
    await versionPackages(root);
    assert.equal((await checkRelease(root)).version, '1.0.1');
    await changeChannel('alpha', root);
    await writeFile(
      path.join(root, '.changeset/next-minor.md'),
      "---\n'@flaut-org/react-md3e': minor\n---\n\nNext feature release.\n",
    );
    await versionPackages(root);
    assert.equal((await checkRelease(root)).version, '1.1.0-alpha.1');

    const pkg = JSON.parse(await readFile(path.join(root, lib), 'utf8'));

    pkg.publishConfig.registry = 'https://npm.pkg.github.com';
    await writeFile(path.join(root, lib), JSON.stringify(pkg));
    await assert.rejects(() => checkRelease(root));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('publish plans explicitly use alpha/beta/latest and reject other packages or versions', () => {
  for (const version of ['1.0.0-alpha.1', '1.0.0-beta.1', '1.0.0']) {
    const metadata = releaseMetadata(version);
    const plan = { plan: [[{ kind: 'publish', name: '@flaut-org/react-md3e', version, tag: 'latest' }]] };

    assert.equal(applyDistTag(plan, metadata).plan[0][0].tag, metadata.distTag);
  }

  assert.throws(() =>
    applyDistTag(
      { plan: [[{ kind: 'publish', name: 'another-package', version: '1.0.0' }]] },
      releaseMetadata('1.0.0'),
    ),
  );
  assert.throws(() =>
    applyDistTag(
      { plan: [[{ kind: 'publish', name: '@flaut-org/react-md3e', version: '2.0.0' }]] },
      releaseMetadata('1.0.0'),
    ),
  );
});

test('Changesets packs the explicit plan and emits the Git tag output required by its Action', async () => {
  const root = await fixture();
  const cli = path.join(workspace, 'node_modules/@changesets/cli/bin.js');

  try {
    await changeChannel('alpha', root);
    await versionPackages(root);

    const pkg = JSON.parse(await readFile(path.join(root, lib), 'utf8'));
    const metadata = await checkRelease(root);
    const planPath = path.join(root, 'plan.json');
    const output = path.join(root, 'packed');
    const events = path.join(root, 'events.ndjson');

    // This fixture tests artifact transport without invoking the real UI build or a registry.
    delete pkg.scripts.prepack;
    await writeFile(path.join(root, lib), JSON.stringify(pkg));
    await mkdir(path.join(root, 'packages/react-md3e/dist'));
    await writeFile(path.join(root, 'packages/react-md3e/dist/index.js'), 'export const fixture = true;');
    await writeFile(
      planPath,
      JSON.stringify(
        applyDistTag(
          {
            version: 1,
            plan: [
              [
                {
                  kind: 'publish',
                  name: pkg.name,
                  version: pkg.version,
                  access: 'public',
                  tag: 'latest',
                },
              ],
            ],
          },
          metadata,
        ),
      ),
    );
    execFileSync(process.execPath, [cli, 'pack', '--from-publish-plan', planPath, '--out-dir', output], {
      cwd: root,
      stdio: 'pipe',
    });

    const packed = JSON.parse(await readFile(path.join(output, 'publish-plan.json'), 'utf8'));

    assert.equal(packed.plan[0][0].tag, 'alpha');
    assert.equal(packed.plan[0][0].version, '1.0.0-alpha.1');
    assert.ok(packed.plan[0][0].tarball.integrity);
    execFileSync(process.execPath, [cli, 'git-tag'], {
      cwd: root,
      stdio: 'pipe',
      env: {
        ...process.env,
        CHANGESETS_OUTPUT: events,
        GIT_COMMITTER_NAME: 'Release test',
        GIT_COMMITTER_EMAIL: 'test@example.invalid',
      },
    });

    const report = (await readFile(events, 'utf8'))
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    assert.equal(report.length, 1);
    assert.equal(report[0].type, 'git-tag');
    assert.equal(report[0].tag, metadata.gitTag);
    assert.equal(report[0].packageName, pkg.name);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
