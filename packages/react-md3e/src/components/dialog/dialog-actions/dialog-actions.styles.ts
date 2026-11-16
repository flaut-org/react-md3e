import { css } from '@linaria/core';
import type { StyleObject } from '../../../styles/style-object.types';

const actionsStyles = {
  'display': 'flex',
  'flexWrap': 'wrap-reverse',
  'justifyContent': 'flex-end',
  'alignItems': 'center',
  'flexShrink': 0,
  'gap': 8,
  'padding': '0 24px 24px',
  'boxSizing': 'border-box',
  '&:first-child': { paddingBlockStart: 24 },
  "&[data-stacked='true']": { flexDirection: 'column-reverse', alignItems: 'flex-end', flexWrap: 'nowrap' },
} satisfies StyleObject;

export const dialogActions = css`
  ${actionsStyles}
`;
