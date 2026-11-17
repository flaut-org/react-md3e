import { css } from '@linaria/core';
import type { StyleObject } from '../../styles/style-object.types';

import { color, motion } from '../../styles/theme-tokens';

const buttonRootStyles = {
  '--_height': '40px',
  '--_padding': '16px',
  '--_icon': '20px',
  '--_gap': '8px',
  '--_outline-width': '1px',
  '--_square': 'var(--md-sys-shape-corner-medium, 12px)',
  '--_pressed': 'var(--md-sys-shape-corner-small, 8px)',
  '--_radius': 'min(var(--md-sys-shape-corner-full, 9999px), calc(var(--_height) / 2))',
  '--_font': 'var(--md-sys-typescale-label-large-font, Roboto, system-ui, sans-serif)',
  '--_font-size': 'var(--md-sys-typescale-label-large-size, 0.875rem)',
  '--_line': 'var(--md-sys-typescale-label-large-line-height, 1.25rem)',
  '--_weight': 'var(--md-sys-typescale-label-large-weight, 500)',
  '--_tracking': 'var(--md-sys-typescale-label-large-tracking, 0.00625rem)',
  '--_bg': color('primary'),
  '--_fg': color('onPrimary'),
  '--_border': 'transparent',
  '--_elevation': 'none',
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'verticalAlign': 'middle',
  'isolation': 'isolate',
  'minInlineSize': '48px',
  'blockSize': 'var(--_height)',
  'paddingBlock': 0,
  'paddingInline': 'var(--_padding)',
  'gap': 'var(--_gap)',
  'border': 'var(--_outline-width) solid var(--_border)',
  'borderRadius': 'var(--_radius)',
  'appearance': 'none',
  'backgroundColor': 'var(--_bg)',
  'color': 'var(--_fg)',
  'boxShadow': 'var(--_elevation)',
  'fontFamily': 'var(--_font)',
  'fontSize': 'var(--_font-size)',
  'lineHeight': 'var(--_line)',
  'fontWeight': 'var(--_weight)',
  'letterSpacing': 'var(--_tracking)',
  'textAlign': 'center',
  'textDecoration': 'none',
  'whiteSpace': 'nowrap',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  'transition': `border-radius ${motion('spatial')}, box-shadow ${motion('effects')}`,
  "&[data-full-width='true']": { inlineSize: '100%' },
  "&[data-loading='true'] > [data-md3-icon], &[data-loading='true'] > span:not([data-md3-button-loading]):not([aria-hidden])":
    { opacity: 0 },
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 'calc(-1 * var(--_outline-width))',
    borderRadius: 'inherit',
    background: 'currentColor',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${motion('effects')}`,
  },
  // Expand the hit area to 48px without changing the specified visual height.
  '&::after': {
    content: "''",
    position: 'absolute',
    insetInline: 0,
    insetBlock: 'min(0px, calc((100% - 48px) / 2))',
  },
  "&[data-shape='square']": {
    '--_radius': 'var(--_square)',
  },
  "&[aria-pressed='true'][data-shape='round']": {
    '--_radius': 'var(--_square)',
  },
  "&[aria-pressed='true'][data-shape='square']": {
    '--_radius': 'min(var(--md-sys-shape-corner-full, 9999px), calc(var(--_height) / 2))',
  },
  "&[data-variant='tonal']": {
    '--_bg': color('secondaryContainer'),
    '--_fg': color('onSecondaryContainer'),
  },
  "&[data-variant='outlined']": {
    '--_bg': 'transparent',
    '--_fg': color('onSurfaceVariant'),
    '--_border': color('outlineVariant'),
  },
  "&[data-variant='text']": {
    '--_bg': 'transparent',
    '--_fg': color('primary'),
  },
  "&[data-variant='elevated']": {
    '--_bg': color('surfaceContainerLow'),
    '--_fg': color('primary'),
    '--_elevation': `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 1px 3px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
  },
  "&[data-variant='filled'][aria-pressed='false']": {
    '--_bg': color('surfaceContainer'),
    '--_fg': color('onSurfaceVariant'),
  },
  "&[data-variant='tonal'][aria-pressed='true']": {
    '--_bg': color('secondary'),
    '--_fg': color('onSecondary'),
  },
  "&[data-variant='elevated'][aria-pressed='true']": {
    '--_bg': color('primary'),
    '--_fg': color('onPrimary'),
  },
  "&[data-variant='outlined'][aria-pressed='true']": {
    '--_bg': color('inverseSurface'),
    '--_fg': color('inverseOnSurface'),
    '--_border': 'transparent',
  },
  '&:focus-visible': {
    outline: `3px solid ${color('secondary')}`,
    outlineOffset: '3px',
  },
  '&:focus-visible::before': {
    opacity: 0.1,
  },
  "&:active:not(:disabled):not([aria-disabled='true'])": {
    borderRadius: 'var(--_pressed)',
  },
  "&:active:not(:disabled):not([aria-disabled='true'])::before": {
    opacity: 0.1,
  },
  "&:disabled, &[aria-disabled='true']": {
    '--_bg': `color-mix(in srgb, ${color('onSurface')} 10%, transparent)`,
    '--_fg': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_border': 'transparent',
    '--_elevation': 'none',
    'cursor': 'default',
  },
  "&:disabled[data-variant='text'], &:disabled[data-variant='outlined'], &[aria-disabled='true'][data-variant='text'], &[aria-disabled='true'][data-variant='outlined']":
    {
      '--_bg': 'transparent',
    },
  "&:disabled[data-variant='outlined'], &[aria-disabled='true'][data-variant='outlined']": {
    '--_border': `color-mix(in srgb, ${color('onSurface')} 10%, transparent)`,
  },
  '@media (hover: hover)': {
    "&[data-variant='elevated']:hover:not(:disabled):not([aria-disabled='true'])": {
      '--_elevation': `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 2px 6px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
    },
    "&:hover:not(:disabled):not([aria-disabled='true']):not(:focus-visible)::before": {
      opacity: 0.08,
    },
    "&:active:not(:disabled):not([aria-disabled='true'])::before": {
      opacity: 0.1,
    },
  },
  "&[data-size='extraSmall']": {
    '--_height': '32px',
  },
  "&[data-size='medium']": {
    '--_height': '56px',
    '--_padding': '24px',
    '--_icon': '24px',
    '--_square': 'var(--md-sys-shape-corner-large, 16px)',
    '--_pressed': 'var(--md-sys-shape-corner-medium, 12px)',
    '--_font': 'var(--md-sys-typescale-title-medium-font, Roboto, system-ui, sans-serif)',
    '--_font-size': 'var(--md-sys-typescale-title-medium-size, 1rem)',
    '--_line': 'var(--md-sys-typescale-title-medium-line-height, 1.5rem)',
    '--_weight': 'var(--md-sys-typescale-title-medium-weight, 500)',
    '--_tracking': 'var(--md-sys-typescale-title-medium-tracking, 0.0125rem)',
  },
  "&[data-size='large']": {
    '--_height': '96px',
    '--_padding': '48px',
    '--_icon': '32px',
    '--_gap': '12px',
    '--_outline-width': '2px',
    '--_square': 'var(--md-sys-shape-corner-extra-large, 28px)',
    '--_pressed': 'var(--md-sys-shape-corner-large, 16px)',
    '--_font': 'var(--md-sys-typescale-headline-small-font, Roboto, system-ui, sans-serif)',
    '--_font-size': 'var(--md-sys-typescale-headline-small-size, 1.5rem)',
    '--_line': 'var(--md-sys-typescale-headline-small-line-height, 2rem)',
    '--_weight': 'var(--md-sys-typescale-headline-small-weight, 400)',
    '--_tracking': 'var(--md-sys-typescale-headline-small-tracking, 0rem)',
  },
  "&[data-size='extraLarge']": {
    '--_height': '136px',
    '--_padding': '64px',
    '--_icon': '40px',
    '--_gap': '16px',
    '--_outline-width': '3px',
    '--_square': 'var(--md-sys-shape-corner-extra-large, 28px)',
    '--_pressed': 'var(--md-sys-shape-corner-large, 16px)',
    '--_font': 'var(--md-sys-typescale-headline-large-font, Roboto, system-ui, sans-serif)',
    '--_font-size': 'var(--md-sys-typescale-headline-large-size, 2rem)',
    '--_line': 'var(--md-sys-typescale-headline-large-line-height, 2.5rem)',
    '--_weight': 'var(--md-sys-typescale-headline-large-weight, 400)',
    '--_tracking': 'var(--md-sys-typescale-headline-large-tracking, 0rem)',
  },
  '@media (prefers-reduced-motion: reduce)': {
    '&, &::before': {
      transition: 'none',
    },
  },
  '@media (forced-colors: active)': {
    'borderColor': 'ButtonText',
    'backgroundColor': 'ButtonFace',
    'color': 'ButtonText',
    "&:disabled, &[aria-disabled='true']": {
      color: 'GrayText',
      borderColor: 'GrayText',
    },
    '&:focus-visible': {
      outlineColor: 'Highlight',
    },
    "&[aria-pressed='true']": {
      background: 'Highlight',
      color: 'HighlightText',
    },
  },
} satisfies StyleObject;

export const buttonRoot = css`
  ${buttonRootStyles}
`;

const buttonIconStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'flex': '0 0 auto',
  'inlineSize': 'var(--_icon)',
  'blockSize': 'var(--_icon)',
  'pointerEvents': 'none',
  '& > svg': {
    inlineSize: '100%',
    blockSize: '100%',
    fill: 'currentColor',
  },
} satisfies StyleObject;

export const buttonIcon = css`
  ${buttonIconStyles}
`;

const buttonLabelStyles = {
  position: 'relative',
  pointerEvents: 'none',
} satisfies StyleObject;

export const buttonLabel = css`
  ${buttonLabelStyles}
`;
