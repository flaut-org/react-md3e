import { css } from '@linaria/core';
import { motion, color, typography } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const barStyles = {
  ...typography('bodyLarge'),
  'display': 'flex',
  'alignItems': 'center',
  'gap': 4,
  'boxSizing': 'border-box',
  'inlineSize': 360,
  'maxInlineSize': 'min(100%, 720px)',
  'minInlineSize': 0,
  'blockSize': 56,
  'padding': 4,
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'border': '1px solid transparent',
  'backgroundColor': `var(--_search-bar-container-color, ${color('surfaceContainerHigh')})`,
  'color': color('onSurface'),
  'cursor': 'text',
  'transition': `box-shadow ${motion('effects')}, background-color ${motion('effects')}`,
  '@media (hover: hover)': {
    "&:hover:not([data-disabled='true']):not(:focus-within)": {
      backgroundColor: `color-mix(in srgb, ${color('onSurface')} 8%, var(--_search-bar-container-color, ${color('surfaceContainerHigh')}))`,
    },
  },
  '&:focus-within': { boxShadow: `inset 0 0 0 2px ${color('secondary')}` },
  "&[data-retain-focus='true']": {
    boxShadow: `inset 0 0 0 2px ${color('secondary')}`,
    transition: `background-color ${motion('effects')}`,
  },
  "&[data-full-width='true']": { inlineSize: '100%' },
  "&[data-disabled='true']": { opacity: 0.38, cursor: 'default' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    'borderColor': 'CanvasText',
    'backgroundColor': 'Canvas',
    'color': 'CanvasText',
    '&:focus-within': { outline: '2px solid Highlight', outlineOffset: -2 },
    "&[data-retain-focus='true']": { outline: '2px solid Highlight', outlineOffset: -2 },
  },
} satisfies StyleObject;

export const searchBar = css`
  ${barStyles}
`;

const inputStyles = {
  ...typography('bodyLarge'),
  'flex': '1 1 auto',
  'minInlineSize': 0,
  'inlineSize': '100%',
  'blockSize': '100%',
  'boxSizing': 'border-box',
  'padding': '0 4px',
  'border': 0,
  'outline': 'none',
  'color': 'inherit',
  'backgroundColor': 'transparent',
  '&:first-child': { paddingInlineStart: 12 },
  '&:last-child': { paddingInlineEnd: 12 },
  '&::placeholder': { color: color('onSurfaceVariant'), opacity: 1 },
} satisfies StyleObject;

export const searchInput = css`
  ${inputStyles}
`;

const leadingStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'flex': '0 0 auto',
  'minInlineSize': 48,
  'blockSize': 48,
  'color': `var(--_search-bar-leading-color, ${color('onSurface')})`,
  '& > svg': { inlineSize: 24, blockSize: 24, fill: 'currentColor' },
} satisfies StyleObject;

export const searchLeading = css`
  ${leadingStyles}
`;

const trailingStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  flex: '0 0 auto',
  color: color('onSurfaceVariant'),
} satisfies StyleObject;

export const searchTrailing = css`
  ${trailingStyles}
`;
