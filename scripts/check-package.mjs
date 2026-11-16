import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('../', import.meta.url));
const packageRoot = path.join(workspaceRoot, 'packages/react-md3e');
const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

assert.ok(!Object.hasOwn(manifest.exports, './paper'), 'The renamed Surface entry must replace /paper.');

assert.equal(manifest.type, 'module', 'The package must preserve ESM module boundaries.');
assert.ok(manifest.sideEffects?.includes('**/*.css'), 'CSS must survive tree shaking.');
assert.equal(manifest.peerDependencies?.react, '^19.0.0');
assert.equal(manifest.peerDependencies?.['react-dom'], '^19.0.0');

for (const name of Object.keys(manifest.dependencies ?? {})) {
  assert.ok(
    !/^(?:@mui\/|@emotion\/|styled-components$|react$|react-dom$|next$)/.test(name),
    `Unexpected library runtime dependency: ${name}`,
  );
}

function exportTargets(value) {
  if (typeof value === 'string') {
    return [value];
  }

  return Object.values(value).flatMap(exportTargets);
}

for (const target of exportTargets(manifest.exports)) {
  assert.ok(target.startsWith('./'), `Export is not package-relative: ${target}`);
  await access(path.join(packageRoot, target));
}

const entry = await readFile(path.join(packageRoot, manifest.exports['.'].import), 'utf8');

