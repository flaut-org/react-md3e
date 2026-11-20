import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  '--_track-size': '16px',
  '--_handle-size': '44px',
  '--_track-radius': 'var(--md-sys-shape-corner-small, 8px)',
  '--_icon-size': '24px',
  '--_gap': '8px',
  '--_value-origin': '50% calc(100% + 6px)',
  '--_active': color('primary'),
  '--_inactive': color('secondaryContainer'),
  '--_active-stop': color('onPrimary'),
  '--_inactive-stop': color('onSecondaryContainer'),
  'display': 'inline-flex',
  'flexDirection': 'column',
  'boxSizing': 'border-box',
  'inlineSize': '100%',
  'minInlineSize': 120,
  'paddingInline': 24,
  'verticalAlign': 'middle',
  'touchAction': 'pan-y',
  'WebkitTapHighlightColor': 'transparent',
  "&[data-size='small']": { '--_track-size': '24px' },
  "&[data-size='medium']": {
    '--_track-size': '40px',
    '--_handle-size': '52px',
    '--_track-radius': 'var(--md-sys-shape-corner-medium, 12px)',
  },
  "&[data-size='large']": {
    '--_track-size': '56px',
    '--_handle-size': '68px',
    '--_track-radius': 'var(--md-sys-shape-corner-large, 16px)',
  },
  "&[data-size='extraLarge']": {
    '--_track-size': '96px',
    '--_handle-size': '108px',
    '--_track-radius': 'var(--md-sys-shape-corner-extra-large, 28px)',
    '--_icon-size': '32px',
  },
  "&[data-orientation='vertical']": {
    '--_value-origin': '-6px 50%',
    'inlineSize': 'max(48px, var(--_handle-size))',
    'minInlineSize': 0,
    'blockSize': 240,
    'minBlockSize': 120,
    'paddingInline': 0,
    'paddingBlock': 24,
    'touchAction': 'pan-x',
  },
  "&[data-orientation='vertical'][data-md3-slider-direction='rtl']": {
    '--_value-origin': 'calc(100% + 6px) 50%',
  },
  '&[data-disabled]': {
    '--_active': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_inactive': `color-mix(in srgb, ${color('onSurface')} 12%, transparent)`,
    '--_active-stop': color('inverseOnSurface'),
    '--_inactive-stop': color('onSurface'),
  },
  "&[data-has-mark-labels='true'][data-orientation='horizontal']": { paddingBlockEnd: 24 },
  "&[data-has-mark-labels='true'][data-orientation='vertical']": { marginInlineEnd: 48 },
  '&[hidden]': { display: 'none' },
  '@media (forced-colors: active)': {
    '--_active': 'Highlight',
    '--_inactive': 'Canvas',
    '--_active-stop': 'HighlightText',
    '--_inactive-stop': 'ButtonText',
    'forcedColorAdjust': 'none',
    '&[data-disabled]': { '--_active': 'GrayText', '--_active-stop': 'Canvas', '--_inactive-stop': 'GrayText' },
  },
} satisfies StyleObject;

export const sliderRoot = css`
  ${rootStyles}
`;

const labelStyles = {
  ...typography('labelLarge'),
  'color': color('onSurface'),
  'marginBlockEnd': 8,
  '@media (forced-colors: active)': { color: 'CanvasText' },
} satisfies StyleObject;

export const sliderLabel = css`
  ${labelStyles}
`;

const controlStyles = {
  'position': 'relative',
  'inlineSize': '100%',
  'minBlockSize': 'max(48px, var(--_handle-size))',
  'cursor': 'pointer',
  'userSelect': 'none',
  'touchAction': 'pan-y',
  '&[data-orientation="vertical"]': {
    inlineSize: '100%',
    blockSize: '100%',
    minBlockSize: 0,
    flex: '1 1 0',
    touchAction: 'pan-x',
  },
  '&[data-disabled]': { cursor: 'default' },
} satisfies StyleObject;

export const sliderControl = css`
  ${controlStyles}
`;

const trackStyles = {
  'position': 'absolute',
  'zIndex': 0,
  'inset': 0,
  'margin': 'auto',
  'inlineSize': '100%',
  'blockSize': 'var(--_track-size)',
  'pointerEvents': 'none',
  '&:is([data-orientation="vertical"] [data-md3-slider-track])': {
    inlineSize: 'var(--_track-size)',
    blockSize: '100%',
  },
} satisfies StyleObject;

export const sliderTrack = css`
  ${trackStyles}
`;

