import { css } from '@linaria/core';
import { motion } from '../../../../styles/theme-tokens';
import type { StyleObject } from '../../../../styles/style-object.types';

const layerStyles = {
  'position': 'absolute',
  'inset': 0,
  'padding': 'inherit',
  'boxSizing': 'border-box',
  'pointerEvents': 'none',
  '& *': { animation: 'none', transition: 'none', pointerEvents: 'none' },
} satisfies StyleObject;

export const sourceLayer = css`
  ${layerStyles}
`;

const barStyles = { position: 'relative', inlineSize: '100%', blockSize: 56 } satisfies StyleObject;

export const sourceBar = css`
  ${barStyles}
`;

const leadingStyles = {
  'position': 'absolute',
  'insetInlineStart': 'var(--_search-anchor-leading-start)',
  'insetBlockStart': 'var(--_search-anchor-leading-top)',
  'inlineSize': 'var(--_search-anchor-leading-width)',
  'blockSize': 'var(--_search-anchor-leading-height)',
  'opacity': 0,
  'transform': 'rotate(90deg)',
  'transition': `opacity ${motion('effects')}, transform ${motion('effects', 'default')}`,
  '& > *': { inlineSize: '100%', blockSize: '100%', minInlineSize: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const sourceLeading = css`
  ${leadingStyles}
`;

const trailingStyles = {
  'position': 'absolute',
  'insetInlineEnd': 'var(--_search-anchor-trailing-end)',
  'insetBlockStart': 'var(--_search-anchor-trailing-top)',
  'inlineSize': 'var(--_search-anchor-trailing-width)',
  'blockSize': 'var(--_search-anchor-trailing-height)',
  'opacity': 0,
  'transform': 'scale(0.85)',
  'transition': `opacity ${motion('effects')}, transform ${motion('effects', 'default')}`,
  '& > *': { inlineSize: '100%', blockSize: '100%', minInlineSize: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const sourceTrailing = css`
  ${trailingStyles}
`;
