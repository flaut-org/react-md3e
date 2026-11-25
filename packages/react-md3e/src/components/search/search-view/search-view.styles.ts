import { css } from '@linaria/core';
import { color, typography, motion } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

// A shared bounded position keeps native input text inside its clip and makes the popup own its lifetime.
const headerPosition = 'clamp(0, var(--md3e-search-header-progress), 1)';
// Input text cannot overshoot its native clipping boundary; use the shared monotonic 200ms spring.
const headerMotion = `--md3e-search-header-progress ${motion('effects', 'default')}`;
const sourceTextOffset =
  'calc(var(--_search-anchor-text-start) - var(--_search-view-input-base, 9px) - var(--_search-anchor-leading-width) - var(--_search-anchor-leading-gap))';

const fullScreen = {
  'left': 0,
  'top': 0,
  'inlineSize': '100dvw',
  'blockSize': '100dvh',
  'maxBlockSize': '100dvh',
  'padding': 0,
  'borderRadius': 0,
  'backgroundColor': color('surfaceContainerLow'),
  'transition': `left ${motion('spatial', 'slow')}, top ${motion('spatial', 'slow')}, inline-size ${motion('spatial', 'slow')}, block-size ${motion('spatial', 'slow')}, border-radius ${motion('spatial', 'slow')}, ${headerMotion}`,
  '&[data-starting-style][data-layout], &[data-ending-style][data-layout]': {
    left: 'var(--_search-anchor-left, 24px)',
    top: 'var(--_search-anchor-top, 24px)',
    inlineSize: 'var(--_search-anchor-width, 360px)',
    blockSize: 'var(--_search-anchor-height, 56px)',
    borderRadius: 'calc(var(--_search-anchor-height, 56px) / 2)',
    opacity: 1,
  },
  '& > [data-md3-search-header]': { padding: '8px 12px', minBlockSize: 72 },
  '&[data-starting-style][data-layout] > [data-md3-search-header], &[data-ending-style][data-layout] > [data-md3-search-header]':
    {
      padding: 0,
      minBlockSize: 56,
      transform: 'none',
    },
  '& > [data-md3-search-results]': { flex: '1 1 auto', minBlockSize: 0, maxBlockSize: 'none', margin: '0 12px 12px' },
} satisfies StyleObject;
const popupStyles = {
  ...typography('bodyLarge'),
  '@property --md3e-search-header-progress': { syntax: '"<number>"', inherits: 'true', initialValue: 0 },
  '--md3e-search-header-progress': '1',
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
  'transition': `left ${motion('spatial', 'default')}, top ${motion('spatial', 'default')}, inline-size ${motion('spatial', 'default')}, ${headerMotion}`,
  '&[hidden]': { display: 'none' },
  '&[data-starting-style][data-layout], &[data-ending-style][data-layout]': {
    '--md3e-search-header-progress': '0',
    'left': 'var(--_search-anchor-left, 24px)',
    'top': 'var(--_search-anchor-top, 24px)',
    'inlineSize': 'var(--_search-anchor-width, 360px)',
  },
  '&[data-starting-style][data-layout] > [data-md3-search-results], &[data-ending-style][data-layout] > [data-md3-search-results]':
    {
      transform: 'translateY(-4px) scaleY(0.8)',
      opacity: 0,
    },
  '&[data-starting-style][data-layout] > [data-md3-search-header] > [data-md3-search-bar], &[data-ending-style][data-layout] > [data-md3-search-header] > [data-md3-search-bar]':
    {
      backgroundColor: 'var(--_search-anchor-background)',
    },
  '&[data-starting-style][data-layout] [data-md3-search-bar]': { boxShadow: 'var(--_search-anchor-focus-shadow)' },
  '&[data-ending-style][data-layout] [data-md3-search-bar]': { boxShadow: 'inset 0 0 0 2px transparent' },
  "&[data-ending-style][data-layout][data-keyboard-return='true'] [data-md3-search-bar]": {
    boxShadow: `inset 0 0 0 2px ${color('secondary')}`,
  },
  '&[data-starting-style][data-layout] [data-md3-search-back], &[data-ending-style][data-layout] [data-md3-search-back]':
    {
      opacity: 0,
      transform: 'rotate(-90deg)',
    },
  '&[data-starting-style][data-layout] [data-md3-search-view-trailing], &[data-ending-style][data-layout] [data-md3-search-view-trailing]':
    {
      opacity: 0,
    },
  '&[data-starting-style][data-layout] [data-md3-search-source-leading], &[data-ending-style][data-layout] [data-md3-search-source-leading], &[data-starting-style][data-layout] [data-md3-search-source-trailing], &[data-ending-style][data-layout] [data-md3-search-source-trailing]':
    {
      opacity: 1,
      transform: 'none',
    },
  "&[data-layout='fullScreen']": fullScreen,
  '@media (max-width: 599px)': { "&[data-layout='auto']": fullScreen },
  '@media (prefers-reduced-motion: reduce)': { '&[data-layout]': { transition: 'none' } },
  '@media (forced-colors: active)': {
    '&[data-layout]': { backgroundColor: 'Canvas', color: 'CanvasText' },
    "&[data-ending-style][data-layout][data-keyboard-return='true'] [data-md3-search-bar]": {
      outline: '2px solid Highlight',
      outlineOffset: -2,
    },
  },
} satisfies StyleObject;

