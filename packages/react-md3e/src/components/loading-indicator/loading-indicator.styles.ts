import { css } from '@linaria/core';
import { shapePaths } from '../../tokens/shape-paths.generated';
import { createShapePolygon } from '../../styles/shape-morph';
import { color } from '../../styles/theme-tokens';
import { createLoadingPolygons } from './loading-indicator-geometry';
import { indicatorColors } from '../../styles/indicator-colors';
import type { StyleObject } from '../../styles/style-object.types';

// Measured against the supplied recording and m3e 10b8db2; see docs/components/loading-indicator.md.
// Timing/angle data only. This loop must never inherit a spring that reverses its winding.
const sequence = ['softBurst', 'cookie9Sided', 'pentagon', 'pill', 'sunny', 'cookie4Sided', 'oval'] as const;
const positions = [0, 14, 29, 43, 57, 71, 83, 100] as const;
const angles = [0, 154, 309, 463, 617, 771, 926, 1080] as const;
const polygons = createLoadingPolygons(sequence, 'cookie4Sided');
const frames = Object.fromEntries(
  [...sequence, sequence[0]].map((name, index) => [
    `${positions[index]}%`,
    { clipPath: polygons[name], transform: `rotate(${angles[index]}deg) scale(0.842)` },
  ]),
) as Record<`${number}%`, { clipPath: string; transform: string }>;
const root = {
  ...indicatorColors,
  'display': 'inline-grid',
  'placeItems': 'center',
  'inlineSize': 'var(--md-loading-indicator-size, 48px)',
  'blockSize': 'var(--md-loading-indicator-size, 48px)',
  'aspectRatio': '1',
  'boxSizing': 'border-box',
  'flexShrink': 0,
  'verticalAlign': 'middle',
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'color': `var(--md-loading-indicator-color, ${color('primary')})`,
  "&[data-variant='contained']": {
    backgroundColor: `var(--md-loading-indicator-container-color, ${color('primaryContainer')})`,
    color: `var(--md-loading-indicator-color, ${color('onPrimaryContainer')})`,
  },
  "&[data-variant='contained'][data-color='secondary']": {
    backgroundColor: color('secondaryContainer'),
    color: color('onSecondaryContainer'),
  },
  "&[data-variant='contained'][data-color='tertiary']": {
    backgroundColor: color('tertiaryContainer'),
    color: color('onTertiaryContainer'),
  },
  "&[data-variant='contained'][data-color='inherit']": { color: 'inherit' },
  "&[data-indeterminate='false'] [data-md3-loading-rotor]": {
    animation: 'none',
    transform: 'rotate(calc(-180deg * var(--_loading-progress)))',
  },
  "&[data-indeterminate='false'] [data-md3-loading-shape]": {
    animation: 'md3-loading-controlled 1s linear both paused',
    animationDelay: 'calc(-1s * var(--_loading-progress))',
    transform: 'none',
  },
  '@keyframes md3-loading-controlled': {
    from: { clipPath: createShapePolygon(shapePaths.circle, true) },
    to: { clipPath: createShapePolygon(shapePaths.softBurst, true) },
  },
  '@media (prefers-reduced-motion: reduce)': {
    "&[data-indeterminate='true'] [data-md3-loading-rotor], &[data-indeterminate='true'] [data-md3-loading-shape]": {
      animation: 'none',
    },
  },
  '@media (forced-colors: active)': {
    'color': 'CanvasText',
    "&[data-variant='contained']": { backgroundColor: 'Canvas', color: 'CanvasText', border: '1px solid CanvasText' },
    '& [data-md3-loading-shape]': { backgroundColor: 'CanvasText' },
  },
} satisfies StyleObject;
const rotor = {
  'display': 'grid',
  'placeItems': 'center',
  'inlineSize': '79.1667%',
  'aspectRatio': '1',
  'animation': 'md3-loading-turn 4666ms linear infinite',
  '@keyframes md3-loading-turn': { to: { transform: 'rotate(360deg)' } },
} satisfies StyleObject;
const morph = {
  'inlineSize': '100%',
  'blockSize': '100%',
  'backgroundColor': 'currentColor',
  'clipPath': polygons.softBurst,
  'transform': 'scale(0.842)',
  'animation': 'md3-loading-morph 4666ms cubic-bezier(0.34, 0.88, 0.34, 1) infinite',
  '@keyframes md3-loading-morph': frames,
} satisfies StyleObject;

export const loadingRoot = css`
  ${root}
`;
export const loadingRotor = css`
  ${rotor}
`;
export const loadingMorph = css`
  ${morph}
`;
