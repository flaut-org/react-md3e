import { css } from '@linaria/core';
import { color, typography } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const titleStyles = {
  ...typography('headlineSmall'),
  'flexShrink': 0,
  'boxSizing': 'border-box',
  'margin': 0,
  'padding': '24px 24px 16px',
  'color': color('onSurface'),
  "&[data-has-icon='true']": { textAlign: 'center' },
  '&:last-child': { paddingBlockEnd: 24 },
  '& + [data-md3-dialog-actions]': { paddingBlockStart: 8 },
} satisfies StyleObject;

export const dialogTitle = css`
  ${titleStyles}
`;

const iconStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'inlineSize': 24,
  'blockSize': 24,
  'marginInline': 'auto',
  'marginBlockEnd': 16,
  'color': color('secondary'),
  'fill': 'currentColor',
  '& > svg': { inlineSize: '100%', blockSize: '100%' },
} satisfies StyleObject;

export const dialogIcon = css`
  ${iconStyles}
`;
