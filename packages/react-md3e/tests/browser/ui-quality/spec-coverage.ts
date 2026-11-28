export type VerificationStatus = 'PASS' | 'FAIL' | 'NOT APPLICABLE' | 'UNVERIFIED';
export interface Requirement {
  id: string;
  component: string;
  description: string;
  source: string;
  category: string;
  method: string;
  status: VerificationStatus;
  tests: { file: string; title: string }[];
  externalChecks?: { command: string; file: string; title?: string }[];
}
export interface TestEvidence {
  file: string;
  title: string;
  project: string;
  status: VerificationStatus;
}

/** A filtered, skipped, interrupted or never-run test can never provide PASS evidence. */
export function requirementResults(requirements: Requirement[], evidence: TestEvidence[]) {
  return requirements.map((requirement) => {
    const links = requirement.tests.map((link) =>
      evidence.filter((entry) => entry.file === link.file && entry.title === link.title),
    );
    const observed = links.flat();
    let status: VerificationStatus = 'UNVERIFIED';

    if (observed.some((entry) => entry.status === 'FAIL')) {
      status = 'FAIL';
    } else if (
      links.length > 0 &&
      links.every((entries) => entries.length > 0 && entries.every((entry) => entry.status === 'PASS'))
    ) {
      status = 'PASS';
    }

    return { ...requirement, status, evidence: observed };
  });
}

export function specificationCoverage(rows: { category: string; status: VerificationStatus }[], category: string) {
  const applicable = rows.filter((row) => row.category === category && row.status !== 'NOT APPLICABLE');
  const passed = applicable.filter((row) => row.status === 'PASS').length;

  return {
    passed,
    total: applicable.length,
    percent: applicable.length ? Math.round((passed / applicable.length) * 1000) / 10 : null,
  };
}
