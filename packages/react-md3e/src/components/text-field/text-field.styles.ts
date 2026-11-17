import { css } from '@linaria/core';
import { motion, color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const floating =
  "&:not([data-shrink='false']):is(:focus-within, :has([data-md3-field-input]:not(:placeholder-shown)), :has([data-md3-field-input]:autofill), [data-shrink='true'])";
const rootStyles = {
  '--_field-outline': color('outline'),
  '--_field-label': color('onSurfaceVariant'),
  '--_field-text': color('onSurface'),
  '--_field-support': color('onSurfaceVariant'),
  '--_field-caret': color('primary'),
  '--_field-width': '1px',
  '--_field-placeholder-opacity': 0,
  '--_field-placeholder-color': color('onSurfaceVariant'),
  'display': 'inline-flex',
  'flexDirection': 'column',
  'verticalAlign': 'top',
  'inlineSize': 280,
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  "&[data-full-width='true']": { inlineSize: '100%' },
  '&:focus-within': {
    '--_field-outline': color('primary'),
    '--_field-label': color('primary'),
    '--_field-width': '2px',
  },
  "&[data-error='true']": {
    '--_field-outline': color('error'),
    '--_field-label': color('error'),
    '--_field-support': color('error'),
    '--_field-caret': color('error'),
  },
  '& [data-md3-field-label]': { color: 'var(--_field-label)' },
  [floating]: {
    '--_field-placeholder-opacity': 1,
    '& [data-md3-field-label]': { insetBlockStart: 0, insetInlineStart: 16, ...typography('bodySmall') },
    '& legend': { maxInlineSize: '100%', paddingInline: 4 },
  },
  "&[data-has-start='true'] [data-md3-field-label]": { insetInlineStart: 52 },
  "&[data-has-start='true']:not([data-shrink='false']):is(:focus-within, :has([data-md3-field-input]:not(:placeholder-shown)), [data-shrink='true']) [data-md3-field-label]":
    { insetInlineStart: 16 },
  "&[data-variant='filled']": {
    '--_field-outline': color('onSurfaceVariant'),
    '& [data-md3-field-container]': {
      backgroundColor: color('surfaceContainerHighest'),
      borderEndStartRadius: 0,
      borderEndEndRadius: 0,
    },
    '& [data-md3-field-container]::after': {
      content: "''",
      position: 'absolute',
      insetInline: 0,
      insetBlockEnd: 0,
      borderBlockEnd: 'var(--_field-width) solid var(--_field-outline)',
      pointerEvents: 'none',
    },
    "&[data-has-label='true'] [data-md3-field-input]": { paddingBlock: '24px 8px' },
    [floating]: { '& [data-md3-field-label]': { insetBlockStart: 8, transform: 'none' } },
    "&[data-has-start='true'] [data-md3-field-label]": { insetInlineStart: 52 },
    '&:focus-within': { '--_field-outline': color('primary') },
    "&[data-error='true']": { '--_field-outline': color('error') },
  },
  "&[data-has-label='false'] fieldset": { insetBlockStart: 0 },
  "&[data-has-label='false'] legend": { display: 'none' },
  "&[data-has-label='false']": { '--_field-placeholder-opacity': 1 },
  "&[data-multiline='true'] [data-md3-field-container]": { alignItems: 'flex-start' },
  "&[data-multiline='true'] [data-md3-field-label]": { insetBlockStart: 28 },
  "&[data-multiline='true']:not([data-shrink='false']):is(:focus-within, :has([data-md3-field-input]:not(:placeholder-shown)), [data-shrink='true']) [data-md3-field-label]":
    { insetBlockStart: 0 },
  "&[data-multiline='true'][data-variant='filled']:not([data-shrink='false']):is(:focus-within, :has([data-md3-field-input]:not(:placeholder-shown)), [data-shrink='true']) [data-md3-field-label]":
    { insetBlockStart: 8 },
  '@media (hover: hover)': {
    "&:hover:not([data-disabled='true']):not(:focus-within)": { '--_field-outline': color('onSurface') },
    "&[data-error='true']:hover:not([data-disabled='true']):not(:focus-within)": {
      '--_field-outline': color('onErrorContainer'),
      '--_field-label': color('onErrorContainer'),
    },
  },
  "&[data-disabled='true']": {
    '--_field-outline': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
    '--_field-label': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_field-text': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_field-placeholder-color': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_field-support': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_field-width': '1px',
    '& [data-md3-field-container]': { cursor: 'default' },
    '& [data-md3-field-leading], & [data-md3-field-trailing]': { color: 'var(--_field-text)' },
  },
  "&[data-disabled='true'][data-variant='filled']": {
    '--_field-outline': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '& [data-md3-field-container]': { backgroundColor: `color-mix(in srgb, ${color('onSurface')} 4%, transparent)` },
  },
  '@media (prefers-reduced-motion: reduce)': { '& [data-md3-field-label]': { transition: 'none' } },
  '@media (forced-colors: active)': {
    '--_field-outline': 'CanvasText',
    '--_field-label': 'CanvasText',
    '--_field-text': 'CanvasText',
    '--_field-support': 'CanvasText',
    '--_field-caret': 'CanvasText',
    '--_field-placeholder-color': 'CanvasText',
    '&:focus-within': { '--_field-outline': 'Highlight', '--_field-label': 'Highlight' },
    "&[data-error='true']": {
      '--_field-outline': 'CanvasText',
      '--_field-label': 'CanvasText',
      '--_field-support': 'CanvasText',
    },
    "&[data-disabled='true']": {
      '--_field-outline': 'GrayText',
      '--_field-label': 'GrayText',
      '--_field-text': 'GrayText',
      '--_field-placeholder-color': 'GrayText',
      '--_field-support': 'GrayText',
    },
    '& [data-md3-field-container]': { backgroundColor: 'Canvas' },
  },
} satisfies StyleObject;

export const textFieldRoot = css`
  ${rootStyles}
`;

const containerStyles = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minBlockSize: 56,
  boxSizing: 'border-box',
  paddingInline: 16,
  borderRadius: 'var(--md-sys-shape-corner-extra-small, 4px)',
  color: 'var(--_field-text)',
  cursor: 'text',
  minInlineSize: 0,
} satisfies StyleObject;

