import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  '--_md3-tab-active-color': color('primary'),
  '--_md3-tab-direction': 'column',
  '--_md3-tab-stack-height': '64px',
  '--_md3-tab-indicator-height': '3px',
  '--_md3-tab-indicator-radius': '3px 3px 0 0',
  '--_md3-tab-indicator-full': '0',
  '--_md3-tab-fallback-width': '24px',
  '--_md3-tab-badge-start': 'calc(50% + 6px)',
  'minInlineSize': 0,
  "&[data-variant='secondary']": {
    '--_md3-tab-active-color': color('onSurface'),
    '--_md3-tab-direction': 'row',
    '--_md3-tab-stack-height': '48px',
    '--_md3-tab-indicator-height': '2px',
    '--_md3-tab-indicator-radius': '0px',
    '--_md3-tab-indicator-full': '1',
    '--_md3-tab-fallback-width': '100%',
    '--_md3-tab-badge-start': 'calc(100% + 4px)',
  },
} satisfies StyleObject;

export const tabsRoot = css`
  ${rootStyles}
`;

const listStyles = {
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'stretch',
  'boxSizing': 'border-box',
  'isolation': 'isolate',
  'minBlockSize': 48,
  'maxInlineSize': '100%',
  'backgroundColor': color('surface'),
  'boxShadow': `inset 0 -1px ${color('outlineVariant')}`,
  '& > [data-md3-tab]': { flex: '1 1 0' },
  '&:has(> [data-with-icon="true"][data-with-label="true"]:not([data-icon-position="start"]))': {
    minBlockSize: 'var(--_md3-tab-stack-height)',
  },
  '&:has(> [data-with-icon="true"][data-with-label="true"][data-icon-position="top"])': { minBlockSize: 64 },
  "&[data-scrollable='true']": {
    'overflowX': 'auto',
    'overscrollBehaviorX': 'contain',
    'scrollbarWidth': 'none',
    'paddingInlineStart': 52,
    '&::-webkit-scrollbar': { display: 'none' },
    '& > [data-md3-tab]': { flex: '0 0 auto', minInlineSize: 90 },
  },
  // A static selected underline is present in SSR; the shared moving indicator replaces it after measurement.
  '&:has(> [data-md3-tab-indicator]:not([hidden])) > [data-md3-tab]::after': { display: 'none' },
  '@media (forced-colors: active)': { boxShadow: 'inset 0 -1px CanvasText' },
} satisfies StyleObject;

export const tabList = css`
  ${listStyles}
`;

