import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const workspace = fileURLToPath(new URL('../', import.meta.url));
const packagePath = 'packages/react-md3e/package.json';
const packageName = '@flaut-org/react-md3e';

async function readJson(root, file) {
  return JSON.parse(await readFile(path.join(root, file), 'utf8'));
}

async function writeJson(root, file, value) {
  await writeFile(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
}

async function readPre(root) {
  try {
    return await readJson(root, '.changeset/pre.json');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

function run(root, args) {
  if (process.env.npm_execpath) {
    execFileSync(process.execPath, [process.env.npm_execpath, ...args], { cwd: root, stdio: 'inherit' });
  } else {
    execFileSync('asdf', ['exec', 'npm', ...args], { cwd: root, stdio: 'inherit' });
  }
}

export function releaseMetadata(version) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta)\.([1-9]\d*))?$/.exec(version);

  assert.ok(match && version !== '0.0.0', `Unsupported release version: ${version}`);

  return {
    version,
    distTag: match[4] ?? 'latest',
    prerelease: Boolean(match[4]),
    gitTag: `${packageName}@${version}`,
  };
}

export async function versionPackages(root = workspace) {
  const before = await readJson(root, packagePath);

  run(root, ['exec', '--', 'changeset', 'version']);

  const after = await readJson(root, packagePath);

  if (before.version !== after.version) {
    const next = /^(\d+\.\d+\.\d+)-(alpha|beta)\.(\d+)$/.exec(after.version);
    const previousChannel = /-(alpha|beta)\./.exec(before.version)?.[1];

    if (next && (next[3] === '0' || previousChannel !== next[2])) {
      const nativeVersion = after.version;
      const version = `${next[1]}-${next[2]}.1`;
      const changelogPath = path.join(root, 'packages/react-md3e/CHANGELOG.md');
      const changelog = await readFile(changelogPath, 'utf8');

      assert.ok(changelog.includes(`## ${nativeVersion}\n`), 'Missing generated changelog heading.');
      after.version = version;
      await writeJson(root, packagePath, after);
      await writeFile(changelogPath, changelog.replace(`## ${nativeVersion}\n`, `## ${version}\n`));
    }

    releaseMetadata(after.version);

    const fixture = await readJson(root, 'apps/next-fixture/package.json');

    fixture.dependencies[packageName] = after.version;
    await writeJson(root, 'apps/next-fixture/package.json', fixture);
    run(root, ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund', '--offline']);
  }
}

export async function changeChannel(channel, root = workspace) {
  assert.ok(['alpha', 'beta', 'stable'].includes(channel), 'Unknown release channel.');

  const pre = await readPre(root);

  if (channel === 'stable') {
    assert.equal(pre?.mode, 'pre', 'No active prerelease series to finish.');
    run(root, ['exec', '--', 'changeset', 'pre', 'exit']);
  } else if (!pre) {
    assert.equal(channel, 'alpha', 'Start a new prerelease series with alpha.');
    run(root, ['exec', '--', 'changeset', 'pre', 'enter', 'alpha']);
  } else if (pre.tag !== channel) {
    assert.equal(pre.mode, 'pre', 'Finish or revert the pending stable transition first.');
    assert.ok(pre.tag === 'alpha' && channel === 'beta', 'Only alpha to beta is supported within a series.');
    pre.tag = channel;
    await writeJson(root, '.changeset/pre.json', pre);
    await writeFile(
      path.join(root, '.changeset/release-beta.md'),
      `---\n'${packageName}': patch\n---\n\nPromote the upcoming release to beta for consumer testing.\n`,
    );
  }
}

export async function checkRelease(root = workspace) {
  const pkg = await readJson(root, packagePath);
  const manifest = await readJson(root, 'package.json');
  const fixture = await readJson(root, 'apps/next-fixture/package.json');
  const lock = await readJson(root, 'package-lock.json');
  const pre = await readPre(root);
  const metadata = releaseMetadata(pkg.version);
  const changelog = await readFile(path.join(root, 'packages/react-md3e/CHANGELOG.md'), 'utf8');

  assert.equal(pkg.name, packageName);
  assert.equal(manifest.private, true);
  assert.equal(fixture.private, true);
  assert.equal(fixture.dependencies[packageName], pkg.version, 'Stale fixture dependency.');
  assert.notEqual(pkg.private, true);
  assert.equal(pkg.publishConfig.registry, 'https://registry.npmjs.org');
  assert.equal(pkg.publishConfig.access, 'public');
  assert.equal(lock.packages['packages/react-md3e'].version, pkg.version, 'Stale package-lock version.');
  assert.ok(changelog.includes(`## ${pkg.version}\n`), 'Release notes must match the version.');

  if (metadata.prerelease) {
    assert.equal(pre?.mode, 'pre', 'Prerelease metadata is missing.');
    assert.equal(pre.tag, metadata.distTag, 'Prerelease channel does not match the version.');
  } else {
    assert.equal(pre, null, 'Stable releases must finish Changesets prerelease mode.');
  }

  return metadata;
}

/** Changesets' default prerelease plan can choose latest before the first stable release. */
export function applyDistTag(plan, metadata) {
  for (const entry of plan.plan.flat()) {
    assert.equal(entry.name, packageName, 'Only the UI package can be released.');
    assert.equal(entry.version, metadata.version, 'Publish plan version differs from the reviewed package.');
    assert.equal(entry.kind, 'publish');
    entry.tag = metadata.distTag;
  }

  return plan;
}

async function publish(metadata) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'react-md3e-publish-'));
  const planPath = path.join(directory, 'plan.json');
  const output = path.join(directory, 'packed');

  try {
    run(workspace, ['exec', '--', 'changeset', 'publish-plan', '--output', planPath]);

    const plan = applyDistTag(JSON.parse(await readFile(planPath, 'utf8')), metadata);

    if (plan.plan.flat().length > 0) {
      await writeFile(planPath, JSON.stringify(plan));
      run(workspace, ['exec', '--', 'changeset', 'pack', '--from-publish-plan', planPath, '--out-dir', output]);
      run(workspace, ['exec', '--', 'changeset', 'publish', '--from-pack-dir', output]);
    }

    // Recover a missing Git tag if the registry publish succeeded in an earlier attempt.
    run(workspace, ['exec', '--', 'changeset', 'git-tag']);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function main() {
  const command = process.argv[2];

  if (command === 'version') {
    await versionPackages();
  } else if (['alpha', 'beta', 'stable'].includes(command)) {
    await changeChannel(command);
  } else if (command === 'check' || command === 'publish') {
    const metadata = await checkRelease();

    process.stdout.write(`${JSON.stringify(metadata)}\n`);

    if (command === 'publish') {
      assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Automated publishing runs only in GitHub Actions.');
      assert.equal(process.env.GITHUB_REPOSITORY, 'flaut-org/react-md3e');
      assert.equal(process.env.GITHUB_REF, 'refs/heads/main');
      await publish(metadata);
    }
  } else {
    throw new Error('Use version, alpha, beta, stable, check, or publish.');
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
