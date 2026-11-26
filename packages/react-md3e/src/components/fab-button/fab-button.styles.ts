import { css } from '@linaria/core';
import { color, motion, typography } from '../../styles/theme-tokens';
import { elevationShadow, shadowColors } from '../../styles/elevation';
import type { StyleObject } from '../../styles/style-object.types';

const styles = {
  '&[data-md3-fab-button]': {
    ...shadowColors,
    ...typography('titleMedium'),
    '--_height': '56px',
    '--_icon': '24px',
    '--_padding': '16px',
    '--_gap': '8px',
    '--_outline-width': '0px',
    '--_radius': 'var(--md-sys-shape-corner-large, 16px)',
    '--_pressed': 'var(--_radius)',
    '--_bg': `var(--md-comp-fab-container-color, ${color('primaryContainer')})`,
    '--_fg': `var(--md-comp-fab-color, ${color('onPrimaryContainer')})`,
    '--_elevation': `var(--md-comp-fab-elevation, ${elevationShadow(3)})`,
    'minInlineSize': 0,
    'inlineSize': 'max-content',
    'interpolateSize': 'allow-keywords',
    'transition': `inline-size ${motion('spatial')}, block-size ${motion('spatial')}, padding-inline ${motion('spatial')}, gap ${motion('spatial')}, border-radius ${motion('spatial')}, box-shadow ${motion('effects')}, background-color ${motion('effects')}, color ${motion('effects')}`,
    '&::after': { insetInline: 'min(0px, calc((100% - 48px) / 2))' },
    '&[data-fab-size="small"]': {
      '--_height': '40px',
      '--_radius': 'var(--md-sys-shape-corner-medium, 12px)',
    },
    '&[data-fab-size="medium"]': {
      ...typography('titleLarge'),
      '--_height': '80px',
      '--_icon': '28px',
      '--_padding': '26px',
      '--_gap': '12px',
      '--_radius': 'var(--md-sys-shape-corner-large-increased, 20px)',
    },
    '&[data-fab-size="large"]': {
      ...typography('headlineSmall'),
      '--_height': '96px',
      '--_icon': '36px',
      '--_padding': '28px',
      '--_gap': '16px',
      '--_radius': 'var(--md-sys-shape-corner-extra-large, 28px)',
    },
    '&[data-fab-color="secondaryContainer"]': {
      '--_bg': `var(--md-comp-fab-container-color, ${color('secondaryContainer')})`,
      '--_fg': `var(--md-comp-fab-color, ${color('onSecondaryContainer')})`,
    },
    '&[data-fab-color="tertiaryContainer"]': {
      '--_bg': `var(--md-comp-fab-container-color, ${color('tertiaryContainer')})`,
      '--_fg': `var(--md-comp-fab-color, ${color('onTertiaryContainer')})`,
    },
    '&[data-fab-color="primary"]': {
      '--_bg': `var(--md-comp-fab-container-color, ${color('primary')})`,
      '--_fg': `var(--md-comp-fab-color, ${color('onPrimary')})`,
    },
    '&[data-fab-color="secondary"]': {
      '--_bg': `var(--md-comp-fab-container-color, ${color('secondary')})`,
      '--_fg': `var(--md-comp-fab-color, ${color('onSecondary')})`,
    },
    '&[data-fab-color="tertiary"]': {
      '--_bg': `var(--md-comp-fab-container-color, ${color('tertiary')})`,
      '--_fg': `var(--md-comp-fab-color, ${color('onTertiary')})`,
    },
    '&[data-fab-color="surface"]': {
      '--_bg': `var(--md-comp-fab-container-color, ${color('surfaceContainerHigh')})`,
      '--_fg': `var(--md-comp-fab-color, ${color('primary')})`,
    },
    '&[data-md3-fab][data-fab-size="regular"]': {
      '--_height': 'var(--md-comp-fab-container-size, 56px)',
      '--_radius': 'var(--md-comp-fab-container-shape, var(--md-sys-shape-corner-large, 16px))',
    },
    '&[data-lowered="true"]': { '--_elevation': elevationShadow(1) },
    '&[data-icon-only="true"]': { inlineSize: 'var(--_height)', paddingInline: 0, gap: 0 },
    '&:disabled, &[aria-disabled="true"]': {
      '--_bg': `color-mix(in srgb, ${color('onSurface')} 10%, transparent)`,
      '--_fg': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
      '--_elevation': 'none',
    },
    '& > span:not([aria-hidden]):last-child': { minInlineSize: 0, overflow: 'clip' },
    '& [data-md3-fab-icon]': {
      display: 'grid',
      placeItems: 'center',
      inlineSize: 'var(--_icon)',
      blockSize: 'var(--_icon)',
      fontSize: 'var(--_icon)',
    },
    '& [data-md3-fab-icon] > svg': { inlineSize: '100%', blockSize: '100%', fill: 'currentColor' },
    '@media (hover: hover)': {
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        '--_elevation': `var(--md-comp-fab-hover-elevation, ${elevationShadow(4)})`,
      },
      '&[data-lowered="true"]:hover:not(:disabled):not([aria-disabled="true"])': {
        '--_elevation': elevationShadow(2),
      },
    },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    '@media (forced-colors: active)': {
      'outline': '1px solid ButtonText',
      'outlineOffset': -1,
      'backgroundColor': 'ButtonFace',
      'color': 'ButtonText',
      '&:disabled, &[aria-disabled="true"]': { color: 'GrayText', outlineColor: 'GrayText' },
      '&:focus-visible': { outline: '3px solid Highlight', outlineOffset: 3 },
    },
  },
} satisfies StyleObject;

export const fabButton = css`
  ${styles}
`;
