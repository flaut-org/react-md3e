import { css } from '@linaria/core';
import { color, springCurve } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  'inlineSize': 408,
  'maxInlineSize': '100%',
  'boxSizing': 'border-box',
  "&[data-full-width='true']": { inlineSize: '100%', maxInlineSize: 768 },
} satisfies StyleObject;

export const searchRoot = css`
  ${rootStyles}
`;

const anchorStyles = {
  'marginInline': 24,
  'transition': `margin 400ms ${springCurve}`,
  "&[data-expanded='true']": { visibility: 'hidden' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const searchAnchor = css`
  ${anchorStyles}
`;

const portalStyles = { position: 'relative', zIndex: 1400, isolation: 'isolate' } satisfies StyleObject;

export const searchPortal = css`
  ${portalStyles}
`;

const backdropStyles = {
  'position': 'fixed',
  'inset': 0,
  'backgroundColor': `color-mix(in srgb, ${color('scrim')} 32%, transparent)`,
  'opacity': 1,
  'transition': 'opacity 150ms ease',
  '&[data-starting-style], &[data-ending-style]': { opacity: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const searchBackdrop = css`
  ${backdropStyles}
`;
