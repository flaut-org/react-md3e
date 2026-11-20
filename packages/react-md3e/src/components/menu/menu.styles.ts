import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import { elevationShadow, shadowColors } from '../../styles/elevation';
import type { StyleObject } from '../../styles/style-object.types';

const triggerStyles = {
  '&[data-popup-open]': {
    borderRadius: 'var(--_pressed)',
    backgroundImage:
      'linear-gradient(color-mix(in srgb, currentColor 10%, transparent), color-mix(in srgb, currentColor 10%, transparent))',
  },
} satisfies StyleObject;

export const menuTrigger = css`
  ${triggerStyles}
`;

const portalStyles = { position: 'relative', zIndex: 1400, isolation: 'isolate' } satisfies StyleObject;

export const menuPortal = css`
  ${portalStyles}
`;

const positionerStyles = {
  ...shadowColors,
  'zIndex': 1400,
  'maxInlineSize': 'var(--available-width)',
  'outline': 'none',
  '&[hidden]': { display: 'none' },
  "&[data-md3-menu-layout='grouped']": {
    filter: 'drop-shadow(0 1px 3px var(--_shadow-key)) drop-shadow(0 4px 8px var(--_shadow-ambient))',
  },
  '@media (forced-colors: active)': { "&[data-md3-menu-layout='grouped']": { filter: 'none' } },
} satisfies StyleObject;

export const menuPositioner = css`
  ${positionerStyles}
`;

const popupStyles = {
  ...typography('labelLarge'),
  ...shadowColors,
  '@property --md3e-menu-scale': { syntax: '"<number>"', inherits: 'true', initialValue: '1' },
  '--md3e-menu-scale': '1',
  '--_menu-radius': 'var(--md-sys-shape-corner-large, 16px)',
  '--_menu-container': color('surfaceContainerLow'),
  '--_menu-item-start-radius': 'max(4px, calc(var(--_menu-radius) - 4px))',
  '--_menu-item-end-radius': 'max(4px, calc(var(--_menu-radius) - 4px))',
  '--_menu-label': color('onSurface'),
  '--_menu-icon': color('onSurfaceVariant'),
  '--_menu-supporting': color('onSurfaceVariant'),
  '--_menu-state': color('onSurface'),
  '--_menu-selected': color('tertiaryContainer'),
  '--_menu-on-selected': color('onTertiaryContainer'),
  '--_menu-height': '48px',
  '--_menu-arrow-transform': 'none',
  '--_menu-disabled': color('onSurface'),
  'position': 'relative',
  'display': 'flex',
  'flexDirection': 'column',
  'gap': 2,
  'boxSizing': 'border-box',
  'minInlineSize': 'min(112px, var(--available-width))',
  'maxInlineSize': 'min(280px, var(--available-width))',
  'maxBlockSize': 'min(480px, var(--available-height))',
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  'scrollbarWidth': 'thin',
  'scrollbarColor': `${color('onSurfaceVariant')} transparent`,
  'scrollPaddingBlock': 4,
  'padding': 4,
  'borderRadius': 'var(--_menu-radius)',
  'outline': 'none',
  'backgroundColor': 'var(--_menu-container)',
  'color': 'var(--_menu-label)',
  'boxShadow': elevationShadow(3),
  'opacity': 1,
  'transform': 'scaleY(clamp(0.001, var(--md3e-menu-scale), 1.05))',
  'transformOrigin': 'var(--transform-origin)',
  'transition': `opacity ${motion('effects')}, --md3e-menu-scale ${motion('spatial')}, border-radius ${motion('spatial')}`,
  '&[hidden]': { display: 'none' },
  '&[dir="rtl"]': { '--_menu-arrow-transform': 'scaleX(-1)' },
  "&[data-variant='vibrant']": {
    '--_menu-container': color('tertiaryContainer'),
    '--_menu-label': color('onTertiaryContainer'),
    '--_menu-icon': color('onTertiaryContainer'),
    '--_menu-supporting': color('onTertiaryContainer'),
    '--_menu-state': color('onTertiaryContainer'),
    '--_menu-selected': color('tertiary'),
    '--_menu-on-selected': color('onTertiary'),
    '--_menu-disabled': color('onTertiaryContainer'),
  },
  "&[data-layout='grouped']": { padding: 0, backgroundColor: 'transparent', boxShadow: 'none', borderRadius: 0 },
  "&[data-density='-1']": { '--_menu-height': '44px' },
  "&[data-density='-2']": { '--_menu-height': '40px' },
  "&[data-density='-3']": { '--_menu-height': '36px' },
  '&:has([data-md3-menu-submenu-trigger][data-popup-open]):not(:focus-within):not(:hover)': {
    '--_menu-radius': 'var(--md-sys-shape-corner-small, 8px)',
  },
  '&[data-starting-style], &[data-ending-style]': { '--md3e-menu-scale': '0', 'opacity': 0 },
  '@media (pointer: coarse)': { '&[data-density]': { '--_menu-height': '48px' } },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    '--_menu-label': 'CanvasText',
    '--_menu-icon': 'CanvasText',
    '--_menu-supporting': 'CanvasText',
    '--_menu-selected': 'Highlight',
    '--_menu-on-selected': 'HighlightText',
    '--_menu-disabled': 'GrayText',
    '--_menu-container': 'Canvas',
    'border': '1px solid CanvasText',
    'backgroundColor': 'Canvas',
    'boxShadow': 'none',
    "&[data-variant='vibrant']": {
      '--_menu-label': 'CanvasText',
      '--_menu-icon': 'CanvasText',
      '--_menu-supporting': 'CanvasText',
      '--_menu-selected': 'Highlight',
      '--_menu-on-selected': 'HighlightText',
      '--_menu-disabled': 'GrayText',
      '--_menu-container': 'Canvas',
      'backgroundColor': 'Canvas',
    },
    "&[data-layout='grouped']": { backgroundColor: 'transparent', border: 0 },
  },
} satisfies StyleObject;