export const searchPopup = css`
  ${popupStyles}
`;

const headerStyles = {
  'flex': '0 0 auto',
  'position': 'relative',
  'minInlineSize': 0,
  'minBlockSize': 56,
  'boxSizing': 'border-box',
  'transformOrigin': 'center',
  'transition': `transform ${motion('spatial', 'default')}, padding ${motion('spatial', 'default')}, min-block-size ${motion('spatial', 'default')}`,
  '& > [data-md3-search-bar]': {
    'maxInlineSize': 'none',
    'gap': 0,
    '& > [data-md3-search-leading]': {
      minInlineSize: 0,
      inlineSize: `calc(var(--_search-anchor-leading-width) * (1 - ${headerPosition}) + 48px * ${headerPosition})`,
      marginInlineEnd: `calc(var(--_search-anchor-leading-gap) * (1 - ${headerPosition}) + 4px * ${headerPosition})`,
    },
    '& > [data-md3-search-clear]': { marginInlineStart: 4 },
    '& > [data-md3-search-trailing]': {
      inlineSize: `calc(var(--_search-anchor-trailing-width) * (1 - ${headerPosition}) + var(--_search-view-trailing-width, 0px) * ${headerPosition})`,
      marginInlineStart: `calc(var(--_search-anchor-trailing-gap) * (1 - ${headerPosition}) + var(--_search-view-trailing-gap, 0px) * ${headerPosition})`,
      overflow: 'hidden',
    },
    '& > [data-md3-search-input]': {
      textAlign: 'start',
      textIndent: `calc(${sourceTextOffset} * (1 - ${headerPosition}))`,
    },
  },
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
  'transition': `transform ${motion('spatial', 'default')}, opacity ${motion('effects')}`,
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
  'opacity': 1,
  'transform': 'rotate(0deg)',
  'transition': `opacity ${motion('effects')}, transform ${motion('effects', 'default')}`,
  '& svg': { transform: 'rotate(0deg)' },
  "&[dir='rtl'] svg": { transform: 'rotate(180deg)' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const searchBack = css`
  ${backStyles}
`;

const viewTrailingStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'flex': '0 0 auto',
  'inlineSize': 'max-content',
  'opacity': 1,
  'transition': `opacity ${motion('effects')}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const searchViewTrailing = css`
  ${viewTrailingStyles}
`;

const emptyStyles = { padding: 16 } satisfies StyleObject;

export const searchEmpty = css`
  ${emptyStyles}
`;
