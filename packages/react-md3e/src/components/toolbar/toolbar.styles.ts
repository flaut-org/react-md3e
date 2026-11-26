import { css } from '@linaria/core';
import { color, motion, motionDuration } from '../../styles/theme-tokens';
import { elevationShadow, shadowColors } from '../../styles/elevation';
import defaultTheme from '../../theme/default-theme.generated.json';
import type { StyleObject } from '../../styles/style-object.types';

const compactQuery = `@container (width < ${defaultTheme.breakpoints.sm}px)` as const;
const compactStyles = {
  '&:where([data-md3-toolbar][data-align="responsive"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface] > *)':
    { flexGrow: 1, justifyContent: 'space-evenly' },
} satisfies StyleObject;
const responsive: Readonly<Partial<Record<`@container ${string}`, StyleObject>>> = {
  [compactQuery]: compactStyles,
};

// MD3 toolbar tokens v34.0.0; geometry/color provenance and web adaptations: docs/components/toolbar.md.
const rootStyles = {
  ...shadowColors,
  '--_toolbar-container': `var(--md-comp-toolbar-container-color, ${color('surfaceContainer')})`,
  '--_toolbar-content': `var(--md-comp-toolbar-content-color, ${color('primary')})`,
  '--_toolbar-selected-container': `var(--md-comp-toolbar-selected-container-color, ${color('secondaryContainer')})`,
  '--_toolbar-selected-content': `var(--md-comp-toolbar-selected-content-color, ${color('onSecondaryContainer')})`,
  '--_toolbar-fab-container': `var(--md-comp-toolbar-fab-container-color, ${color('secondaryContainer')})`,
  '--_toolbar-fab-content': `var(--md-comp-toolbar-fab-content-color, ${color('onSecondaryContainer')})`,
  '--_toolbar-padding': 'var(--md-comp-toolbar-docked-container-padding, 16px)',
  '--_toolbar-size': 'var(--md-comp-toolbar-container-size, 64px)',
  '--_toolbar-gap': 'var(--md-comp-toolbar-item-spacing, 4px)',
  '--_toolbar-margin': 'var(--md-comp-toolbar-external-margin, 16px)',
  '--_toolbar-shadow': 'none',
  '--_toolbar-radius': 'var(--md-comp-toolbar-docked-container-shape, 0px)',
  '--md-comp-icon-button-standard-color': 'var(--_toolbar-content)',
  '--md-comp-icon-button-standard-selected-color': 'var(--_toolbar-content)',
  '--md-comp-icon-button-tonal-container-color': 'transparent',
  '--md-comp-icon-button-tonal-color': 'var(--_toolbar-content)',
  '--md-comp-icon-button-tonal-selected-container-color': 'var(--_toolbar-selected-container)',
  '--md-comp-icon-button-tonal-selected-color': 'var(--_toolbar-selected-content)',
  '--md-comp-icon-button-filled-unselected-container-color': 'transparent',
  '--md-comp-icon-button-filled-unselected-color': 'var(--_toolbar-content)',
  '--md-comp-button-text-color': 'var(--_toolbar-content)',
  '--md-comp-button-tonal-container-color': 'transparent',
  '--md-comp-button-tonal-color': 'var(--_toolbar-content)',
  '--md-comp-button-tonal-selected-container-color': 'var(--_toolbar-selected-container)',
  '--md-comp-button-tonal-selected-color': 'var(--_toolbar-selected-content)',
  '--md-comp-button-filled-unselected-container-color': 'transparent',
  '--md-comp-button-filled-unselected-color': 'var(--_toolbar-content)',
  '--md-comp-divider-color': color('outlineVariant'),
  'position': 'relative',
  'boxSizing': 'border-box',
  'inlineSize': 'max-content',
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  'color': 'var(--_toolbar-content)',
  'isolation': 'isolate',
  '&[data-color="vibrant"]': {
    '--_toolbar-container': `var(--md-comp-toolbar-container-color, ${color('primaryContainer')})`,
    '--_toolbar-content': `var(--md-comp-toolbar-content-color, ${color('onPrimaryContainer')})`,
    '--_toolbar-selected-container': `var(--md-comp-toolbar-selected-container-color, ${color('surfaceContainer')})`,
    '--_toolbar-selected-content': `var(--md-comp-toolbar-selected-content-color, ${color('onSurface')})`,
    '--_toolbar-fab-container': `var(--md-comp-toolbar-fab-container-color, ${color('tertiaryContainer')})`,
    '--_toolbar-fab-content': `var(--md-comp-toolbar-fab-content-color, ${color('onTertiaryContainer')})`,
  },
  '&[data-variant="docked"][data-full-width="true"]': { inlineSize: '100%', containerType: 'inline-size' },
  '&[data-shape="rounded"]': { '--_toolbar-radius': 'var(--md-sys-shape-corner-large, 16px)' },
  '&[data-dense="true"]': { '--_toolbar-size': '48px' },
  '&[data-variant="floating"]': {
    '--_toolbar-padding': 'var(--md-comp-toolbar-floating-container-padding, 8px)',
    '--_toolbar-radius': 'var(--md-comp-toolbar-floating-container-shape, var(--md-sys-shape-corner-full, 9999px))',
    '--_toolbar-shadow': `var(--md-comp-toolbar-container-shadow, ${elevationShadow(3)})`,
    'margin': 'var(--_toolbar-margin)',
    'maxInlineSize': 'calc(100% - var(--_toolbar-margin) * 2)',
    'maxBlockSize': 'calc(100dvh - var(--_toolbar-margin) * 2)',
  },
  '&[data-has-fab="true"][data-orientation="horizontal"]': { minBlockSize: '80px' },
  '&[data-has-fab="true"][data-orientation="vertical"]': { minInlineSize: '80px' },
  '&[data-variant="floating"][data-orientation="vertical"]': {
    '--_toolbar-margin':
      'var(--md-comp-toolbar-vertical-external-margin, var(--md-comp-toolbar-external-margin, 24px))',
  },
  '&[data-elevation="0"]': { '--_toolbar-shadow': 'none' },
  '&[data-elevation="1"]': { '--_toolbar-shadow': elevationShadow(1) },
  '&[data-elevation="2"]': { '--_toolbar-shadow': elevationShadow(2) },
  '&[data-position="sticky"]': { position: 'sticky', zIndex: 10 },
  '&[data-position="fixed"], &[data-position="absolute"]': {
    'position': 'fixed',
    'zIndex': 10,
    '&[data-position="absolute"]': { position: 'absolute', maxBlockSize: 'calc(100% - var(--_toolbar-margin) * 2)' },
    '&[data-placement="bottom"]': { insetBlockEnd: 0, insetInline: 0, marginInline: 'auto' },
    '&[data-placement="top"]': { insetBlockStart: 0, insetInline: 0, marginInline: 'auto' },
    '&[data-placement="start"]': { insetInlineStart: 0, insetBlock: 0, marginBlock: 'auto', blockSize: 'max-content' },
    '&[data-placement="end"]': { insetInlineEnd: 0, insetBlock: 0, marginBlock: 'auto', blockSize: 'max-content' },
  },
  '&[data-position="sticky"][data-placement="bottom"]': { insetBlockEnd: 0 },
  '&[data-position="sticky"][data-placement="top"]': { insetBlockStart: 0 },
  '&[data-variant="docked"][data-position="fixed"], &[data-variant="docked"][data-position="absolute"]': {
    maxInlineSize: '100%',
  },
  '&[data-variant="floating"][data-placement="bottom"]': {
    marginBlockEnd: 'max(var(--_toolbar-margin), env(safe-area-inset-bottom, 0px))',
  },
  '&[data-variant="floating"][data-placement="top"]': {
    marginBlockStart: 'max(var(--_toolbar-margin), env(safe-area-inset-top, 0px))',
  },
  '& > [data-md3-toolbar-controls] > [data-md3-toolbar-fab]': {
    '--md-comp-fab-container-color': 'var(--_toolbar-fab-container)',
    '--md-comp-fab-color': 'var(--_toolbar-fab-content)',
    '--md-comp-fab-container-size': '56px',
    '--md-comp-fab-container-shape': 'var(--md-sys-shape-corner-large, 16px)',
    '--md-comp-fab-elevation': elevationShadow(2),
    '--md-comp-fab-hover-elevation': elevationShadow(3),
  },
  '&:has(> [data-md3-toolbar-controls][data-expanded="false"]) > [data-md3-toolbar-controls] > [data-md3-toolbar-fab]':
    {
      '--md-comp-fab-container-size': '80px',
      '--md-comp-fab-container-shape': 'var(--md-sys-shape-corner-large-increased, 20px)',
    },
  '@media (forced-colors: active)': {
    '--_toolbar-container': 'Canvas',
    '--_toolbar-content': 'ButtonText',
    '--_toolbar-shadow': 'none',
    '--_toolbar-selected-container': 'Highlight',
    '--_toolbar-selected-content': 'HighlightText',
  },
} satisfies StyleObject;

