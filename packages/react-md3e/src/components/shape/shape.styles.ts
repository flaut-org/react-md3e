import { css } from '@linaria/core';
import { color, springCurve } from '../../styles/theme-tokens';
import { surfaceColorStyles } from '../../styles/surface-colors';
import { shapePaths } from './shape-paths.generated';
import { createShapePolygon } from './shape-morph.helpers';
import type { ShapeVariant } from './shape.types';
import type { StyleObject } from '../../styles/style-object.types';

// Geometry and SVG encoding run during CSS extraction, never when rendering a Shape.
const masks = Object.fromEntries(
  Object.entries(shapePaths).map(([name, path]) => [
    `&[data-variant='${name}']`,
    {
      maskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path d="${path}" fill="white"/></svg>`)}")`,
    } satisfies StyleObject,
  ]),
) as Record<`&[data-variant='${ShapeVariant}']`, { maskImage: string }>;
const polygons = Object.fromEntries(
  Object.entries(shapePaths).map(([name, path]) => [
    `&[data-morph='true'][data-variant='${name}']`,
    { clipPath: createShapePolygon(path) } satisfies StyleObject,
  ]),
) as Record<`&[data-morph='true'][data-variant='${ShapeVariant}']`, { clipPath: string }>;
const rootStyles = {
  ...surfaceColorStyles(),
  ...masks,
  'display': 'inline-grid',
  'placeItems': 'center',
  'boxSizing': 'border-box',
  'inlineSize': 80,
  'aspectRatio': '1',
  'flexShrink': 0,
  'verticalAlign': 'middle',
  'overflow': 'hidden',
  'backgroundColor': color('primaryContainer'),
  'color': color('onPrimaryContainer'),
  'maskMode': 'alpha',
  'maskSize': '100% 100%',
  'maskPosition': 'center',
  'maskRepeat': 'no-repeat',
  '@supports (clip-path: polygon(0% 0%, 100% 0%, 0% 100%))': {
    ...polygons,
    "&[data-morph='true']": {
      maskImage: 'none',
      transitionProperty: 'clip-path',
      transitionDuration: 'var(--md3e-shape-morph-duration, 400ms)',
      transitionTimingFunction: `var(--md3e-shape-morph-easing, ${springCurve})`,
    },
  },
  '@media (prefers-reduced-motion: reduce)': { '&[data-morph]': { transition: 'none' } },
  "&[data-size='small']": { inlineSize: 40 },
  "&[data-size='large']": { inlineSize: 120 },
  '& > img': { inlineSize: '100%', blockSize: '100%', objectFit: 'cover', gridArea: '1 / 1' },
  '& > svg': { inlineSize: '40%', blockSize: '40%', fill: 'currentColor', gridArea: '1 / 1' },
  '@media (forced-colors: active)': {
    '&[data-color]': { forcedColorAdjust: 'none', backgroundColor: 'CanvasText', color: 'Canvas' },
  },
} satisfies StyleObject;

export const shapeRoot = css`
  ${rootStyles}
`;
