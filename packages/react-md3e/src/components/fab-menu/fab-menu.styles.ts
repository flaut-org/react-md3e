import { css } from '@linaria/core';
import { color, motion, motionDuration, motionEasing, typography } from '../../styles/theme-tokens';
import { elevationShadow, shadowColors } from '../../styles/elevation';
import type { StyleObject } from '../../styles/style-object.types';
import { fabMenuStaggerStyles } from './fab-menu-motion';

const rootStyles = {
  '--_fab-menu-size': '56px',
  'position': 'relative',
  'display': 'inline-flex',
  'justifyContent': 'flex-end',
  'alignItems': 'flex-start',
  'inlineSize': 'var(--_fab-menu-size)',
  'blockSize': 'var(--_fab-menu-size)',
  'verticalAlign': 'middle',
  '&[data-fab-size="medium"]': { '--_fab-menu-size': '80px' },
  '&[data-fab-size="large"]': { '--_fab-menu-size': '96px' },
  '&[data-open="true"]': { zIndex: 1401 },
} satisfies StyleObject;

export const fabMenuRoot = css`
  ${rootStyles}
`;

const toggleStyles = {
  '&[data-md3-fab-menu-toggle]': {
    '--_fab-menu-close-bg': color('primary'),
    '--_fab-menu-close-fg': color('onPrimary'),
    '&[data-fab-menu-color="secondary"]': {
      '--_fab-menu-close-bg': color('secondary'),
      '--_fab-menu-close-fg': color('onSecondary'),
    },
    '&[data-fab-menu-color="tertiary"]': {
      '--_fab-menu-close-bg': color('tertiary'),
      '--_fab-menu-close-fg': color('onTertiary'),
    },
    '& [data-md3-fab-icon]': { transition: `inline-size ${motion('spatial')}, block-size ${motion('spatial')}` },
    '&[data-popup-open]': {
      '--_height': '56px',
      '--_icon': '20px',
      '--_radius': 'min(var(--md-sys-shape-corner-full, 9999px), calc(var(--_height) / 2))',
      '--_bg': 'var(--_fab-menu-close-bg)',
      '--_fg': 'var(--_fab-menu-close-fg)',
      '--_elevation': elevationShadow(3),
      'backgroundImage': 'none',
      '& [data-fab-menu-icon="action"]': { opacity: 0, transform: 'rotate(90deg) scale(0.5)' },
      '& [data-fab-menu-icon="close"]': { opacity: 1, transform: 'rotate(0deg) scale(1)' },
    },
    '@media (hover: hover)': {
      '&[data-popup-open][data-lowered]:hover:not(:disabled)': { '--_elevation': elevationShadow(4) },
    },
    '@media (prefers-reduced-motion: reduce)': { '& [data-md3-fab-icon]': { transition: 'none' } },
  },
} satisfies StyleObject;

export const fabMenuToggle = css`
  ${toggleStyles}
`;

const iconStyles = {
  'position': 'relative',
  'display': 'block',
  'inlineSize': '100%',
  'blockSize': '100%',
  '& [data-fab-menu-icon]': {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    inlineSize: '100%',
    blockSize: '100%',
    fill: 'currentColor',
    transition: `transform ${motion('spatial')}, opacity ${motion('effects')}`,
  },
  '& [data-fab-menu-icon] > svg': { inlineSize: '100%', blockSize: '100%', fill: 'currentColor' },
  '& [data-fab-menu-icon="close"]': { opacity: 0, transform: 'rotate(-90deg) scale(0.5)' },
  '@media (prefers-reduced-motion: reduce)': { '& [data-fab-menu-icon]': { transition: 'none' } },
} satisfies StyleObject;

export const fabMenuIcons = css`
  ${iconStyles}
`;

