import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const workspaceRoot = fileURLToPath(new URL('../../../', import.meta.url));
let server;
let baseUrl;
let serverOutput = '';

before(async () => {
  const socket = createServer();

  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');

  const { port } = socket.address();

  await new Promise((resolve, reject) => {
    socket.close((error) => (error ? reject(error) : resolve()));
  });
  baseUrl = `http://127.0.0.1:${port}`;

  server = spawn(
    process.execPath,
    [
      path.join(workspaceRoot, 'node_modules/next/dist/bin/next'),
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    {
      cwd: path.join(workspaceRoot, 'apps/next-fixture'),
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  server.stdout.on('data', (chunk) => {
    serverOutput += chunk;
  });
  server.stderr.on('data', (chunk) => {
    serverOutput += chunk;
  });

  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    assert.equal(server.exitCode, null, `Next.js exited before startup:\n${serverOutput}`);

    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(1_000) });

      if (response.ok) {
        await response.arrayBuffer();

        return;
      }

      await response.arrayBuffer();
    } catch {
      // The process may not have started listening yet.
    }

    await delay(100);
  }

  assert.fail(`Next.js did not become ready:\n${serverOutput}`);
});

after(async () => {
  if (!server || server.exitCode !== null) {
    return;
  }

  const exited = once(server, 'exit');

  server.kill('SIGTERM');

  const force = setTimeout(() => server.kill('SIGKILL'), 5_000);

  force.unref();
  await exited;
  clearTimeout(force);
});

test('the production fixture consumes the built package from a server page', async () => {
  const response = await fetch(baseUrl, { signal: AbortSignal.timeout(10_000) });

  assert.equal(response.status, 200);

  const html = await response.text();

  assert.match(html, /data-fixture="package-consumer"/);
  assert.match(html, /The built package is imported from a React Server Component/);
});

test('List action and disclosure composition is present in production server HTML', async () => {
  const response = await fetch(`${baseUrl}/lists`, { signal: AbortSignal.timeout(10_000) });
  const html = await response.text();
  const trigger = /<button[^>]*id="saved-folder-trigger"[^>]*>/.exec(html)?.[0] ?? '';
  const panel = /<div[^>]*id="saved-folder-panel"[^>]*>/.exec(html)?.[0] ?? '';

  assert.equal(response.status, 200);
  assert.match(html, /data-testid="single-action-list"/);
  assert.match(html, /<a[^>]*href="#list-destination"/);
  assert.match(trigger, /aria-controls="saved-folder-panel"/);
  assert.match(panel, /hidden=""/);
  assert.match(panel, /inert=""/);
  assert.match(html, /Recently visited destinations/);
  assert.doesNotMatch(html, /<button[^>]*>[^<]*<button/);
});

test('the response sends a shell and fallback before request-time content', async () => {
  const response = await fetch(`${baseUrl}/streaming`, {
    signal: AbortSignal.timeout(10_000),
  });

  assert.equal(response.status, 200);
  assert.ok(response.body);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let html = '';
  let fallbackBeforeContent = false;

  try {
    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      html += decoder.decode(value, { stream: true });

      if (html.includes('data-fixture="streaming-loading"') && !html.includes('data-fixture="streaming-ready"')) {
        fallbackBeforeContent = true;
      }
    }

    html += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  assert.match(html, /data-fixture="streaming-shell"/);
  assert.match(html, /data-fixture="streaming-ready"/);
  assert.ok(fallbackBeforeContent, 'The fallback must arrive before the completed content.');
});

test('homepage essentials provide static server markup before portal interaction', async () => {
  const response = await fetch(`${baseUrl}/essentials`, { signal: AbortSignal.timeout(10_000) });

  assert.equal(response.status, 200);

  const html = await response.text();

  assert.match(html, /data-md3-skeleton=""/);
  assert.match(html, /data-md3-divider=""/);
  assert.match(html, /data-md3-button-group=""/);
  assert.match(html, /href="\/typography"/);
  assert.doesNotMatch(html, /data-md3-sheet=""|data-md3-snackbar=""/);
});

