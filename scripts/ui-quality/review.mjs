import { spawnSync } from 'node:child_process';

const result = spawnSync(
  process.execPath,
  [
    'node_modules/@playwright/test/cli.js',
    'test',
    '--config',
    'playwright.ui.config.ts',
    '--headed',
    '--workers=1',
    '--trace=on',
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit', env: { ...process.env, UI_QA_REVIEW: '1' } },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
