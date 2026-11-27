import { defaultBreakpoints } from '../internal/breakpoints';
import type { Breakpoint, BreakpointValues } from './theme.types';

export function createBreakpoints(options: Partial<BreakpointValues> = {}): BreakpointValues {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('breakpoints must be an object of named widths in px.');
  }

  for (const name of Object.keys(options)) {
    if (!Object.hasOwn(defaultBreakpoints, name)) {
      throw new TypeError(`Unknown breakpoint: ${name}`);
    }
  }

  const values = { ...defaultBreakpoints, ...options };
  let previous = -1;

  for (const [name, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`breakpoints.${name} must be a finite non-negative width in px.`);
    }

    if (value <= previous) {
      throw new RangeError('breakpoints must increase strictly in the order xs < sm < md < lg < xl.');
    }

    previous = value;
  }

  return Object.freeze(values);
}

/** Build/server helper: native media conditions cannot read scoped CSS custom properties. */
export function createBreakpointQueries(breakpoints: BreakpointValues = defaultBreakpoints) {
  const values = createBreakpoints(breakpoints);
  const up = {} as Record<Breakpoint, string>;
  const down = {} as Record<Breakpoint, string>;

  for (const name of Object.keys(values) as Breakpoint[]) {
    up[name] = `(width >= ${values[name]}px)`;
    down[name] = `(width < ${values[name]}px)`;
  }

  return Object.freeze({ up: Object.freeze(up), down: Object.freeze(down) });
}