export const menuPopup = css`
  ${popupStyles}
`;

const itemStyles = {
  ...typography('labelLarge'),
  '--_outline-width': '0px',
  '--_list-label': 'var(--_menu-label)',
  '--_list-icon': 'var(--_menu-icon)',
  '--_list-supporting': 'var(--_menu-supporting)',
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'center',
  'gap': 12,
  'flexShrink': 0,
  'minInlineSize': 0,
  'minBlockSize': 'var(--_menu-height)',
  'padding': '8px 16px',
  'boxSizing': 'border-box',
  'borderRadius': 'var(--md-sys-shape-corner-extra-small, 4px)',
  'border': 0,
  'outline': 'none',
  'color': 'var(--_list-label)',
  'backgroundColor': 'transparent',
  'textDecoration': 'none',
  'overflowWrap': 'anywhere',
  'cursor': 'pointer',
  'userSelect': 'none',
  'WebkitTapHighlightColor': 'transparent',
  'transition': `background-color ${motion('effects')}, border-radius ${motion('spatial')}`,
  '& > [data-md3-list-primary], & [data-md3-list-primary]': { ...typography('labelLarge') },
  '& [data-md3-list-secondary]': { ...typography('bodySmall') },
  '&:first-child': {
    borderStartStartRadius: 'var(--_menu-item-start-radius)',
    borderStartEndRadius: 'var(--_menu-item-start-radius)',
  },
  // Portals append nonvisual anchor/focus siblings. Count items without overriding selected shapes.
  '&:nth-last-child(1 of :where([data-md3-menu-item]:not([hidden])))': {
    borderEndStartRadius: 'var(--_menu-item-end-radius)',
    borderEndEndRadius: 'var(--_menu-item-end-radius)',
  },
  '&[data-checked], &[data-selected="true"]': {
    '--_list-label': 'var(--_menu-on-selected)',
    '--_list-icon': 'var(--_menu-on-selected)',
    '--_list-supporting': 'var(--_menu-on-selected)',
    'backgroundColor': 'var(--_menu-selected)',
    'borderRadius': 'var(--md-sys-shape-corner-medium, 12px)',
  },
  '&[data-popup-open]': {
    backgroundImage:
      'linear-gradient(color-mix(in srgb, var(--_menu-state) 8%, transparent), color-mix(in srgb, var(--_menu-state) 8%, transparent))',
  },
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: 'currentColor',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${motion('effects')}`,
  },
  '&[data-highlighted]:not([data-disabled])::before': { opacity: 0.08 },
  '&:active:not([data-disabled])::before': { opacity: 0.1 },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
  '&[data-disabled]': {
    '--_list-label': 'color-mix(in srgb, var(--_menu-disabled) 38%, transparent)',
    '--_list-icon': 'color-mix(in srgb, var(--_menu-disabled) 38%, transparent)',
    '--_list-supporting': 'color-mix(in srgb, var(--_menu-disabled) 38%, transparent)',
    'backgroundColor': 'transparent',
    'cursor': 'default',
  },
  '&[hidden]': { display: 'none' },
  '@media (prefers-reduced-motion: reduce)': { 'transition': 'none', '&::before': { transition: 'none' } },
  '@media (forced-colors: active)': {
    'forcedColorAdjust': 'none',
    'backgroundImage': 'none',
    '&[data-highlighted]:not([data-disabled])': {
      '--_list-label': 'HighlightText',
      '--_list-icon': 'HighlightText',
      '--_list-supporting': 'HighlightText',
      'backgroundColor': 'Highlight',
    },
    '&:focus-visible': { outlineColor: 'Highlight' },
    '&[data-disabled]': { '--_list-label': 'GrayText', '--_list-icon': 'GrayText', '--_list-supporting': 'GrayText' },
    '&::before': { display: 'none' },
  },
} satisfies StyleObject;

export const menuItem = css`
  ${itemStyles}
`;

const itemBodyStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  inlineSize: '100%',
  minInlineSize: 0,
  position: 'relative',
  transform: 'scaleY(calc(1 / clamp(0.001, var(--md3e-menu-scale), 1.05)))',
  transformOrigin: 'center',
} satisfies StyleObject;

export const menuItemBody = css`
  ${itemBodyStyles}
`;

const trailingStyles = {
  ...typography('labelLarge'),
  position: 'relative',
  color: 'var(--_list-supporting)',
} satisfies StyleObject;

export const menuTrailing = css`
  ${trailingStyles}
`;

const groupStyles = {
  'display': 'flex',
  'flexDirection': 'column',
  'gap': 2,
  'flexShrink': 0,
  'transition': `border-radius ${motion('spatial')}`,
  '&:is([data-md3-menu][data-layout="grouped"] > [data-md3-menu-group])': {
    '--_menu-item-start-radius': 'var(--md-sys-shape-corner-extra-small, 4px)',
    '--_menu-item-end-radius': 'var(--md-sys-shape-corner-extra-small, 4px)',
    'padding': 4,
    'backgroundColor': 'var(--_menu-container)',
    'borderRadius': 'var(--md-sys-shape-corner-small, 8px)',
  },
  '&:is([data-md3-menu][data-layout="grouped"] > [data-md3-menu-group]):first-child': {
    '--_menu-item-start-radius': 'max(4px, calc(var(--_menu-radius) - 4px))',
    'borderStartStartRadius': 'var(--_menu-radius)',
    'borderStartEndRadius': 'var(--_menu-radius)',
  },
  '&:is([data-md3-menu][data-layout="grouped"] > [data-md3-menu-group]):last-child': {
    '--_menu-item-end-radius': 'max(4px, calc(var(--_menu-radius) - 4px))',
    'borderEndStartRadius': 'var(--_menu-radius)',
    'borderEndEndRadius': 'var(--_menu-radius)',
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    '&:is([data-md3-menu][data-layout="grouped"] > [data-md3-menu-group])': {
      outline: '1px solid CanvasText',
      outlineOffset: -1,
    },
  },
} satisfies StyleObject;

export const menuGroup = css`
  ${groupStyles}
`;

const groupLabelStyles = {
  ...typography('labelMedium'),
  padding: '8px 16px',
  color: 'var(--_menu-supporting)',
} satisfies StyleObject;

export const menuGroupLabel = css`
  ${groupLabelStyles}
`;

const dividerStyles = {
  'blockSize': 1,
  'flexShrink': 0,
  'margin': '8px 12px',
  'backgroundColor': color('outlineVariant'),
  '@media (forced-colors: active)': { backgroundColor: 'CanvasText' },
} satisfies StyleObject;

export const menuDivider = css`
  ${dividerStyles}
`;

const arrowStyles = {
  display: 'block',
  inlineSize: 20,
  blockSize: 20,
  fill: 'currentColor',
  transform: 'var(--_menu-arrow-transform)',
} satisfies StyleObject;

export const menuArrow = css`
  ${arrowStyles}
`;
