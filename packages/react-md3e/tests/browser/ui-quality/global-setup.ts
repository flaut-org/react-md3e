import { execFileSync } from 'node:child_process';
import type { FullConfig } from '@playwright/test';

export default function setup(config: FullConfig) {
  execFileSync(process.execPath, ['scripts/ui-quality/check-contract.mjs'], { stdio: 'inherit' });

  if (process.env.UI_QA_MUTATION && config.updateSnapshots !== 'none') {
    throw new Error('Fault injection must never update a baseline.');
  }

  if (config.updateSnapshots !== 'none') {
    if (process.env.CI) {
      throw new Error('CI must compare baselines, never update them.');
    }

    if (process.platform !== 'linux' || process.arch !== 'x64') {
      throw new Error('Generate baseline candidates with npm run test:ui:update in the canonical Linux x64 container.');
    }
  }
}
