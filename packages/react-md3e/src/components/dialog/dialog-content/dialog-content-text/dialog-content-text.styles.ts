import { css } from '@linaria/core';
import { color, typography } from '../../../../styles/theme-tokens';
import type { StyleObject } from '../../../../styles/style-object.types';

const contentTextStyles = {
  ...typography('bodyMedium'),
  margin: 0,
  color: color('onSurfaceVariant'),
} satisfies StyleObject;

export const dialogContentText = css`
  ${contentTextStyles}
`;
