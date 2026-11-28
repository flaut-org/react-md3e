import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const requirements = JSON.parse(readFileSync('docs/testing/ui-requirements.json', 'utf8'));
const ids = new Set();
const categories = new Set([
  'functional',
  'behavioral',
  'visual',
  'motion',
  'layout',
  'accessibility',
  'keyboard',
  'touch',
  'responsive',
  'integration',
  'theme',
  'rtl',
  'ssr-hydration',
  'rsc',
  'browser',
]);
const titleCache = new Map();

function registeredTitles(file) {
  if (!titleCache.has(file)) {
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const titles = new Set();
    const visit = (node) => {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'test') {
        const title = node.arguments[0];

        if (title && (ts.isStringLiteral(title) || ts.isNoSubstitutionTemplateLiteral(title))) {
          titles.add(title.text);
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(source);
    titleCache.set(file, titles);
  }

  return titleCache.get(file);
}

for (const requirement of requirements) {
  assert.match(requirement.id, /^[A-Z]+-\d{3}$/);
  assert.ok(!ids.has(requirement.id), `Duplicate requirement ${requirement.id}`);
  ids.add(requirement.id);
  assert.ok(categories.has(requirement.category), `Unknown category ${requirement.category}`);
  assert.equal(requirement.status, 'UNVERIFIED', 'Registry is an inventory, not a stored claim of test success.');

  for (const key of ['component', 'description', 'source', 'method']) {
    assert.ok(
      typeof requirement[key] === 'string' && requirement[key].trim().length > 0,
      `${requirement.id}: missing ${key}`,
    );
  }

  if (!requirement.source.startsWith('https://')) {
    readFileSync(requirement.source.split('#')[0], 'utf8');
  }

  for (const link of requirement.tests) {
    assert.ok(
      registeredTitles(link.file).has(link.title),
      `${requirement.id}: stale test link ${link.title}; linked tests must use literal titles`,
    );
  }

  for (const check of requirement.externalChecks ?? []) {
    const source = readFileSync(check.file, 'utf8');

    assert.ok(check.command.trim().length > 0, `${requirement.id}: missing external command`);

    if (check.title) {
      assert.ok(source.includes(check.title), `${requirement.id}: stale external test link ${check.title}`);
    }
  }
}

function inspect(directory) {
  for (const entry of readdirSync(directory)) {
    const file = path.join(directory, entry);

    if (statSync(file).isDirectory()) {
      if (!['node_modules', 'dist', 'baselines'].includes(entry)) {
        inspect(file);
      }
    } else if (/\.(?:quality|visual)\.spec\.ts$/.test(entry)) {
      const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
      const visit = (node) => {
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
          const { expression } = node;

          assert.ok(
            !['skip', 'only', 'fixme', 'fail'].includes(expression.name.text),
            `${file}: ${expression.name.text} can hide QA failures`,
          );
        }

        ts.forEachChild(node, visit);
      };

      visit(source);
    }
  }
}

inspect('packages/react-md3e');
process.stdout.write(`UI contract: ${ids.size} requirements; no focused, skipped or expected-failure UI tests.\n`);