export const textFieldContainer = css`
  ${containerStyles}
`;

const inputStyles = {
  ...typography('bodyLarge'),
  'display': 'block',
  'flex': '1 1 0%',
  'inlineSize': '100%',
  'minInlineSize': 0,
  'boxSizing': 'border-box',
  'padding': '16px 0',
  'margin': 0,
  'border': 0,
  'outline': 'none',
  'borderRadius': 0,
  'color': 'var(--_field-text)',
  'WebkitTextFillColor': 'var(--_field-text)',
  'caretColor': 'var(--_field-caret)',
  'backgroundColor': 'transparent',
  'resize': 'vertical',
  '&::placeholder': {
    color: 'var(--_field-placeholder-color)',
    WebkitTextFillColor: 'var(--_field-placeholder-color)',
    opacity: 'var(--_field-placeholder-opacity)',
  },
  '&:disabled': { cursor: 'default' },
} satisfies StyleObject;

export const textFieldInput = css`
  ${inputStyles}
`;

const labelStyles = {
  ...typography('bodyLarge'),
  position: 'absolute',
  insetInlineStart: 16,
  insetBlockStart: '50%',
  transform: 'translateY(-50%)',
  maxInlineSize: 'calc(100% - 32px)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  pointerEvents: 'none',
  transition: `inset-block-start ${motion('spatial')}, inset-inline-start ${motion('spatial')}, transform ${motion('spatial')}, font-size ${motion('spatial')}, line-height ${motion('spatial')}, letter-spacing ${motion('spatial')}, color ${motion('effects')}`,
} satisfies StyleObject;

export const textFieldLabel = css`
  ${labelStyles}
`;

const outlineStyles = {
  'position': 'absolute',
  'inset': 0,
  'insetBlockStart': 'calc(var(--md-sys-typescale-body-small-line-height, 1rem) / -2)',
  'margin': 0,
  'padding': '0 12px',
  'border': 'var(--_field-width) solid var(--_field-outline)',
  'borderRadius': 'inherit',
  'pointerEvents': 'none',
  'minInlineSize': 0,
  '& legend': {
    ...typography('bodySmall'),
    height: 'var(--md-sys-typescale-body-small-line-height, 1rem)',
    maxInlineSize: 0,
    padding: 0,
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  '& legend > span': { padding: 0 },
} satisfies StyleObject;

export const textFieldOutline = css`
  ${outlineStyles}
`;

const adornmentStyles = {
  ...typography('bodyLarge'),
  'display': 'inline-flex',
  'alignItems': 'center',
  'gap': 4,
  'flexShrink': 0,
  'color': color('onSurfaceVariant'),
  '& > svg': { inlineSize: 24, blockSize: 24, fill: 'currentColor' },
} satisfies StyleObject;

export const textFieldAdornment = css`
  ${adornmentStyles}
`;

const helperStyles = {
  ...typography('bodySmall'),
  color: 'var(--_field-support)',
  margin: '4px 16px 0',
  overflowWrap: 'anywhere',
} satisfies StyleObject;

export const textFieldHelper = css`
  ${helperStyles}
`;
