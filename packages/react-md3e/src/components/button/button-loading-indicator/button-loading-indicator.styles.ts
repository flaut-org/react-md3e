import { css } from '@linaria/core';
import type { StyleObject } from '../../../styles/style-object.types';

const outer = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  pointerEvents: 'none',
} satisfies StyleObject;
const spinner = {
  'inlineSize': 'var(--_icon, 20px)',
  'blockSize': 'var(--_icon, 20px)',
  'boxSizing': 'border-box',
  'border': '2px solid currentColor',
  'borderBlockStartColor': 'transparent',
  'borderRadius': '50%',
  'animation': 'md3-button-loading 800ms linear infinite',
  '@keyframes md3-button-loading': { to: { transform: 'rotate(360deg)' } },
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
} satisfies StyleObject;

export const loadingIndicator = css`
  ${outer}
`;
export const loadingSpinner = css`
  ${spinner}
`;