export const toolbarRoot = css`
  ${rootStyles}
`;

const controlsStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'inlineSize': '100%',
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  'minBlockSize': 'inherit',
  'gap': 'var(--md-comp-toolbar-floating-fab-between-space, 8px)',
  'transition': `translate ${motion('spatial')}, opacity ${motion('effects')}, gap ${motion('spatial')}`,
  '&:where([data-md3-toolbar][data-orientation="vertical"] > *)': { flexDirection: 'column', maxBlockSize: 'inherit' },
  '&:where([data-md3-toolbar][data-fab-position="start"] > *)': { flexDirection: 'row-reverse' },
  '&:where([data-md3-toolbar][data-orientation="vertical"][data-fab-position="start"] > *)': {
    flexDirection: 'column-reverse',
  },
  '&[data-expanded="false"]': { gap: 0 },
  '&[data-hidden="true"]': {
    opacity: 0,
    visibility: 'hidden',
    translate: '0 100%',
    transition: `translate ${motion('spatial')}, opacity ${motion('effects')}, visibility 0s linear ${motionDuration('effects')}`,
  },
  '&:where([data-placement="top"] > *)[data-hidden="true"]': { translate: '0 -100%' },
  '&:where([data-placement="start"] > *)[data-hidden="true"]': { translate: '-100% 0' },
  '&:where([data-placement="end"] > *)[data-hidden="true"]': { translate: '100% 0' },
  '&:where([data-placement="start"] > *):dir(rtl)[data-hidden="true"]': { translate: '100% 0' },
  '&:where([data-placement="end"] > *):dir(rtl)[data-hidden="true"]': { translate: '-100% 0' },
  '@media (prefers-reduced-motion: reduce)': { '&, &[data-hidden="true"]': { transition: 'none' } },
} satisfies StyleObject;

