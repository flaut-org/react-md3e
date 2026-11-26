import { css } from '@linaria/core';
import { color, motion } from '../../../../styles/theme-tokens';
import type { StyleObject } from '../../../../styles/style-object.types';

const rowStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'minInlineSize': 0,
  'minBlockSize': 'inherit',
  'borderRadius': 'inherit',
  "&[data-lines='3']": {
    'alignItems': 'flex-start',
    '& > [data-md3-list-action]': { alignItems: 'flex-start' },
  },
} satisfies StyleObject;
const actionStyles = {
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'center',
  'alignSelf': 'stretch',
  'flex': '1 1 0%',
  'gap': 12,
  'minInlineSize': 0,
  'minBlockSize': 'inherit',
  'boxSizing': 'border-box',
  'padding': '10px 16px',
  'margin': 0,
  'border': 0,
  'borderRadius': 'inherit',
  'font': 'inherit',
  'textAlign': 'start',
  'textDecoration': 'none',
  'color': 'inherit',
  'background': 'transparent',
  'outline': 'none',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: color('onSurface'),
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${motion('effects')}`,
  },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: -3 },
  '&:focus-visible::before, &:active:not(:has([data-md3-ripple-ink]))::before': { opacity: 0.1 },
  '&:disabled, &[aria-disabled="true"]': { cursor: 'default' },
  '&:disabled::before, &[aria-disabled="true"]::before': { opacity: 0 },
  '&:has(~ [data-action-position="end"])': { borderStartEndRadius: 0, borderEndEndRadius: 0 },
  '&:not(:first-child)': { paddingInlineStart: 12, borderStartStartRadius: 0, borderEndStartRadius: 0 },
  '&:has(+ [data-action-position="end"])': { paddingInlineEnd: 12 },
  '&[aria-expanded="true"] [data-md3-list-expand-icon]': {
    'backgroundColor': `var(--md-comp-list-expand-expanded-list-item-trailing-icon-container-color, ${color('surfaceContainer')})`,
    'color': 'var(--md-comp-list-expand-expanded-list-item-trailing-icon-icon-color, var(--_list-label))',
    '& > svg': { transform: 'rotate(180deg)' },
  },
  '&:disabled [data-md3-list-expand-icon]': { backgroundColor: 'transparent', color: 'var(--_list-label)' },
  '@media (hover: hover)': {
    '&:hover:not(:disabled):not([aria-disabled="true"])::before': { opacity: 0.08 },
    '&:hover:active:not(:has([data-md3-ripple-ink])):not(:disabled):not([aria-disabled="true"])::before, &:hover:focus-visible::before':
      {
        opacity: 0.1,
      },
  },
  '@media (prefers-reduced-motion: reduce)': { '&::before': { transition: 'none' } },
  '@media (forced-colors: active)': {
    '&:focus-visible': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;
const slotStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'alignSelf': 'stretch',
  'flexShrink': 0,
  'minInlineSize': 48,
  'minBlockSize': 48,
  'gap': 12,
  'paddingInline': 8,
  'color': 'var(--_list-icon)',
  'boxSizing': 'border-box',
  '& > [data-md3-icon-button]': { alignSelf: 'stretch', blockSize: 'auto' },
} satisfies StyleObject;
const iconStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'inlineSize': 40,
  'blockSize': 40,
  'borderRadius': 'var(--md-comp-list-expand-trailing-icon-shape, var(--md-sys-shape-corner-full, 9999px))',
  'backgroundColor': `var(--md-comp-list-expand-collapsed-list-item-trailing-icon-container-color, ${color('surface')})`,
  'color': 'var(--md-comp-list-expand-collapsed-list-item-trailing-icon-icon-color, var(--_list-label))',
  'fill': 'currentColor',
  'transition': `background-color ${motion('effects')}`,
  '& > svg': { inlineSize: 20, blockSize: 20, transition: `transform ${motion('spatial')}` },
  '@media (prefers-reduced-motion: reduce)': { 'transition': 'none', '& > svg': { transition: 'none' } },
} satisfies StyleObject;
const panelStyles = {
  'height': 'var(--collapsible-panel-height)',
  'overflow': 'hidden',
  'transition': `height ${motion('spatial', 'default')}`,
  '&[data-starting-style], &[data-ending-style]': { height: 0 },
  '&[hidden]': { display: 'none' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;
const contentStyles = {
  'display': 'flow-root',
  'padding': '0 16px 10px',
  'color': color('onSurface'),
  '& > [data-md3-list]': { paddingBlock: 0 },
} satisfies StyleObject;

export const listActionRow = css`
  ${rowStyles}
`;
export const listAction = css`
  ${actionStyles}
`;
export const listActionSlot = css`
  ${slotStyles}
`;
export const listExpandIcon = css`
  ${iconStyles}
`;
export const listExpandPanel = css`
  ${panelStyles}
`;
export const listExpandContent = css`
  ${contentStyles}
`;
