import { css } from '@linaria/core';
import { typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const leadingStyles = {
  ...typography('titleMedium'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'flexShrink': 0,
  'inlineSize': 20,
  'blockSize': 20,
  'fontSize': 20,
  'color': 'var(--_list-icon)',
  'fill': 'currentColor',
  "&[data-leading-kind='avatar']": {
    inlineSize: 40,
    blockSize: 40,
  },
  "&[data-leading-kind='image'], &[data-leading-kind='video']": {
    inlineSize: 56,
    blockSize: 56,
    borderRadius: 'var(--md-sys-shape-corner-small, 8px)',
    overflow: 'hidden',
  },
  "&[data-leading-kind='video']": { inlineSize: 100 },
  '& > svg, & > img': { inlineSize: '100%', blockSize: '100%', objectFit: 'cover' },
} satisfies StyleObject;

export const listLeading = css`
  ${leadingStyles}
`;

const contentStyles = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minInlineSize: 0,
} satisfies StyleObject;

export const listContent = css`
  ${contentStyles}
`;

const primaryStyles = { ...typography('bodyLarge'), color: 'var(--_list-label)' } satisfies StyleObject;

export const listPrimary = css`
  ${primaryStyles}
`;

const secondaryStyles = { ...typography('bodyMedium'), color: 'var(--_list-supporting)' } satisfies StyleObject;

export const listSecondary = css`
  ${secondaryStyles}
`;

const overlineStyles = { ...typography('labelSmall'), color: 'var(--_list-supporting)' } satisfies StyleObject;

export const listOverline = css`
  ${overlineStyles}
`;

const trailingStyles = {
  ...typography('labelSmall'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'flexShrink': 0,
  'gap': 12,
  'color': 'var(--_list-supporting)',
  "&[data-trailing-kind='icon'] > span > svg": { inlineSize: 20, blockSize: 20, fill: 'currentColor' },
} satisfies StyleObject;

export const listTrailing = css`
  ${trailingStyles}
`;
