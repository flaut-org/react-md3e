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

function run(
  reviews,
  files = [{ filename: 'packages/react-md3e/src/components/example/tests/baselines/linux/new.png' }],
) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'md3e-baseline-review-'));
  const eventFile = path.join(directory, 'event.json');

  writeFileSync(
    eventFile,
    JSON.stringify({ pull_request: { number: 1, user: { login: 'author' }, head: { sha: 'current-head' } } }),
  );

  const mock = `globalThis.fetch = async (url) => new Response(JSON.stringify(url.includes('/files?') ? ${JSON.stringify(files)} : ${JSON.stringify(reviews)}), {status: 200});`;

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

test('baseline review requires a current independent human collaborator approval', () => {
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
