import { css } from '@linaria/core';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  'display': 'flex',
  'flexDirection': 'column',
  'gap': 8,
  "&[data-row='true']": { flexDirection: 'row', flexWrap: 'wrap' },
} satisfies StyleObject;

export const radioGroup = css`
  ${styles}
`;
