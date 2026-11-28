import assert from 'node:assert/strict';
import { test } from 'node:test';

const { validateMutation } = await import(new URL('../mutation-results.mjs', import.meta.url));

function run(id, passed, message = '') {
  return {
    exitCode: passed ? 0 : 1,
    report: {
      stats: { expected: passed ? 1 : 0, unexpected: passed ? 0 : 1, skipped: 0 },
      suites: [
        {
          suites: [],
          specs: [{ title: `[${id}] regression`, tests: [{ results: [{ errors: message ? [{ message }] : [] }] }] }],
        },
      ],
    },
  };
}

test('known-defect proof rejects startup failures, generic timeouts and missing healthy baselines', () => {
  for (const id of ['DP-001', 'DP-002', 'DP-003', 'DP-004', 'DP-005']) {
    assert.throws(() =>
      validateMutation(id, run(id, true), run(id, false, 'expect(locator).toBeVisible: #storybook-root timed out')),
    );
    assert.throws(() =>
      validateMutation(id, run(id, false, 'baseline missing'), run(id, false, `${id}:dash-continuity`)),
    );
    assert.doesNotThrow(() => validateMutation(id, run(id, true), run(id, false, `${id}:specific-defect`)));
  }
});
