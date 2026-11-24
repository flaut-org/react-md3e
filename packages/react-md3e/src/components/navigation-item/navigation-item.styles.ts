import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const item = {
  ...typography('labelMedium'),
  'position': 'relative',
  'display': 'flex',
  'flexDirection': 'column',
  'alignItems': 'var(--_nav-item-align)',
  'justifyContent': 'flex-start',
  'boxSizing': 'border-box',
  'isolation': 'isolate',
  'minInlineSize': 48,
  'minBlockSize': 'max(48px, var(--_nav-item-height))',
  'paddingBlockStart': 'var(--_nav-item-top)',
  'paddingBlockEnd': 'var(--_nav-item-bottom)',
  'paddingInline': 'var(--_nav-item-inset)',
  'border': 0,
  'borderRadius': 0,
  'appearance': 'none',
  'background': 'transparent',
  'color': color('onSurfaceVariant'),
  'textDecoration': 'none',
  'textAlign': 'center',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'userSelect': 'none',
  'WebkitTapHighlightColor': 'transparent',
  'transition': `min-block-size ${motion('spatial', 'default')}, padding ${motion('spatial', 'default')}, color ${motion('effects')}`,
  '&[hidden]': { display: 'none' },
  '&[data-with-label="false"]': { justifyContent: 'center', paddingBlock: 0 },
  '&[data-selected="true"]': { color: 'var(--_nav-active-label)' },
  '&:focus-visible': { outline: 'none' },
  '&:focus-visible > [data-md3-navigation-focus-ring]': { display: 'var(--_nav-block-focus-display, block)' },
  '&:focus-visible [data-md3-navigation-inline-focus-ring]': { display: 'var(--_nav-inline-focus-display, none)' },
  '&:is(:focus-visible, :active):not(:disabled):not([aria-disabled="true"]) > [data-md3-navigation-surface]::before': {
    opacity: 0.1,
  },
  '@media (hover: hover)': {
    '&:hover:not(:disabled):not([aria-disabled="true"]) > [data-md3-navigation-surface]::before': { opacity: 0.08 },
    '&:is(:focus-visible, :active):hover:not(:disabled):not([aria-disabled="true"]) > [data-md3-navigation-surface]::before':
      { opacity: 0.1 },
  },
  '&:disabled, &[aria-disabled="true"]': {
    'color': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    'cursor': 'default',
    '& [data-md3-navigation-icon]': { color: 'inherit' },
    '& [data-md3-navigation-indicator]': { opacity: 0 },
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    'color': 'ButtonText',
    '&[data-selected="true"]': { color: 'Highlight' },
    '&:disabled, &[aria-disabled="true"]': { color: 'GrayText' },
    '& [data-md3-navigation-surface]::before': { display: 'none' },
    '&[data-selected="true"] [data-md3-navigation-icon], &[data-selected="true"] [data-md3-navigation-inline-label]': {
      color: 'HighlightText',
      forcedColorAdjust: 'none',
    },
    '&:disabled [data-md3-navigation-icon], &[aria-disabled="true"] [data-md3-navigation-icon], &:disabled [data-md3-navigation-inline-label], &[aria-disabled="true"] [data-md3-navigation-inline-label]':
      { color: 'GrayText' },
  },
} satisfies StyleObject;
const surface = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'flex-start',
  'boxSizing': 'border-box',
  'flex': '0 0 auto',
  'inlineSize': 'var(--_nav-indicator-width)',
  'maxInlineSize': '100%',
  'minInlineSize': 'var(--_nav-surface-min-width)',
  'minBlockSize': 'var(--_nav-surface-height)',
  'paddingInline': 'var(--_nav-surface-padding)',
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'transition': `min-block-size ${motion('spatial', 'default')}, padding ${motion('spatial', 'default')}`,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    backgroundColor: 'var(--_nav-state-color)',
    opacity: 0,
    transition: `opacity ${motion('effects')}`,
  },
  '@media (prefers-reduced-motion: reduce)': { '&, &::before': { transition: 'none' } },
} satisfies StyleObject;
const indicator = {
  'position': 'absolute',
  'inset': 0,
  'borderRadius': 'inherit',
  'pointerEvents': 'none',
  'zIndex': -1,
  'backgroundColor': color('secondaryContainer'),
  'opacity': 0,
  'transform': 'scaleX(var(--_nav-indicator-off-scale, 0))',
  'transition': `transform ${motion('spatial')}, opacity ${motion('effects')}`,
  '&:is([data-selected="true"] *)': { opacity: 1, transform: 'scaleX(1)' },
  '&:is(:focus-visible *)': {
    transition: `transform var(--_nav-focused-indicator-motion, ${motion('spatial')}), opacity ${motion('effects')}`,
  },
  '@media (prefers-reduced-motion: reduce)': { '&, &:is(:focus-visible *)': { transition: 'none' } },
  '@media (forced-colors: active)': { backgroundColor: 'Highlight', forcedColorAdjust: 'none' },
} satisfies StyleObject;
const icon = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'flex': '0 0 24px',
  'inlineSize': 24,
  'blockSize': 24,
  'color': color('onSurfaceVariant'),
  'transition': `color ${motion('effects')}`,
  '& > svg': { inlineSize: '100%', blockSize: '100%', fill: 'currentColor' },
  '&:is([data-selected="true"] *)': { color: 'var(--_nav-active-icon)' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;
const inlineLabel = {
  ...typography('labelMedium'),
  'position': 'relative',
  'display': 'grid',
  'gridTemplateColumns': 'var(--_nav-inline-columns)',
  'marginInlineStart': 'var(--_nav-inline-gap)',
  'minInlineSize': 0,
  'opacity': 'var(--_nav-inline-opacity)',
  'textAlign': 'start',
  'transition': `grid-template-columns ${motion('spatial', 'default')}, margin-inline-start ${motion('spatial', 'default')}, opacity ${motion('effects')}`,
  '& > span': { minInlineSize: 0, overflow: 'hidden', whiteSpace: 'nowrap' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;
const bottomLabel = {
  'display': 'grid',
  'gridTemplateRows': 'var(--_nav-bottom-rows)',
  'position': 'relative',
  'opacity': 'var(--_nav-bottom-opacity)',
  'marginBlockStart': 'var(--_nav-bottom-gap)',
  'maxInlineSize': '100%',
  'transition': `grid-template-rows ${motion('spatial', 'default')}, margin-block-start ${motion('spatial', 'default')}, opacity ${motion('effects')}`,
  '& > span': { minBlockSize: 0, overflow: 'hidden', overflowWrap: 'anywhere' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;
const badge = {
  ...typography('labelSmall'),
  position: 'absolute',
  insetBlockStart: 0,
  insetInlineStart: 'calc(var(--_nav-surface-padding) + 18px)',
  zIndex: 1,
  whiteSpace: 'nowrap',
} satisfies StyleObject;
const focus = {
  'display': 'none',
  'position': 'absolute',
  'inset': 0,
  'boxSizing': 'border-box',
  'border': `3px solid ${color('secondary')}`,
  'borderRadius': 'var(--md-sys-shape-corner-medium, 12px)',
  'pointerEvents': 'none',
  'zIndex': 2,
  'animation': 'md3e-navigation-focus-pulse 500ms ease',
  '@keyframes md3e-navigation-focus-pulse': {
    'from': { borderWidth: 3 },
    '50%': { borderWidth: 6 },
    'to': { borderWidth: 3 },
  },
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  '@media (forced-colors: active)': { borderColor: 'Highlight', forcedColorAdjust: 'none' },
} satisfies StyleObject;
const inlineFocus = {
  ...focus,
  'inset': 0,
  'border': 0,
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'outline': `3px solid ${color('secondary')}`,
  'outlineOffset': 2,
  'animation': 'md3e-navigation-focus-outward-pulse 500ms ease',
  '@keyframes md3e-navigation-focus-outward-pulse': {
    'from': { outlineWidth: 3 },
    '50%': { outlineWidth: 6 },
    'to': { outlineWidth: 3 },
  },
  '@media (forced-colors: active)': { outlineColor: 'Highlight', forcedColorAdjust: 'none' },
} satisfies StyleObject;

export const navigationItem = css`
  ${item}
`;
export const navigationItemSurface = css`
  ${surface}
`;
export const navigationItemIndicator = css`
  ${indicator}
`;
export const navigationItemIcon = css`
  ${icon}
`;
export const navigationItemInlineLabel = css`
  ${inlineLabel}
`;
export const navigationItemBottomLabel = css`
  ${bottomLabel}
`;
export const navigationItemBadge = css`
  ${badge}
`;
export const navigationItemFocus = css`
  ${focus}
`;
export const navigationItemInlineFocus = css`
  ${inlineFocus}
`;
