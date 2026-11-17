import { css } from '@linaria/core';
import { motion } from '../../styles/theme-tokens';
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
  'top': 0,
  'left': 0,
  'width': 'var(--_ripple-size)',
  'height': 'var(--_ripple-size)',
  'borderRadius': '50%',
  'background': 'currentColor',
  'opacity': 0.1,
  'pointerEvents': 'none',
  'animation': `ripple-enter ${motion('effects', 'slow')} both`,
  'transition': `opacity ${motion('effects')}`,
  "&[data-leaving='true']": { opacity: 0 },
  '@keyframes ripple-enter': {
    from: { transform: 'translate(var(--_ripple-start-x), var(--_ripple-start-y)) scale(1)' },
    to: {
      transform: 'translate(var(--_ripple-end-x), var(--_ripple-end-y)) scale(var(--_ripple-scale))',
    },
  },
} satisfies StyleObject;

export const rippleInk = css`
  ${rippleInkStyles}
`;
