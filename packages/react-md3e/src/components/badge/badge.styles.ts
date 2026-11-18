import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'verticalAlign': 'middle',
  'flexShrink': 0,
  "&[data-anchored='true'] > [data-md3-badge-indicator]": {
    position: 'absolute',
    insetInlineStart: 'calc(100% - 12px)',
    insetBlockEnd: 'calc(100% - 14px)',
  },
  "&[data-anchored='true'] > [data-md3-badge-indicator][data-variant='small']": {
    insetInlineStart: 'calc(100% - 6px)',
    insetBlockEnd: 'calc(100% - 6px)',
  },
} satisfies StyleObject;

export const badgeRoot = css`
  ${rootStyles}
`;

const indicatorStyles = {
  ...typography('labelSmall'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'flexShrink': 0,
  'minInlineSize': 16,
  'minBlockSize': 16,
  'paddingInline': 4,
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'backgroundColor': color('error'),
  'color': color('onError'),
  'whiteSpace': 'nowrap',
  'pointerEvents': 'none',
  'transformOrigin': 'left center',
  'transform': 'scale(1)',
  'opacity': 1,
  'transition': `transform ${motion('spatial')}, opacity ${motion('effects')}`,
  '&:dir(rtl)': { transformOrigin: 'right center' },
  "&[data-variant='small']": { minInlineSize: 6, minBlockSize: 6, inlineSize: 6, blockSize: 6, padding: 0 },
  "&[data-invisible='true']": { transform: 'scale(0)', opacity: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    forcedColorAdjust: 'none',
    backgroundColor: 'Highlight',
    color: 'HighlightText',
    outline: '1px solid CanvasText',
  },
} satisfies StyleObject;

export const badgeIndicator = css`
  ${indicatorStyles}
`;