const tabStyles = {
  ...typography('titleSmall'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'minInlineSize': 48,
  'minBlockSize': 48,
  'padding': '9px 16px',
  'border': 0,
  'borderRadius': 0,
  'background': 'transparent',
  'color': color('onSurfaceVariant'),
  'appearance': 'none',
  'cursor': 'pointer',
  'userSelect': 'none',
  'WebkitTapHighlightColor': 'transparent',
  'transition': `color ${motion('effects')}`,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    backgroundColor: 'currentColor',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${motion('effects')}`,
  },
  "&[aria-selected='true']": { color: 'var(--_md3-tab-active-color)' },
  "&[aria-selected='true']::after": {
    content: "''",
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    inlineSize: 'var(--_md3-tab-fallback-width)',
    blockSize: 'var(--_md3-tab-indicator-height)',
    borderRadius: 'var(--_md3-tab-indicator-radius)',
    backgroundColor: color('primary'),
  },
  '&:focus-visible': { outline: 'none' },
  '&:focus-visible > [data-md3-tab-focus-ring]': { display: 'block' },
  '&[aria-selected="true"] > [data-md3-tab-focus-ring]': {
    insetBlockEnd: 'calc(var(--_md3-tab-indicator-height) + 1px)',
  },
  '&:focus-visible:not([aria-disabled="true"])::before, &:active:not(:has([data-md3-ripple-ink])):not([aria-disabled="true"])::before':
    { opacity: 0.1 },
  '&:not([aria-selected="true"]):is(:focus-visible, :active):not([aria-disabled="true"])': {
    color: color('onSurface'),
  },
  '@media (hover: hover)': {
    '&:hover:not([aria-disabled="true"])::before': { opacity: 0.08 },
    '&:hover:active:not(:has([data-md3-ripple-ink])):not([aria-disabled="true"])::before': { opacity: 0.1 },
    '&:hover:not([aria-selected="true"]):not([aria-disabled="true"])': { color: color('onSurface') },
  },
  "&[aria-disabled='true']": { color: `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`, cursor: 'default' },
  "&[data-icon-position='start']": { '--_md3-tab-direction': 'row', '--_md3-tab-badge-start': 'calc(100% + 4px)' },
  "&[data-icon-position='top']": { '--_md3-tab-direction': 'column', '--_md3-tab-badge-start': 'calc(50% + 6px)' },
  "&[data-with-icon='false']": { '--_md3-tab-badge-start': 'calc(100% + 4px)' },
  '@media (prefers-reduced-motion: reduce)': { '&, &::before': { transition: 'none' } },
  '@media (forced-colors: active)': {
    'color': 'ButtonText',
    'forcedColorAdjust': 'none',
    "&[aria-selected='true']": { color: 'Highlight' },
    "&[aria-disabled='true']": { color: 'GrayText' },
    '&::before': { display: 'none' },
    "&[aria-selected='true']::after": { backgroundColor: 'Highlight' },
    '&:not([aria-selected="true"]):is(:hover, :focus-visible, :active):not([aria-disabled="true"])': {
      color: 'ButtonText',
    },
  },
} satisfies StyleObject;

export const tabRoot = css`
  ${tabStyles}
`;

// The requested reference has a single inward emphasis pulse, with fixed outer edges.
// Its 500ms cycle matches the recorded M3E focus ring, independently of indicator springs.
const focusRingStyles = {
  'display': 'none',
  'position': 'absolute',
  'inset': 0,
  'zIndex': 1,
  'boxSizing': 'border-box',
  'pointerEvents': 'none',
  'border': `3px solid ${color('secondary')}`,
  'borderRadius': 'var(--md-sys-shape-corner-large, 16px)',
  'animation': 'md3e-tab-focus-pulse 500ms ease',
  '@keyframes md3e-tab-focus-pulse': {
    'from': { borderWidth: 3 },
    '50%': { borderWidth: 6 },
    'to': { borderWidth: 3 },
  },
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  '@media (forced-colors: active)': { borderColor: 'Highlight', forcedColorAdjust: 'none' },
} satisfies StyleObject;

export const tabFocusRing = css`
  ${focusRingStyles}
`;

const contentStyles = {
  position: 'relative',
  display: 'inline-flex',
  flexFlow: 'var(--_md3-tab-direction) nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px 8px',
  maxInlineSize: '100%',
  minInlineSize: 0,
} satisfies StyleObject;

export const tabContent = css`
  ${contentStyles}
`;

const labelStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxInlineSize: '100%',
} satisfies StyleObject;

export const tabLabel = css`
  ${labelStyles}
`;

const iconStyles = {
  'display': 'inline-flex',
  'flexShrink': 0,
  'inlineSize': 24,
  'blockSize': 24,
  'fontSize': 24,
  '& > svg': { inlineSize: '100%', blockSize: '100%' },
} satisfies StyleObject;

export const tabIcon = css`
  ${iconStyles}
`;

const badgeStyles = {
  position: 'absolute',
  insetInlineStart: 'var(--_md3-tab-badge-start)',
  insetBlockStart: 0,
} satisfies StyleObject;

export const tabBadge = css`
  ${badgeStyles}
`;

const indicatorStyles = {
  '--_md3-tab-indicator-width':
    'max(min(var(--active-tab-width), var(--_md3-tab-label-width, 24px)), calc(var(--active-tab-width) * var(--_md3-tab-indicator-full)))',
  'position': 'absolute',
  'pointerEvents': 'none',
  'bottom': 0,
  'left': 0,
  'inlineSize': 'var(--_md3-tab-indicator-width)',
  'blockSize': 'var(--_md3-tab-indicator-height)',
  'transform':
    'translateX(calc(var(--active-tab-left) + (var(--active-tab-width) - var(--_md3-tab-indicator-width)) / 2))',
  'borderRadius': 'var(--_md3-tab-indicator-radius)',
  'backgroundColor': color('primary'),
  'transition': `transform ${motion('spatial')}, inline-size ${motion('spatial')}`,
  '&[hidden]': { display: 'none' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { backgroundColor: 'Highlight', forcedColorAdjust: 'none' },
} satisfies StyleObject;

export const tabIndicator = css`
  ${indicatorStyles}
`;

const panelStyles = {
  'minInlineSize': 0,
  '&[hidden], &[inert]': { display: 'none' },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
  '@media (forced-colors: active)': { '&:focus-visible': { outlineColor: 'Highlight' } },
} satisfies StyleObject;

export const tabPanel = css`
  ${panelStyles}
`;
