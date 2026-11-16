import { css } from '@linaria/core';
import { color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  'display': 'inline-flex',
  'flexDirection': 'column',
  'inlineSize': 280,
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  "&[data-full-width='true']": { inlineSize: '100%' },
  '& [data-md3-text-field]': { inlineSize: '100%' },
  "&[data-multiple='true'] [data-md3-field-container]": { flexWrap: 'wrap', paddingBlock: 8, gap: 8 },
  "&[data-multiple='true'] [data-md3-field-leading]": { display: 'contents' },
  "&[data-multiple='true'] [data-md3-field-input]": { flexBasis: 64, inlineSize: 64, paddingBlock: 8 },
  "&[data-multiple='true'] [data-md3-field-trailing]": { marginInlineStart: 'auto' },
} satisfies StyleObject;

export const autocompleteRoot = css`
  ${rootStyles}
`;

const positionerStyles = {
  zIndex: 1400,
  outline: 'none',
  inlineSize: 'var(--anchor-width)',
  maxInlineSize: 'var(--available-width)',
} satisfies StyleObject;

export const autocompletePositioner = css`
  ${positionerStyles}
`;

const popupStyles = {
  'boxSizing': 'border-box',
  'maxBlockSize': 'var(--available-height)',
  'borderRadius': 'var(--md-sys-shape-corner-extra-small, 4px)',
  'backgroundColor': color('surfaceContainer'),
  'color': color('onSurface'),
  'boxShadow': '0 2px 6px rgb(0 0 0 / 20%), 0 1px 2px rgb(0 0 0 / 12%)',
  'overflow': 'hidden',
  'transformOrigin': 'var(--transform-origin)',
  'transition': 'opacity 120ms ease, transform 120ms ease',
  '&[data-starting-style], &[data-ending-style]': { opacity: 0, transform: 'translateY(-4px)' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { border: '1px solid CanvasText', backgroundColor: 'Canvas', color: 'CanvasText' },
} satisfies StyleObject;

export const autocompletePopup = css`
  ${popupStyles}
`;

const listStyles = {
  'maxBlockSize': 'min(320px, var(--available-height))',
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  'padding': '8px 4px',
  'outline': 'none',
  '&[data-empty]': { padding: 0 },
} satisfies StyleObject;

export const autocompleteList = css`
  ${listStyles}
`;

const statusStyles = {
  ...typography('bodyMedium'),
  padding: '16px',
  color: color('onSurfaceVariant'),
} satisfies StyleObject;

export const autocompleteStatus = css`
  ${statusStyles}
`;

const actionStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'inlineSize': 48,
  'blockSize': 48,
  'marginInline': -8,
  'border': 0,
  'borderRadius': '50%',
  'padding': 12,
  'background': 'transparent',
  'color': 'inherit',
  'cursor': 'pointer',
  '& > svg': { inlineSize: 24, blockSize: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
  '&:disabled': { cursor: 'default', opacity: 0.38 },
  '@media (hover: hover)': {
    '&:hover:not(:disabled)': { backgroundColor: `color-mix(in srgb, ${color('onSurface')} 8%, transparent)` },
  },
} satisfies StyleObject;

export const autocompleteAction = css`
  ${actionStyles}
`;
