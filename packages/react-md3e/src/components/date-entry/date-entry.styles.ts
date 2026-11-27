import { css } from '@linaria/core';
import type { StyleObject } from '../../styles/style-object.types';

const entryStyles = {
  'display': 'flex',
  'alignItems': 'flex-start',
  'gap': '16px',
  'minInlineSize': 0,
  'inlineSize': 'fit-content',
  'maxInlineSize': '100%',
  '& > [data-md3-text-field]': { flex: '1 1 0', minInlineSize: 0 },
  '&[data-full-width="true"]': { inlineSize: '100%' },
  '& [data-md3-field-trailing]': { display: 'flex', alignItems: 'center' },
} satisfies StyleObject;

export const dateEntryRoot = css`
  ${entryStyles}
`;
