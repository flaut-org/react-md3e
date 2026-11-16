import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

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