const popupStyles = {
  '&[data-md3-fab-menu-popup]': {
    ...shadowColors,
    ...fabMenuStaggerStyles(),
    '--md3e-menu-scale': '1',
    '--_menu-item-start-radius': 'var(--md-sys-shape-corner-full, 9999px)',
    '--_menu-item-end-radius': 'var(--md-sys-shape-corner-full, 9999px)',
    '--_fab-menu-item-bg': color('primaryContainer'),
    '--_menu-label': color('onPrimaryContainer'),
    '--_menu-icon': color('onPrimaryContainer'),
    '--_menu-state': color('onPrimaryContainer'),
    'alignItems': 'flex-end',
    'gap': 4,
    'minInlineSize': 0,
    'inlineSize': 'max-content',
    'maxInlineSize': 'var(--available-width)',
    'maxBlockSize': 'var(--available-height)',
    'padding': 0,
    'border': 0,
    'borderRadius': 0,
    'backgroundColor': 'transparent',
    'boxShadow': 'none',
    'filter': 'drop-shadow(0 1px 3px var(--_shadow-key)) drop-shadow(0 4px 8px var(--_shadow-ambient))',
    'transform': 'none',
    'opacity': 1,
    'visibility': 'visible',
    'interpolateSize': 'allow-keywords',
    'scrollbarWidth': 'none',
    'scrollPaddingBlock': 0,
    // Base UI observes the Popup's own transitions. Visibility retains it for all item exits.
    'transition': `visibility calc(max(${motionDuration('spatial')}, ${motionDuration('effects')}) + var(--_fab-menu-stagger-end, 0ms)) linear`,
    '&[data-fab-menu-color="secondary"]': {
      '--_fab-menu-item-bg': color('secondaryContainer'),
      '--_menu-label': color('onSecondaryContainer'),
      '--_menu-icon': color('onSecondaryContainer'),
      '--_menu-state': color('onSecondaryContainer'),
    },
    '&[data-fab-menu-color="tertiary"]': {
      '--_fab-menu-item-bg': color('tertiaryContainer'),
      '--_menu-label': color('onTertiaryContainer'),
      '--_menu-icon': color('onTertiaryContainer'),
      '--_menu-state': color('onTertiaryContainer'),
    },
    '&[data-starting-style], &[data-ending-style]': {
      '--md3e-menu-scale': '1',
      'opacity': 1,
      '& [data-md3-fab-menu-item]': { inlineSize: 0, opacity: 0 },
    },
    '&[data-ending-style]': { visibility: 'hidden', pointerEvents: 'none' },
    '&[data-ending-style] [data-md3-fab-menu-item]': {
      transitionDelay: 'var(--_fab-menu-close-delay), var(--_fab-menu-close-delay)',
    },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    '@media (forced-colors: active)': {
      '--_fab-menu-item-bg': 'Canvas',
      '--_menu-label': 'CanvasText',
      '--_menu-icon': 'CanvasText',
      'backgroundColor': 'transparent',
      'filter': 'none',
      '&[data-fab-menu-color]': {
        '--_fab-menu-item-bg': 'Canvas',
        '--_menu-label': 'CanvasText',
        '--_menu-icon': 'CanvasText',
      },
    },
  },
} satisfies StyleObject;

export const fabMenuPopup = css`
  ${popupStyles}
`;

const itemStyles = {
  '&[data-md3-fab-menu-item]': {
    'inlineSize': 'max-content',
    'maxInlineSize': '100%',
    'minBlockSize': 56,
    'padding': 0,
    'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
    'backgroundColor': 'var(--_fab-menu-item-bg)',
    'boxShadow': 'none',
    'overflow': 'clip',
    'opacity': 1,
    'interpolateSize': 'allow-keywords',
    'transitionProperty': 'inline-size, opacity',
    'transitionDuration': `${motionDuration('spatial')}, ${motionDuration('effects')}`,
    'transitionTimingFunction': `${motionEasing('spatial')}, ${motionEasing('effects')}`,
    'transitionDelay': 'var(--_fab-menu-open-delay, 0ms), var(--_fab-menu-open-delay, 0ms)',
    '& [data-md3-menu-item-body]': {
      inlineSize: 'max-content',
      maxInlineSize: 'var(--available-width)',
      minBlockSize: 56,
      minInlineSize: 56,
      boxSizing: 'border-box',
      flexShrink: 0,
      padding: '16px 24px',
      gap: 8,
      transform: 'none',
    },
    '& [data-leading-kind="icon"]': { inlineSize: 24, blockSize: 24, fontSize: 24 },
    '& [data-md3-list-primary]': { ...typography('titleMedium'), whiteSpace: 'normal' },
    '&[data-disabled]': {
      backgroundColor: `color-mix(in srgb, ${color('onSurface')} 10%, transparent)`,
      boxShadow: 'none',
    },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    '@media (forced-colors: active)': {
      'outline': '1px solid CanvasText',
      'outlineOffset': -1,
      '&[data-highlighted]:not([data-disabled])': { backgroundColor: 'Highlight' },
      '&:focus-visible, &[data-focus-visible]': { outline: '3px solid Highlight', outlineOffset: -3 },
      '&[data-disabled]': { backgroundColor: 'Canvas', outlineColor: 'GrayText' },
    },
  },
} satisfies StyleObject;

export const fabMenuItem = css`
  ${itemStyles}
`;
