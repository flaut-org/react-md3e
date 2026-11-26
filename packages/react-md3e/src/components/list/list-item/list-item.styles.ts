import { css } from '@linaria/core';
import { color, motion } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const itemStyles = {
  '--_outline-width': '0px',
  '--_list-label': color('onSurface'),
  '--_list-supporting': color('onSurfaceVariant'),
  '--_list-icon': color('onSurfaceVariant'),
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'center',
  'gap': 12,
  'boxSizing': 'border-box',
  'minInlineSize': 0,
  'minBlockSize': 56,
  'padding': '10px 16px',
  'borderStartStartRadius': 'var(--_list-top, 4px)',
  'borderStartEndRadius': 'var(--_list-top, 4px)',
  'borderEndStartRadius': 'var(--_list-bottom, 4px)',
  'borderEndEndRadius': 'var(--_list-bottom, 4px)',
  'color': 'var(--_list-label)',
  'backgroundColor': color('surface'),
  'transition': `border-radius ${motion('spatial')}, background-color ${motion('effects')}`,
  'overflowWrap': 'anywhere',
  "&[data-divider='true']::after": {
    content: "''",
    position: 'absolute',
    insetInline: 16,
    insetBlockEnd: 0,
    borderBlockEnd: `1px solid ${color('outlineVariant')}`,
    pointerEvents: 'none',
  },
  "&[data-lines='2']": { minBlockSize: 72 },
  "&[data-lines='3']": { minBlockSize: 88, alignItems: 'flex-start' },
  "&[data-selectable='true']": { display: 'block', padding: 0 },
  "&[data-actionable='true']": { display: 'block', padding: 0 },
  "&[data-expandable='true'][data-open]": {
    borderRadius: 'var(--md-comp-list-expand-container-shape, var(--md-sys-shape-corner-large, 16px))',
    backgroundColor: `var(--md-comp-list-expand-expanded-list-item-container-color, ${color('surface')})`,
  },
  "&:has(> [aria-selected='true'])": {
    '--_list-label': color('onSecondaryContainer'),
    '--_list-supporting': color('onSecondaryContainer'),
    '--_list-icon': color('onSecondaryContainer'),
    'backgroundColor': color('secondaryContainer'),
    'borderRadius': 'var(--md-sys-shape-corner-large, 16px)',
  },
  '&:has(> :focus-visible)': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
  "&[data-disabled='true']": {
    '--_list-label': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_list-supporting': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_list-icon': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    'backgroundColor': `color-mix(in srgb, ${color('onSurface')} 10%, transparent)`,
  },
  "&[data-disabled='true']:has(> [aria-selected='true'])": {
    backgroundColor: `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    "&:has(> [aria-selected='true'])": {
      '--_list-label': 'HighlightText',
      '--_list-supporting': 'HighlightText',
      '--_list-icon': 'HighlightText',
      '--_selection-active': 'HighlightText',
      '--_selection-mark': 'Highlight',
      'backgroundColor': 'Highlight',
      'forcedColorAdjust': 'none',
    },
    "&[data-disabled='true']": {
      '--_list-label': 'GrayText',
      '--_list-supporting': 'GrayText',
      '--_list-icon': 'GrayText',
    },
    '&:has(> :focus-visible)': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;

export const listItem = css`
  ${itemStyles}
`;
