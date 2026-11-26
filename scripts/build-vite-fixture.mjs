import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const workspace = fileURLToPath(new URL('../', import.meta.url));
let rootOutput;
let rootSize;
let rootJsSize;
let chipSize;

for (const example of [
  'root',
  'subpath',
  'legacy',
  'button',
  'checkbox',
  'theme',
  'composition',
  'lazy',
  'chip',
  'chip-subpath',
  'chip-autocomplete',
  'root',
]) {
  execFileSync(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'build', '--config', 'packages/react-md3e/tests/vite-consumer/vite.config.ts'],
    {
      cwd: workspace,
      env: { ...process.env, MD3E_CSS_CASE: example },
      stdio: 'pipe',
    },
  );

  const directory = new URL(`../packages/react-md3e/tests/vite-consumer/dist/${example}/`, import.meta.url);
  const files = (await readdir(directory, { recursive: true })).sort();
  const output = await Promise.all(
    files
      .filter((file) => /\.(css|js|html)$/.test(file))
      .map(async (file) => [file, await readFile(new URL(file, directory), 'utf8')]),
  );
  const css = output
    .filter(([file]) => file.endsWith('.css'))
    .map(([, content]) => content)
    .join('\n');
  const bytes = Buffer.byteLength(css);
  const jsBytes = output
    .filter(([file]) => file.endsWith('.js'))
    .reduce((sum, [, content]) => sum + Buffer.byteLength(content), 0);

  assert.ok(bytes > 0, 'The bundler must select styled module exports.');
  assert.doesNotMatch(css, /data-morph|md3-calendar-enter|md3-slider-active|md3-loading-morph/);
  assert.equal(
    [...css.matchAll(/@keyframes ripple-enter[\w-]*\s*\{/g)].length,
    example === 'theme' ? 0 : 1,
    'Shared ripple must be emitted once.',
  );
  assert.equal(
    [...css.matchAll(/--md-sys-color-primary:light-dark\(/g)].length,
    ['button', 'checkbox'].includes(example) ? 0 : 1,
    'Theme defaults must be emitted once.',
  );

  if (example === 'composition') {
    assert.match(css, /--md3e-menu-scale/);
    assert.match(css, /--_split-expanded-angle/);
    assert.match(css, /data-md3-app-bar-search/, 'AppBar must carry its declared Search composition.');
    assert.match(css, /--_search-/);
  } else if (example !== 'chip-autocomplete') {
    assert.doesNotMatch(css, /--md3e-menu-scale|data-md3-app-bar|data-md3-field|--_search-|--_toolbar-container/);
    assert.ok(bytes < 45_000, `Button/Checkbox CSS exceeded the 45 kB regression budget: ${bytes}`);
  }

  if (example.startsWith('chip')) {
    assert.match(css, /--_chip-radius/);
    assert.equal(
      [...css.matchAll(/--_chip-start:12px/g)].length,
      1,
      'Chip and Autocomplete must share one Chip stylesheet.',
    );
    assert.doesNotMatch(css, /md3-button-loading|data-md3-button-loading|data-morph|md3-calendar-enter/);

    if (example === 'chip') {
      chipSize = bytes;
    } else if (example === 'chip-subpath') {
      assert.equal(bytes, chipSize, 'Chip root and subpath imports must have identical CSS payloads.');
    } else {
      assert.match(css, /data-md3-field/);
      assert.ok(bytes < 85_000, `Autocomplete with Chip exceeded its CSS budget: ${bytes}`);
    }
  } else if (example !== 'composition') {
    assert.doesNotMatch(css, /--_chip-radius/, 'Unused Chip CSS must tree-shake from root named imports.');
  }

  if (example === 'root') {
    if (rootOutput) {
      assert.deepEqual(output, rootOutput, 'Repeated builds must preserve asset names, CSS order and JavaScript.');
    }

    rootOutput = output;
    rootSize = bytes;
    rootJsSize = jsBytes;
  }

  if (example === 'subpath') {
    assert.equal(bytes, rootSize, 'Root named imports must tree-shake CSS as well as subpath imports.');
  }

  if (['button', 'theme'].includes(example)) {
    assert.doesNotMatch(css, /data-indicator|--_indicator-active/, 'Unused Checkbox presentation must be removed.');
  }

  if (['checkbox', 'theme'].includes(example)) {
    assert.doesNotMatch(
      css,
      /md3-button-loading|data-md3-button-loading/,
      'Unused Button presentation must be removed.',
    );
  }

  if (example === 'theme') {
    assert.ok(bytes < 17_000, 'ThemeProvider must not load component CSS.');
  }

  if (example === 'legacy') {
    assert.equal(bytes, rootSize, 'Automatic imports must preserve the explicit CSS payload.');
    assert.ok(rootJsSize <= jsBytes + 256, 'Automatic CSS must not add a JavaScript styling runtime.');
  }

  if (example === 'lazy') {
    const manifest = JSON.parse(await readFile(new URL('.vite/manifest.json', directory), 'utf8'));
    const entry = Object.values(manifest).find((chunk) => chunk.isEntry);

    assert.ok(entry.dynamicImports?.length > 0, 'The lazy component must keep a dynamic chunk.');
    assert.ok(Object.values(manifest).some((chunk) => chunk.isDynamicEntry && chunk.css?.length > 0));
  }

  process.stdout.write(
    `Vite ${example}: CSS ${bytes} bytes (${gzipSync(css).length} gzip), JS ${jsBytes} bytes; dependency/tree-shaking checks passed.\n`,
  );
}
