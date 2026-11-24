import { css } from '@linaria/core';
import { motion, color } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  '--_control-state': color('onSurface'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'verticalAlign': 'middle',
  'flexShrink': 0,
  'boxSizing': 'border-box',
  'inlineSize': 48,
  'blockSize': 48,
  'padding': 0,
  'margin': 0,
  'border': 0,
  'borderRadius': '50%',
  'color': 'var(--_control-state)',
  'backgroundColor': 'transparent',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'outline': 'none',
  'WebkitTapHighlightColor': 'transparent',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 4,
    borderRadius: 'inherit',
    backgroundColor: 'currentColor',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${motion('effects')}`,
  },
  '&[data-checked], &[data-indeterminate]': { '--_control-state': color('primary') },
  "&[data-error='true']": { '--_control-state': color('error') },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
  '&:active:not(:has([data-md3-ripple-ink])):not([data-disabled], [data-readonly])::before': { opacity: 0.1 },
  '&[data-disabled], &[data-readonly]': { cursor: 'default' },
  '@media (hover: hover)': { '&:hover:not([data-disabled], [data-readonly])::before': { opacity: 0.08 } },
  '@media (prefers-reduced-motion: reduce)': { '&::before': { transition: 'none' } },
  '@media (forced-colors: active)': { '&:focus-visible': { outlineColor: 'Highlight' } },
} satisfies StyleObject;

export const selectionControl = css`
  ${styles}
`;

const rippleStyles = {
  position: 'absolute',
  inset: 4,
  borderRadius: '50%',
  pointerEvents: 'none',
} satisfies StyleObject;

export const selectionRipple = css`
  ${rippleStyles}
`;