export const toolbarControls = css`
  ${controlsStyles}
`;

const surfaceStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'inlineSize': 'max-content',
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  'minBlockSize': 'var(--_toolbar-size)',
  'flex': '1 1 auto',
  'paddingInline': 'var(--_toolbar-padding)',
  'paddingBlock': 'max(0px, calc((var(--_toolbar-size) - 48px) / 2))',
  'gap': 'var(--_toolbar-gap)',
  'backgroundColor': 'var(--_toolbar-container)',
  'borderRadius': 'var(--_toolbar-radius)',
  'boxShadow': 'var(--_toolbar-shadow)',
  'interpolateSize': 'allow-keywords',
  'transition': `inline-size ${motion('spatial')}, block-size ${motion('spatial')}, padding ${motion('spatial')}, opacity ${motion('effects')}`,
  '&:where([data-md3-toolbar][data-variant="docked"] > [data-md3-toolbar-controls] > *)': {
    inlineSize: '100%',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  '&:where([data-md3-toolbar][data-variant="floating"] > [data-md3-toolbar-controls] > *)': {
    overflowX: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
    justifyContent: 'safe center',
  },
  '&:where([data-md3-toolbar][data-variant="docked"] > [data-md3-toolbar-controls] > *)[data-has-primary="true"]': {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
  },
  '&:where([data-md3-toolbar-controls][data-expanded="false"] > *)': { gap: 0 },
  '&:where([data-md3-toolbar][data-variant="docked"][data-position="fixed"][data-placement="bottom"] > [data-md3-toolbar-controls] > *)':
    {
      paddingBlockEnd: 'max(calc((var(--_toolbar-size) - 48px) / 2), env(safe-area-inset-bottom, 0px))',
    },
  '&:where([data-md3-toolbar][data-align="start"] > [data-md3-toolbar-controls] > *)': { justifyContent: 'start' },
  '&:where([data-md3-toolbar][data-align="end"] > [data-md3-toolbar-controls] > *)': { justifyContent: 'end' },
  '&:where([data-md3-toolbar][data-align="space-between"] > [data-md3-toolbar-controls] > *)': {
    justifyContent: 'space-between',
  },
  '&:where([data-md3-toolbar][data-orientation="vertical"] > [data-md3-toolbar-controls] > *)': {
    flexDirection: 'column',
    minInlineSize: 'var(--_toolbar-size)',
    minBlockSize: 0,
    maxBlockSize: 'inherit',
    paddingBlock: 'var(--_toolbar-padding)',
    paddingInline: 'var(--_toolbar-padding)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
  },
  '&:where([data-md3-toolbar-controls][data-expanded="false"] > *)[data-md3-toolbar-collapsible]': {
    inlineSize: 0,
    minInlineSize: 0,
    minBlockSize: 0,
    padding: 0,
    flex: '0 0 auto',
    opacity: 0,
    overflow: 'clip',
    visibility: 'hidden',
    transition: `inline-size ${motion('spatial')}, block-size ${motion('spatial')}, padding ${motion('spatial')}, opacity ${motion('effects')}, visibility 0s linear ${motionDuration('effects')}`,
  },
  '&:where([data-md3-toolbar][data-orientation="vertical"] > [data-md3-toolbar-controls][data-expanded="false"] > *)[data-md3-toolbar-collapsible]':
    {
      inlineSize: 'auto',
      blockSize: 0,
    },
  '@media (forced-colors: active)': { outline: '1px solid CanvasText' },
  '@media (prefers-reduced-motion: reduce)': { '&, &[data-md3-toolbar-collapsible]': { transition: 'none' } },
} satisfies StyleObject;

