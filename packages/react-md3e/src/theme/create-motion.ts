import { createSpringEasing } from './create-spring-easing';
import type { MotionKind, MotionScheme, MotionSpeed, MotionSpring, MotionTokens } from './theme.types';

// MD3/AndroidX v0_14_0 parameter data. Numerical values only; no AndroidX animation code.
// Sources and web adaptation: docs/motion.md.
const spatial = {
  expressive: { fast: [0.6, 800], default: [0.8, 380], slow: [0.8, 200] },
  standard: { fast: [0.9, 1400], default: [0.9, 700], slow: [0.9, 300] },
} as const;
const effects = { fast: [1, 3800], default: [1, 1600], slow: [1, 800] } as const;
const speeds: readonly MotionSpeed[] = ['fast', 'default', 'slow'];
const kinds: readonly MotionKind[] = ['spatial', 'effects'];
// Fixed web durations from the pinned m3e reference; not a physical settling timeout.
const spatialDurations = { standard: [350, 500, 750], expressive: [350, 500, 650] } as const;
const effectDurations = [150, 200, 300] as const;

export function createMotion(scheme: MotionScheme = 'expressive') {
  if (scheme !== 'expressive' && scheme !== 'standard') {
    throw new TypeError('motionScheme must be standard or expressive.');
  }

  const motion = {} as Record<MotionSpeed, Record<MotionKind, MotionSpring>>;
  const cssVariables: Record<`--${string}`, string> = {};

  for (const [index, speed] of speeds.entries()) {
    motion[speed] = {} as Record<MotionKind, MotionSpring>;

    for (const kind of kinds) {
      const [damping, stiffness] = kind === 'spatial' ? spatial[scheme][speed] : effects[speed];
      const duration = kind === 'spatial' ? spatialDurations[scheme][index]! : effectDurations[index]!;
      const spring = { damping, stiffness, duration, easing: createSpringEasing(damping, stiffness, duration) };
      const prefix = `--md-sys-motion-spring-${speed}-${kind}` as const;

      motion[speed][kind] = spring;
      cssVariables[`${prefix}-damping`] = String(damping);
      cssVariables[`${prefix}-stiffness`] = String(stiffness);
      cssVariables[`${prefix}-duration`] = `${spring.duration}ms`;
      cssVariables[`${prefix}-easing`] = spring.easing;
    }
  }

  return { motion: motion as MotionTokens, cssVariables };
}
