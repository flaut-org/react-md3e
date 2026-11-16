import { css } from '@linaria/core';
import type { StyleObject } from '../../../styles/style-object.types';

const contentStyles = { padding: 16, minInlineSize: 0, overflowWrap: 'anywhere' } satisfies StyleObject;

export const cardContent = css`
  ${contentStyles}
`;
