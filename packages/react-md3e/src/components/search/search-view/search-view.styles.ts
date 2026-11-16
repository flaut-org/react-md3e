import { css } from '@linaria/core';
import { color, typography, springCurve } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const fullScreen = {
  'left': 0,
  'top': 0,
  'inlineSize': '100dvw',
  'blockSize': '100dvh',
  'maxBlockSize': '100dvh',
  'padding': 0,
  'borderRadius': 0,
  'backgroundColor': color('surfaceContainerLow'),
  'transition': `left 400ms ${springCurve}, top 400ms ${springCurve}, inline-size 400ms ${springCurve}, block-size 400ms ${springCurve}, border-radius 400ms ${springCurve}, opacity 150ms ease`,
  '&[data-starting-style], &[data-ending-style]': {
    left: 'var(--_search-anchor-left, 24px)',
    top: 'var(--_search-anchor-top, 24px)',
    inlineSize: 'var(--_search-anchor-width, 360px)',
    blockSize: 'var(--_search-anchor-height, 56px)',
    borderRadius: 'calc(var(--_search-anchor-height, 56px) / 2)',
    opacity: 1,
  },
  '& > [data-md3-search-header]': { padding: '8px 12px', minBlockSize: 72 },
  '&[data-starting-style] > [data-md3-search-header], &[data-ending-style] > [data-md3-search-header]': {
    padding: 0,
    minBlockSize: 56,
    transform: 'none',
  },
  '& > [data-md3-search-results]': { flex: '1 1 auto', minBlockSize: 0, maxBlockSize: 'none', margin: '0 12px 12px' },
} satisfies StyleObject;
const popupStyles = {
  ...typography('bodyLarge'),
  '--_search-view-width': 'min(720px, calc(100dvw - 24px), calc(var(--_search-anchor-width, 360px) + 24px))',
  '--_search-view-top': 'clamp(12px, var(--_search-anchor-top, 24px), max(12px, calc(100dvh - 240px - 12px)))',
  'position': 'fixed',
  'display': 'flex',
  'flexDirection': 'column',
  'gap': 2,
  'left':
    'clamp(12px, calc(var(--_search-anchor-left, 24px) - (var(--_search-view-width) - var(--_search-anchor-width, 360px)) / 2), calc(100dvw - var(--_search-view-width) - 12px))',
  'top': 'var(--_search-view-top)',
  'inlineSize': 'var(--_search-view-width)',
  'maxBlockSize': 'calc(100dvh - var(--_search-view-top) - 12px)',
  'boxSizing': 'border-box',
  'margin': 0,
  'padding': 0,
  'border': 0,
  'outline': 'none',
  'backgroundColor': 'transparent',
  'color': color('onSurface'),
  'overflow': 'hidden',
  'opacity': 1,
  'transition': 'opacity 400ms ease',
  '&[hidden]': { display: 'none' },
  '&[data-starting-style], &[data-ending-style]': { opacity: 0 },
  '&[data-starting-style] > [data-md3-search-results], &[data-ending-style] > [data-md3-search-results]': {
    transform: 'translateY(-4px) scaleY(0.8)',
    opacity: 0,
  },
  '&[data-starting-style] > [data-md3-search-header], &[data-ending-style] > [data-md3-search-header]': {
    transform: 'scaleX(0.94)',
  },
  "&[data-layout='fullScreen']": fullScreen,
  '@media (max-width: 599px)': { "&[data-layout='auto']": fullScreen },
  '@media (prefers-reduced-motion: reduce)': { '&[data-layout]': { transition: 'none' } },
  '@media (forced-colors: active)': { '&[data-layout]': { backgroundColor: 'Canvas', color: 'CanvasText' } },
} satisfies StyleObject;

export const searchPopup = css`
  ${popupStyles}
`;

const headerStyles = {
  'flex': '0 0 auto',
  'minInlineSize': 0,
  'minBlockSize': 56,
  'boxSizing': 'border-box',
  'transformOrigin': 'center',
  'transition': `transform 400ms ${springCurve}, padding 400ms ${springCurve}, min-block-size 400ms ${springCurve}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const searchHeader = css`
  ${headerStyles}
`;

const resultStyles = {
  'display': 'flex',
  'flexDirection': 'column',
  'minBlockSize': 'min(182px, calc(100dvh - 84px))',
  'maxBlockSize': 'min(calc(100dvh * 0.6667 - 58px), calc(100dvh - 84px))',
  'minInlineSize': 0,
  'position': 'relative',
  'boxSizing': 'border-box',
  'padding': 4,
  'overflow': 'hidden',
  'borderRadius': 'var(--md-sys-shape-corner-extra-large, 28px)',
  'backgroundColor': color('surfaceContainerHigh'),
  'color': color('onSurface'),
  'transformOrigin': 'top',
  'transform': 'translateY(0) scaleY(1)',
  'opacity': 1,
  'transition': `transform 400ms ${springCurve}, opacity 150ms ease`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { border: '1px solid CanvasText', backgroundColor: 'Canvas', color: 'CanvasText' },
} satisfies StyleObject;

export const searchResults = css`
  ${resultStyles}
`;

const scrollStyles = {
  'flex': '1 1 auto',
  'minBlockSize': 0,
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  'outline': 'none',
  'overflowWrap': 'anywhere',
  '&:focus-visible': { outline: `2px solid ${color('secondary')}`, outlineOffset: -2 },
} satisfies StyleObject;

export const searchScroll = css`
  ${scrollStyles}
`;

const statusStyles = {
  position: 'absolute',
  inlineSize: 1,
  blockSize: 1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
} satisfies StyleObject;

export const searchStatus = css`
  ${statusStyles}
`;

const loadingStyles = {
  'blockSize': 4,
  'flex': '0 0 auto',
  'borderRadius': 2,
  'backgroundColor': color('primary'),
  'transformOrigin': 'left',
  'animation': 'search-loading 1.2s ease-in-out infinite',
  '@keyframes search-loading': {
    '0%': { transform: 'scaleX(0.2)' },
    '50%': { transform: 'scaleX(0.8)' },
    '100%': { transform: 'scaleX(0.2)' },
  },
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
} satisfies StyleObject;

export const searchLoading = css`
  ${loadingStyles}
`;

const backStyles = {
  '& svg': { transform: 'rotate(0deg)' },
  "&[dir='rtl'] svg": { transform: 'rotate(180deg)' },
} satisfies StyleObject;

export const searchBack = css`
  ${backStyles}
`;

const emptyStyles = { padding: 16 } satisfies StyleObject;

export const searchEmpty = css`
  ${emptyStyles}
`;
