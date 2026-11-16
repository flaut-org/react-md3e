import { css } from '@linaria/core';
import type { StyleObject } from '../../../styles/style-object.types';

const fallbackStyles = {
  position: 'absolute',
  inset: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
} satisfies StyleObject;

export const avatarFallback = css`
  ${fallbackStyles}
`;

const imageStyles = {
  'position': 'absolute',
  'inset': 0,
  'inlineSize': '100%',
  'blockSize': '100%',
  'objectFit': 'cover',
  '&[data-loading], &[data-error]': { visibility: 'hidden' },
} satisfies StyleObject;

export const avatarImage = css`
  ${imageStyles}
`;
