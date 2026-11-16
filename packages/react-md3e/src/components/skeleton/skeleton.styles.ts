import { css } from '@linaria/core';
import { color } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  'position': 'relative',
  'display': 'block',
  'blockSize': '1em',
  'overflow': 'hidden',
  'flexShrink': 0,
  'backgroundColor': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
  "&[data-variant='text']": {
    borderRadius: 'var(--md-sys-shape-corner-extra-small, 4px)',
    transform: 'scaleY(0.65)',
    transformOrigin: 'center',
  },
  "&[data-variant='rounded']": { borderRadius: 'var(--md-sys-shape-corner-medium, 12px)' },
  "&[data-variant='circular']": { borderRadius: '50%' },
  "&[data-animation='pulse']": { animation: 'md3-skeleton-pulse 1.8s ease-in-out infinite' },
  "&[data-animation='wave']::after": {
    content: "''",
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${color('onSurface')} 8%, transparent), transparent)`,
    animation: 'md3-skeleton-wave 1.8s linear infinite',
  },
  '& > *': { visibility: 'hidden' },
  '&:has(> *)': { blockSize: 'auto', transform: 'none' },
  '@keyframes md3-skeleton-pulse': { '0%': { opacity: 1 }, '50%': { opacity: 0.4 }, '100%': { opacity: 1 } },
  '@keyframes md3-skeleton-wave': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(100%)' } },
  '@media (prefers-reduced-motion: reduce)': { '&[data-animation], &[data-animation]::after': { animation: 'none' } },
  '@media (forced-colors: active)': { backgroundColor: 'Canvas', outline: '1px solid GrayText' },
} satisfies StyleObject;

export const skeletonRoot = css`
  ${styles}
`;
