import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  ...typography('bodyLarge'),
  'boxSizing': 'border-box',
  'inlineSize': '360px',
  'maxInlineSize': '100%',
  'padding': '12px',
  'color': color('onSurface'),
  'colorScheme': 'inherit',
  '& *, & *::before, & *::after': { boxSizing: 'border-box' },
  "&&[dir='rtl'] [data-calendar-arrow]": { transform: 'scaleX(-1)' },
  "&&[dir='ltr'] [data-calendar-arrow]": { transform: 'scaleX(1)' },
} satisfies StyleObject;

const headerStyles = {
  'display': 'grid',
  'gridTemplateColumns': 'minmax(0, 1fr) 48px 48px',
  'alignItems': 'center',
  'minBlockSize': '56px',
  'paddingInlineStart': '12px',
  'gap': '4px',
  '& > *': { gridRow: 1 },
  '& [data-calendar-heading]': { ...typography('labelLarge'), gridColumn: 1, minInlineSize: 0 },
  '& [data-calendar-previous-button]': { gridColumn: 2 },
  '& [data-calendar-next-button]': { gridColumn: 3 },
  '& [data-calendar-heading-button]': {
    ...typography('labelLarge'),
    'display': 'inline-flex',
    'alignItems': 'center',
    'gap': '8px',
    'minBlockSize': '48px',
    'padding': '8px',
    'marginInlineStart': '-8px',
    'border': 0,
    'borderRadius': '20px',
    'background': 'transparent',
    'color': color('onSurfaceVariant'),
    'cursor': 'pointer',
    '&:hover': { backgroundColor: `color-mix(in srgb, ${color('onSurfaceVariant')} 8%, transparent)` },
    '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: '2px' },
    '&:disabled': { cursor: 'default', opacity: 0.38 },
  },
  '& svg': { inlineSize: '24px', blockSize: '24px', flexShrink: 0 },
  '& [data-calendar-arrow]:dir(rtl)': { transform: 'scaleX(-1)' },
} satisfies StyleObject;