const segmentStyles = {
  'position': 'absolute',
  'insetInlineStart': 'calc(var(--_from) + var(--_gap-start))',
  'inlineSize': 'max(0px, calc(var(--_to) - var(--_from) - var(--_gap-start) - var(--_gap-end)))',
  'blockSize': '100%',
  'borderStartStartRadius': 'var(--_start-radius)',
  'borderEndStartRadius': 'var(--_start-radius)',
  'borderStartEndRadius': 'var(--_end-radius)',
  'borderEndEndRadius': 'var(--_end-radius)',
  'backgroundColor': 'var(--_inactive)',
  'boxSizing': 'border-box',
  'transition': `background-color ${motion('effects')}`,
  "&[data-active='true']": {
    zIndex: 1,
    backgroundColor: 'var(--_active)',
    containerType: 'size',
    containerName: 'md3-slider-active',
  },
  '&:is([data-orientation="vertical"] [data-md3-slider-segment])': {
    insetInlineStart: 0,
    insetBlockEnd: 'calc(var(--_from) + var(--_gap-start))',
    inlineSize: '100%',
    blockSize: 'max(0px, calc(var(--_to) - var(--_from) - var(--_gap-start) - var(--_gap-end)))',
    borderStartStartRadius: 'var(--_end-radius)',
    borderStartEndRadius: 'var(--_end-radius)',
    borderEndStartRadius: 'var(--_start-radius)',
    borderEndEndRadius: 'var(--_start-radius)',
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { outline: '1px solid var(--_inactive-stop)', outlineOffset: -1 },
} satisfies StyleObject;

export const sliderTrackSegment = css`
  ${segmentStyles}
`;

const stopsStyles = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  borderRadius: 'inherit',
} satisfies StyleObject;

export const sliderStops = css`
  ${stopsStyles}
`;

const stopStyles = {
  '--_stop-offset': 'calc(var(--_mark-fraction) * (100% + var(--_gap-start) + var(--_gap-end)) - var(--_gap-start))',
  'position': 'absolute',
  'insetInlineStart': 'var(--_stop-offset)',
  'insetBlockStart': '50%',
  'marginInlineStart': -2,
  'translate': '0 -50%',
  'inlineSize': 4,
  'blockSize': 4,
  'borderRadius': '50%',
  'backgroundColor': 'var(--_inactive-stop)',
  "&[data-active='true']": { backgroundColor: 'var(--_active-stop)' },
  "&[data-at-start='true']": { '--_stop-offset': 'calc(8px - var(--_gap-start))' },
  "&[data-at-end='true']": { '--_stop-offset': 'calc(100% + var(--_gap-end) - 8px)' },
  "&[data-hidden='true']": { visibility: 'hidden' },
  '&:is([data-orientation="vertical"] [data-md3-slider-stop])': {
    insetInlineStart: '50%',
    insetBlockStart: 'auto',
    insetBlockEnd: 'var(--_stop-offset)',
    translate: '0 50%',
  },
} satisfies StyleObject;

export const sliderStop = css`
  ${stopStyles}
`;

const thumbStyles = {
  'translate': '0 -50%',
  'marginInlineStart': -24,
  'zIndex': 1,
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'inlineSize': 48,
  'blockSize': 'max(48px, var(--_handle-size))',
  'cursor': 'grab',
  'touchAction': 'pan-y',
  'outline': 'none',
  '&:has(input:focus-visible) > [data-md3-slider-handle]': {
    outline: `3px solid ${color('secondary')}`,
    outlineOffset: 3,
  },
  "&[data-active-thumb='true'] > [data-md3-slider-handle], &:has(input:focus-visible) > [data-md3-slider-handle], &[data-dragging]:not([data-disabled]):has(input:focus) > [data-md3-slider-handle]":
    {
      inlineSize: 2,
    },
  '&[data-dragging]': { cursor: 'grabbing' },
  '&[data-disabled]': { cursor: 'default' },
  '&[data-orientation="vertical"]': {
    inlineSize: 'max(48px, var(--_handle-size))',
    blockSize: 48,
    touchAction: 'pan-x',
    translate: '-50% 50%',
    marginInlineStart: 0,
  },
  '&[data-orientation="vertical"] > [data-md3-slider-handle]': { inlineSize: 'var(--_handle-size)', blockSize: 4 },
  '&[data-orientation="vertical"][data-active-thumb="true"] > [data-md3-slider-handle], &[data-orientation="vertical"]:has(input:focus-visible) > [data-md3-slider-handle], &[data-orientation="vertical"][data-dragging]:not([data-disabled]):has(input:focus) > [data-md3-slider-handle]':
    { inlineSize: 'var(--_handle-size)', blockSize: 2 },
  '@media (forced-colors: active)': {
    '&:has(input:focus-visible) > [data-md3-slider-handle]': { outlineColor: 'Highlight' },
  },
} satisfies StyleObject;

export const sliderThumb = css`
  ${thumbStyles}
`;

