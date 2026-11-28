import { expect } from '@playwright/test';

export interface SpatialRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export type SpatialMetric = keyof SpatialRect | 'right' | 'bottom';
export interface SpatialFrame {
  time: number;
  viewport: SpatialRect;
  elements: Record<string, SpatialRect & { visibility?: string; rendered?: boolean }>;
}
export interface SpatialRecording {
  frames: SpatialFrame[];
  truncated: boolean;
}
interface RuleBase {
  id: string;
  target: string;
}
interface Bounds {
  min: number;
  max: number;
}
export type SpatialConstraint = RuleBase &
  (
    | ({ kind: 'range'; metric: SpatialMetric } & Bounds)
    | { kind: 'attachment'; boundary: string; edge: 'left' | 'right' | 'top' | 'bottom'; allowOutside?: boolean }
    | { kind: 'containment'; boundary: string }
    | ({ kind: 'gap'; other: string; axis: 'x' | 'y' } & Bounds)
    | ({ kind: 'relative'; other: string; metric: SpatialMetric } & Bounds)
  );
export interface SpatialOptions {
  tolerancePx?: number;
  maxFrameGapMs?: number;
  minSamples?: number;
}

function metric(rect: SpatialRect, name: SpatialMetric) {
  if (name === 'right') {
    return rect.x + rect.width;
  }

  if (name === 'bottom') {
    return rect.y + rect.height;
  }

  return rect[name];
}

function edgeMetric(edge: 'left' | 'right' | 'top' | 'bottom'): SpatialMetric {
  if (edge === 'left') {
    return 'x';
  }

  if (edge === 'top') {
    return 'y';
  }

  return edge;
}

function violation(frame: SpatialFrame, rule: SpatialConstraint) {
  const target = frame.elements[rule.target];

  if (!target || target.visibility === 'hidden' || target.rendered === false) {
    return null;
  }

  if (rule.kind === 'range') {
    const value = metric(target, rule.metric);

    return { value, excess: Math.max(rule.min - value, value - rule.max, 0) };
  }

  if (rule.kind === 'relative' || rule.kind === 'gap') {
    const other = frame.elements[rule.other];

    if (!other || other.visibility === 'hidden' || other.rendered === false) {
      return null;
    }

    const value =
      rule.kind === 'relative'
        ? metric(target, rule.metric) - metric(other, rule.metric)
        : metric(other, rule.axis) - metric(target, rule.axis === 'x' ? 'right' : 'bottom');

    return { value, excess: Math.max(rule.min - value, value - rule.max, 0) };
  }

  const boundary = rule.boundary === 'viewport' ? frame.viewport : frame.elements[rule.boundary];

  if (!boundary || ('rendered' in boundary && boundary.rendered === false)) {
    return null;
  }

  if (rule.kind === 'containment') {
    const excess = Math.max(
      boundary.x - target.x,
      boundary.y - target.y,
      metric(target, 'right') - metric(boundary, 'right'),
      metric(target, 'bottom') - metric(boundary, 'bottom'),
      0,
    );

    return { value: excess, excess };
  }

  const coordinate = edgeMetric(rule.edge);
  const delta = metric(target, coordinate) - metric(boundary, coordinate);
  const outward = rule.edge === 'left' || rule.edge === 'top' ? -delta : delta;
  const excess = rule.allowOutside ? Math.max(-outward, 0) : Math.abs(delta);

  return { value: delta, excess };
}

/** Contracts opt into bounds; overshoot is allowed wherever the supplied envelope allows it. */
export function analyzeSpatialConstraints(
  recording: SpatialRecording,
  rules: readonly SpatialConstraint[],
  options: SpatialOptions = {},
) {
  const tolerance = options.tolerancePx ?? 0.5;
  const minSamples = options.minSamples ?? 2;

  if (rules.length === 0 || new Set(rules.map((rule) => rule.id)).size !== rules.length) {
    throw new TypeError('Spatial contracts require nonempty rules with unique IDs.');
  }

  if (
    rules.some(
      (rule) => 'min' in rule && (!Number.isFinite(rule.min) || !Number.isFinite(rule.max) || rule.min > rule.max),
    )
  ) {
    throw new TypeError('Spatial envelopes require finite, ordered bounds.');
  }

  if (
    !Number.isFinite(tolerance) ||
    tolerance < 0 ||
    !Number.isInteger(minSamples) ||
    minSamples < 2 ||
    !Number.isFinite(options.maxFrameGapMs ?? 100) ||
    (options.maxFrameGapMs ?? 100) <= 0
  ) {
    throw new TypeError('Spatial sampling and pixel tolerances must be finite, with at least two samples.');
  }

  const violations: { rule: string; time: number; value: number; excess: number }[] = [];
  const coverage = rules.map((rule) => ({ rule: rule.id, samples: 0 }));
  const gaps = recording.frames.slice(1).map((frame, index) => frame.time - recording.frames[index]!.time);

  for (const frame of recording.frames) {
    for (const [index, rule] of rules.entries()) {
      const result = violation(frame, rule);

      if (result) {
        coverage[index]!.samples += 1;

        if (!Number.isFinite(result.value) || result.excess > tolerance) {
          violations.push({ rule: rule.id, time: frame.time, ...result });
        }
      }
    }
  }

  const maxFrameGapMs = Math.max(0, ...gaps);
  const insufficient = coverage.filter((row) => row.samples < minSamples);

  return {
    violations,
    coverage,
    insufficient,
    maxFrameGapMs,
    truncated: recording.truncated,
    samplingAdequate:
      !recording.truncated &&
      insufficient.length === 0 &&
      gaps.every((gap) => Number.isFinite(gap) && gap >= 0) &&
      maxFrameGapMs <= (options.maxFrameGapMs ?? 100),
  };
}

/** Fails on intermediate violations AND inadequate evidence, not merely the final rectangle. */
export function expectSpatialConstraints(
  recording: SpatialRecording,
  rules: readonly SpatialConstraint[],
  options: SpatialOptions = {},
) {
  const result = analyzeSpatialConstraints(recording, rules, options);

  expect(result.truncated, 'Spatial recording must not be truncated').toBe(false);
  expect(result.insufficient, 'Each spatial relationship needs actual paired geometry samples').toEqual([]);
  expect(
    recording.frames.every(
      (frame, index) => Number.isFinite(frame.time) && (index === 0 || frame.time >= recording.frames[index - 1]!.time),
    ),
    'Spatial recording timestamps must be finite and monotonic',
  ).toBe(true);
  expect(
    result.maxFrameGapMs,
    'rAF gaps must fit the component sampling contract; inspect video if they do not',
  ).toBeLessThanOrEqual(options.maxFrameGapMs ?? 100);
  expect(result.violations, 'Actual intermediate geometry must satisfy the component spatial contract').toEqual([]);

  return result;
}
