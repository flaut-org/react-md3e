import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const dist = fileURLToPath(new URL('../packages/react-md3e/dist/', import.meta.url));
const options = { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler };
const declarationExtension = /\.d\.(ts|mts|cts)$/;
const javascriptExtensions = { ts: '.js', mts: '.mjs', cts: '.cjs' };

function moduleSpecifier(node) {
  if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
    return node.moduleSpecifier;
  }

  if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
    return node.argument.literal;
  }

  if (ts.isExternalModuleReference(node)) {
    return node.expression;
  }

  if (ts.isModuleDeclaration(node)) {
    return node.name;
  }

  return undefined;
}

function esmSpecifier(specifier, fileName) {
  const { resolvedModule } = ts.resolveModuleName(specifier, fileName, options, ts.sys);

  if (!resolvedModule) {
    throw new Error(`Cannot resolve declaration import '${specifier}' in ${fileName}`);
  }

  const target = resolvedModule.resolvedFileName.replace(
    declarationExtension,
    (_, extension) => javascriptExtensions[extension],
  );
  const relative = path.relative(path.dirname(fileName), target).split(path.sep).join('/');

  return relative.startsWith('.') ? relative : `./${relative}`;
}

async function finalizeFile(fileName) {
  const source = await readFile(fileName, 'utf8');
  const ast = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const edits = [];

  function visit(node) {
    const specifier = moduleSpecifier(node);

    if (
      specifier &&
      ts.isStringLiteral(specifier) &&
      specifier.text.startsWith('.') &&
      !/\.(?:css|json)$/.test(specifier.text)
    ) {
      const replacement = esmSpecifier(specifier.text, fileName);

      edits.push({ start: specifier.getStart(ast), end: specifier.getEnd(), text: JSON.stringify(replacement) });
    }

    ts.forEachChild(node, visit);
  }

  visit(ast);

  let output = source;

  for (const edit of edits.sort((left, right) => right.start - left.start)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }

  if (output !== source) {
    await writeFile(fileName, output);
  }
}

async function finalize(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fileName = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await finalize(fileName);
    } else if (declarationExtension.test(entry.name)) {
      await finalizeFile(fileName);
    }
  }
}

// TypeScript resolution handles both file imports and directory/index imports. Bare packages stay intact.
await finalize(dist);
