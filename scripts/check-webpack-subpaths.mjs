import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const fixture = new URL('../apps/next-fixture/', import.meta.url);

execFileSync(process.execPath, ['../../node_modules/next/dist/bin/next', 'build', '--webpack'], {
  cwd: fileURLToPath(fixture),
  env: { ...process.env, MD3E_DISABLE_IMPORT_OPTIMIZATION: '1', NEXT_TELEMETRY_DISABLED: '1' },
  stdio: 'pipe',
});

const html = await readFile(new URL('.next/server/app/automatic-css/subpath.html', fixture), 'utf8');
const files = [...new Set([...html.matchAll(/href="([^"?]+\.css(?:\?[^"]*)?)"/g)].map((match) => match[1]))];
const css = (
  await Promise.all(files.map((file) => readFile(new URL(`.next${file.replace('/_next', '')}`, fixture), 'utf8')))
).join('\n');

assert.ok(files.length > 0, 'The server shell must load CSS without package-import optimization.');
assert.ok(/ripple-enter/.test(css) && /data-indicator/.test(css) && /md3-button-loading/.test(css));
assert.ok(
  !/data-morph|md3-calendar-enter|--md3e-menu-scale|md3-slider-active|data-md3-app-bar/.test(css),
  'Subpath imports must exclude unrelated CSS without package-import optimization.',
);
assert.equal([...css.matchAll(/@keyframes ripple-enter[\w-]*\s*\{/g)].length, 1);
assert.ok(Buffer.byteLength(css) < 55_000, 'The subpath route must not receive catalog CSS.');

process.stdout.write(`Webpack subpaths without import optimization: ${Buffer.byteLength(css)} CSS bytes; passed.\n`);

const chipHtml = await readFile(new URL('.next/server/app/chips/server.html', fixture), 'utf8');
const chipFiles = [...new Set([...chipHtml.matchAll(/href="([^"?]+\.css(?:\?[^"]*)?)"/g)].map((match) => match[1]))];
const chipCss = (
  await Promise.all(chipFiles.map((file) => readFile(new URL(`.next${file.replace('/_next', '')}`, fixture), 'utf8')))
).join('\n');

assert.match(chipCss, /--_chip-radius/);
assert.equal([...chipCss.matchAll(/--_chip-start:12px/g)].length, 1);
assert.doesNotMatch(
  chipCss,
  /md3-button-loading|data-morph|md3-calendar-enter|--md3e-menu-scale|md3-slider-active|data-md3-field/,
);
assert.ok(Buffer.byteLength(chipCss) < 45_000, 'Chip subpaths must not receive catalog CSS.');

process.stdout.write(
  `Webpack Chip subpath without import optimization: ${Buffer.byteLength(chipCss)} CSS bytes; passed.\n`,
);