async function routeCss(route) {
  const response = await fetch(`${baseUrl}${route}`, { signal: AbortSignal.timeout(10_000) });
  const html = await response.text();
  const files = [...new Set([...html.matchAll(/href="([^"?]+\.css(?:\?[^"]*)?)"/g)].map((match) => match[1]))];
  const styles = await Promise.all(files.map(async (file) => (await fetch(new URL(file, baseUrl))).text()));

  assert.ok(files.length > 0, 'The server shell must reference compiled CSS before hydration.');

  return styles.join('\n');
}

test('route CSS includes Button dependencies without loading unused Shape styles', async () => {
  const buttons = await routeCss('/');
  const shapes = await routeCss('/surfaces');

  assert.match(buttons, /ripple-enter/);
  assert.match(buttons, /--md-sys-color-primary/);
  assert.doesNotMatch(buttons, /data-morph/);
  assert.match(shapes, /data-morph/);
});

test('root and subpath imports load only Button/Checkbox dependencies without manual CSS', async () => {
  const root = await routeCss('/automatic-css');
  const subpath = await routeCss('/automatic-css/subpath');

  for (const styles of [root, subpath]) {
    assert.match(styles, /ripple-enter/);
    assert.match(styles, /data-indicator/);
    assert.match(styles, /md3-button-loading/);
    assert.doesNotMatch(styles, /data-morph|md3-calendar-enter|--md3e-menu-scale|md3-slider-active|data-md3-app-bar/);
    assert.equal(
      [...styles.matchAll(/@keyframes ripple-enter[\w-]*\s*\{/g)].length,
      1,
      'Shared ripple must load once.',
    );
    assert.ok(Buffer.byteLength(styles) < 55_000, 'The acceptance route must not receive catalog CSS.');
  }
});

test('automatic styles preserve actual Next RSC client references', async () => {
  for (const route of [
    'automatic-css',
    'automatic-css/subpath',
    'automatic-css/server',
    'chips/server',
    'toolbars/server',
  ]) {
    const code = await readFile(
      path.join(workspaceRoot, `apps/next-fixture/.next/server/app/${route}/page_client-reference-manifest.js`),
      'utf8',
    );
    const context = {};

    runInNewContext(code, context);

    const { __RSC_MANIFEST: manifests } = context;
    const manifest = manifests[`/${route}/page`];
    const modules = Object.keys(manifest.clientModules).filter(
      (name) => name.includes('react-md3e/dist/') && /\.js(?:\?|$)/.test(name),
    );
    // Webpack's manifest is a global registry and also lists CSS resources. Check the actual
    // Flight references sent for this route, rather than treating the whole registry as its bundle.
    const flight = await readFile(path.join(workspaceRoot, `apps/next-fixture/.next/server/app/${route}.rsc`), 'utf8');
    const referencedIds = new Set(
      [...flight.matchAll(/^[\da-f]+:I(\[[^\n]+\])/gm)].map((match) => String(JSON.parse(match[1])[0])),
    );
    const usedModules = modules.filter((name) => referencedIds.has(String(manifest.clientModules[name].id)));

    if (route.endsWith('/server')) {
      assert.deepEqual(usedModules, [], 'Server presentation must ship no library client references.');
    } else {
      assert.ok(usedModules.some((name) => name.includes('/button/button.component.js')));
      assert.ok(usedModules.some((name) => name.includes('/checkbox/checkbox.component.js')));
    }

    assert.ok(
      !modules.some((name) => /theme-provider|\/surface\/|\/typography\/|\/badge\//.test(name)),
      'Server presentation must not become a client reference.',
    );
    assert.ok(!modules.some((name) => name.includes('/dist/node/')), 'Next must select styled bundler exports.');
  }
});

test('Chip loads automatic shared CSS in the server shell without unrelated component styles', async () => {
  const origin = baseUrl;

  for (const route of ['chips', 'chips/server']) {
    const response = await fetch(`${baseUrl}/${route}`, { signal: AbortSignal.timeout(10_000) });
    const html = await response.text();
    const files = [...new Set([...html.matchAll(/href="([^"?]+\.css(?:\?[^"]*)?)"/g)].map((match) => match[1]))];
    const css = (await Promise.all(files.map(async (file) => (await fetch(`${origin}${file}`)).text()))).join('\n');

    assert.equal(response.status, 200);
    assert.match(html, /data-md3-chip=""/);
    assert.match(css, /--_chip-radius/);
    assert.equal([...css.matchAll(/--_chip-start:12px/g)].length, 1, 'Shared Chip CSS must load once.');
    assert.doesNotMatch(css, /md3-button-loading|data-morph|md3-calendar-enter|--md3e-menu-scale|data-md3-field/);
    assert.ok(Buffer.byteLength(css) < 45_000, 'Chip must keep its component CSS closure.');
  }
});

test('SegmentedButton is server-rendered with its own CSS closure and Material selection roles', async () => {
  const response = await fetch(`${baseUrl}/segmented-buttons`, { signal: AbortSignal.timeout(10_000) });

  assert.equal(response.status, 200);

  const html = await response.text();
  const styles = await routeCss('/segmented-buttons');

  assert.match(html, /data-md3-segmented-button=""/);
  assert.match(html, /role="radiogroup"/);
  assert.match(html, /role="checkbox"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /name="cabin"/);
  assert.match(styles, /ripple-enter/);
  assert.match(styles, /md3-segment-container/);
  assert.doesNotMatch(styles, /data-morph|md3-calendar-enter/);
});

test('Slider ships native named ranges and extracted family CSS before hydration', async () => {
  const response = await fetch(`${baseUrl}/sliders`, { signal: AbortSignal.timeout(10_000) });

  assert.equal(response.status, 200);

  const html = await response.text();
  const styles = await routeCss('/sliders');

  assert.match(html, /data-md3-slider=""/);
  assert.match(html, /type="range"/);
  assert.match(html, /aria-label="Minimum price"/);
  assert.match(html, /aria-valuenow="25"/);
  assert.match(styles, /md3-slider-active/);
  assert.match(styles, /--_stop-offset/);
  assert.doesNotMatch(styles, /data-morph|ripple-enter|md3-calendar-enter/);
});

test('Menu server composition loads its extracted dependency closure without other popup families', async () => {
  const response = await fetch(`${baseUrl}/menus`, { signal: AbortSignal.timeout(10_000) });

  assert.equal(response.status, 200);

  const html = await response.text();
  const styles = await routeCss('/menus');

  assert.match(html, /aria-haspopup="menu"/);
  assert.match(html, /Server menu/);
  assert.match(styles, /@property --md3e-menu-scale/);
  assert.match(styles, /ripple-enter/);
  assert.doesNotMatch(styles, /data-morph|md3-calendar-enter|data-md3-slider|md3-slider-active/);
});

test('SplitButton server composition loads Button and Menu styling without unrelated component families', async () => {
  const response = await fetch(`${baseUrl}/split-buttons`, { signal: AbortSignal.timeout(10_000) });

  assert.equal(response.status, 200);

  const html = await response.text();
  const styles = await routeCss('/split-buttons');

  assert.match(html, /data-md3-split-button=""/);
  assert.match(html, /More save options/);
  assert.match(html, /aria-haspopup="menu"/);
  assert.match(styles, /@property --md3e-menu-scale/);
  assert.match(styles, /--_split-expanded-angle/);
  assert.match(styles, /ripple-enter/);
  assert.doesNotMatch(styles, /data-morph|md3-calendar-enter|md3-slider-active/);
});

test('floating actions render server markup with their Button/Menu CSS dependencies', async () => {
  const response = await fetch(`${baseUrl}/fabs`, { signal: AbortSignal.timeout(10_000) });

  assert.equal(response.status, 200);

  const html = await response.text();
  const styles = await routeCss('/fabs');

  assert.match(html, /data-md3-fab=""/);
  assert.match(html, /data-md3-extended-fab=""/);
  assert.match(html, /Server create actions/);
  assert.match(html, /aria-haspopup="menu"/);
  assert.match(styles, /data-md3-fab-button/);
  assert.match(styles, /--_fab-menu-open-delay/);
  assert.match(styles, /ripple-enter/);
  assert.doesNotMatch(styles, /data-morph|md3-calendar-enter|md3-slider-active/);
});

test('Toolbar sends named server composition, scoped tokens and inert-free passive RSC markup', async () => {
  const response = await fetch(`${baseUrl}/toolbars`, { signal: AbortSignal.timeout(10_000) });
  const html = await response.text();
  const styles = await routeCss('/toolbars');

  assert.equal(response.status, 200);
  assert.match(html, /role="toolbar"/);
  assert.match(html, /aria-orientation="vertical"/);
  assert.match(html, /Server docked tools/);
  assert.match(styles, /--md-comp-toolbar-floating-fab-between-space/);
  assert.match(styles, /--md-comp-icon-button-tonal-selected-container-color/);
  assert.match(styles, /--md-sys-motion-spring-fast-spatial/);

  const passive = await fetch(`${baseUrl}/toolbars/server`, { signal: AbortSignal.timeout(10_000) });
  const passiveHtml = await passive.text();

  assert.equal(passive.status, 200);
  assert.match(passiveHtml, /role="group"/);
  assert.doesNotMatch(passiveHtml, /role="toolbar"|data-hidden=/);
});
