import { css } from '@linaria/core';
import { color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  ...typography('titleMedium'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'verticalAlign': 'middle',
  'flexShrink': 0,
  'inlineSize': 40,
  'blockSize': 40,
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'backgroundColor': color('primaryContainer'),
  'color': color('onPrimaryContainer'),
  'overflow': 'hidden',
  "&[data-size='small']": { inlineSize: 32, blockSize: 32 },
  "&[data-size='large']": { inlineSize: 56, blockSize: 56 },
  "&[data-variant='rounded']": { borderRadius: 'var(--md-sys-shape-corner-small, 8px)' },
  "&[data-variant='square']": { borderRadius: 0 },
  '& svg': { inlineSize: '60%', blockSize: '60%', fill: 'currentColor' },
  '@media (forced-colors: active)': { border: '1px solid CanvasText', color: 'CanvasText', backgroundColor: 'Canvas' },
} satisfies StyleObject;

export const avatarRoot = css`
  ${rootStyles}
`;
