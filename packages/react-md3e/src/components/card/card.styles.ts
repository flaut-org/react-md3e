import { css } from '@linaria/core';
import { motion, color } from '../../styles/theme-tokens';
import { elevationShadow } from '../../styles/elevation';
import type { StyleObject } from '../../styles/style-object.types';

const action = '> [data-md3-card-action-area]:not(:disabled):not([aria-disabled="true"])';
const rootStyles = {
  '--_card-disabled-background': color('surfaceContainerHighest'),
  'position': 'relative',
  'textAlign': 'start',
  'transition': `box-shadow ${motion('effects')}`,
  "&[data-variant='elevated']": { '--_card-disabled-background': color('surface') },
  "&[data-variant='outlined']": { '--_card-disabled-background': color('surface') },
  [`&:has(${action}:focus-visible)`]: { boxShadow: 'none' },
  [`&[data-variant='elevated']:has(${action}:focus-visible)`]: { boxShadow: elevationShadow(1) },
  [`&[data-variant='outlined']:has(${action}:focus-visible)`]: { borderColor: color('onSurface') },
  '@media (hover: hover)': {
    [`&:has(${action}:hover:not(:focus-visible))`]: { boxShadow: elevationShadow(1) },
    [`&[data-variant='elevated']:has(${action}:hover:not(:focus-visible))`]: { boxShadow: elevationShadow(2) },
  },
  [`&:has(${action}:active)`]: { boxShadow: 'none' },
  [`&[data-variant='elevated']:has(${action}:active)`]: { boxShadow: elevationShadow(1) },
  "&[data-dragged='true'][data-variant]": { boxShadow: elevationShadow(3) },
  "&[data-dragged='true'][data-variant='elevated']": { boxShadow: elevationShadow(4) },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { '&[data-variant]': { boxShadow: 'none', borderColor: 'CanvasText' } },
} satisfies StyleObject;

export const cardRoot = css`
  ${rootStyles}
`;
