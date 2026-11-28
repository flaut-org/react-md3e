import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const { validateMutation } = await import(new URL('./mutation-results.mjs', import.meta.url));
const directory = 'test-results/ui-mutations';

mkdirSync(directory, { recursive: true });
rmSync(path.join(directory, 'mutation-results.json'), { force: true });

function run(id, injected) {
  const name = `${id}-${injected ? 'fault' : 'control'}`;
  const reportFile = path.resolve(directory, `${name}.json`);

  rmSync(reportFile, { force: true });

  const environment = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: reportFile };

  delete environment.UI_QA_MUTATION;

  if (injected) {
    environment.UI_QA_MUTATION = id;
  }

  const result = spawnSync(
    process.execPath,
    [
      'node_modules/@playwright/test/cli.js',
      'test',
      '--config',
      'playwright.ui.config.ts',
      '--project=chromium-light',
      '--grep',
      id,
      '--reporter=json',
      `--output=${path.join(directory, name)}`,
    ],
    { stdio: 'inherit', env: environment },
  );

  if (result.error) {
    throw result.error;
  }

  return { exitCode: result.status, report: JSON.parse(readFileSync(reportFile, 'utf8')), reportFile };
}

const results = [];

for (const id of ['DP-001', 'DP-002', 'DP-003', 'DP-004', 'DP-005']) {
  const healthy = run(id, false);
  const faulty = run(id, true);

  validateMutation(id, healthy, faulty);
  results.push({
    id,
    status: 'PASS',
    meaning: 'Healthy control passed; isolated defect rejected by its specific assertion',
    control: healthy.reportFile,
    fault: faulty.reportFile,
  });
}

writeFileSync(path.join(directory, 'mutation-results.json'), `${JSON.stringify(results, null, 2)}\n`);
process.stdout.write(
  'All five isolated known-defect mutations were detected by their specific assertions after healthy controls passed. Component source and baselines were unchanged.\n',
);
