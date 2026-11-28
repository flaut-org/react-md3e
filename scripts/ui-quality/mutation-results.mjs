import assert from 'node:assert/strict';

function cases(suites) {
  return suites.flatMap((suite) => [
    ...suite.specs.flatMap((spec) => spec.tests.map((test) => ({ title: spec.title, ...test }))),
    ...cases(suite.suites ?? []),
  ]);
}

export function validateMutation(id, healthy, faulty) {
  for (const run of [healthy, faulty]) {
    const checks = cases(run.report.suites);

    assert.equal(checks.length, 1, `${id}: must exercise exactly the intended regression`);
    assert.ok(checks[0].title.includes(`[${id}]`));
    assert.equal(run.report.stats.skipped, 0);
  }

  assert.equal(healthy.exitCode, 0, `${id}: healthy control must pass before defect detection can be claimed`);
  assert.equal(healthy.report.stats.expected, 1);
  assert.equal(healthy.report.stats.unexpected, 0);
  assert.equal(faulty.exitCode, 1, `${id}: injected defect was not rejected`);
  assert.equal(faulty.report.stats.unexpected, 1);

  const errors = cases(faulty.report.suites).flatMap((check) => check.results.flatMap((entry) => entry.errors));

  assert.ok(
    errors.some((error) => error.message.includes(`${id}:`)),
    `${id}: only the defect-specific assertion is evidence; setup errors and generic timeouts do not count`,
  );
}
