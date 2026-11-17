import { css } from '@linaria/core';
import { color, typography, motion } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const portal = { position: 'relative', zIndex: 1600, isolation: 'isolate' } satisfies StyleObject;
const viewport = {
  'position': 'fixed',
  'insetInline': 16,
  'insetBlockEnd': 'calc(16px + env(safe-area-inset-bottom, 0px))',
  'display': 'flex',
  'justifyContent': 'center',
  'pointerEvents': 'none',
  'outline': 'none',
  "&[data-vertical='top']": { insetBlockEnd: 'auto', insetBlockStart: 'calc(16px + env(safe-area-inset-top, 0px))' },
  "&[data-horizontal='left']": { justifyContent: 'flex-start' },
  "&[data-horizontal='right']": { justifyContent: 'flex-end' },
} satisfies StyleObject;
const root = {
  ...typography('bodyMedium'),
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'center',
  'gap': 8,
  'boxSizing': 'border-box',
  'pointerEvents': 'auto',
  'minInlineSize': 'min(344px, calc(100vw - 32px))',
  'maxInlineSize': 'min(560px, calc(100vw - 32px))',
  'minBlockSize': 48,
  'padding': '0 8px 0 16px',
  'borderRadius': 'var(--md-sys-shape-corner-extra-small, 4px)',
  'color': color('inverseOnSurface'),
  'backgroundColor': color('inverseSurface'),
  'boxShadow': `0 1px 3px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 2px 6px 2px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
  'opacity': 1,
  'transform': 'translateY(0)',
  'transition': `transform ${motion('spatial')}, opacity ${motion('effects')}`,
  '&[data-starting-style], &[data-ending-style]': { opacity: 0, transform: 'translateY(8px)' },
  '&:focus-visible': { outline: `2px solid ${color('inversePrimary')}`, outlineOffset: 2 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': {
    backgroundColor: 'Canvas',
    color: 'CanvasText',
    border: '1px solid CanvasText',
    boxShadow: 'none',
  },
} satisfies StyleObject;
const message = {
  paddingBlock: 14,
  minInlineSize: 0,
  overflowWrap: 'anywhere',
  flex: '1 1 auto',
} satisfies StyleObject;
const actions = {
  'display': 'flex',
  'alignItems': 'center',
  'gap': 8,
  'flex': '0 0 auto',
  "& > [data-variant='text']": { color: color('inversePrimary') },
  '& > [data-md3-icon-button]': { color: 'inherit' },
  '@media (forced-colors: active)': {
    "& > [data-variant='text']": { color: 'LinkText' },
  },
} satisfies StyleObject;

export const snackbarPortal = css`
  ${portal}
`;
export const snackbarViewport = css`
  ${viewport}
`;
export const snackbarRoot = css`
  ${root}
`;
export const snackbarMessage = css`
  ${message}
`;
export const snackbarActions = css`
  ${actions}
`;
