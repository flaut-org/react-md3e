import { expect, test } from '@playwright/test';
import { analyzeSpatialConstraints, expectSpatialConstraints } from '../spatial';
import type { SpatialConstraint, SpatialRecording } from '../spatial';

function recording(positions: number[]): SpatialRecording {
  return {
    truncated: false,
    frames: positions.map((x, index) => ({
      time: index * 16,
      viewport: { x: 0, y: 0, width: 1000, height: 720 },
      elements: {
        surface: { x, y: 0, width: 360, height: 720 },
        companion: { x: x + 360, y: 0, width: 100, height: 720 },
      },
    })),
  };
}

const attachment: SpatialConstraint = {
  id: 'edge',
  kind: 'attachment',
  target: 'surface',
  boundary: 'viewport',
  edge: 'left',
  allowOutside: true,
};

test('spatial contracts reject a transient edge gap even when the endpoints are correct', () => {
  const data = recording([-360, -120, 5.4, 2, 0]);
  const report = analyzeSpatialConstraints(data, [attachment]);

  expect(report.violations.map((row) => row.value)).toEqual([5.4, 2]);
  expect(() => expectSpatialConstraints(data, [attachment])).toThrow('Actual intermediate geometry');
  expectSpatialConstraints(recording([-360, -120, 0, 0]), [attachment]);
});

test('spatial envelopes allow intentional overshoot and identify overshoot and undershoot individually', () => {
  const rule: SpatialConstraint = { id: 'elastic', kind: 'range', target: 'surface', metric: 'x', min: -365, max: 6 };

  expectSpatialConstraints(recording([-360, -100, 5.4, 0]), [rule]);
  expect(analyzeSpatialConstraints(recording([-370, 8, 0]), [rule]).violations).toEqual([
    { rule: 'elastic', time: 0, value: -370, excess: 5 },
    { rule: 'elastic', time: 16, value: 8, excess: 2 },
  ]);
});

test('spatial relationships detect transient gaps, overlaps and lost coordinated motion', () => {
  const data = recording([-200, -100, 0]);
  const gap: SpatialConstraint = {
    id: 'join',
    kind: 'gap',
    target: 'surface',
    other: 'companion',
    axis: 'x',
    min: 0,
    max: 0,
  };
  const relative: SpatialConstraint = {
    id: 'follow',
    kind: 'relative',
    target: 'companion',
    other: 'surface',
    metric: 'x',
    min: 360,
    max: 360,
  };

  expectSpatialConstraints(data, [gap, relative]);
  data.frames[1]!.elements.companion!.x -= 10;
  expect(analyzeSpatialConstraints(data, [gap, relative]).violations.map((row) => row.rule)).toEqual([
    'join',
    'follow',
  ]);
  expectSpatialConstraints(data, [{ ...gap, min: -12 }]);
  data.frames[1]!.elements.companion!.x += 20;
  expect(analyzeSpatialConstraints(data, [gap]).violations[0]!.value).toBe(10);
});

test('spatial containment and edge contracts use the supplied parent and actual right edge', () => {
  const data = recording([640, 645, 640]);
  const contained: SpatialConstraint = { id: 'inside', kind: 'containment', target: 'surface', boundary: 'viewport' };
  const right: SpatialConstraint = {
    id: 'right',
    kind: 'attachment',
    target: 'surface',
    boundary: 'viewport',
    edge: 'right',
    allowOutside: true,
  };

  expect(analyzeSpatialConstraints(data, [contained]).violations[0]!.excess).toBe(5);
  expectSpatialConstraints(data, [right]);
  expect(analyzeSpatialConstraints(recording([640, 635, 640]), [right]).violations[0]!.excess).toBe(5);

  const parentRule: SpatialConstraint = { ...contained, boundary: 'companion' };

  expect(analyzeSpatialConstraints(data, [parentRule]).violations.length).toBe(3);
});

test('spatial checks reject incomplete, sparse and missing paired evidence rather than granting PASS', () => {
  const data = recording([-360, -100, 0]);

  expect(() => expectSpatialConstraints({ ...data, truncated: true }, [attachment])).toThrow('must not be truncated');
  data.frames[1]!.time = 1000;
  data.frames[2]!.time = 1016;
  expect(analyzeSpatialConstraints(data, [attachment]).samplingAdequate).toBe(false);
  expect(() => expectSpatialConstraints(data, [attachment])).toThrow('rAF gaps');
  expect(() => expectSpatialConstraints(recording([0]), [attachment])).toThrow('paired geometry');
  expect(() => expectSpatialConstraints(recording([0, 0]), [{ ...attachment, boundary: 'absent' }])).toThrow(
    'paired geometry',
  );
  expect(() => analyzeSpatialConstraints(data, [])).toThrow('nonempty rules');
});
