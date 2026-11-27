import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

// DatePickerModalTokens v0_210: 360px container, 28px corners, 24px header insets.
const panelStyles = {
  'boxSizing': 'border-box',
  'backgroundColor': `var(--md-date-picker-container-color, ${color('surfaceContainerHigh')})`,
  'color': color('onSurface'),
  'borderRadius': 'var(--md-date-picker-container-shape, var(--md-sys-shape-corner-extra-large, 28px))',
  'inlineSize': 'var(--md-date-picker-container-width, 360px)',
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  '&[data-md3-popover]': {
    maxInlineSize: 'min(100vw - 16px, var(--available-width))',
    maxBlockSize: 'none',
    overflow: 'visible',
  },
  '&[data-picker-range="true"][data-picker-modal="false"]': {
    inlineSize: 'fit-content',
    width: 'max-content',
    maxInlineSize: 'min(100vw - 16px, var(--available-width))',
  },
  '&[data-picker-fullscreen="true"]': { inlineSize: '100%', maxInlineSize: 'none', borderRadius: 0 },
  '& [data-picker-header]': {
    boxSizing: 'border-box',
    flexShrink: 0,
    minBlockSize: 'var(--md-date-picker-header-height, 120px)',
    padding: '16px 24px 12px',
  },
  '& [data-picker-headline-row]': { display: 'flex', alignItems: 'center', gap: '8px', minBlockSize: '48px' },
  '& [data-picker-headline]': {
    flex: '1 1 0',
    minInlineSize: 0,
    color: `var(--md-date-picker-headline-color, ${color('onSurface')})`,
  },
  '& [data-picker-label]': { ...typography('labelLarge'), color: color('onSurfaceVariant') },
  '& [data-picker-content]': {
    minBlockSize: 0,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    flex: '1 1 auto',
    outline: 'none',
  },
  '&[data-picker-modal="false"] [data-picker-content], &[data-picker-range="false"][data-picker-mode="calendar"] [data-picker-content]':
    {
      overflow: 'visible',
      flexShrink: 0,
    },
  '& [data-picker-input]': { padding: '24px', animation: `md3-picker-input-enter ${motion('effects')}` },
  '& [data-picker-input][hidden]': { display: 'none' },
  '& [data-picker-actions]': {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '8px 12px 12px',
  },
  '& [data-picker-clear]': { marginInlineEnd: 'auto' },
  '& [data-picker-month-actions]': { display: 'flex', justifyContent: 'space-between', paddingInline: '12px' },
  '& [data-picker-month-actions]:dir(rtl) [data-picker-arrow]': { transform: 'scaleX(-1)' },
  '&[data-picker-range="true"][data-picker-modal="true"] [data-md3-range-calendar]': {
    flexDirection: 'column',
    alignItems: 'center',
    inlineSize: '100%',
  },
  '&[data-picker-range="true"][data-picker-modal="true"] [data-md3-range-calendar] > [data-md3-calendar]': {
    maxInlineSize: '100%',
  },
  '&[data-picker-modal="true"] [data-md3-range-calendar] [data-calendar-previous-button], &[data-picker-modal="true"] [data-md3-range-calendar] [data-calendar-next-button]':
    { visibility: 'hidden' },
  '&[data-reduce-animations="true"] [data-picker-input]': { animation: 'none' },
  '&[data-reduce-animations="true"]': { transition: 'none' },
  '@media (prefers-reduced-motion: reduce)': { '& [data-picker-input]': { animation: 'none' } },
  '@keyframes md3-picker-input-enter': { from: { opacity: 0 }, to: { opacity: 1 } },
  '@media (forced-colors: active)': { border: '1px solid CanvasText' },
} satisfies StyleObject;

export const datePickerPanel = css`
  ${panelStyles}
`;
