import { css } from '@linaria/core';
import type { StyleObject } from '../../../styles/style-object.types';

const mediaStyles = {
  display: 'block',
  inlineSize: '100%',
  maxInlineSize: '100%',
  objectFit: 'cover',
} satisfies StyleObject;

export const cardMedia = css`
  ${mediaStyles}
`;
