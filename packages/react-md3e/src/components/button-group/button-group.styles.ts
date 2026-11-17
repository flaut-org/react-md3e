import { css } from '@linaria/core';
import { motion } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  'display': 'inline-flex',
  'maxInlineSize': '100%',
  'gap': 2,
  'alignItems': 'stretch',
  'isolation': 'isolate',
  "&[data-full-width='true']": { display: 'flex', inlineSize: '100%' },
  '& > [data-md3-button]': {
    flex: '1 1 0',
    minInlineSize: 48,
    transition: `border-radius ${motion('spatial')}, flex-grow ${motion('spatial')}`,
  },
  "&[data-group-variant='connected'] > [data-md3-button]": { borderRadius: 'var(--md-sys-shape-corner-small, 8px)' },
  "&[data-group-variant='connected'][data-orientation='horizontal'] > [data-md3-button]:first-child": {
    borderStartStartRadius: '9999px',
    borderEndStartRadius: '9999px',
  },
  "&[data-group-variant='connected'][data-orientation='horizontal'] > [data-md3-button]:last-child": {
    borderStartEndRadius: '9999px',
    borderEndEndRadius: '9999px',
  },
  "&[data-group-variant='connected'] > [data-md3-button][aria-pressed='true']": { borderRadius: '9999px' },
  "&[data-orientation='vertical']": { flexDirection: 'column' },
  "&[data-group-variant='connected'][data-orientation='vertical'] > [data-md3-button]:first-child": {
    borderStartStartRadius: '9999px',
    borderStartEndRadius: '9999px',
  },
  "&[data-group-variant='connected'][data-orientation='vertical'] > [data-md3-button]:last-child": {
    borderEndStartRadius: '9999px',
    borderEndEndRadius: '9999px',
  },
  "&[data-group-variant='standard']": { gap: 12 },
  "&[data-group-variant='standard']:has(> button:active:not(:disabled)) > button:active:not(:disabled)": {
    flexGrow: 1.3,
  },
  "&[data-group-variant='standard'] > button:has(+ button:active:not(:disabled)), &[data-group-variant='standard'] > button:active:not(:disabled) + button":
    { flexGrow: 0.7 },
  '@media (prefers-reduced-motion: reduce)': { '& > [data-md3-button]': { transition: 'none' } },
} satisfies StyleObject;

export const buttonGroupRoot = css`
  ${styles}
`;
