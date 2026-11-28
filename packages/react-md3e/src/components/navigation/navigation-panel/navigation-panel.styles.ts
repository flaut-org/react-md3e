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
  // The viewport masks entry; it must not scroll focused offscreen RTL content into view.
  'overflow': 'clip',
  'pointerEvents': 'none',
  '&[data-edge="left"]': { justifyContent: 'flex-start' },
  '&[data-edge="right"]': { justifyContent: 'flex-end' },
  '&[hidden]': { display: 'none' },
} satisfies StyleObject;
const popup = {
  '@property --md3e-navigation-drawer-reveal': { syntax: '"<number>"', inherits: 'false', initialValue: '1' },
  '@property --md3e-navigation-panel-swipe': { syntax: '"<length>"', inherits: 'false', initialValue: '0px' },
  '--md3e-navigation-panel-swipe': 'var(--drawer-swipe-movement-x, 0px)',
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
    // Width may spring past its target; the anchored swipe coordinate may not detach.
    'transition': `inline-size ${motion('spatial', 'default')}, min-inline-size ${motion('spatial', 'default')}, --md3e-navigation-panel-swipe ${motion('spatial', 'default')}`,
    '&[data-edge="left"], &[data-edge="left"]:is([data-starting-style], [data-ending-style])': {
      transform: 'translateX(clamp(-100%, var(--md3e-navigation-panel-swipe), 0px))',
    },
    '&[data-edge="right"], &[data-edge="right"]:is([data-starting-style], [data-ending-style])': {
      transform: 'translateX(clamp(0px, var(--md3e-navigation-panel-swipe), 100%))',
    },
    '& > [data-md3-navigation-content] > [data-md3-navigation]': {
      minInlineSize: 'min(220px, max(0px, calc(100vw - 56px)))',
    },
    '&:is([data-starting-style], [data-ending-style])[data-edge]': {
      inlineSize: 0,
      minInlineSize: 0,
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
  '&[data-md3-navigation-popup="drawer"]': {
    // Keep the spatial spring, but project its pose onto this edge-attached surface's legal travel.
    '--md3e-navigation-drawer-reveal': '1',
    'transition': `--md3e-navigation-drawer-reveal calc(${motionDuration('spatial', 'default')} * var(--drawer-swipe-strength, 1)) ${motionEasing('spatial', 'default')}, --md3e-navigation-panel-swipe calc(${motionDuration('spatial', 'default')} * var(--drawer-swipe-strength, 1)) ${motionEasing('spatial', 'default')}`,
    '&[data-edge="left"]': {
      transform:
        'translateX(clamp(-100%, calc((clamp(0, var(--md3e-navigation-drawer-reveal), 1) - 1) * 100% + var(--md3e-navigation-panel-swipe)), 0px))',
    },
    '&[data-edge="right"]': {
      transform:
        'translateX(clamp(0px, calc((1 - clamp(0, var(--md3e-navigation-drawer-reveal), 1)) * 100% + var(--md3e-navigation-panel-swipe)), 100%))',
    },
    '&[data-starting-style], &[data-ending-style]': { '--md3e-navigation-drawer-reveal': '0' },
    '&[data-ending-style]': {
      transition: `--md3e-navigation-drawer-reveal ${motion('effects')}, --md3e-navigation-panel-swipe ${motion('effects')}`,
    },
  },
  '&[data-swiping]': { transition: 'none', userSelect: 'none' },
  '&[hidden]': { display: 'none' },
  '@media (prefers-reduced-motion: reduce)': {
    '&, &[data-md3-navigation-popup="rail"], &[data-md3-navigation-popup="drawer"], &[data-md3-navigation-popup="drawer"][data-ending-style]':
      {
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
