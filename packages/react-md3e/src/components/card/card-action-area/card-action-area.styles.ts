import { css } from '@linaria/core';
import { color } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const areaStyles = {
  '--_outline-width': '0px',
  'position': 'relative',
  'display': 'block',
  'boxSizing': 'border-box',
  'inlineSize': '100%',
  'minBlockSize': 48,
  'padding': 0,
  'margin': 0,
  'border': 0,
  'borderRadius': 'inherit',
  'appearance': 'none',
  'background': 'transparent',
  'color': 'inherit',
  'font': 'inherit',
  'textAlign': 'inherit',
  'textDecoration': 'none',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    backgroundColor: color('onSurface'),
    opacity: 0,
    transition: 'opacity 150ms ease',
  },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
  '&:focus-visible::before, &:active::before': { opacity: 0.1 },
  '&:disabled, &[aria-disabled="true"]': {
    backgroundColor: 'var(--_card-disabled-background)',
    color: `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    cursor: 'default',
  },
  '&:disabled::before, &[aria-disabled="true"]::before': { opacity: 0 },
  '&:disabled [data-md3-card-media], &[aria-disabled="true"] [data-md3-card-media]': { opacity: 0.38 },
  '@media (hover: hover)': {
    '&:hover:not(:disabled):not([aria-disabled="true"]):not(:focus-visible)::before': { opacity: 0.08 },
    '&:active:not(:disabled):not([aria-disabled="true"])::before': { opacity: 0.1 },
  },
  '@media (prefers-reduced-motion: reduce)': { '&::before': { transition: 'none' } },
  '@media (forced-colors: active)': {
    'color': 'ButtonText',
    '&:focus-visible': { outlineColor: 'Highlight' },
    '&:disabled, &[aria-disabled="true"]': { color: 'GrayText' },
  },
} satisfies StyleObject;

export const cardActionArea = css`
  ${areaStyles}
`;
