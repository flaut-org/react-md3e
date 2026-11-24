import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  'display': 'inline-grid',
  'gridAutoFlow': 'column',
  'gridAutoColumns': 'minmax(48px, 1fr)',
  'inlineSize': 'max-content',
  'maxInlineSize': '100%',
  'verticalAlign': 'middle',
  'isolation': 'isolate',
  "&[data-full-width='true']": { display: 'grid', inlineSize: '100%' },
  '& > [data-md3-button-segment]:first-of-type': {
    '--_start-border': '1px',
    'borderStartStartRadius': 'var(--md-sys-shape-corner-full, 9999px)',
    'borderEndStartRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  },
  '& > [data-md3-button-segment]:last-of-type': {
    borderStartEndRadius: 'var(--md-sys-shape-corner-full, 9999px)',
    borderEndEndRadius: 'var(--md-sys-shape-corner-full, 9999px)',
  },
  // The enabled neighbor keeps a contrasting shared divider beside a disabled segment.
  '& > [data-md3-button-segment]:disabled:has(+ [data-md3-button-segment]:not(:disabled))': {
    '--_end-border': color('outline'),
  },
  '@media (forced-colors: active)': {
    '& > [data-md3-button-segment]:disabled:has(+ [data-md3-button-segment]:not(:disabled))': {
      '--_end-border': 'ButtonText',
    },
  },
} satisfies StyleObject;

export const segmentedButtonRoot = css`
  ${rootStyles}
`;

const segmentStyles = {
  ...typography('labelLarge'),
  '--_outline-width': '1px',
  '--_border': color('outline'),
  '--_bg': 'transparent',
  '--_fg': color('onSurface'),
  '--_label-offset': '-13px',
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'minInlineSize': 48,
  'minBlockSize': 48,
  'padding': '4px 0',
  'border': 0,
  'borderRadius': 0,
  'background': 'transparent',
  'color': 'var(--_fg)',
  'appearance': 'none',
  'cursor': 'pointer',
  'userSelect': 'none',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  'transition': `color ${motion('effects')}`,
  '&:dir(rtl)': { '--_label-offset': '13px' },
  "&[aria-checked='true']": {
    '--_bg': color('secondaryContainer'),
    '--_fg': color('onSecondaryContainer'),
  },
  '&:focus-visible': { zIndex: 2, outline: 'none' },
  '&:focus-visible > [data-md3-segment-container]': {
    outline: `3px solid ${color('secondary')}`,
    outlineOffset: 3,
  },
  '&:focus-visible:not(:disabled) > [data-md3-segment-container]::before, &:active:not(:has([data-md3-ripple-ink])):not(:disabled):not([data-readonly="true"]) > [data-md3-segment-container]::before':
    {
      opacity: 0.1,
    },
  '@media (hover: hover)': {
    '&:hover:not(:disabled):not(:focus-visible) > [data-md3-segment-container]::before': { opacity: 0.08 },
    '&:hover:active:not(:has([data-md3-ripple-ink])):not(:disabled):not([data-readonly="true"]) > [data-md3-segment-container]::before':
      {
        opacity: 0.1,
      },
  },
  '&:disabled': {
    '--_fg': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_border': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
    'cursor': 'default',
  },
  "&[data-readonly='true']": { cursor: 'default' },
  "&[data-with-icon='false'][data-selection-indicator='true']:not([aria-checked='true']) [data-md3-segment-content]": {
    transform: 'translateX(var(--_label-offset))',
  },
  "&[aria-checked='true'] [data-md3-segment-check]": { opacity: 1, transform: 'scale(1)' },
  "&[aria-checked='true'][data-selection-indicator='true'][data-with-icon='true'] [data-md3-segment-icon]": {
    opacity: 0,
    transform: 'scale(0.5)',
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    '--_fg': 'ButtonText',
    '--_border': 'ButtonText',
    'forcedColorAdjust': 'none',
    "&[aria-checked='true']": { '--_bg': 'Highlight', '--_fg': 'HighlightText' },
    '&:disabled': { '--_fg': 'GrayText', '--_border': 'GrayText' },
    '&:focus-visible > [data-md3-segment-container]': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;

export const buttonSegmentRoot = css`
  ${segmentStyles}
`;

const containerStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'inlineSize': '100%',
  'minBlockSize': 40,
  'padding': '9px 12px',
  'border': '1px solid var(--_border)',
  'borderInlineStartWidth': 'var(--_start-border, 0px)',
  'borderInlineEndColor': 'var(--_end-border, var(--_border))',
  'borderRadius': 'inherit',
  'backgroundColor': 'var(--_bg)',
  'transition': `background-color ${motion('effects')}`,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: -1,
    borderRadius: 'inherit',
    backgroundColor: 'currentColor',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${motion('effects')}`,
  },
  '@media (prefers-reduced-motion: reduce)': { '&, &::before': { transition: 'none' } },
} satisfies StyleObject;

export const buttonSegmentContainer = css`
  ${containerStyles}
`;

const contentStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'gap': 8,
  'minInlineSize': 0,
  'maxInlineSize': '100%',
  'transform': 'translateX(0)',
  'pointerEvents': 'none',
  'transition': `transform ${motion('spatial')}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const buttonSegmentContent = css`
  ${contentStyles}
`;

const iconStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'flexShrink': 0,
  'inlineSize': 18,
  'blockSize': 18,
  'fontSize': 18,
  'lineHeight': 1,
  'fill': 'currentColor',
  '& > svg': { display: 'block', inlineSize: '100%', blockSize: '100%' },
} satisfies StyleObject;

export const buttonSegmentIcon = css`
  ${iconStyles}
`;

const slotStyles = { ...iconStyles, position: 'relative' } satisfies StyleObject;

export const buttonSegmentIconSlot = css`
  ${slotStyles}
`;

const selectedIconStyles = {
  ...iconStyles,
  'position': 'absolute',
  'inset': 0,
  'opacity': 0,
  'transform': 'scale(0.5)',
  'transition': `opacity ${motion('effects')}, transform ${motion('spatial')}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const buttonSegmentSelectedIcon = css`
  ${selectedIconStyles}
`;

const unselectedIconStyles = {
  ...iconStyles,
  'opacity': 1,
  'transform': 'scale(1)',
  'transition': `opacity ${motion('effects')}, transform ${motion('spatial')}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const buttonSegmentUnselectedIcon = css`
  ${unselectedIconStyles}
`;

const labelStyles = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } satisfies StyleObject;

export const buttonSegmentLabel = css`
  ${labelStyles}
`;
