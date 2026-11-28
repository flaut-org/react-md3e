import { spawnSync } from 'node:child_process';

const mode = process.argv[2] ?? 'test';
const commands = { test: 'test:ui', update: 'test:ui', extended: 'test:ui:extended', mutation: 'test:ui:mutations' };

if (!(mode in commands)) {
  throw new Error(`Unknown UI QA mode: ${mode}`);
}

if (process.env.CI && mode === 'update') {
  throw new Error('Baseline updates are a local candidate-generation action. CI cannot approve or update baselines.');
}

function run(args) {
  const result = spawnSync('docker', args, { stdio: 'inherit' });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Behavior checks use a native engine on Apple Silicon. Screenshot baselines stay Linux x64.
const nativeArm = mode === 'extended' && process.arch === 'arm64';
const platform = nativeArm ? 'linux/arm64' : 'linux/amd64';
const image = `react-md3e-ui-qa:1.64.1${nativeArm ? '-arm64' : ''}`;
const dependencies = `react-md3e-ui-qa-1.64.1-dependencies${nativeArm ? '-arm64' : ''}`;

run(['build', '--platform', platform, '-t', image, '-f', 'scripts/ui-quality/Dockerfile', 'scripts/ui-quality']);
run([
  'run',
  '--rm',
  '--platform',
  platform,
  '--ipc=host',
  '--mount',
  `type=bind,source=${process.cwd()},target=/work`,
  '--mount',
  `type=volume,source=${dependencies},target=/work/node_modules`,
  '--env',
  `UI_QA_COMMAND=${commands[mode]}`,
  image,
  'node',
  'scripts/ui-quality/container-entry.mjs',
  ...(mode === 'update' ? ['--update-snapshots=all'] : []),
  ...process.argv.slice(3),
]);
