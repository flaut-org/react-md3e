import { css } from '@linaria/core';
import { color, typography } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const styles = {
  ...typography('labelLarge'),
  'display': 'inline-flex',
  'alignItems': 'center',
  'gap': 4,
  'minBlockSize': 32,
  'paddingInline': '12px 4px',
  'maxInlineSize': '100%',
  'borderRadius': 'var(--md-sys-shape-corner-small, 8px)',
  'backgroundColor': color('secondaryContainer'),
  'color': color('onSecondaryContainer'),
  'overflowWrap': 'anywhere',
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: 2 },
  '&[data-disabled]': { opacity: 0.38 },
  '@media (forced-colors: active)': { border: '1px solid CanvasText' },
} satisfies StyleObject;

export const autocompleteChip = css`
  ${styles}
`;

const removeStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'minInlineSize': 32,
  'minBlockSize': 32,
  'padding': 4,
  'border': 0,
  'borderRadius': '50%',
  'background': 'transparent',
  'color': 'inherit',
  'cursor': 'pointer',
  '& > svg': { inlineSize: 18, blockSize: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  '&:focus-visible': { outline: `2px solid ${color('secondary')}` },
  '&:disabled': { cursor: 'default' },
} satisfies StyleObject;

export const autocompleteChipRemove = css`
  ${removeStyles}
`;
