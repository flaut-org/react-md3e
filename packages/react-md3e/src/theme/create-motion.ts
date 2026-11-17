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
const tolerance = 0.001;

/** Unit step response with unit mass and zero initial velocity; evaluated only on the server/build. */
function response(time: number, damping: number, omega: number): number {
  const decay = Math.exp(-damping * omega * time);

  if (damping === 1) {
    return 1 - (1 + omega * time) * decay;
  }

  const ratio = Math.sqrt(1 - damping ** 2);
  const phase = omega * ratio * time;

  return 1 - decay * (Math.cos(phase) + (damping / ratio) * Math.sin(phase));
}

function createSpring(damping: number, stiffness: number): MotionSpring {
  const omega = Math.sqrt(stiffness);
  let duration = 0;

  if (damping === 1) {
    while (1 - response(duration / 1000, damping, omega) > tolerance) {
      duration += 1;
    }
  } else {
    // Bound all later displacement, avoiding the first target-crossing as a false end.
    const seconds = Math.log(1 / (tolerance * Math.sqrt(1 - damping ** 2))) / (damping * omega);

    duration = Math.ceil(seconds * 1000);
  }

  const samples = Array.from({ length: 81 }, (_, index) => {
    let value = response((index / 80) * (duration / 1000), damping, omega);

    if (index === 0 || index === 80) {
      value = index === 0 ? 0 : 1;
    }

    return String(Number(value.toFixed(5)));
  });

  return { damping, stiffness, duration, easing: `linear(${samples.join(', ')})` };
}

export function createMotion(scheme: MotionScheme = 'expressive') {
  if (scheme !== 'expressive' && scheme !== 'standard') {
    throw new TypeError('motionScheme must be standard or expressive.');
  }

  const motion = {} as Record<MotionSpeed, Record<MotionKind, MotionSpring>>;
  const cssVariables: Record<`--${string}`, string> = {};

  for (const speed of speeds) {
    motion[speed] = {} as Record<MotionKind, MotionSpring>;

    for (const kind of kinds) {
      const [damping, stiffness] = kind === 'spatial' ? spatial[scheme][speed] : effects[speed];
      const spring = createSpring(damping, stiffness);
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
