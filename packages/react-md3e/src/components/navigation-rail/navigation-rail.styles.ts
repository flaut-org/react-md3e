import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import { elevationShadow } from '../../styles/elevation';
import type { StyleObject } from '../../styles/style-object.types';

const root = {
  '@property --md3e-navigation-rail-expansion': { syntax: '"<number>"', inherits: 'true', initialValue: 0 },
  '--md3e-navigation-rail-expansion': '0',
  '--_nav-rail-bottom-alpha': 'max(0, calc(1 - 2 * var(--md3e-navigation-rail-expansion)))',
  '--_nav-rail-inline-alpha': 'max(0, calc(2 * var(--md3e-navigation-rail-expansion) - 1))',
  '--_nav-item-inset': 'calc(20px * (1 - var(--md3e-navigation-rail-expansion)))',
  '--_nav-item-align': 'flex-start',
  'containerName': 'md3e-navigation-rail',
  'display': 'flex',
  'flexDirection': 'column',
  'flexShrink': 0,
  'inlineSize': '96px',
  'minInlineSize': '96px',
  'blockSize': '100%',
  'maxInlineSize': '100%',
  'minBlockSize': 0,
  'paddingBlock': '44px 8px',
  'backgroundColor': `var(--md-navigation-rail-container-color, ${color('surface')})`,
  'overflowX': 'hidden',
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  'interpolateSize': 'allow-keywords',
  'transition': `inline-size ${motion('spatial', 'default')}, min-inline-size ${motion('spatial', 'default')}, --md3e-navigation-rail-expansion ${motion('spatial', 'default')}`,
  '& [data-md3-navigation-bottom-label]': {
    alignSelf: 'flex-start',
    inlineSize: 56,
    opacity: 'calc(var(--_nav-rail-bottom-alpha) * var(--_nav-rail-bottom-alpha))',
    transition: `grid-template-rows ${motion('spatial', 'default')}, margin-block-start ${motion('spatial', 'default')}`,
  },
  '& [data-md3-navigation-inline-label]': {
    opacity: 'calc(var(--_nav-rail-inline-alpha) * var(--_nav-rail-inline-alpha))',
    transform: 'translateX(calc((var(--md3e-navigation-rail-expansion) - 1) * 40px))',
    transition: `grid-template-columns ${motion('spatial', 'default')}, margin-inline-start ${motion('spatial', 'default')}`,
  },
  '& [data-md3-navigation-inline-label] > span': { overflow: 'visible' },
  '&:dir(rtl) [data-md3-navigation-inline-label]': {
    transform: 'translateX(calc((1 - var(--md3e-navigation-rail-expansion)) * 40px))',
  },
  '& > [data-md3-navigation-items]': { flex: '1 0 auto', gap: 4 },
  '& > [data-md3-navigation-items] > [data-md3-navigation-item]': {
    alignSelf: 'flex-start',
    inlineSize: 'fit-content',
    maxInlineSize: 'calc(100% - 40px * var(--md3e-navigation-rail-expansion))',
    marginInline: 'calc(20px * var(--md3e-navigation-rail-expansion))',
    transition: `min-block-size ${motion('spatial', 'default')}, color ${motion('effects')}`,
  },
  '&[data-indicator="fullWidth"] > [data-md3-navigation-items] > [data-md3-navigation-item]': {
    inlineSize: 'calc(100% - 40px * var(--md3e-navigation-rail-expansion))',
  },
  '& > [data-md3-navigation-header]': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    paddingInline: 20,
    marginBlockEnd: 40,
  },
  '& > [data-md3-navigation-header] > [data-md3-icon-button]': { marginInlineStart: 4 },
  '& > [data-md3-navigation-header] [data-md3-fab-button]': { boxShadow: 'none' },
  '@media (hover: hover)': {
    '& > [data-md3-navigation-header] [data-md3-fab-button]:hover:not(:disabled):not([aria-disabled="true"])': {
      boxShadow: elevationShadow(1),
    },
  },
  '& > [data-md3-navigation-footer]': { paddingInline: 20, marginBlockStart: 8 },
  '&[data-alignment="center"] > [data-md3-navigation-items]': { justifyContent: 'center' },
  '&[data-alignment="end"] > [data-md3-navigation-items]': { justifyContent: 'flex-end' },
  '&[data-expanded="true"]': {
    '--md3e-navigation-rail-expansion': '1',
    '--_nav-block-focus-display': 'none',
    '--_nav-inline-focus-display': 'block',
    '--_nav-focused-indicator-motion': motion('effects'),
    '--_nav-item-height': '56px',
    '--_nav-surface-height': '56px',
    '--_nav-item-top': '0px',
    '--_nav-item-bottom': '0px',
    '--_nav-item-align': 'flex-start',
    '--_nav-inline-columns': '1fr',
    '--_nav-inline-opacity': '1',
    '--_nav-inline-gap': '8px',
    '--_nav-bottom-rows': '0fr',
    '--_nav-bottom-opacity': '0',
    '--_nav-bottom-gap': '0px',
    '--_nav-active-label': color('onSecondaryContainer'),
    'inlineSize': 'var(--md-navigation-rail-expanded-width, max-content)',
    'minInlineSize': 'min(220px, 100%)',
    'maxInlineSize': 'min(360px, 100%)',
    '& > [data-md3-navigation-items]': { gap: 0 },
    '& [data-md3-navigation-inline-label]': typography('labelLarge'),
    '& [data-md3-navigation-badge]': { position: 'relative', inset: 'auto', marginInlineStart: 8 },
    '&[data-indicator="fullWidth"]': { '--_nav-indicator-width': '100%' },
  },
  '&[data-variant="modal"]': { backgroundColor: color('surfaceContainer') },
  '@container md3e-navigation-rail style(--md3e-navigation-rail-expansion: 1)': {
    '&[data-expanded="true"] [data-md3-navigation-inline-label] > span': {
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
    },
  },
  '&[data-expanded="false"][data-hide-when-collapsed="true"]': { display: 'none' },
  '&[data-appearance="baseline"]': {
    '--_nav-item-inset': '12px',
    '--_nav-item-height': '56px',
    '--_nav-item-top': '0px',
    '--_nav-item-bottom': '4px',
    '--_nav-active-label': color('onSurface'),
    'inlineSize': 80,
    'minInlineSize': 80,
    'paddingBlock': '4px',
    '& > [data-md3-navigation-header]': { paddingInline: 12, marginBlockEnd: 8 },
    '& [data-md3-navigation-item][data-selected="true"] [data-md3-navigation-bottom-label]': { fontWeight: 700 },
  },
  '@media (prefers-reduced-motion: reduce)': {
    'transition': 'none',
    '& [data-md3-navigation-inline-label], & [data-md3-navigation-bottom-label]': { transition: 'none' },
  },
  '@media (forced-colors: active)': {
    'backgroundColor': 'Canvas',
    '& > [data-md3-navigation-header] [data-md3-fab-button], & > [data-md3-navigation-header] [data-md3-fab-button]:hover:not(:disabled):not([aria-disabled="true"])':
      { boxShadow: 'none' },
  },
} satisfies StyleObject;

export const navigationRail = css`
  ${root}
`;
