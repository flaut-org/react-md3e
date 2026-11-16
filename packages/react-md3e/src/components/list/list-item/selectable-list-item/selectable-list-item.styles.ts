import { css } from '@linaria/core';
import { color } from '../../../../styles/theme-tokens';
import type { StyleObject } from '../../../../styles/style-object.types';

const controlStyles = {
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'inherit',
  'gap': 12,
  'inlineSize': '100%',
  'minBlockSize': 'inherit',
  'boxSizing': 'border-box',
  'padding': '10px 16px',
  'margin': 0,
  'border': 0,
  'borderRadius': 'inherit',
  'font': 'inherit',
  'textAlign': 'start',
  'color': 'inherit',
  'background': 'transparent',
  'outline': 'none',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: color('onSurface'),
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 150ms ease',
  },
  '&:focus-visible::before, &:active:not(:disabled)::before': { opacity: 0.1 },
  '&:disabled': { cursor: 'default' },
  '@media (hover: hover)': {
    '&:hover:not(:disabled)::before': { opacity: 0.08 },
    '&:hover:active:not(:disabled)::before, &:hover:focus-visible::before': { opacity: 0.1 },
  },
  '@media (prefers-reduced-motion: reduce)': { '&::before': { transition: 'none' } },
} satisfies StyleObject;

export const listControl = css`
  ${controlStyles}
`;
