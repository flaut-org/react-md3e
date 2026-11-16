import { css } from '@linaria/core';
import { color } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  'margin': 0,
  'border': 0,
  'boxSizing': 'border-box',
  'backgroundColor': color('outlineVariant'),
  'flexShrink': 0,
  "&[data-orientation='horizontal']": { blockSize: 1, inlineSize: 'auto', alignSelf: 'stretch' },
  "&[data-orientation='vertical']": { inlineSize: 1, blockSize: '100%', minBlockSize: '1em', alignSelf: 'stretch' },
  "&[data-flex-item='true'][data-orientation='vertical']": { blockSize: 'auto' },
  "&[data-variant='inset'][data-orientation='horizontal']": { marginInlineStart: 16 },
  "&[data-variant='middle'][data-orientation='horizontal']": { marginInline: 16 },
  "&[data-variant='inset'][data-orientation='vertical']": { marginBlockStart: 16 },
  "&[data-variant='middle'][data-orientation='vertical']": { marginBlock: 16 },
  '@media (forced-colors: active)': { backgroundColor: 'CanvasText', forcedColorAdjust: 'none' },
} satisfies StyleObject;

export const dividerRoot = css`
  ${styles}
`;
