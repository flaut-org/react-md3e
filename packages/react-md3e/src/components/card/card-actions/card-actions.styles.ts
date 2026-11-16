import { css } from '@linaria/core';
import type { StyleObject } from '../../../styles/style-object.types';

const actionsStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'flex-end',
  'flexWrap': 'wrap',
  'gap': 8,
  'padding': 16,
  "&[data-disable-spacing='true']": { gap: 0 },
} satisfies StyleObject;

export const cardActions = css`
  ${actionsStyles}
`;