const handleStyles = {
  'display': 'block',
  'inlineSize': 4,
  'blockSize': 'var(--_handle-size)',
  'borderRadius': '9999px',
  'backgroundColor': 'var(--_active)',
  'pointerEvents': 'none',
  'transition': `width ${motion('spatial')}, height ${motion('spatial')}, background-color ${motion('effects')}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const sliderHandle = css`
  ${handleStyles}
`;

const valueStyles = {
  ...typography('labelLarge'),
  '@property --md3e-slider-value-scale': { syntax: '"<number>"', inherits: 'false', initialValue: 0 },
  '--md3e-slider-value-scale': '0',
  'position': 'absolute',
  'insetBlockEnd': 'calc(50% + var(--_handle-size) / 2 + 12px)',
  'left': '50%',
  'translate': '-50% 0',
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'minInlineSize': 48,
  'minBlockSize': 44,
  'padding': '8px 12px',
  'borderRadius': '9999px',
  'backgroundColor': color('inverseSurface'),
  'color': color('inverseOnSurface'),
  'whiteSpace': 'nowrap',
  'opacity': 0,
  'visibility': 'hidden',
  'transform': 'scale(clamp(0, var(--md3e-slider-value-scale), 1))',
  'transformOrigin': 'var(--_value-origin)',
  'pointerEvents': 'none',
  "&[data-auto='true']": { animation: `md3e-slider-value-grow ${motion('spatial')} both paused` },
  "&[data-open='true']": { '--md3e-slider-value-scale': '1', 'opacity': 1, 'visibility': 'visible' },
  "&[data-present='true']": { opacity: 1, visibility: 'visible' },
  '@keyframes md3e-slider-value-grow': {
    from: { '--md3e-slider-value-scale': '0' },
    to: { '--md3e-slider-value-scale': '1' },
  },
  '&:is([data-orientation="vertical"] [data-md3-slider-value-label])': {
    insetBlockEnd: 'auto',
    insetBlockStart: '50%',
    insetInlineStart: 'calc(50% + var(--_handle-size) / 2 + 12px)',
    left: 'auto',
    translate: '0 -50%',
  },
  '@media (prefers-reduced-motion: reduce)': { "&[data-auto='true']": { animation: 'none' } },
  '@media (forced-colors: active)': { backgroundColor: 'CanvasText', color: 'Canvas' },
} satisfies StyleObject;

export const sliderValueLabel = css`
  ${valueStyles}
`;

const iconStyles = {
  'position': 'absolute',
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'inlineSize': 'var(--_icon-size)',
  'blockSize': 'var(--_icon-size)',
  'fontSize': 'var(--_icon-size)',
  'insetInlineStart': 12,
  'insetBlockStart': '50%',
  'translate': '0 -50%',
  'color': color('onPrimary'),
  'fill': 'currentColor',
  '& > svg': { inlineSize: '100%', blockSize: '100%' },
  "&[data-placement='inactive']": {
    insetInlineStart: 'calc(100% + var(--_gap) * 2 + 12px)',
    color: color('onSecondaryContainer'),
    visibility: 'hidden',
  },
  "&[data-orientation='vertical']": {
    insetInlineStart: '50%',
    insetBlockStart: 'auto',
    insetBlockEnd: 12,
    translate: 'none',
    marginInlineStart: 'calc(var(--_icon-size) / -2)',
  },
  "&[data-orientation='vertical'][data-placement='inactive']": { insetBlockEnd: 'calc(100% + var(--_gap) * 2 + 12px)' },
  '@container md3-slider-active (width < 48px)': {
    "&[data-orientation='horizontal'][data-placement='active']": { visibility: 'hidden' },
    "&[data-orientation='horizontal'][data-placement='inactive']": { visibility: 'visible' },
  },
  '@container md3-slider-active (width < 56px)': {
    "&[data-orientation='horizontal'][data-size='extraLarge'][data-placement='active']": { visibility: 'hidden' },
    "&[data-orientation='horizontal'][data-size='extraLarge'][data-placement='inactive']": { visibility: 'visible' },
  },
  '@container md3-slider-active (height < 48px)': {
    "&[data-orientation='vertical'][data-placement='active']": { visibility: 'hidden' },
    "&[data-orientation='vertical'][data-placement='inactive']": { visibility: 'visible' },
  },
  '@container md3-slider-active (height < 56px)': {
    "&[data-orientation='vertical'][data-size='extraLarge'][data-placement='active']": { visibility: 'hidden' },
    "&[data-orientation='vertical'][data-size='extraLarge'][data-placement='inactive']": { visibility: 'visible' },
  },
  '@media (forced-colors: active)': {
    'color': 'HighlightText',
    "&[data-placement='inactive']": { color: 'ButtonText' },
  },
} satisfies StyleObject;

export const sliderInsetIcon = css`
  ${iconStyles}
`;

const markLabelStyles = {
  ...typography('bodySmall'),
  'position': 'absolute',
  'insetInlineStart': 'var(--_mark-position)',
  'insetBlockStart': 'calc(50% + var(--_handle-size) / 2 + 4px)',
  'inlineSize': 0,
  'color': color('onSurfaceVariant'),
  'whiteSpace': 'nowrap',
  '& > span': { position: 'absolute', left: 0, inlineSize: 'max-content', transform: 'translateX(-50%)' },
  '&:is([data-orientation="vertical"] [data-md3-slider-mark-label])': {
    'insetInlineStart': 'calc(50% + var(--_handle-size) / 2 + 4px)',
    'insetBlockStart': 'auto',
    'insetBlockEnd': 'var(--_mark-position)',
    'translate': '0 50%',
    'inlineSize': 'max-content',
    '& > span': { position: 'static', transform: 'none' },
  },
  '@media (forced-colors: active)': { color: 'CanvasText' },
} satisfies StyleObject;

export const sliderMarkLabel = css`
  ${markLabelStyles}
`;
