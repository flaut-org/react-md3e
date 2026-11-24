import { css } from '@linaria/core';
import { color, motion } from '../../styles/theme-tokens';
import { createBreakpointQueries } from '../../theme/create-breakpoints';
import defaultTheme from '../../theme/default-theme.generated.json';
import type { StyleObject } from '../../styles/style-object.types';

const queries = createBreakpointQueries(defaultTheme.breakpoints);
const mediumWindow = `@media ${queries.up.sm}` as const;
const inline = {
  '--_nav-block-focus-display': 'none',
  '--_nav-inline-focus-display': 'block',
  '--_nav-focused-indicator-motion': motion('effects'),
  '--_nav-surface-height': '40px',
  '--_nav-surface-padding': '20px',
  '--_nav-inline-columns': '1fr',
  '--_nav-inline-opacity': '1',
  '--_nav-inline-gap': '4px',
  '--_nav-bottom-rows': '0fr',
  '--_nav-bottom-opacity': '0',
  '--_nav-bottom-gap': '0px',
  '--_nav-item-top': '12px',
  '--_nav-item-bottom': '12px',
  '--_nav-active-label': color('onSecondaryContainer'),
  '& > [data-md3-navigation-items]': { justifyContent: 'center' },
  '& > [data-md3-navigation-items] > [data-md3-navigation-item]': { flex: '0 1 auto', paddingInline: 8 },
} satisfies StyleObject;
const responsive: Readonly<Partial<Record<`@media ${string}`, StyleObject>>> = {
  [mediumWindow]: { '&[data-icon-position="auto"]': inline } satisfies StyleObject,
};
const root = {
  'display': 'flex',
  'flexDirection': 'row',
  'inlineSize': '100%',
  'minBlockSize': 'calc(64px + env(safe-area-inset-bottom, 0px))',
  'paddingBlockEnd': 'env(safe-area-inset-bottom, 0px)',
  'overflowX': 'auto',
  '& > [data-md3-navigation-items] > [data-md3-navigation-item]': { flex: '1 1 0', minInlineSize: 'max-content' },
  '& [data-md3-navigation-bottom-label] > span': { whiteSpace: 'nowrap' },
  '&[data-icon-position="start"]': inline,
  ...responsive,
  '&[data-variant="baseline"]': {
    '--_nav-item-height': '80px',
    '--_nav-item-top': '12px',
    '--_nav-item-bottom': '16px',
    '--_nav-surface-min-width': '64px',
    '--_nav-surface-padding': '20px',
    '--_nav-active-label': color('onSurface'),
    'minBlockSize': 'calc(80px + env(safe-area-inset-bottom, 0px))',
    '& [data-md3-navigation-item][data-selected="true"] [data-md3-navigation-bottom-label]': { fontWeight: 700 },
  },
  '&[data-position="fixed"]': { position: 'fixed', insetInline: 0, insetBlockEnd: 0, zIndex: 1100 },
  '&[data-position="sticky"]': { position: 'sticky', insetBlockEnd: 0, zIndex: 1100 },
} satisfies StyleObject;

export const navigationBar = css`
  ${root}
`;
