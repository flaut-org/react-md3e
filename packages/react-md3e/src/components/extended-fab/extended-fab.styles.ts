import { css } from '@linaria/core';
import { motion } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  '&[data-md3-extended-fab]': {
    'minInlineSize': 'var(--_height)',
    'justifyContent': 'center',
    '&:has(> [data-md3-icon="start"])': { justifyContent: 'flex-start' },
    '& > [data-md3-icon="start"]': {
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--_icon)',
      lineHeight: 1,
    },
    '& [data-md3-extended-fab-label]': {
      display: 'block',
      opacity: 1,
      transition: `opacity ${motion('effects')}`,
    },
    '&[data-extended="false"]': {
      'inlineSize': 'var(--_height)',
      'paddingInline': 'calc((var(--_height) - var(--_icon)) / 2)',
      'gap': 0,
      '& [data-md3-extended-fab-label]': { opacity: 0 },
    },
    '@media (prefers-reduced-motion: reduce)': {
      '& [data-md3-extended-fab-label]': { transition: 'none' },
    },
  },
} satisfies StyleObject;

export const extendedFab = css`
  ${styles}
`;
