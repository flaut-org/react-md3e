import { css } from '@linaria/core';
import { color, typography } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const contentStyles = {
  ...typography('bodyMedium'),
  'minBlockSize': 0,
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  'padding': '0 24px 24px',
  'color': color('onSurfaceVariant'),
  '&:first-child': { paddingBlockStart: 24 },
  "&[data-dividers='true']": { paddingBlock: 16, borderBlock: `1px solid ${color('outlineVariant')}` },
  "&[data-dividers='true'] + [data-md3-dialog-actions]": { paddingBlockStart: 24 },
} satisfies StyleObject;

export const dialogContent = css`
  ${contentStyles}
`;
