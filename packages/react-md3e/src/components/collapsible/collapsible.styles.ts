import { css } from '@linaria/core';
import { motion } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const panel = {
  'height': 'var(--collapsible-panel-height)',
  'opacity': 1,
  'overflow': 'hidden',
  'transition': `height ${motion('spatial', 'default')}, opacity ${motion('effects')}`,
  '&[hidden]': { display: 'none' },
  '&[data-starting-style], &[data-ending-style]': { height: 0, opacity: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;
const content = { display: 'flow-root', minBlockSize: 0 } satisfies StyleObject;

export const collapsiblePanel = css`
  ${panel}
`;
export const collapsibleContent = css`
  ${content}
`;
