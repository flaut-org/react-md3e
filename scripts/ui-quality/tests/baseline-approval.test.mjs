import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const script = path.resolve('scripts/ui-quality/baseline-approval.mjs');
const approval = {
  state: 'APPROVED',
  commit_id: 'current-head',
  user: { login: 'independent', type: 'User' },
  author_association: 'MEMBER',
};
const confirmation = {
  ...approval,
  state: 'COMMENTED',
  body: '/approve-ui-baselines',
  user: { login: 'author', type: 'User' },
};

function run(
  reviews,
  files = [{ filename: 'packages/react-md3e/src/components/example/tests/baselines/linux/new.png' }],
  { permission = 'write', roleName = permission, permissionStatus = 200 } = {},
) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'md3e-baseline-review-'));
  const eventFile = path.join(directory, 'event.json');

  writeFileSync(
    eventFile,
    JSON.stringify({ pull_request: { number: 1, user: { login: 'author' }, head: { sha: 'current-head' } } }),
  );

  const mock = `globalThis.fetch = async (url, options) => {
    if (options?.method && options.method !== 'GET') {
      throw new Error('Baseline approval must only read GitHub data');
    }

    const request = new URL(url);
    const page = Number(request.searchParams.get('page') ?? 1);
    const start = (page - 1) * 100;

    if (request.pathname.endsWith('/files')) {
      return new Response(JSON.stringify(${JSON.stringify(files)}.slice(start, start + 100)));
    }

    if (request.pathname.endsWith('/reviews')) {
      return new Response(JSON.stringify(${JSON.stringify(reviews)}.slice(start, start + 100)));
    }

    if (request.pathname.endsWith('/collaborators/author/permission')) {
      return new Response(JSON.stringify(${JSON.stringify({ permission, role_name: roleName })}), {status: ${permissionStatus}});
    }

    throw new Error('Unexpected GitHub request: ' + url);
  };`;

  try {
    return spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(mock)}`, script], {
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_EVENT_PATH: eventFile,
        GITHUB_API_URL: 'https://api.example.invalid',
        GITHUB_REPOSITORY: 'example/ui',
      },
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function expectMissingSignoff(result) {
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /changed baseline images need human signoff for current head current-head/);
}

test('independent approval still requires a current human collaborator review', () => {
  assert.equal(run([approval]).status, 0);
  assert.equal(run([]).status, 1);
  assert.equal(run([{ ...approval, commit_id: 'old-head' }]).status, 1);
  assert.equal(run([{ ...approval, user: { login: 'author', type: 'User' } }]).status, 1);
  assert.equal(run([{ ...approval, user: { login: 'bot', type: 'Bot' } }]).status, 1);
  assert.equal(run([{ ...approval, author_association: 'NONE' }]).status, 1);
  assert.equal(run([approval, { ...approval, state: 'DISMISSED' }]).status, 1);
  assert.equal(run([approval, { ...approval, state: 'CHANGES_REQUESTED' }]).status, 1);
  assert.equal(run([], [{ filename: 'docs/testing/ui-quality.md' }]).status, 0);
  assert.equal(
    run([], [{ filename: 'elsewhere/renamed.png', previous_filename: 'component/tests/baselines/old.png' }]).status,
    1,
  );
});

test('a maintainer can confirm their own current-head baselines through an explicit comment review', () => {
  for (const access of [
    { permission: 'admin' },
    { permission: 'write' },
    { permission: 'write', roleName: 'maintain' },
  ]) {
    const result = run([confirmation], undefined, access);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Maintainer baseline confirmation by PR author: author/);
  }
});

test('maintainer confirmation requires the exact command, current commit and a submitted human author review', () => {
  for (const invalid of [
    { ...confirmation, body: 'Looks good' },
    { ...confirmation, body: 'Please run /approve-ui-baselines' },
    { ...confirmation, body: '> /approve-ui-baselines' },
    { ...confirmation, commit_id: 'old-head' },
    { ...confirmation, state: 'PENDING' },
    { ...confirmation, state: 'DISMISSED' },
    { ...confirmation, user: { login: 'author', type: 'Bot' } },
    { ...confirmation, user: { login: 'independent', type: 'User' } },
  ]) {
    expectMissingSignoff(run([invalid]));
  }

  assert.equal(run([{ ...confirmation, body: '\n /approve-ui-baselines \n' }]).status, 0);
});

test('author association alone does not grant maintainer confirmation permission', () => {
  for (const permission of ['read', 'none', 'unknown']) {
    expectMissingSignoff(run([confirmation], undefined, { permission }));
  }

  for (const permissionStatus of [403, 404, 500]) {
    const result = run([confirmation], undefined, { permissionStatus });

    assert.equal(result.status, 1);
    assert.match(result.stderr, new RegExp(`GitHub API ${permissionStatus} reading collaborators/author/permission`));
  }
});

test('editing or superseding the author confirmation revokes it until explicitly confirmed again', () => {
  expectMissingSignoff(run([{ ...confirmation, body: 'Confirmation withdrawn' }]));
  expectMissingSignoff(run([confirmation, { ...confirmation, body: 'Needs another look' }]));
  expectMissingSignoff(run([confirmation, { ...confirmation, state: 'DISMISSED' }]));
  assert.equal(run([{ ...confirmation, body: 'Needs another look' }, confirmation]).status, 0);
  assert.equal(run([confirmation, { ...confirmation, user: approval.user, body: 'Unrelated comment' }]).status, 0);
});

test('baseline changes after the first API page and renamed images still require human signoff', () => {
  const files = [
    ...Array.from({ length: 100 }, (_, index) => ({ filename: `docs/example-${index}.md` })),
    { filename: 'packages/react-md3e/src/components/example/tests/baselines/linux/new.png' },
  ];

  expectMissingSignoff(run([], files));
  assert.equal(run([confirmation], files).status, 0);
  assert.equal(
    run([confirmation], [{ filename: 'elsewhere/renamed.png', previous_filename: 'component/tests/baselines/old.png' }])
      .status,
    0,
  );
});
