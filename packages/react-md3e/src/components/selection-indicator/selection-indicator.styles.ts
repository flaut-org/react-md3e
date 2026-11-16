import { css } from '@linaria/core';
import { color } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  '--_indicator-active': color('primary'),
  '--_indicator-outline': color('onSurfaceVariant'),
  '--_indicator-mark': color('onPrimary'),
  'position': 'relative',
  'display': 'inline-flex',
  'boxSizing': 'border-box',
  'alignItems': 'center',
  'justifyContent': 'center',
  'flexShrink': 0,
  'inlineSize': 18,
  'blockSize': 18,
  'margin': 2,
  'border': '2px solid var(--_indicator-outline)',
  'color': 'var(--_indicator-mark)',
  'borderRadius': 2,
  'transition': 'background-color 150ms ease, border-color 150ms ease',
  '& > svg': {
    inlineSize: '100%',
    blockSize: '100%',
    stroke: 'currentColor',
    strokeWidth: 2.5,
    fill: 'none',
    opacity: 0,
  },
  "&[data-indicator='radio']": { inlineSize: 20, blockSize: 20, borderRadius: '50%' },
  "&[data-indicator='radio']::after": {
    content: "''",
    inlineSize: 10,
    blockSize: 10,
    borderRadius: '50%',
    backgroundColor: 'var(--_indicator-active)',
    opacity: 0,
    transition: 'opacity 150ms ease',
  },
  "&[data-selected='true']": { borderColor: 'var(--_indicator-active)' },
  "&[data-indicator='radio'][data-selected='true']::after": { opacity: 1 },
  "&[data-indicator='checkbox'][data-selected='true']": { backgroundColor: 'var(--_indicator-active)' },
  "&[data-selected='true'] > svg": { opacity: 1 },
  "&[data-indicator='checkmark']": {
    inlineSize: 20,
    blockSize: 20,
    border: 0,
    color: `var(--_list-icon, ${color('primary')})`,
  },
  "&[data-error='true']": {
    '--_indicator-active': color('error'),
    '--_indicator-outline': color('error'),
    '--_indicator-mark': color('onError'),
  },
  "&[data-disabled='true']": {
    '--_indicator-active': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_indicator-outline': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_indicator-mark': color('surface'),
  },
  '@media (prefers-reduced-motion: reduce)': { 'transition': 'none', '&::after': { transition: 'none' } },
  '@media (forced-colors: active)': {
    'forcedColorAdjust': 'none',
    '--_indicator-outline': 'CanvasText',
    '--_indicator-active': 'var(--_selection-active, Highlight)',
    '--_indicator-mark': 'var(--_selection-mark, HighlightText)',
    "&[data-disabled='true']": {
      '--_indicator-outline': 'GrayText',
      '--_indicator-active': 'GrayText',
      '--_indicator-mark': 'Canvas',
    },
    "&[data-indicator='checkmark']": { color: 'inherit' },
  },
} satisfies StyleObject;

export const selectionIndicator = css`
  ${styles}
`;
