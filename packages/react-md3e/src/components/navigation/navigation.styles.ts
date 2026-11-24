import { css } from '@linaria/core';
import { color, motion } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const defaults = {
  '--_nav-block-focus-display': 'block',
  '--_nav-inline-focus-display': 'none',
  '--_nav-indicator-off-scale': '0',
  '--_nav-focused-indicator-motion': motion('spatial'),
  '--_nav-item-height': '64px',
  '--_nav-item-top': '6px',
  '--_nav-item-bottom': '6px',
  '--_nav-surface-height': '32px',
  '--_nav-surface-padding': '16px',
  '--_nav-surface-min-width': '56px',
  '--_nav-item-align': 'center',
  '--_nav-inline-columns': '0fr',
  '--_nav-inline-opacity': '0',
  '--_nav-inline-gap': '0px',
  '--_nav-bottom-rows': '1fr',
  '--_nav-bottom-opacity': '1',
  '--_nav-bottom-gap': '4px',
  '--_nav-active-label': color('secondary'),
  '--_nav-active-icon': color('onSecondaryContainer'),
  '--_nav-state-color': color('onSecondaryContainer'),
  '--_nav-indicator-width': 'fit-content',
  '--_nav-item-inset': '0px',
  '--_nav-icon-label-gap': '4px',
  'boxSizing': 'border-box',
  'minInlineSize': 0,
  'color': color('onSurfaceVariant'),
  'backgroundColor': color('surfaceContainer'),
  '@media (forced-colors: active)': { backgroundColor: 'Canvas', color: 'CanvasText' },
} satisfies StyleObject;
// Each family CSS entry includes these defaults; later imports must not override family presentation.
const root = { ':where(&)': defaults, '&[hidden]': { display: 'none' } } satisfies StyleObject;
const items = {
  display: 'flex',
  flexDirection: 'inherit',
  alignItems: 'stretch',
  minInlineSize: 0,
  flex: '1 1 auto',
} satisfies StyleObject;
const header = { flex: '0 0 auto', minInlineSize: 0 } satisfies StyleObject;
const footer = { flex: '0 0 auto', minInlineSize: 0 } satisfies StyleObject;

export const navigationRoot = css`
  ${root}
`;
export const navigationItems = css`
  ${items}
`;
export const navigationHeader = css`
  ${header}
`;
export const navigationFooter = css`
  ${footer}
`;
