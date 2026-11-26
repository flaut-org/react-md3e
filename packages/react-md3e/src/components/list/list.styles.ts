import { css } from '@linaria/core';
import { color } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  '--_list-inner': 'var(--md-sys-shape-corner-extra-small, 4px)',
  '--_list-outer': 'var(--md-sys-shape-corner-large, 16px)',
  '--_list-top': 'var(--_list-inner)',
  '--_list-bottom': 'var(--_list-inner)',
  'display': 'flex',
  'flexDirection': 'column',
  'gap': 2,
  'padding': '8px 0',
  'margin': 0,
  'listStyle': 'none',
  'minInlineSize': 0,
  'boxSizing': 'border-box',
  "&[data-variant='standard']": { '--_list-inner': '0px', '--_list-outer': '0px', 'gap': 0 },
  "&[data-disable-padding='true']": { padding: 0 },
  "&[data-variant='segmented'] > [data-expandable='true'][data-open]": {
    backgroundColor: `var(--md-comp-list-expand-expanded-list-item-segmented-container-color, ${color('surface')})`,
  },
  '& > [data-md3-list-item]:first-child': { '--_list-top': 'var(--_list-outer)' },
  '& > [data-md3-list-item]:last-child': { '--_list-bottom': 'var(--_list-outer)' },
} satisfies StyleObject;

export const listRoot = css`
  ${rootStyles}
`;
