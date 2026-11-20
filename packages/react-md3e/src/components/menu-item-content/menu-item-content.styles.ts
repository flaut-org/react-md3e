import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

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
  '&[data-checked], &[data-selected="true"], &[aria-selected="true"]': {
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
  '&:focus-visible, &[data-focus-visible]': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
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
    '&:focus-visible, &[data-focus-visible]': { outlineColor: 'Highlight' },
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
