import { css } from '@linaria/core';
import { color, springCurve } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  '--_height': '40px',
  '--_icon': '24px',
  '--_narrow-padding': '4px',
  '--_default-padding': '8px',
  '--_wide-padding': '14px',
  '--_padding': 'var(--_default-padding)',
  '--_width': 'calc(var(--_icon) + var(--_padding) * 2)',
  '--_square': 'var(--md-sys-shape-corner-medium, 12px)',
  '--_pressed': 'var(--md-sys-shape-corner-small, 8px)',
  '--_radius': 'min(var(--md-sys-shape-corner-full, 9999px), calc(min(var(--_height), var(--_width)) / 2))',
  '--_outline-width': '1px',
  '--_border': 'transparent',
  '--_bg': color('primary'),
  '--_fg': color('onPrimary'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'flexShrink': 0,
  'verticalAlign': 'middle',
  'inlineSize': 'max(48px, var(--_width))',
  'blockSize': 'max(48px, var(--_height))',
  'padding': 0,
  'border': 0,
  'background': 'transparent',
  'color': 'var(--_fg)',
  'appearance': 'none',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  "&[data-width='narrow']": { '--_padding': 'var(--_narrow-padding)' },
  "&[data-width='wide']": { '--_padding': 'var(--_wide-padding)' },
  "&[data-shape='square'], &[data-shape='round'][aria-pressed='true']": { '--_radius': 'var(--_square)' },
  "&[data-shape='square'][aria-pressed='true']": {
    '--_radius': 'min(var(--md-sys-shape-corner-full, 9999px), calc(min(var(--_height), var(--_width)) / 2))',
  },
  "&[data-variant='tonal']": { '--_bg': color('secondaryContainer'), '--_fg': color('onSecondaryContainer') },
  "&[data-variant='outlined']": {
    '--_bg': 'transparent',
    '--_fg': color('onSurfaceVariant'),
    '--_border': color('outlineVariant'),
  },
  "&[data-variant='standard']": {
    '--_bg': 'transparent',
    '--_fg': `var(--md-comp-icon-button-standard-color, ${color('onSurfaceVariant')})`,
  },
  "&[data-variant='filled'][aria-pressed='false']": {
    '--_bg': color('surfaceContainer'),
    '--_fg': color('onSurfaceVariant'),
  },
  "&[data-variant='tonal'][aria-pressed='true']": { '--_bg': color('secondary'), '--_fg': color('onSecondary') },
  "&[data-variant='outlined'][aria-pressed='true']": {
    '--_bg': color('inverseSurface'),
    '--_fg': color('inverseOnSurface'),
    '--_border': 'transparent',
  },
  "&[data-variant='standard'][aria-pressed='true']": { '--_fg': color('primary') },
  '&:active:not(:disabled)': { '--_radius': 'var(--_pressed)' },
  '&:focus-visible': { outline: 'none' },
  '&:focus-visible > span': { outline: `3px solid ${color('secondary')}`, outlineOffset: 3 },
  '&:focus-visible > span::before, &:active:not(:disabled) > span::before': { opacity: 0.1 },
  '@media (hover: hover)': {
    '&:hover:not(:disabled):not(:focus-visible) > span::before': { opacity: 0.08 },
    '&:hover:active:not(:disabled) > span::before': { opacity: 0.1 },
  },
  '&:disabled': {
    '--_bg': `color-mix(in srgb, ${color('onSurface')} 10%, transparent)`,
    '--_fg': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_border': 'transparent',
    'cursor': 'default',
  },
  "&:disabled[data-variant='standard'], &:disabled[data-variant='outlined']": { '--_bg': 'transparent' },
  "&:disabled[data-variant='outlined']": { '--_border': color('outlineVariant') },
  "&:disabled[data-variant='outlined'][aria-pressed='true']": {
    '--_bg': `color-mix(in srgb, ${color('onSurface')} 10%, transparent)`,
    '--_border': 'transparent',
  },
  "&[data-size='extraSmall']": {
    '--_height': '32px',
    '--_icon': '20px',
    '--_narrow-padding': '4px',
    '--_default-padding': '6px',
    '--_wide-padding': '10px',
  },
  "&[data-size='medium']": {
    '--_height': '56px',
    '--_narrow-padding': '12px',
    '--_default-padding': '16px',
    '--_wide-padding': '24px',
    '--_square': 'var(--md-sys-shape-corner-large, 16px)',
    '--_pressed': 'var(--md-sys-shape-corner-medium, 12px)',
  },
  "&[data-size='large']": {
    '--_height': '96px',
    '--_icon': '32px',
    '--_narrow-padding': '16px',
    '--_default-padding': '32px',
    '--_wide-padding': '48px',
    '--_outline-width': '2px',
    '--_square': 'var(--md-sys-shape-corner-extra-large, 28px)',
    '--_pressed': 'var(--md-sys-shape-corner-large, 16px)',
  },
  "&[data-size='extraLarge']": {
    '--_height': '136px',
    '--_icon': '40px',
    '--_narrow-padding': '32px',
    '--_default-padding': '48px',
    '--_wide-padding': '72px',
    '--_outline-width': '3px',
    '--_square': 'var(--md-sys-shape-corner-extra-large, 28px)',
    '--_pressed': 'var(--md-sys-shape-corner-large, 16px)',
  },
  '@media (forced-colors: active)': {
    '--_border': 'ButtonText',
    '&:disabled': { '--_fg': 'GrayText', '--_border': 'GrayText' },
    "&[aria-pressed='true']": { '--_bg': 'Highlight', '--_fg': 'HighlightText' },
    '&:focus-visible > span': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;

export const iconButtonRoot = css`
  ${rootStyles}
`;

const containerStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'inlineSize': 'var(--_width)',
  'blockSize': 'var(--_height)',
  'flexShrink': 0,
  'border': 'var(--_outline-width) solid var(--_border)',
  'borderRadius': 'var(--_radius)',
  'backgroundColor': 'var(--_bg)',
  'transition': `border-radius 400ms ${springCurve}`,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 'calc(-1 * var(--_outline-width))',
    borderRadius: 'inherit',
    background: 'currentColor',
    opacity: 0,
    transition: 'opacity 150ms ease',
    pointerEvents: 'none',
  },
  '@media (prefers-reduced-motion: reduce)': { '&, &::before': { transition: 'none' } },
} satisfies StyleObject;

export const iconButtonContainer = css`
  ${containerStyles}
`;

const iconStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'inlineSize': 'var(--_icon)',
  'blockSize': 'var(--_icon)',
  'fontSize': 'var(--_icon)',
  'lineHeight': 1,
  'fill': 'currentColor',
  'pointerEvents': 'none',
  '& > svg': { display: 'block', inlineSize: '100%', blockSize: '100%' },
} satisfies StyleObject;

export const iconButtonIcon = css`
  ${iconStyles}
`;
