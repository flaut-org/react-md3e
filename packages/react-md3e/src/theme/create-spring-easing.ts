// Adapted from matraic/m3e, revision 7520f333699ceeaaf9eb7704a54fe28e14cf08af.
// Copyright (c) 2025–2026 matraic. MIT License; see licenses/m3e.txt.
// Source and adaptations: docs/motion.md. Build/server code only.
const SAMPLES = 1000;
const MAX_STOPS = 32;
const easings = new Map<string, string>();

/**
 * Returns the position of a unit-mass spring released from rest toward its target.
 * @param {number} damping The damping ratio.
 * @param {number} stiffness The stiffness.
 * @param {number} time The time, in milliseconds, since release.
 * @returns {number} The position, where 0 is the start and 1 is the target.
 */
function springStep(damping: number, stiffness: number, time: number): number {
  const t = time / 1000;
  const w = Math.sqrt(stiffness);

  if (damping < 1) {
    const wd = w * Math.sqrt(1 - damping * damping);

    return 1 - Math.exp(-damping * w * t) * (Math.cos(wd * t) + ((damping * w) / wd) * Math.sin(wd * t));
  }

  if (damping === 1) {
    return 1 - (1 + w * t) * Math.exp(-w * t);
  }

  const r = Math.sqrt(damping * damping - 1);
  const r1 = -w * (damping - r);
  const r2 = -w * (damping + r);

  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/** @private */
function measureSegment(values: number[], start: number, end: number) {
  let error = 0;
  let index = start;

  for (let i = start + 1; i < end; i += 1) {
    const interpolated = values[start]! + ((values[end]! - values[start]!) * (i - start)) / (end - start);
    const deviation = Math.abs(values[i]! - interpolated);

    if (deviation > error) {
      error = deviation;
      index = i;
    }
  }

  return { start, end, index, error };
}

/** @private */
function generateSpringEasing(damping: number, stiffness: number, duration: number): string {
  const values = new Array<number>(SAMPLES + 1);

  for (let i = 0; i <= SAMPLES; i += 1) {
    values[i] = springStep(damping, stiffness, (i / SAMPLES) * duration);
  }

  // The transition ends at its target, so any residual displacement of the spring becomes a jump at the end.
  values[SAMPLES] = 1;

  // Peaks and troughs are always kept, so the overshoot and its timing match the spring.
  const anchors = [0];

  for (let i = 1; i < SAMPLES; i += 1) {
    const [previous, value, next] = [values[i - 1]!, values[i]!, values[i + 1]!];
    const extremum = (value >= previous && value > next) || (value <= previous && value < next);

    if (extremum && Math.abs(value - 1) > 1e-4) {
      anchors.push(i);
    }
  }

  anchors.push(SAMPLES);

  // Repeatedly split the segment that deviates most from the samples until the stops are used.
  const stops = new Set(anchors);
  const segments = anchors.slice(1).map((end, i) => measureSegment(values, anchors[i]!, end));

  while (stops.size < MAX_STOPS && segments.length > 0) {
    let worst = 0;

    for (let i = 1; i < segments.length; i += 1) {
      if (segments[i]!.error > segments[worst]!.error) {
        worst = i;
      }
    }

    const { start, end, index, error } = segments[worst]!;

    if (error < 1e-5) {
      break;
    }

    stops.add(index);
    segments.splice(worst, 1, measureSegment(values, start, index), measureSegment(values, index, end));
  }

  const sorted = [...stops].sort((a, b) => a - b);
  const last = sorted.length - 1;
  const parts = sorted.map((index, i) => {
    const value = Number(values[index]!.toFixed(4)).toString();

    return i === 0 || i === last ? value : `${value} ${Number(((index / SAMPLES) * 100).toFixed(2))}%`;
  });

  return `linear(${parts.join(', ')})`;
}

/**
 * Generates a CSS `linear()` easing function that follows the step response of a spring over a duration.
 * @param {number} damping The damping ratio.
 * @param {number} stiffness The stiffness, for a unit mass.
 * @param {number} duration The duration, in milliseconds.
 * @returns {string} The `linear()` easing function.
 */
export function createSpringEasing(damping: number, stiffness: number, duration: number): string {
  const key = `${damping} ${stiffness} ${duration}`;
  let easing = easings.get(key);

  if (easing === undefined) {
    easing = generateSpringEasing(damping, stiffness, duration);
    easings.set(key, easing);
  }

  return easing;
}