assert.ok(!/^\s*['"]use client['"]/m.test(entry), 'The package root must remain server-safe.');

const packed = JSON.parse(
  execFileSync(npm, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: packageRoot,
    encoding: 'utf8',
  }),
);
const files = new Set(packed[0].files.map(({ path: file }) => file));

for (const file of ['dist/index.js', 'dist/index.d.ts', 'package.json', 'README.md', 'LICENSE']) {
  assert.ok(files.has(file), `Missing packed file: ${file}`);
}

for (const file of files) {
  assert.ok(!file.includes('/tests/'), `Test file leaked into the package: ${file}`);

  assert.ok(
    file.startsWith('dist/') ||
      ['package.json', 'README.md', 'CHANGELOG.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md'].includes(file) ||
      file.startsWith('licenses/'),
    `Development file leaked into the package: ${file}`,
  );
}

assert.equal(
  await readFile(path.join(packageRoot, 'LICENSE'), 'utf8'),
  await readFile(path.join(workspaceRoot, 'LICENSE'), 'utf8'),
  'The distributed license must match the repository license.',
);

execFileSync(process.execPath, ['--input-type=module', '--eval', "await import('@flaut-travel/react-md3e');"], {
  cwd: workspaceRoot,
  stdio: 'pipe',
});

// Raw Node does not implement RSC client references. Check server-only modules here;
// Next production/streaming tests verify that the root's client export is a real boundary.
const appBarUrl = new URL('../packages/react-md3e/dist/app-bar.js', import.meta.url).href;
const dialogContentUrl = new URL(
  '../packages/react-md3e/dist/components/dialog/dialog-content/dialog-content.component.js',
  import.meta.url,
).href;
const dialogActionsUrl = new URL(
  '../packages/react-md3e/dist/components/dialog/dialog-actions/dialog-actions.component.js',
  import.meta.url,
).href;
const staticListUrl = new URL(
  '../packages/react-md3e/dist/components/list/static-list/static-list.component.js',
  import.meta.url,
).href;
// StaticListItem and Avatar compose an image client boundary, so Next verifies them.
// Raw react-server Node imports cannot interpret client-reference module directives.
const selectionIndicatorUrl = new URL(
  '../packages/react-md3e/dist/components/selection-indicator/selection-indicator.component.js',
  import.meta.url,
).href;
const skeletonUrl = new URL('../packages/react-md3e/dist/skeleton.js', import.meta.url).href;
const dividerUrl = new URL('../packages/react-md3e/dist/divider.js', import.meta.url).href;
const typographyUrl = new URL('../packages/react-md3e/dist/typography.js', import.meta.url).href;
const surfaceUrl = new URL('../packages/react-md3e/dist/surface.js', import.meta.url).href;
const shapeUrl = new URL('../packages/react-md3e/dist/shape.js', import.meta.url).href;
const cardUrl = new URL('../packages/react-md3e/dist/components/card/card.component.js', import.meta.url).href;
const providerUrl = new URL(
  '../packages/react-md3e/dist/theme/theme-provider/theme-provider.component.js',
  import.meta.url,
).href;

execFileSync(
  process.execPath,
  [
    '--conditions=react-server',
    '--input-type=module',
    '--eval',
    `await import(${JSON.stringify(skeletonUrl)}); await import(${JSON.stringify(dividerUrl)}); await import(${JSON.stringify(typographyUrl)}); await import(${JSON.stringify(surfaceUrl)}); await import(${JSON.stringify(shapeUrl)}); await import(${JSON.stringify(cardUrl)}); await import(${JSON.stringify(staticListUrl)}); await import(${JSON.stringify(selectionIndicatorUrl)}); await import(${JSON.stringify(appBarUrl)}); await import(${JSON.stringify(dialogContentUrl)}); await import(${JSON.stringify(dialogActionsUrl)}); await import(${JSON.stringify(providerUrl)}); await import('@flaut-travel/react-md3e/theme');`,
  ],
  { cwd: workspaceRoot, stdio: 'pipe' },
);

const button = await readFile(path.join(packageRoot, 'dist/components/button/button.component.js'), 'utf8');

assert.match(button, /^['"]use client['"]/m, 'Interactive Button must preserve its client boundary.');
assert.match(button, /@base-ui\/react\/button/, 'Button must compose the Base UI primitive.');

const iconButton = await readFile(
  path.join(packageRoot, 'dist/components/icon-button/icon-button.component.js'),
  'utf8',
);
const appBar = await readFile(path.join(packageRoot, 'dist/components/app-bar/app-bar.component.js'), 'utf8');

assert.match(iconButton, /^['"]use client['"]/m, 'Interactive IconButton must preserve its client boundary.');
assert.match(iconButton, /@base-ui\/react\/button/, 'IconButton must compose the Base UI primitive.');
assert.doesNotMatch(appBar, /use client|useEffect|useState|@base-ui/, 'AppBar must remain a server component.');

for (const name of ['surface', 'shape', 'card', 'typography', 'skeleton', 'divider']) {
  const code = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.doesNotMatch(
    code,
    /use client|useState|useEffect|useContext|@base-ui/,
    `${name} must stay server-compatible.`,
  );
}

const cardAction = await readFile(
  path.join(packageRoot, 'dist/components/card/card-action-area/card-action-area.component.js'),
  'utf8',
);

assert.match(cardAction, /^['"]use client['"]/m);
assert.match(cardAction, /@base-ui\/react\/button/);
assert.ok(files.has('licenses/androidx-material-shapes.txt'), 'Static shape geometry must retain its license.');

const dialog = await readFile(path.join(packageRoot, 'dist/components/dialog/dialog.component.js'), 'utf8');

assert.match(dialog, /^['"]use client['"]/m, 'Modal Dialog must preserve its behavior boundary.');
assert.match(dialog, /@base-ui\/react\/dialog/, 'Dialog must compose Base UI.');

const selectableList = await readFile(
  path.join(packageRoot, 'dist/components/list/selectable-list/selectable-list.component.js'),
  'utf8',
);
const staticList = await readFile(
  path.join(packageRoot, 'dist/components/list/static-list/static-list.component.js'),
  'utf8',
);

assert.match(selectableList, /^['"]use client['"]/m);
assert.match(selectableList, /@base-ui\/react\/toggle-group/);
assert.doesNotMatch(staticList, /use client|useContext|@base-ui/);

for (const name of ['checkbox', 'radio', 'radio-group', 'autocomplete', 'popover']) {
  const code = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.match(code, /^['"]use client['"]/m);
  assert.ok(
    code.includes(`@base-ui/react/${name === 'autocomplete' ? 'combobox' : name}`),
    `${name} must compose Base UI.`,
  );
}

for (const [name, primitive] of [
  ['tooltip', 'tooltip'],
  ['collapsible', 'collapsible'],
  ['button-group', 'toggle-group'],
  ['snackbar', 'toast'],
  ['sheet', 'drawer'],
]) {
  const code = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.match(code, /^['"]use client['"]/m);
  assert.ok(code.includes(`@base-ui/react/${primitive}`), `${name} must compose Base UI.`);
}

const staticListItem = await readFile(
  path.join(packageRoot, 'dist/components/list/list-item/static-list-item/static-list-item.component.js'),
  'utf8',
);

assert.doesNotMatch(staticListItem, /use client|useContext|useState|useEffect|@base-ui/);

const avatar = await readFile(path.join(packageRoot, 'dist/components/avatar/avatar.component.js'), 'utf8');

assert.doesNotMatch(avatar, /use client|useState|useEffect|@base-ui/, 'Static Avatar must stay server-compatible.');

const avatarImage = await readFile(
  path.join(packageRoot, 'dist/components/avatar/avatar-image/avatar-image.component.js'),
  'utf8',
);

assert.match(avatarImage, /^['"]use client['"]/m);
assert.match(avatarImage, /@base-ui\/react\/avatar/);

const search = await readFile(path.join(packageRoot, 'dist/components/search/search.component.js'), 'utf8');
const searchBar = await readFile(
  path.join(packageRoot, 'dist/components/search/search-bar/search-bar.component.js'),
  'utf8',
);

assert.match(search, /^['"]use client['"]/m);
assert.match(search, /@base-ui\/react\/dialog/);
assert.match(searchBar, /^['"]use client['"]/m);
assert.match(searchBar, /@base-ui\/react\/input/);

const textField = await readFile(path.join(packageRoot, 'dist/components/text-field/text-field.component.js'), 'utf8');

assert.match(textField, /^['"]use client['"]/m);
assert.match(textField, /@base-ui\/react\/input/);
assert.match(
  await readFile(path.join(packageRoot, 'dist/components/autocomplete/autocomplete.component.js'), 'utf8'),
  /text-field\/text-field.component/,
);

// Follow the actual UI module graph: generation tools must not enter component imports.
const visited = new Set();

async function inspectUi(relative) {
  const absolute = path.resolve(packageRoot, relative);

  if (visited.has(absolute)) {
    return;
  }

  visited.add(absolute);

  const code = await readFile(absolute, 'utf8');

  assert.ok(!absolute.endsWith('/dist/theme.js'), 'The color generator leaked into the UI graph.');
  assert.ok(
    !/@linaria|@wyw-in-js|@emotion|@material|insertRule|createTheme|TonalPalette|HctSolver|shapePaths|encodeURIComponent|RoundedPolygon|elevationShadow|surfaceColorStyles|createShapePolygon|createTypography|emphasizedTypeScale|typeScaleTokenName/.test(
      code,
    ),
    `Styling or generation runtime leaked into ${relative}`,
  );

  for (const match of code.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+\.js)['"]/g)) {
    await inspectUi(path.relative(packageRoot, path.resolve(path.dirname(absolute), match[1])));
  }
}

await inspectUi(manifest.exports['.'].import);

const css = await readFile(path.join(packageRoot, 'dist/styles.css'), 'utf8');

assert.ok(
  css.includes('light-dark(') &&
    css.includes('data-variant') &&
    css.includes('linear(') &&
    css.includes('@keyframes') &&
    css.includes('ripple-enter'),
  'Expected precompiled theme, Button variants, and motion CSS.',
);
assert.ok(files.has('THIRD_PARTY_NOTICES.md') && files.has('licenses/material-color-utilities.txt'));

process.stdout.write(
  `Package checks passed (${files.size} packed files; ESM, server theme imports, and client boundaries).\n`,
);
