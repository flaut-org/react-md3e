import { css } from '@linaria/core';
import type { StyleObject } from '../../../styles/style-object.types';

const rootStyles = {
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'center',
  'boxSizing': 'border-box',
  'flex': '0 1 auto',
  'inlineSize': 'var(--_toolbar-overflow-size, max-content)',
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  'gap': 'var(--_toolbar-gap, 4px)',
  'overflowX': 'auto',
  'overscrollBehavior': 'contain',
  'scrollbarWidth': 'thin',
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    inlineSize: 'auto',
    blockSize: 'var(--_toolbar-overflow-size, max-content)',
    maxBlockSize: '100%',
    minBlockSize: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  '& > [data-md3-toolbar-overflow-action]': {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    inlineSize: 'max-content',
    blockSize: 'max-content',
  },
  '& > [data-overflowed="true"]': {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    inlineSize: 'max-content',
    blockSize: 'max-content',
    inset: 0,
  },
  '& > [data-md3-toolbar-overflow-trigger]': { display: 'flex', flexShrink: 0 },
  '&[data-orientation="vertical"] > [data-md3-toolbar-overflow-action]': { minBlockSize: '48px' },
  '& > [data-md3-toolbar-overflow-trigger][data-empty="true"]': { visibility: 'hidden' },
} satisfies StyleObject;

export const toolbarOverflow = css`
  ${rootStyles}
`;
