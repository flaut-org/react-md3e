// Ripple visuals adapted from matraic/m3e RippleElement.ts; MIT, see licenses/m3e.txt.
import { css } from '@linaria/core';
import type { StyleObject } from '../../styles/style-object.types';

const rippleSurfaceStyles = {
  'position': 'absolute',
  'inset': 'calc(-1 * var(--_outline-width))',
  'borderRadius': 'inherit',
  'overflow': 'hidden',
  'pointerEvents': 'none',
  '@media (prefers-reduced-motion: reduce), (forced-colors: active)': { display: 'none' },
} satisfies StyleObject;

export const rippleSurface = css`
  ${rippleSurfaceStyles}
`;

const rippleInkStyles = {
  'position': 'absolute',
  'top': 'var(--_ripple-start-y)',
  'left': 'var(--_ripple-start-x)',
  'contain': 'layout style paint',
  'width': 'var(--_ripple-size)',
  'height': 'var(--_ripple-size)',
  'borderRadius': '50%',
  'backgroundColor': 'currentColor',
  'filter': 'blur(20px)',
  'willChange': 'transform, background-color, opacity',
  'opacity': 0.1,
  'pointerEvents': 'none',
  'animation': 'ripple-enter 450ms linear both',
  'transition': 'background-color 50ms cubic-bezier(0.2, 0, 0, 1)',
  "&[data-leaving='true']": {
    opacity: 0,
    transition: 'opacity 350ms cubic-bezier(0, 0, 0.2, 0.1), background-color 50ms cubic-bezier(0.2, 0, 0, 1)',
  },
  '@keyframes ripple-enter': {
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(4)' },
  },
} satisfies StyleObject;

export const rippleInk = css`
  ${rippleInkStyles}
`;
