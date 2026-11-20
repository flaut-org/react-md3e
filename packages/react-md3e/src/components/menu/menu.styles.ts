import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import { shadowColors } from '../../styles/elevation';
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
  '&:has([data-md3-menu-submenu-trigger][data-popup-open]):not(:focus-within):not(:hover)': {
    '--_menu-radius': 'var(--md-sys-shape-corner-small, 8px)',
  },
} satisfies StyleObject;

export const menuPopup = css`
  ${popupStyles}
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
