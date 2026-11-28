import { spawnSync } from 'node:child_process';

const command = process.env.UI_QA_COMMAND;

if (!['test:ui', 'test:ui:extended', 'test:ui:mutations'].includes(command)) {
  throw new Error('Run through npm run test:ui:container, test:ui:update or test:ui:extended:container.');
}

for (const args of [
  ['ci'],
  ['run', 'build'],
  ['run', 'build:storybook'],
  ['run', command, '--', ...process.argv.slice(2)],
]) {
  const result = spawnSync('npm', args, { stdio: 'inherit' });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
