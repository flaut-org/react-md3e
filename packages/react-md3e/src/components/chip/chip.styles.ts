import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const elevation1 = `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 1px 3px color-mix(in srgb, ${color('shadow')} 15%, transparent)`;
const elevation2 = `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 2px 6px color-mix(in srgb, ${color('shadow')} 15%, transparent)`;
const elevation4 = `0 4px 4px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 6px 10px 4px color-mix(in srgb, ${color('shadow')} 15%, transparent)`;

const rootStyles = {
  ...typography('labelLarge'),
  '--_chip-spatial-motion': motion('spatial'),
  '--_chip-effects-motion': motion('effects'),
  '--_outline-width': '1px',
  '--_chip-bg': 'transparent',
  '--_chip-fg': color('onSurfaceVariant'),
  '--_chip-icon': color('primary'),
  '--_chip-leading-icon': 'var(--_chip-icon)',
  '--_chip-border': color('outlineVariant'),
  '--_chip-elevation': 'none',
  '--_chip-radius': 'var(--md-sys-shape-corner-small, 8px)',
  '--_chip-start': '16px',
  '--_chip-end': '16px',
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'boxSizing': 'border-box',
  'blockSize': 32,
  'maxInlineSize': '100%',
  'minInlineSize': 48,
  'flexShrink': 0,
  'verticalAlign': 'middle',
  'border': '1px solid var(--_chip-border)',
  'borderRadius': 'var(--_chip-radius)',
  'backgroundColor': 'var(--_chip-bg)',
  'color': 'var(--_chip-fg)',
  'boxShadow': 'var(--_chip-elevation)',
  'isolation': 'isolate',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: -1,
    borderRadius: 'inherit',
    backgroundColor: 'var(--_chip-fg)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity var(--_chip-effects-motion)',
  },
  'transition': `border-radius var(--_chip-spatial-motion), background-color var(--_chip-effects-motion), color var(--_chip-effects-motion), box-shadow var(--_chip-effects-motion)`,
  "&[data-kind='assist']": { '--_chip-fg': color('onSurface') },
  "&[data-kind='input']": { '--_chip-icon': color('onSurfaceVariant'), '--_chip-start': '12px', '--_chip-end': '12px' },
  "&[data-variant='elevated']": {
    '--_chip-bg': color('surfaceContainerLow'),
    '--_chip-border': 'transparent',
    '--_chip-elevation': elevation1,
  },
  "&[data-leading-icon='true'], &[data-kind='filter'][data-selected='true']": { '--_chip-start': '8px' },
  "&[data-avatar='true']": { '--_chip-start': '4px' },
  "&[data-trailing-icon='true']": { '--_chip-end': '8px' },
  "&[data-removable='true']": { '--_chip-end': '0px' },
  "&[data-selected='true']": {
    '--_chip-bg': color('secondaryContainer'),
    '--_chip-fg': color('onSecondaryContainer'),
    '--_chip-icon': color('onSecondaryContainer'),
    '--_chip-border': 'transparent',
  },
  "&[data-kind='input'][data-selected='true']": { '--_chip-leading-icon': color('primary') },
  "&[data-shape='expressive']": { '--_chip-radius': 'var(--md-sys-shape-corner-medium, 12px)' },
  "&[data-shape='expressive'][data-selected='true']": {
    '--_chip-radius': 'min(var(--md-sys-shape-corner-full, 9999px), 16px)',
  },
  "&[data-shape='expressive']:has(> button:active:not(:disabled):not([aria-disabled='true']))": {
    '--_chip-radius': 'var(--md-sys-shape-corner-small, 8px)',
  },
  '&:focus-visible, &:has(> [data-md3-chip-action]:focus-visible)': {
    outline: `3px solid ${color('secondary')}`,
    outlineOffset: 2,
  },
  "&:focus-visible::before, &:has(> button:focus-visible:not(:disabled):not([aria-disabled='true']))::before": {
    opacity: 0.1,
  },
  "&[data-kind='input']:has(> button:is(:focus-visible, :active))": {
    '--_chip-leading-icon': color('primary'),
  },
  "&[data-variant='outlined']:not([data-selected='true']):has(> button:focus-visible), &:focus-visible": {
    '--_chip-border': color('onSurfaceVariant'),
  },
  "&[data-kind='assist'][data-variant='outlined']:has(> button:focus-visible)": {
    '--_chip-border': color('onSurface'),
  },
  "&[data-dragged='true']:not([data-disabled='true'])": { '--_chip-elevation': elevation4 },
  "&[data-dragged='true']::after": {
    content: "''",
    position: 'absolute',
    inset: -1,
    borderRadius: 'inherit',
    backgroundColor: 'var(--_chip-fg)',
    opacity: 0.16,
    pointerEvents: 'none',
  },
  "&[data-kind='input'][data-dragged='true']": {
    '--_chip-icon': color('primary'),
    '--_chip-leading-icon': 'var(--_chip-fg)',
  },
  '@media (hover: hover)': {
    "&[data-variant='elevated']:hover:not([data-disabled='true']):not(:has(> button:disabled))": {
      '--_chip-elevation': elevation2,
    },
    "&[data-kind='filter'][data-variant='outlined'][data-selected='true']:hover:not([data-disabled='true']):not(:has(> button:disabled))":
      {
        '--_chip-elevation': elevation1,
      },
    "&[data-kind='input']:hover:not([data-selected='true']):not([data-disabled='true']):not([data-read-only='true'])": {
      '--_chip-leading-icon': color('primary'),
    },
    "&[data-dragged='true']:not([data-disabled='true'])": { '--_chip-elevation': elevation4 },
  },
  "&[data-variant='elevated']:has(> button:is(:active, :focus-visible))": { '--_chip-elevation': elevation1 },
  "&[data-kind='filter'][data-variant='outlined']:has(> button:is(:active, :focus-visible))": {
    '--_chip-elevation': 'none',
  },
  "&[data-disabled='true'], &:has(> button:disabled), &:is([data-md3-chip-set][data-disabled] [data-md3-chip])": {
    '--_chip-fg': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_chip-icon': 'var(--_chip-fg)',
    '--_chip-leading-icon': 'var(--_chip-fg)',
    '--_chip-border': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
    '--_chip-elevation': 'none',
    "&[data-variant='elevated'], &[data-selected='true']": {
      '--_chip-bg': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
      '--_chip-border': 'transparent',
    },
    '& [data-md3-chip-avatar]': { opacity: 0.38 },
    '&::before, &::after': { display: 'none' },
  },
  "&[data-kind='filter'] [data-md3-chip-original-icon]": { opacity: 1 },
  '& [data-md3-chip-check]': { position: 'absolute', inset: 0, opacity: 0 },
  "&[data-kind='filter'][data-selected='true'] [data-md3-chip-original-icon]": { opacity: 0 },
  "&[data-kind='filter'][data-selected='true'] [data-md3-chip-check]": { opacity: 1 },
  "&[data-kind='filter'][data-leading-icon='false']:not([data-selected='true']) [data-md3-chip-leading]": {
    gridTemplateColumns: '0fr',
    marginInlineEnd: -8,
    opacity: 0,
  },
  '@media (prefers-reduced-motion: reduce)': { '&, &::before': { transition: 'none' } },
  '@media (forced-colors: active)': {
    '--_chip-bg': 'Canvas',
    '--_chip-fg': 'ButtonText',
    '--_chip-icon': 'ButtonText',
    '--_chip-border': 'ButtonText',
    'forcedColorAdjust': 'none',
    "&[data-kind='assist'], &[data-kind='input'], &[data-variant='elevated']": {
      '--_chip-bg': 'Canvas',
      '--_chip-fg': 'ButtonText',
      '--_chip-icon': 'ButtonText',
      '--_chip-leading-icon': 'ButtonText',
      '--_chip-border': 'ButtonText',
      '--_chip-elevation': 'none',
    },
    "&[data-selected='true'], &[data-kind='input'][data-selected='true']": {
      '--_chip-bg': 'Highlight',
      '--_chip-fg': 'HighlightText',
      '--_chip-icon': 'HighlightText',
      '--_chip-leading-icon': 'HighlightText',
    },
    "&[data-disabled='true'], &:has(> button:disabled), &:is([data-md3-chip-set][data-disabled] [data-md3-chip])": {
      '--_chip-bg': 'Canvas',
      '--_chip-fg': 'GrayText',
      '--_chip-icon': 'GrayText',
      '--_chip-leading-icon': 'GrayText',
      '--_chip-border': 'GrayText',
    },
    '&:focus-visible, &:has(> [data-md3-chip-action]:focus-visible)': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;

export const chipRoot = css`
  ${rootStyles}
`;

const controlStyles = {
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'blockSize': '100%',
  'paddingBlock': 0,
  'border': 0,
  'borderRadius': 'inherit',
  'background': 'transparent',
  'color': 'inherit',
  'font': 'inherit',
  'letterSpacing': 'inherit',
  'textDecoration': 'none',
  'appearance': 'none',
  'cursor': 'pointer',
  'touchAction': 'manipulation',
  'WebkitTapHighlightColor': 'transparent',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: -1,
    borderRadius: 'inherit',
    backgroundColor: 'currentColor',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity var(--_chip-effects-motion)`,
  },
  // Keep a 48px touch target around the 32px visual container.
  '&::after': { content: "''", position: 'absolute', insetInline: 0, insetBlock: -9 },
  '&:focus-visible': { outline: 'none' },
  "&:active:not(:disabled):not([aria-disabled='true']):not(:has([data-md3-ripple-ink]))::before": { opacity: 0.1 },
  "&:disabled, &[aria-disabled='true']": { cursor: 'default' },
  '@media (hover: hover)': {
    "&:hover:not(:disabled):not([aria-disabled='true']):not(:focus-visible)::before": { opacity: 0.08 },
    "&:active:not(:disabled):not([aria-disabled='true']):not(:has([data-md3-ripple-ink]))::before": { opacity: 0.1 },
  },
  '@media (prefers-reduced-motion: reduce)': { '&::before': { transition: 'none' } },
  '@media (forced-colors: active)': { '&:focus-visible': { outlineColor: 'Highlight' } },
} satisfies StyleObject;

const actionStyles = {
  ...controlStyles,
  'flex': '1 1 auto',
  'gap': 8,
  'minInlineSize': 24,
  // The 1px border counts toward MD3's outer-edge content padding.
  'paddingInline': 'calc(var(--_chip-start) - 1px) calc(var(--_chip-end) - 1px)',
  '&:not(:last-child)': {
    paddingInlineEnd: 0,
  },
  // Primary actions highlight the entire chip, including its trailing icon. Keep the touch
  // target on the primary button so it cannot intercept the independent delete action.
  '&:not(:last-child)::before, &:not(:last-child) > [data-md3-chip-ripple-surface]': { insetInlineEnd: -34 },
  '&[data-md3-chip-passive]': { cursor: 'default' },
  '&[data-md3-chip-passive]::before, &[data-md3-chip-passive]::after': { display: 'none' },
} satisfies StyleObject;

export const chipAction = css`
  ${actionStyles}
`;

const deleteStyles = {
  ...controlStyles,
  'flex': '0 0 33px',
  'inlineSize': 33,
  'paddingInline': '8px 7px',
  'color': 'var(--_chip-icon)',
  // The invisible hit area stays separate from the 24px circular icon-button surface.
  '&::before': { display: 'none', opacity: 0 },
  '&:focus-visible > [data-md3-chip-delete-surface]': {
    outline: `3px solid ${color('secondary')}`,
    outlineOffset: 0,
  },
  '@media (hover: hover)': {
    "&:hover:not(:disabled):not([aria-disabled='true']):not(:focus-visible) > [data-md3-chip-delete-surface]::before": {
      opacity: 0.08,
    },
    "&:active:not(:disabled):not([aria-disabled='true']):not(:has([data-md3-ripple-ink])) > [data-md3-chip-delete-surface]::before":
      { opacity: 0.1 },
  },
  "&:active:not(:disabled):not([aria-disabled='true']):not(:has([data-md3-ripple-ink])) > [data-md3-chip-delete-surface]::before":
    { opacity: 0.1 },
  '@media (forced-colors: active)': {
    '&:focus-visible > [data-md3-chip-delete-surface]': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;

export const chipDelete = css`
  ${deleteStyles}
`;

const deleteSurfaceStyles = {
  '--_outline-width': '0px',
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'flexShrink': 0,
  'inlineSize': 24,
  'blockSize': 24,
  'borderRadius': '50%',
  'pointerEvents': 'none',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: 'currentColor',
    opacity: 0,
    transition: 'opacity var(--_chip-effects-motion)',
  },
  '@media (prefers-reduced-motion: reduce)': { '&::before': { transition: 'none' } },
} satisfies StyleObject;

export const chipDeleteSurface = css`
  ${deleteSurfaceStyles}
`;

const leadingStyles = {
  'display': 'grid',
  'gridTemplateColumns': '1fr',
  'flexShrink': 0,
  'color': 'var(--_chip-leading-icon)',
  'transition': `grid-template-columns var(--_chip-spatial-motion), margin-inline-end var(--_chip-spatial-motion), opacity var(--_chip-effects-motion)`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const chipLeading = css`
  ${leadingStyles}
`;

const iconFrameStyles = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  minInlineSize: 0,
  overflow: 'hidden',
} satisfies StyleObject;

export const chipIconFrame = css`
  ${iconFrameStyles}
`;

const glyphStyles = {
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'flexShrink': 0,
  'inlineSize': 18,
  'blockSize': 18,
  'fontSize': 18,
  'lineHeight': 1,
  'fill': 'currentColor',
  'transition': `opacity var(--_chip-effects-motion)`,
  '& > svg': { display: 'block', inlineSize: '100%', blockSize: '100%' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const chipGlyph = css`
  ${glyphStyles}
`;

const avatarStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'inlineSize': 24,
  'blockSize': 24,
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  'overflow': 'hidden',
  'fontSize': 12,
  'backgroundColor': color('primaryContainer'),
  'color': color('onPrimaryContainer'),
  '& > *': { inlineSize: '100%', blockSize: '100%', objectFit: 'cover', fontSize: 'inherit' },
} satisfies StyleObject;

export const chipAvatar = css`
  ${avatarStyles}
`;

const labelStyles = {
  display: 'block',
  minInlineSize: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} satisfies StyleObject;

export const chipLabel = css`
  ${labelStyles}
`;

const trailingStyles = { ...glyphStyles, color: 'var(--_chip-icon)' } satisfies StyleObject;

export const chipTrailing = css`
  ${trailingStyles}
`;

const setStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'flexWrap': 'wrap',
  'columnGap': 8,
  'rowGap': 16,
  'paddingBlock': 8,
  '&[aria-orientation="vertical"]': { flexDirection: 'column', alignItems: 'flex-start' },
  '&:focus-visible': { outline: `3px solid ${color('secondary')}`, outlineOffset: 3 },
} satisfies StyleObject;

export const chipSet = css`
  ${setStyles}
`;
