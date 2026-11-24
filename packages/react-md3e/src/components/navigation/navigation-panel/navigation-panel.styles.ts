import { css } from '@linaria/core';
import { color, motion, motionDuration, motionEasing } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const portal = { position: 'relative', isolation: 'isolate', zIndex: 1200 } satisfies StyleObject;
const backdrop = {
  'position': 'fixed',
  'inset': 0,
  'opacity': 1,
  'backgroundColor': `color-mix(in srgb, ${color('scrim')} 32%, transparent)`,
  'transition': `opacity ${motion('effects', 'default')}`,
  '&[data-starting-style], &[data-ending-style]': { opacity: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;
const viewport = {
  'position': 'fixed',
  'inset': 0,
  'display': 'flex',
  'alignItems': 'stretch',
  'direction': 'ltr',
  'overflow': 'hidden',
  'pointerEvents': 'none',
  '&[data-edge="left"]': { justifyContent: 'flex-start' },
  '&[data-edge="right"]': { justifyContent: 'flex-end' },
  '&[hidden]': { display: 'none' },
} satisfies StyleObject;
const popup = {
  'position': 'relative',
  'pointerEvents': 'auto',
  'boxSizing': 'border-box',
  'outline': 'none',
  'inlineSize': 'var(--md-navigation-drawer-width, 360px)',
  'maxInlineSize': 'max(0px, calc(100vw - 56px))',
  'blockSize': '100dvh',
  'overflow': 'hidden',
  'backgroundColor': color('surfaceContainerLow'),
  'color': color('onSurface'),
  'transform': 'translateX(var(--drawer-swipe-movement-x, 0px))',
  'transition': `transform calc(${motionDuration('spatial', 'default')} * var(--drawer-swipe-strength, 1)) ${motionEasing('spatial', 'default')}`,
  'boxShadow': `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 1px 3px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
  '& > [data-md3-navigation-content]': { blockSize: '100%' },
  '& > [data-md3-navigation-content] > [data-md3-navigation]': {
    inlineSize: '100%',
    maxInlineSize: '100%',
    blockSize: '100%',
    paddingBlockEnd: 'max(8px, env(safe-area-inset-bottom, 0px))',
  },
  '&[data-md3-navigation-popup="rail"]': {
    // Focusing the expanded item must not scroll the popup while its reveal width is still small.
    'overflow': 'clip',
    'inlineSize': 'var(--md-navigation-rail-expanded-width, max-content)',
    'minInlineSize': 'min(220px, max(0px, calc(100vw - 56px)))',
    'maxInlineSize': 'min(360px, max(0px, calc(100vw - 56px)))',
    'interpolateSize': 'allow-keywords',
    'backgroundColor': color('surfaceContainer'),
    'boxShadow': `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 2px 6px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
    'transition': `inline-size ${motion('spatial', 'default')}, min-inline-size ${motion('spatial', 'default')}, transform ${motion('spatial', 'default')}`,
    '& > [data-md3-navigation-content] > [data-md3-navigation]': {
      minInlineSize: 'min(220px, max(0px, calc(100vw - 56px)))',
    },
    '&:is([data-starting-style], [data-ending-style])[data-edge]': {
      inlineSize: 0,
      minInlineSize: 0,
      transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
    },
  },
  '&[data-edge="left"]': {
    'borderTopRightRadius': 'var(--md-sys-shape-corner-large, 16px)',
    'borderBottomRightRadius': 'var(--md-sys-shape-corner-large, 16px)',
    '&[data-starting-style], &[data-ending-style]': { transform: 'translateX(-100%)' },
  },
  '&[data-edge="right"]': {
    'borderTopLeftRadius': 'var(--md-sys-shape-corner-large, 16px)',
    'borderBottomLeftRadius': 'var(--md-sys-shape-corner-large, 16px)',
    '&[data-starting-style], &[data-ending-style]': { transform: 'translateX(100%)' },
  },
  '&[data-md3-navigation-popup="drawer"][data-ending-style]': { transition: `transform ${motion('effects')}` },
  '&[data-swiping]': { transition: 'none', userSelect: 'none' },
  '&[hidden]': { display: 'none' },
  '@media (prefers-reduced-motion: reduce)': {
    '&, &[data-md3-navigation-popup="rail"], &[data-md3-navigation-popup="drawer"][data-ending-style]': {
      transition: 'none',
    },
  },
  '@media (forced-colors: active)': { border: '1px solid CanvasText', backgroundColor: 'Canvas', boxShadow: 'none' },
} satisfies StyleObject;

export const navigationPortal = css`
  ${portal}
`;
export const navigationBackdrop = css`
  ${backdrop}
`;
export const navigationViewport = css`
  ${viewport}
`;
export const navigationPopup = css`
  ${popup}
`;
