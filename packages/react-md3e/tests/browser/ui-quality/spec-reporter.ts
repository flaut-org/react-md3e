import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { requirementResults, specificationCoverage } from './spec-coverage';
import type { Requirement, TestEvidence, VerificationStatus } from './spec-coverage';

export default class SpecificationReporter implements Reporter {
  private tests: TestCase[] = [];

  private evidence = new Map<string, TestEvidence>();

  private projects: string[] = [];

  private requirements: Requirement[] = [];

  private updating = false;

  private policyViolations: string[] = [];

  private outputDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir ?? 'test-results/browser-coverage';
  }

  onBegin(_config: FullConfig, suite: Suite) {
    this.updating = _config.updateSnapshots !== 'none';
    this.tests = suite.allTests();
    this.projects = [...new Set(this.tests.map((test) => test.parent.project()!.name))];
    this.requirements = JSON.parse(readFileSync('docs/testing/ui-requirements.json', 'utf8')) as Requirement[];
    this.evidence = new Map(
      this.tests.map((test) => [
        test.id,
        {
          file: path.relative(process.cwd(), test.location.file).split(path.sep).join('/'),
          title: test.title,
          project: test.parent.project()!.name,
          status: 'UNVERIFIED',
        },
      ]),
    );
  }

  onTestEnd(test: TestCase, result: TestResult) {
    let status: VerificationStatus = 'UNVERIFIED';

    if (test.location.file.match(/\.(quality|visual)\.spec\.ts$/) && result.status === 'skipped') {
      this.policyViolations.push(`Skipped UI check: ${test.title}`);
    }

    if (result.status === 'passed') {
      status = 'PASS';
    } else if (['failed', 'timedOut'].includes(result.status)) {
      status = 'FAIL';
    }

    const previous = this.evidence.get(test.id);

    if (this.updating && test.location.file.endsWith('.visual.spec.ts') && status === 'PASS') {
      status = 'UNVERIFIED';
    }

    // A later retry must not erase failure evidence.
    this.evidence.set(test.id, {
      file: path.relative(process.cwd(), test.location.file).split(path.sep).join('/'),
      title: test.title,
      project: test.parent.project()!.name,
      status: previous?.status === 'FAIL' ? 'FAIL' : status,
    });
  }

  async onEnd() {
    const results = requirementResults(this.requirements, [...this.evidence.values()]);
    const report = {
      scope: {
        projects: this.projects,
        collectedTests: this.tests.length,
        note: 'Only this invocation and registered requirements; not the complete component catalog or code coverage.',
        baselineUpdate: this.updating,
      },
      functional: specificationCoverage(results, 'functional'),
      behavioral: specificationCoverage(results, 'behavioral'),
      policyViolations: this.policyViolations,
      requirements: results,
    };
    const markdown = [
      '# Specification coverage',
      '',
      report.scope.note,
      `Projects: ${this.projects.join(', ') || 'none'}.`,
      '',
      `Functional Coverage: ${report.functional.passed}/${report.functional.total} (${report.functional.percent ?? 'N/A'}%).`,
      `Behavioral Coverage: ${report.behavioral.passed}/${report.behavioral.total} (${report.behavioral.percent ?? 'N/A'}%).`,
      '',
      '| Requirement | Category | Status | Evidence |',
      '| --- | --- | --- | --- |',
      ...results.map(
        (row) =>
          `| ${row.id} | ${row.category} | ${row.status} | ${row.evidence.map((entry) => `${entry.project}: ${entry.title}`).join('; ')} |`,
      ),
      '',
      'Visual snapshot equality does not establish Material/Figma parity or independent visual approval.',
      '',
    ].join('\n');

    mkdirSync(this.outputDir, { recursive: true });
    writeFileSync(path.join(this.outputDir, 'specification-coverage.json'), `${JSON.stringify(report, null, 2)}\n`);
    writeFileSync(path.join(this.outputDir, 'specification-coverage.md'), markdown);

    if (this.policyViolations.length > 0) {
      return { status: 'failed' as const };
    }

    return undefined;
  }
}
