import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));
const [java, kotlinHome, graphicsJar, collectionJar] = process.argv.slice(2);

if (!java || !kotlinHome || !graphicsJar || !collectionJar) {
  throw new Error(
    'Usage: node scripts/shapes/generate.mjs <java> <kotlin-home> <graphics-shapes-jar> <collection-jar>',
  );
}

const temporary = await mkdtemp(path.join(tmpdir(), 'react-md3e-shapes-'));
const target = path.join(workspaceRoot, 'packages/react-md3e/src/components/shape');
const stdlib = path.join(kotlinHome, 'lib/kotlin-stdlib.jar');
const generator = path.join(temporary, 'export.jar');
const separator = path.delimiter;
const header = `/*
 * Copyright 2024 The Android Open Source Project
 * SPDX-License-Identifier: Apache-2.0
 * Generated from AndroidX MaterialShapes at 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e
 * using androidx.graphics:graphics-shapes-desktop:1.0.1. Do not edit paths by hand.
 * See scripts/shapes/README.md and licenses/androidx-material-shapes.txt.
 */
`;

try {
  execFileSync(
    java,
    [
      '-cp',
      path.join(kotlinHome, 'lib/*'),
      'org.jetbrains.kotlin.cli.jvm.K2JVMCompiler',
      '-no-stdlib',
      '-classpath',
      [graphicsJar, collectionJar, stdlib].join(separator),
      '-d',
      generator,
      path.join(workspaceRoot, 'scripts/shapes/ExportShapes.kt'),
    ],
    { stdio: 'pipe' },
  );

  const data = JSON.parse(
    execFileSync(java, ['-cp', [generator, graphicsJar, collectionJar, stdlib].join(separator), 'ExportShapesKt'], {
      encoding: 'utf8',
    }),
  );
  const names = Object.keys(data);

  if (names.length !== 35 || Object.values(data).some((value) => !/^M[0-9.,C-]+Z$/.test(value))) {
    throw new Error('Expected exactly 35 finite normalized cubic SVG contours.');
  }

  const source = `${header}import type { ShapeVariant } from './shape.types';\n\nexport const shapePaths: Readonly<Record<ShapeVariant, string>> = ${JSON.stringify(data, null, 2)};\n`;
  const filename = path.join(target, 'shape-paths.generated.ts');
  const options = await resolveConfig(filename);
  const output = await format(source, { ...options, filepath: filename });
  const original = await readFile(filename, 'utf8');

  if (output !== original) {
    await writeFile(filename, output);
  }

  process.stdout.write(`Exported ${names.length} official shapes (${output.length} source bytes).\n`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
