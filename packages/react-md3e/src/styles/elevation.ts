import { color } from './theme-tokens';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** CSS shadow adaptation of the MD3 elevation levels; evaluated only during extraction. */
export function elevationShadow(level: ElevationLevel) {
  const shadows = [
    'none',
    '0 1px 2px var(--_shadow-key), 0 1px 3px 1px var(--_shadow-ambient)',
    '0 1px 2px var(--_shadow-key), 0 2px 6px 2px var(--_shadow-ambient)',
    '0 1px 3px var(--_shadow-key), 0 4px 8px 3px var(--_shadow-ambient)',
    '0 2px 3px var(--_shadow-key), 0 6px 10px 4px var(--_shadow-ambient)',
    '0 4px 4px var(--_shadow-key), 0 8px 12px 6px var(--_shadow-ambient)',
  ] as const;

  return shadows[level];
}

export const shadowColors = {
  '--_shadow-key': `color-mix(in srgb, ${color('shadow')} 30%, transparent)`,
  '--_shadow-ambient': `color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
} as const;