export const toolbarSurface = css`
  ${surfaceStyles}
`;

const regionStyles = {
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'gap': 'var(--_toolbar-gap)',
  'inlineSize': 'max-content',
  'maxInlineSize': '100%',
  'minInlineSize': 0,
  'interpolateSize': 'allow-keywords',
  'transition': `inline-size ${motion('spatial')}, block-size ${motion('spatial')}, opacity ${motion('effects')}`,
  '&[data-md3-toolbar-region="leading"]': { marginInlineEnd: 'auto' },
  '&[data-md3-toolbar-region="trailing"]': { marginInlineStart: 'auto' },
  '&:where([data-md3-toolbar][data-variant="docked"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface][data-has-primary="true"] > *)[data-md3-toolbar-region="leading"]':
    {
      gridColumn: 1,
      justifyContent: 'start',
      margin: 0,
    },
  '&:where([data-md3-toolbar][data-variant="docked"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface][data-has-primary="true"] > *)[data-md3-toolbar-region="primary"]':
    {
      gridColumn: 2,
    },
  '&:where([data-md3-toolbar][data-variant="docked"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface][data-has-primary="true"] > *)[data-md3-toolbar-region="trailing"]':
    {
      gridColumn: 3,
      justifyContent: 'end',
    },
  '&:where([data-md3-toolbar][data-variant="docked"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface] > *)': {
    flexWrap: 'wrap',
    columnGap: 'var(--md-comp-toolbar-docked-item-spacing, 8px)',
    rowGap: 8,
  },
  '&:where([data-md3-toolbar][data-orientation="vertical"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface] > *)':
    { flexDirection: 'column', marginInline: 0 },
  '&:where([data-md3-toolbar][data-variant="floating"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface] > *)':
    { justifyContent: 'safe center', alignItems: 'safe center' },
  '&:where([data-md3-toolbar][data-orientation="vertical"] > [data-md3-toolbar-controls] > [data-md3-toolbar-surface] > *) > [data-md3-button]':
    {
      marginBlock: 'max(0px, calc((48px - var(--_height, 40px)) / 2))',
    },
  '&:where([data-md3-toolbar-controls][data-expanded="false"] > [data-md3-toolbar-surface] > *)[data-md3-toolbar-collapsible]':
    {
      inlineSize: 0,
      minInlineSize: 0,
      opacity: 0,
      overflow: 'clip',
      visibility: 'hidden',
      margin: 0,
      transition: `inline-size ${motion('spatial')}, block-size ${motion('spatial')}, opacity ${motion('effects')}, visibility 0s linear ${motionDuration('effects')}`,
    },
  '&:where([data-md3-toolbar][data-orientation="vertical"] > [data-md3-toolbar-controls][data-expanded="false"] > [data-md3-toolbar-surface] > *)[data-md3-toolbar-collapsible]':
    {
      inlineSize: 'auto',
      blockSize: 0,
    },
  ...responsive,
  '@media (prefers-reduced-motion: reduce)': { '&, &[data-md3-toolbar-collapsible]': { transition: 'none' } },
} satisfies StyleObject;

export const toolbarRegion = css`
  ${regionStyles}
`;

const fabStyles = {
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
} satisfies StyleObject;

export const toolbarFab = css`
  ${fabStyles}
`;
