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
const badgeUrl = new URL('../packages/react-md3e/dist/badge.js', import.meta.url).href;
const dividerUrl = new URL('../packages/react-md3e/dist/divider.js', import.meta.url).href;
const typographyUrl = new URL('../packages/react-md3e/dist/typography.js', import.meta.url).href;
const surfaceUrl = new URL('../packages/react-md3e/dist/surface.js', import.meta.url).href;
const shapeUrl = new URL('../packages/react-md3e/dist/shape.js', import.meta.url).href;
const loadingIndicatorUrl = new URL('../packages/react-md3e/dist/loading-indicator.js', import.meta.url).href;
const progressIndicatorUrl = new URL('../packages/react-md3e/dist/progress-indicator.js', import.meta.url).href;
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
    `await import(${JSON.stringify(badgeUrl)}); await import(${JSON.stringify(loadingIndicatorUrl)}); await import(${JSON.stringify(progressIndicatorUrl)}); await import(${JSON.stringify(skeletonUrl)}); await import(${JSON.stringify(dividerUrl)}); await import(${JSON.stringify(typographyUrl)}); await import(${JSON.stringify(surfaceUrl)}); await import(${JSON.stringify(shapeUrl)}); await import(${JSON.stringify(cardUrl)}); await import(${JSON.stringify(staticListUrl)}); await import(${JSON.stringify(selectionIndicatorUrl)}); await import(${JSON.stringify(appBarUrl)}); await import(${JSON.stringify(dialogContentUrl)}); await import(${JSON.stringify(dialogActionsUrl)}); await import(${JSON.stringify(providerUrl)}); await import('@flaut-travel/react-md3e/theme');`,
  ],
  { cwd: workspaceRoot, stdio: 'pipe' },
);

const button = await readFile(path.join(packageRoot, 'dist/components/button/button.component.js'), 'utf8');

