import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const script = path.resolve('scripts/ui-quality/check-contract.mjs');

test('contract rejects stale exact titles and hidden UI tests without touching the real inventory', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'md3e-ui-contract-'));
  const file = 'packages/react-md3e/tests/example.quality.spec.ts';
  const title = '[DEMO-001] real test';
  const requirement = {
    id: 'DEMO-001',
    component: 'Example',
    description: 'Example',
    source: 'https://example.invalid/contract',
    category: 'functional',
    method: 'automated',
    status: 'UNVERIFIED',
    tests: [{ file, title }],
  };
  const inventory = path.join(directory, 'docs/testing/ui-requirements.json');
  const run = () => spawnSync(process.execPath, [script], { cwd: directory, encoding: 'utf8' });

  try {
    mkdirSync(path.dirname(inventory), { recursive: true });
    mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
    writeFileSync(inventory, JSON.stringify([requirement]));
    writeFileSync(path.join(directory, file), `test('${title}', () => {});`);
    assert.equal(run().status, 0);
    writeFileSync(inventory, JSON.stringify([{ ...requirement, tests: [{ file, title: '[DEMO-001] stale title' }] }]));
    assert.equal(run().status, 1);
    writeFileSync(inventory, JSON.stringify([requirement]));

    for (const marker of ['skip', 'only', 'fixme', 'fail']) {
      writeFileSync(path.join(directory, file), `test('${title}', () => {}); test.${marker}('hidden', () => {});`);
      assert.equal(run().status, 1);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
