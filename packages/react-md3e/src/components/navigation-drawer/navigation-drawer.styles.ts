import { css } from '@linaria/core';
import { color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const root = {
  '--_nav-block-focus-display': 'none',
  '--_nav-inline-focus-display': 'block',
  '--_nav-indicator-off-scale': '1',
  '--_nav-item-height': '56px',
  '--_nav-surface-height': '56px',
  '--_nav-item-top': '0px',
  '--_nav-item-bottom': '0px',
  '--_nav-item-inset': '12px',
  '--_nav-inline-columns': '1fr',
  '--_nav-inline-opacity': '1',
  '--_nav-inline-gap': '12px',
  '--_nav-bottom-rows': '0fr',
  '--_nav-bottom-opacity': '0',
  '--_nav-bottom-gap': '0px',
  '--_nav-indicator-width': '100%',
  '--_nav-active-label': color('onSecondaryContainer'),
  '--_nav-state-color': color('onSurface'),
  'display': 'flex',
  'flexDirection': 'column',
  'flexShrink': 0,
  'inlineSize': 'var(--md-navigation-drawer-width, 360px)',
  'blockSize': '100%',
  'minBlockSize': 0,
  'maxInlineSize': '100%',
  'paddingBlock': '12px',
  'borderStartEndRadius': 'var(--md-sys-shape-corner-large, 16px)',
  'borderEndEndRadius': 'var(--md-sys-shape-corner-large, 16px)',
  'backgroundColor': color('surface'),
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  '&[data-variant="modal"]': { backgroundColor: color('surfaceContainerLow') },
  '& [data-md3-navigation-inline-label]': typography('labelLarge'),
  '& [data-md3-navigation-inline-label] > span': { whiteSpace: 'normal', overflowWrap: 'anywhere' },
  '& [data-md3-navigation-item][data-selected="true"]': { '--_nav-state-color': color('onSecondaryContainer') },
  '& [data-md3-navigation-item]:not([data-selected="true"]):is(:hover, :focus-visible, :active):not(:disabled):not([aria-disabled="true"])':
    {
      'color': color('onSurface'),
      '& [data-md3-navigation-icon]': { color: 'inherit' },
    },
  '& [data-md3-navigation-item][data-with-icon="false"]': { '--_nav-inline-gap': '0px' },
  '& [data-md3-navigation-badge]': {
    ...typography('labelLarge'),
    position: 'relative',
    inset: 'auto',
    marginInlineStart: 'auto',
    paddingInlineStart: 12,
  },
  '& > [data-md3-navigation-items]': { flex: '1 0 auto' },
  '& > [data-md3-navigation-header]': {
    ...typography('titleSmall'),
    display: 'flex',
    alignItems: 'center',
    minBlockSize: 56,
    paddingInline: 28,
  },
  '& > [data-md3-navigation-footer]': { paddingInline: 28, paddingBlock: 16 },
  '@media (forced-colors: active)': {
    'backgroundColor': 'Canvas',
    'borderInlineEnd': '1px solid CanvasText',
    '&[data-variant="modal"]': { backgroundColor: 'Canvas' },
    '& [data-md3-navigation-item]:not([data-selected="true"]):is(:hover, :focus-visible, :active):not(:disabled):not([aria-disabled="true"])':
      { color: 'ButtonText' },
  },
} satisfies StyleObject;

export const navigationDrawer = css`
  ${root}
`;