for (const name of ['calendar', 'range-calendar']) {
  const calendar = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.match(calendar, /^['"]use client['"]/m, `${name} must preserve its interactive client boundary.`);
}

const rangeCalendar = await readFile(
  path.join(packageRoot, 'dist/components/range-calendar/range-calendar.component.js'),
  'utf8',
);

assert.match(rangeCalendar, /calendar\/calendar\.component/, 'RangeCalendar must compose Calendar.');

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

const appBarScroll = await readFile(
  path.join(packageRoot, 'dist/components/app-bar/app-bar-scroll/app-bar-scroll.component.js'),
  'utf8',
);

assert.match(appBarScroll, /^['"]use client['"]/m, 'Opt-in scroll subscriptions must preserve their client boundary.');

for (const name of [
  'badge',
  'surface',
  'shape',
  'card',
  'typography',
  'skeleton',
  'divider',
  'loading-indicator',
  'progress-indicator',
]) {
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

for (const name of [
  'checkbox',
  'switch',
  'slider',
  'radio',
  'radio-group',
  'autocomplete',
  'popover',
  'menu',
  'tabs',
]) {
  const code = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.match(code, /^['"]use client['"]/m);
  assert.ok(
    code.includes(`@base-ui/react/${name === 'autocomplete' ? 'combobox' : name}`),
    `${name} must compose Base UI.`,
  );
}

for (const name of ['menu-surface', 'menu-item-content']) {
  const code = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.doesNotMatch(code, /use client|useContext|useState|useEffect|@base-ui/);
}

const splitButton = await readFile(
  path.join(packageRoot, 'dist/components/split-button/split-button.component.js'),
  'utf8',
);

assert.doesNotMatch(splitButton, /use client|useContext|useState|useEffect|@base-ui/);
assert.match(splitButton, /button\/button.component.js/);
assert.match(splitButton, /menu\/menu.component.js/);

for (const name of ['fab', 'extended-fab', 'fab-button']) {
  const code = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.doesNotMatch(code, /use client|useContext|useState|useEffect|@base-ui/);
}

const fabMenu = await readFile(path.join(packageRoot, 'dist/components/fab-menu/fab-menu.component.js'), 'utf8');

assert.match(fabMenu, /^['"]use client['"]/m);
assert.match(fabMenu, /menu\/menu.component.js/);
assert.doesNotMatch(fabMenu, /@base-ui\/react\/popover|requestAnimationFrame|Math\.exp/);

for (const [name, primitive] of [
  ['tooltip', 'tooltip'],
  ['collapsible', 'collapsible'],
  ['button-group', 'toggle-group'],
  ['segmented-button', 'toggle-group'],
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
    !/@linaria|@wyw-in-js|@emotion|@material|insertRule|createTheme|TonalPalette|HctSolver|shapePaths|encodeURIComponent|RoundedPolygon|elevationShadow|surfaceColorStyles|createShapePolygon|createLoadingPolygons|createTypography|createMotion|createSpring|linearWaveMask|circularWave|waveFrames|emphasizedTypeScale|typeScaleTokenName/.test(
      code,
    ),
    `Styling or generation runtime leaked into ${relative}`,
  );

  assert.doesNotMatch(code, /import\s+['"][^'"]+\.css['"]/, 'UI JS must leave CSS loading to explicit style entries.');

  for (const match of code.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+\.js)['"]/g)) {
    await inspectUi(path.relative(packageRoot, path.resolve(path.dirname(absolute), match[1])));
  }
}

await inspectUi(manifest.exports['.'].import);

async function readCssTree(relative, seenCss = new Set()) {
  const absolute = path.resolve(packageRoot, relative);

  assert.ok(absolute.startsWith(`${packageRoot}${path.sep}dist${path.sep}`), 'CSS imports must stay inside dist.');
  assert.ok(files.has(path.relative(packageRoot, absolute)), `CSS dependency is missing from the tarball: ${relative}`);

  if (seenCss.has(absolute)) {
    return '';
  }

  seenCss.add(absolute);

  const css = await readFile(absolute, 'utf8');
  let result = css;

  for (const match of css.matchAll(/@import\s+['"]([^'"]+)['"]/g)) {
    result += await readCssTree(path.relative(packageRoot, path.resolve(path.dirname(absolute), match[1])), seenCss);
  }

  return result;
}

const buttonStyles = new Set();
const appBarStyles = new Set();
const appBarCss = await readCssTree(manifest.exports['./app-bar/styles.css'], appBarStyles);
const searchStyles = new Set();

await readCssTree(manifest.exports['./search/styles.css'], searchStyles);

for (const file of searchStyles) {
  if (file.includes('/styles/')) {
    assert.ok(appBarStyles.has(file), 'AppBar must reuse the Search stylesheet assets for its search composition.');
  }
}

assert.match(appBarCss, /data-md3-app-bar-search/);
assert.ok(![...appBarStyles].some((file) => /\/(autocomplete|shape|menu)\//.test(file)));

const buttonCss = await readCssTree(manifest.exports['./button/styles.css'], buttonStyles);
const autocompleteStyles = new Set();

const autocompleteCss = await readCssTree(manifest.exports['./autocomplete/styles.css'], autocompleteStyles);

assert.ok(
  [...buttonStyles].some((file) => file.includes('/internal/ripple/')),
  'Button CSS must include its ripple.',
);
assert.ok([...buttonStyles].some((file) => file.includes('/button-loading-indicator/')));
assert.ok([...autocompleteStyles].some((file) => file.includes('/text-field/')));
assert.ok([...autocompleteStyles].some((file) => file.includes('/list-item-content/')));

for (const dependency of ['/menu-surface/', '/menu-item-content/', '/selection-indicator/', '/internal/ripple/']) {
  assert.ok(
    [...autocompleteStyles].some((file) => file.includes(dependency)),
    `Autocomplete CSS must include ${dependency}`,
  );
}

assert.ok(![...autocompleteStyles].some((file) => /\/(menu|popover)\//.test(file)));
assert.ok(autocompleteCss.includes('--md3e-menu-scale'));
assert.ok(![...buttonStyles, ...autocompleteStyles].some((file) => file.includes('/shape/')));
assert.ok(!buttonCss.includes('--md-sys-color-primary:'), 'Component CSS must not duplicate the theme defaults.');

const tabsStyles = new Set();

for (const name of ['navigation-bar', 'navigation-rail', 'navigation-drawer']) {
  const code = await readFile(path.join(packageRoot, `dist/components/${name}/${name}.component.js`), 'utf8');

  assert.doesNotMatch(code, /use client|useContext|useState|useEffect|@base-ui/);

  const familyStyles = new Set();
  const familyCss = await readCssTree(manifest.exports[`./${name}/styles.css`], familyStyles);

  for (const dependency of [`/${name}/`, '/navigation/', '/navigation-item/', '/internal/ripple/']) {
    assert.ok(
      [...familyStyles].some((file) => file.includes(dependency)),
      `${name} must include ${dependency}`,
    );
  }

  assert.match(familyCss, /prefers-reduced-motion/);
  assert.match(familyCss, /forced-colors/);
  assert.match(familyCss, /--md-sys-motion-spring-fast-spatial/);
  assert.ok(![...familyStyles].some((file) => /\/(shape|sheet)\//.test(file)));
}

const navigationItem = await readFile(
  path.join(packageRoot, 'dist/components/navigation-item/navigation-item.component.js'),
  'utf8',
);
const navigationPanel = await readFile(
  path.join(packageRoot, 'dist/components/navigation/navigation-panel/navigation-panel.component.js'),
  'utf8',
);

assert.match(navigationItem, /^['"]use client['"]/m);
assert.match(navigationItem, /@base-ui\/react\/button/);
assert.match(navigationPanel, /^['"]use client['"]/m);
assert.match(navigationPanel, /@base-ui\/react\/drawer/);

const tabsCss = await readCssTree(manifest.exports['./tabs/styles.css'], tabsStyles);

for (const dependency of ['/tabs/', '/internal/ripple/']) {
  assert.ok([...tabsStyles].some((file) => file.includes(dependency)));
}

assert.match(tabsCss, /--active-tab-left/);
assert.match(tabsCss, /--md-sys-motion-spring-fast-spatial/);
assert.match(tabsCss, /prefers-reduced-motion/);
assert.match(tabsCss, /forced-colors/);

for (const part of ['tab-list/tab-list', 'tab/tab', 'tab-panel/tab-panel']) {
  const code = await readFile(path.join(packageRoot, `dist/components/tabs/${part}.component.js`), 'utf8');

  assert.match(code, /^['"]use client['"]/m);
  assert.match(code, /@base-ui\/react\/tabs/);
}

const segmentStyles = new Set();
const segmentCss = await readCssTree(manifest.exports['./segmented-button/styles.css'], segmentStyles);

assert.ok([...segmentStyles].some((file) => file.includes('/segmented-button/')));
assert.ok([...segmentStyles].some((file) => file.includes('/internal/ripple/')));
assert.ok(![...segmentStyles].some((file) => /\/(shape|button|button-group)\//.test(file)));
assert.ok(
  segmentCss.includes('aria-checked') && segmentCss.includes('forced-colors') && segmentCss.includes('linear('),
);

const sliderStyles = new Set();
const sliderCss = await readCssTree(manifest.exports['./slider/styles.css'], sliderStyles);

assert.ok([...sliderStyles].some((file) => file.includes('/slider/')));
assert.ok(![...sliderStyles].some((file) => /\/(shape|tooltip|internal\/ripple)\//.test(file)));
assert.ok(
  sliderCss.includes('md3-slider-active') &&
    sliderCss.includes('prefers-reduced-motion') &&
    sliderCss.includes('forced-colors'),
);

const menuStyles = new Set();
const menuCss = await readCssTree(manifest.exports['./menu/styles.css'], menuStyles);
const splitButtonStyles = new Set();
const splitButtonCss = await readCssTree(manifest.exports['./split-button/styles.css'], splitButtonStyles);

for (const dependency of [
  '/split-button/',
  '/button/',
  '/menu/',
  '/menu-surface/',
  '/menu-item-content/',
  '/internal/ripple/',
]) {
  assert.ok(
    [...splitButtonStyles].some((file) => file.includes(dependency)),
    `SplitButton CSS must include ${dependency}`,
  );
}

for (const file of menuStyles) {
  // The public CSS wrappers differ; their extracted Menu dependency assets must be identical.
  if (file.includes('/styles/')) {
    assert.ok(splitButtonStyles.has(file), 'SplitButton must reuse the existing Menu stylesheet assets.');
  }
}

assert.ok(![...splitButtonStyles].some((file) => /\/(autocomplete|popover|shape|button-group)\//.test(file)));
assert.ok(splitButtonCss.includes('--md3e-menu-scale') && splitButtonCss.includes('--_split-expanded-angle'));

for (const family of ['fab', 'extended-fab', 'fab-menu']) {
  const familyStyles = new Set();
  const css = await readCssTree(manifest.exports[`./${family}/styles.css`], familyStyles);

  for (const dependency of ['/fab-button/', '/button/', '/internal/ripple/']) {
    assert.ok(
      [...familyStyles].some((file) => file.includes(dependency)),
      `${family} must include ${dependency}`,
    );
  }

  assert.ok(![...familyStyles].some((file) => /\/(autocomplete|popover|shape|slider)\//.test(file)));
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /forced-colors/);

  if (family === 'fab-menu') {
    for (const dependency of ['/menu/', '/menu-surface/', '/menu-item-content/', '/fab-menu/']) {
      assert.ok(
        [...familyStyles].some((file) => file.includes(dependency)),
        `FabMenu must reuse ${dependency}`,
      );
    }

    assert.match(css, /--_fab-menu-open-delay/);
  } else {
    assert.ok(![...familyStyles].some((file) => /\/(menu|menu-surface|fab-menu)\//.test(file)));
  }
}

for (const dependency of [
  '/menu/',
  '/menu-surface/',
  '/menu-item-content/',
  '/list-item-content/',
  '/selection-indicator/',
  '/internal/ripple/',
]) {
  assert.ok(
    [...menuStyles].some((file) => file.includes(dependency)),
    `Menu CSS must include ${dependency}`,
  );
}

assert.ok(![...menuStyles].some((file) => /\/(shape|text-field|autocomplete|popover)\//.test(file)));

for (const file of menuStyles) {
  if (/\/(menu-surface|menu-item-content)\//.test(file)) {
    assert.ok(autocompleteStyles.has(file), 'Menu and Autocomplete must reference the same presentation CSS assets.');
  }
}

assert.ok(
  menuCss.includes('--md3e-menu-scale') &&
    menuCss.includes('prefers-reduced-motion') &&
    menuCss.includes('forced-colors'),
);

for (const [name, target] of Object.entries(manifest.exports)) {
  if (name.endsWith('/styles.css')) {
    await readCssTree(target);
  }
}

const loadingStyles = new Set();
const loadingCss = await readCssTree(manifest.exports['./loading-indicator/styles.css'], loadingStyles);
const progressCss = await readCssTree(manifest.exports['./progress-indicator/styles.css']);

assert.ok(loadingCss.includes('md3-loading-morph') && loadingCss.includes('polygon('));
assert.ok(
  ![...loadingStyles].some((file) => file.includes('/shape/')),
  'A loader must not pull in the complete Shape stylesheet.',
);
assert.ok(!loadingCss.includes('data-variant=flower'), 'LoadingIndicator only ships its required silhouettes.');
assert.ok(
  progressCss.includes('md3-linear-first') &&
    progressCss.includes('md3-linear-second') &&
    progressCss.includes('md3-circular-wave'),
);
assert.ok(progressCss.includes('@property --md3e-progress-linear-first-tail') && progressCss.includes('intersect'));

const calendarStyles = new Set();
const calendarCss = await readCssTree(manifest.exports['./range-calendar/styles.css'], calendarStyles);

assert.ok([...calendarStyles].some((file) => file.includes('/calendar/')));
assert.ok([...calendarStyles].some((file) => file.includes('/icon-button/')));
assert.ok([...calendarStyles].some((file) => file.includes('/internal/ripple/')));
assert.ok(![...calendarStyles].some((file) => file.includes('/shape/')));
assert.ok(![...calendarStyles].some((file) => file.includes('/surface/')));
assert.ok(calendarCss.includes('md3-calendar-enter') && calendarCss.includes('prefers-reduced-motion'));

const css = await readCssTree(manifest.exports['./styles.css']);

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