const weekdaysStyles = {
  ...typography('bodyLarge'),
  'display': 'grid',
  'gridTemplateColumns': 'repeat(7, minmax(0, 1fr))',
  'alignItems': 'center',
  'blockSize': '48px',
  'textAlign': 'center',
  'color': color('onSurface'),
  "&[data-week-numbers='true']": { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
  '& [data-week-number]': { ...typography('labelSmall'), color: color('onSurfaceVariant') },
} satisfies StyleObject;

const tableStyles = {
  'inlineSize': '100%',
  'tableLayout': 'fixed',
  'borderSpacing': 0,
  'borderCollapse': 'collapse',
  '& th': {
    ...typography('bodyLarge'),
    blockSize: '48px',
    padding: 0,
    textAlign: 'center',
    fontWeight: 400,
    color: color('onSurface'),
  },
  '& td': { position: 'relative', blockSize: '48px', padding: 0, textAlign: 'center', isolation: 'isolate' },
  '& [data-week-number]': { ...typography('labelSmall'), color: color('onSurfaceVariant') },
  "& td[data-in-range='true']::before": {
    content: '""',
    position: 'absolute',
    insetBlockStart: '4px',
    insetInline: 0,
    blockSize: '40px',
    backgroundColor: color('secondaryContainer'),
    zIndex: -1,
  },
  "& td[data-range-start='true']::before": { insetInlineStart: '50%' },
  "& td[data-range-end='true']::before": { insetInlineEnd: '50%' },
  "& td[data-range-start='true'][data-range-end='true']::before": { display: 'none' },
  "& td[data-preview='true']::after": {
    content: '""',
    position: 'absolute',
    insetBlockStart: '4px',
    insetInline: 0,
    blockSize: '40px',
    borderBlock: `1px dashed ${color('outline')}`,
    pointerEvents: 'none',
    zIndex: -1,
  },
  "& td[data-preview-start='true']::after": {
    insetInlineStart: 'calc(50% - 20px)',
    borderInlineStart: `1px dashed ${color('outline')}`,
    borderStartStartRadius: '20px',
    borderEndStartRadius: '20px',
  },
  "& td[data-preview-end='true']::after": {
    insetInlineEnd: 'calc(50% - 20px)',
    borderInlineEnd: `1px dashed ${color('outline')}`,
    borderStartEndRadius: '20px',
    borderEndEndRadius: '20px',
  },
  '@media (forced-colors: active)': {
    "& td[data-in-range='true']::before": { backgroundColor: 'Highlight', opacity: 0.25, forcedColorAdjust: 'none' },
    "& td[data-preview='true']::after": { borderColor: 'CanvasText' },
  },
} satisfies StyleObject;

const dayStyles = {
  ...typography('bodyLarge'),
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'isolation': 'isolate',
  'inlineSize': '100%',
  'blockSize': '48px',
  'padding': 0,
  'border': 0,
  'borderRadius': '24px',
  'appearance': 'none',
  'background': 'transparent',
  'color': color('onSurface'),
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    insetBlockStart: '4px',
    insetInlineStart: 'calc(50% - 20px)',
    inlineSize: '40px',
    blockSize: '40px',
    borderRadius: 'var(--md-sys-shape-corner-full, 9999px)',
    zIndex: -1,
  },
  '&::before': {
    transition: `background-color ${motion('effects')}, border-color ${motion('effects')}`,
  },
  '&::after': { backgroundColor: 'currentColor', opacity: 0, transition: `opacity ${motion('effects')}` },
  "&[data-outside='true']": { color: color('onSurfaceVariant') },
  "&[data-in-range='true']": { color: color('onSecondaryContainer') },
  "&[data-today='true']::before": { border: `1px solid ${color('primary')}` },
  "&[data-today='true']": { color: color('primary') },
  "&[data-selected='true']": { color: color('onPrimary') },
  "&[data-selected='true']::before": { backgroundColor: color('primary'), borderColor: color('primary') },
  '&:hover:not(:disabled)::after': { opacity: 0.08 },
  '&:active:not(:disabled)::after': { opacity: 0.12 },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: '-3px' },
  '&:disabled': { color: `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`, cursor: 'default' },
  "&:disabled[data-selected='true']::before": {
    backgroundColor: `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
  },
  '@media (prefers-reduced-motion: reduce)': { '&::before, &::after': { transition: 'none' } },
  '@media (forced-colors: active)': {
    'color': 'ButtonText',
    "&[data-today='true']::before": { borderColor: 'ButtonText' },
    "&[data-selected='true']": { color: 'HighlightText', forcedColorAdjust: 'none' },
    "&[data-selected='true']::before": { backgroundColor: 'Highlight', forcedColorAdjust: 'none' },
    '&:focus-visible': { outlineColor: 'Highlight' },
    '&:disabled': { color: 'GrayText' },
  },
} satisfies StyleObject;

const choicesStyles = {
  'position': 'relative',
  'display': 'grid',
  'gridTemplateColumns': 'repeat(3, minmax(0, 1fr))',
  'gap': '4px 8px',
  'maxBlockSize': '336px',
  'minBlockSize': '240px',
  'overflowY': 'auto',
  'scrollPaddingBlock': '12px',
  'padding': '8px',
  "&[data-columns='4']": { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  '& button': {
    ...typography('bodyLarge'),
    'position': 'relative',
    'isolation': 'isolate',
    'minBlockSize': '48px',
    'padding': '4px',
    'border': 0,
    'borderRadius': '24px',
    'background': 'transparent',
    'color': color('onSurfaceVariant'),
    'cursor': 'pointer',
    '&::before': {
      content: '""',
      position: 'absolute',
      insetBlockStart: 'calc(50% - 18px)',
      insetInlineStart: 'calc(50% - 36px)',
      inlineSize: '72px',
      blockSize: '36px',
      borderRadius: '18px',
      zIndex: -1,
      transition: `background-color ${motion('effects')}`,
    },
    "&[aria-checked='true']": { color: color('onPrimary') },
    "&[aria-checked='true']::before": { backgroundColor: color('primary') },
    '&:hover:not(:disabled)': { color: color('onSecondaryContainer') },
    '&:hover:not(:disabled)::before': { backgroundColor: color('secondaryContainer') },
    '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: '-3px' },
    '&:disabled': { opacity: 0.38, cursor: 'default' },
  },
  '@media (prefers-reduced-motion: reduce)': { '& button::before': { transition: 'none' } },
  '@media (forced-colors: active)': {
    "& button[aria-checked='true']": {
      color: 'HighlightText',
      forcedColorAdjust: 'none',
    },
    "& button[aria-checked='true']::before": { backgroundColor: 'Highlight', forcedColorAdjust: 'none' },
    '& button:focus-visible': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;

const transitionStyles = {
  'display': 'grid',
  'position': 'relative',
  'overflow': 'clip',
  '&[data-direction="backward"]': { '--_calendar-travel': '-100%' },
  '&[data-direction="forward"]': { '--_calendar-travel': '100%' },
  '& > div': { position: 'relative', gridArea: '1 / 1', minInlineSize: 0 },
  '& [data-calendar-day-view]': { minBlockSize: '288px' },
  '&[data-active="true"] > [data-calendar-current]': {
    animation:
      'md3-calendar-enter var(--md-calendar-slide-duration, 375ms) var(--md-calendar-slide-easing, cubic-bezier(0.35, 0.8, 0.4, 1)) both',
  },
  '& > [data-calendar-previous]': {
    pointerEvents: 'none',
    animation:
      'md3-calendar-exit var(--md-calendar-slide-duration, 375ms) var(--md-calendar-slide-easing, cubic-bezier(0.35, 0.8, 0.4, 1)) both',
  },
  '&[data-reduce="true"] > [data-calendar-current]': { animation: 'none' },
  '&[data-reduce="true"] > [data-calendar-previous]': { display: 'none' },
  '@media (prefers-reduced-motion: reduce)': {
    '&[data-active] > [data-calendar-current]': { animation: 'none' },
    '& > [data-calendar-previous]': { display: 'none' },
  },
  '@keyframes md3-calendar-enter': {
    from: { insetInlineStart: 'var(--_calendar-travel)' },
    to: { insetInlineStart: '0px' },
  },
  '@keyframes md3-calendar-exit': {
    from: { insetInlineStart: '0px' },
    to: { insetInlineStart: 'calc(var(--_calendar-travel) * -1)' },
  },
} satisfies StyleObject;

const loadingStyles = { display: 'grid', minBlockSize: '336px', placeItems: 'center' } satisfies StyleObject;

export const calendarRoot = css`
  ${rootStyles}
`;
export const calendarHeader = css`
  ${headerStyles}
`;
export const calendarTable = css`
  ${tableStyles}
`;
export const calendarWeekdays = css`
  ${weekdaysStyles}
`;
export const calendarDay = css`
  ${dayStyles}
`;
export const calendarChoices = css`
  ${choicesStyles}
`;
export const calendarTransition = css`
  ${transitionStyles}
`;
export const calendarLoading = css`
  ${loadingStyles}
`;
