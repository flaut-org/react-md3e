import { css } from '@linaria/core';
import { color, motion } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  '--_switch-track': color('surfaceContainerHighest'),
  '--_switch-outline': color('outline'),
  '--_switch-handle': color('outline'),
  '--_switch-icon': color('surfaceContainerHighest'),
  '--_switch-state': color('onSurface'),
  '--_switch-offset': '0px',
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'verticalAlign': 'middle',
  'flexShrink': 0,
  'inlineSize': 52,
  'blockSize': 48,
  'padding': 0,
  'margin': 0,
  'border': 0,
  'outline': 'none',
  'backgroundColor': 'transparent',
  'color': 'var(--_switch-state)',
  'cursor': 'pointer',
  'touchAction': 'pan-y',
  'userSelect': 'none',
  'WebkitTapHighlightColor': 'transparent',
  '&[data-checked]': {
    '--_switch-track': color('primary'),
    '--_switch-outline': 'transparent',
    '--_switch-handle': color('onPrimary'),
    '--_switch-icon': color('onPrimaryContainer'),
    '--_switch-state': color('primary'),
    '--_switch-offset': '20px',
  },
  '&:focus-visible:not([data-disabled]), &:active:not([data-disabled], [data-readonly])': {
    '--_switch-handle': color('onSurfaceVariant'),
    '&[data-checked]': { '--_switch-handle': color('primaryContainer') },
  },
  '&:focus-visible > [data-md3-switch-position]': { outline: `3px solid ${color('secondary')}`, outlineOffset: 2 },
  '&:focus-visible > [data-md3-switch-position]::before, &:active:not(:has([data-md3-ripple-ink])):not([data-disabled], [data-readonly]) > [data-md3-switch-position]::before, &[data-dragging]:not(:has([data-md3-ripple-ink])) > [data-md3-switch-position]::before':
    { opacity: 0.1 },
  '&:active:not([data-disabled], [data-readonly]) [data-md3-switch-handle], &[data-dragging] [data-md3-switch-handle]':
    { inlineSize: 28, blockSize: 28 },
  '@media (hover: hover) and (forced-colors: none)': {
    '&:hover:not([data-disabled], [data-readonly], :focus-visible, :active)': {
      '--_switch-handle': color('onSurfaceVariant'),
      '&[data-checked]': { '--_switch-handle': color('primaryContainer') },
      '& > [data-md3-switch-position]::before': { opacity: 0.08 },
    },
  },
  '&[data-dragging]': {
    '--_switch-handle': color('onSurfaceVariant'),
    '&[data-checked]': { '--_switch-handle': color('primaryContainer') },
    '& > [data-md3-switch-position]': { transition: 'none' },
  },
  '&[data-disabled], &[data-readonly]': { cursor: 'default' },
  '&[data-disabled]': {
    '--_switch-track': `color-mix(in srgb, ${color('surfaceContainerHighest')} 12%, transparent)`,
    '--_switch-outline': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
    '--_switch-handle': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_switch-icon': `color-mix(in srgb, ${color('surfaceContainerHighest')} 38%, transparent)`,
    '&[data-checked]': {
      '--_switch-track': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
      '--_switch-outline': 'transparent',
      '--_switch-handle': color('surface'),
      '--_switch-icon': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    },
  },
  '@media (forced-colors: active)': {
    '--_switch-track': 'Canvas',
    '--_switch-outline': 'ButtonText',
    '--_switch-handle': 'ButtonText',
    '--_switch-icon': 'Canvas',
    'forcedColorAdjust': 'none',
    '&:focus-visible > [data-md3-switch-position]': { outlineColor: 'Highlight' },
    '&[data-checked]': {
      '--_switch-track': 'Highlight',
      '--_switch-outline': 'Highlight',
      '--_switch-handle': 'HighlightText',
      '--_switch-icon': 'Highlight',
    },
    '&[data-disabled]': {
      '--_switch-track': 'Canvas',
      '--_switch-outline': 'GrayText',
      '--_switch-handle': 'GrayText',
      '--_switch-icon': 'Canvas',
      '&[data-checked]': {
        '--_switch-track': 'GrayText',
        '--_switch-outline': 'GrayText',
        '--_switch-handle': 'Canvas',
        '--_switch-icon': 'GrayText',
      },
    },
    '&:focus-visible:not([data-disabled]), &:active:not([data-disabled], [data-readonly]), &[data-dragging]': {
      '--_switch-handle': 'ButtonText',
      '&[data-checked]': { '--_switch-handle': 'HighlightText' },
    },
  },
} satisfies StyleObject;

export const switchRoot = css`
  ${rootStyles}
`;

const trackStyles = {
  'position': 'absolute',
  'insetInline': 0,
  'insetBlockStart': 8,
  'blockSize': 32,
  'boxSizing': 'border-box',
  'border': '2px solid var(--_switch-outline)',
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'backgroundColor': 'var(--_switch-track)',
  'pointerEvents': 'none',
  'transition': `background-color ${motion('effects')}, border-color ${motion('effects')}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const switchTrack = css`
  ${trackStyles}
`;

const handlePositionStyles = {
  'position': 'absolute',
  'insetInlineStart': 'calc(-4px + var(--_switch-drag-offset, var(--_switch-offset)))',
  'insetBlockStart': 4,
  'inlineSize': 40,
  'blockSize': 40,
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'borderRadius': '50%',
  'pointerEvents': 'none',
  'transition': `inset-inline-start ${motion('spatial')}`,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: 'currentColor',
    opacity: 0,
    transition: `opacity ${motion('effects')}`,
  },
  '@media (prefers-reduced-motion: reduce)': { '&, &::before': { transition: 'none' } },
  '@media (forced-colors: active)': { '&::before': { display: 'none' } },
} satisfies StyleObject;

export const switchHandlePosition = css`
  ${handlePositionStyles}
`;

const handleStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'inlineSize': 16,
  'blockSize': 16,
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'backgroundColor': 'var(--_switch-handle)',
  'color': 'var(--_switch-icon)',
  'transition': `inline-size ${motion('spatial')}, block-size ${motion('spatial')}, background-color ${motion('effects')}, color ${motion('effects')}`,
  "&[data-checked], &[data-has-icon='true']": { inlineSize: 24, blockSize: 24 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const switchHandle = css`
  ${handleStyles}
`;

const rippleStyles = { inset: 0, borderRadius: '50%' } satisfies StyleObject;

export const switchRipple = css`
  ${rippleStyles}
`;

const iconStyles = {
  'display': 'inline-flex',
  'inlineSize': 16,
  'blockSize': 16,
  'fontSize': 16,
  'lineHeight': 1,
  'fill': 'currentColor',
  '& > svg': { display: 'block', inlineSize: '100%', blockSize: '100%' },
} satisfies StyleObject;

export const switchIcon = css`
  ${iconStyles}
`;
