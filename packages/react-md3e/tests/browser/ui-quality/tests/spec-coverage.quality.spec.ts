import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { FullConfig, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { requirementResults, specificationCoverage } from '../spec-coverage';
import type { Requirement, TestEvidence } from '../spec-coverage';
import SpecificationReporter from '../spec-reporter';

const requirement: Requirement = {
  id: 'EXAMPLE-001',
  component: 'Example',
  description: 'Example requirement',
  source: 'docs/testing/ui-quality.md',
  category: 'functional',
  method: 'automated',
  status: 'UNVERIFIED',
  tests: [{ file: 'test.ts', title: 'behavior' }],
};
const evidence: TestEvidence = { file: 'test.ts', title: 'behavior', project: 'chromium', status: 'PASS' };

test('specification reporting never promotes unexecuted or partial evidence to PASS', () => {
  expect(requirementResults([requirement], [])[0]!.status).toBe('UNVERIFIED');
  expect(requirementResults([requirement], [{ ...evidence, status: 'UNVERIFIED' }])[0]!.status).toBe('UNVERIFIED');
  expect(
    requirementResults(
      [{ ...requirement, tests: [...requirement.tests, { file: 'other.ts', title: 'missing' }] }],
      [evidence],
    )[0]!.status,
  ).toBe('UNVERIFIED');
  expect(
    requirementResults([requirement], [evidence, { ...evidence, project: 'webkit', status: 'FAIL' }])[0]!.status,
  ).toBe('FAIL');
  expect(requirementResults([requirement], [evidence])[0]!.status).toBe('PASS');
  expect(
    specificationCoverage(
      [
        { category: 'functional', status: 'PASS' },
        { category: 'functional', status: 'UNVERIFIED' },
        { category: 'functional', status: 'NOT APPLICABLE' },
      ],
      'functional',
    ),
  ).toEqual({ passed: 1, total: 2, percent: 50 });
});

test('reporter keeps a collected but never-started project UNVERIFIED', async ({ browserName }, testInfo) => {
  const outputDir = testInfo.outputPath('reporter-check');
  const reporter = new SpecificationReporter({ outputDir });
  const cases = [browserName, 'unstarted-browser'].map(
    (name) =>
      ({
        id: name,
        title: '[DP-001] section entry selects and advances each section without separators',
        location: {
          file: path.resolve('packages/react-md3e/src/components/date-picker/tests/date-picker.quality.spec.ts'),
        },
        parent: { project: () => ({ name }) },
      }) as unknown as TestCase,
  );

  reporter.onBegin({ updateSnapshots: 'none' } as FullConfig, { allTests: () => cases } as unknown as Suite);
  reporter.onTestEnd(cases[0]!, { status: 'passed' } as TestResult);
  await reporter.onEnd();

  const report = JSON.parse(readFileSync(path.join(outputDir, 'specification-coverage.json'), 'utf8')) as {
    requirements: { id: string; status: string }[];
  };

  expect(report.requirements.find((row) => row.id === 'DP-001')!.status).toBe('UNVERIFIED');
});
