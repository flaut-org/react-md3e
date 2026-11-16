import { css } from '@linaria/core';
import { color, typography, springCurve } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const portal = { position: 'relative', zIndex: 1400, isolation: 'isolate' } satisfies StyleObject;
const backdrop = {
  'position': 'fixed',
  'inset': 0,
  'backgroundColor': `color-mix(in srgb, ${color('scrim')} 32%, transparent)`,
  'opacity': 1,
  'transition': 'opacity 200ms ease',
  '&[data-starting-style], &[data-ending-style]': { opacity: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;
const viewport = {
  'position': 'fixed',
  'inset': 0,
  'direction': 'ltr',
  'display': 'flex',
  'alignItems': 'stretch',
  'pointerEvents': 'none',
  'overflow': 'hidden',
  'paddingBlockEnd': 'var(--drawer-keyboard-inset, 0px)',
  'boxSizing': 'border-box',
  "&[data-edge='bottom']": { alignItems: 'flex-end', justifyContent: 'center' },
  "&[data-edge='left']": { justifyContent: 'flex-start' },
  "&[data-edge='right']": { justifyContent: 'flex-end' },
  '&[hidden]': { display: 'none' },
} satisfies StyleObject;
const popup = {
  ...typography('bodyLarge'),
  'display': 'flex',
  'flexDirection': 'column',
  'pointerEvents': 'auto',
  'position': 'relative',
  'boxSizing': 'border-box',
  'minInlineSize': 0,
  'outline': 'none',
  'color': color('onSurface'),
  'backgroundColor': color('surfaceContainerLow'),
  'overflow': 'hidden',
  'maxBlockSize': '100dvh',
  'transition': `transform calc(400ms * var(--drawer-swipe-strength, 1)) ${springCurve}`,
  '&[hidden]': { display: 'none' },
  '&[data-swiping]': { transition: 'none', userSelect: 'none' },
  "&[data-edge='bottom']": {
    'inlineSize': '100%',
    'maxBlockSize': 'calc(100dvh - 72px)',
    'borderStartStartRadius': 'var(--md-sys-shape-corner-extra-large, 28px)',
    'borderStartEndRadius': 'var(--md-sys-shape-corner-extra-large, 28px)',
    'transform': 'translateY(var(--drawer-swipe-movement-y, 0px))',
    'paddingBlockEnd': 'env(safe-area-inset-bottom, 0px)',
    '&[data-starting-style], &[data-ending-style]': { transform: 'translateY(100%)' },
  },
  "&[data-edge='left'], &[data-edge='right']": {
    inlineSize: 360,
    maxInlineSize: 'min(400px, calc(100vw - 16px))',
    blockSize: '100dvh',
    transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
  },
  "&[data-edge='left']": {
    'borderTopRightRadius': 'var(--md-sys-shape-corner-large, 16px)',
    'borderBottomRightRadius': 'var(--md-sys-shape-corner-large, 16px)',
    '&[data-starting-style], &[data-ending-style]': { transform: 'translateX(-100%)' },
  },
  "&[data-edge='right']": {
    'borderTopLeftRadius': 'var(--md-sys-shape-corner-large, 16px)',
    'borderBottomLeftRadius': 'var(--md-sys-shape-corner-large, 16px)',
    '&[data-starting-style], &[data-ending-style]': { transform: 'translateX(100%)' },
  },
  "&[data-variant='standard']": {
    'maxInlineSize': '100%',
    'blockSize': 'auto',
    'maxBlockSize': 'none',
    'transform': 'none',
    'borderRadius': 'var(--md-sys-shape-corner-large, 16px)',
    'flexShrink': 0,
    '&[data-starting-style], &[data-ending-style]': { transform: 'none' },
  },
  '@media (min-width: 641px)': {
    "&[data-edge='bottom'][data-variant='modal']": {
      inlineSize: 'calc(100% - 112px)',
      maxBlockSize: 'calc(100dvh - 56px)',
    },
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { backgroundColor: 'Canvas', color: 'CanvasText', border: '1px solid CanvasText' },
} satisfies StyleObject;
const handle = {
  'display': 'grid',
  'placeItems': 'center',
  'blockSize': 48,
  'flex': '0 0 auto',
  'touchAction': 'none',
  '& > span': {
    inlineSize: 32,
    blockSize: 4,
    borderRadius: 2,
    backgroundColor: color('onSurfaceVariant'),
    opacity: 0.4,
  },
} satisfies StyleObject;
const header = {
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'space-between',
  'gap': 12,
  'padding': '16px 24px 0',
  'flex': '0 0 auto',
  'minInlineSize': 0,
  '& > div': { minInlineSize: 0 },
} satisfies StyleObject;
const content = {
  padding: 24,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  minBlockSize: 0,
  flex: '1 1 auto',
} satisfies StyleObject;
const actions = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '16px 24px 24px',
  flex: '0 0 auto',
} satisfies StyleObject;
const close = { marginInlineEnd: -12, flexShrink: 0 } satisfies StyleObject;

export const sheetPortal = css`
  ${portal}
`;
export const sheetBackdrop = css`
  ${backdrop}
`;
export const sheetViewport = css`
  ${viewport}
`;
export const sheetPopup = css`
  ${popup}
`;
export const sheetHandle = css`
  ${handle}
`;
export const sheetHeader = css`
  ${header}
`;
export const sheetContent = css`
  ${content}
`;
export const sheetActions = css`
  ${actions}
`;
export const sheetClose = css`
  ${close}
`;

const inline = { display: 'contents' } satisfies StyleObject;

export const sheetInline = css`
  ${inline}
`;
