import { css } from '@linaria/core';
import { color, typography } from '../../styles/theme-tokens';
import { surfaceColorStyles } from '../../styles/surface-colors';
import { elevationShadow, shadowColors } from '../../styles/elevation';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  ...typography('bodyLarge'),
  ...shadowColors,
  ...surfaceColorStyles(),
  'display': 'block',
  'boxSizing': 'border-box',
  'minInlineSize': 0,
  'border': '0 solid transparent',
  'borderRadius': 'var(--md-sys-shape-corner-medium, 12px)',
  'backgroundColor': color('surface'),
  'color': color('onSurface'),
  'boxShadow': 'none',
  "&[data-shape='none']": { borderRadius: 0 },
  "&[data-shape='extraSmall']": { borderRadius: 'var(--md-sys-shape-corner-extra-small, 4px)' },
  "&[data-shape='small']": { borderRadius: 'var(--md-sys-shape-corner-small, 8px)' },
  "&[data-shape='large']": { borderRadius: 'var(--md-sys-shape-corner-large, 16px)' },
  "&[data-shape='largeIncreased']": { borderRadius: 'var(--md-sys-shape-corner-large-increased, 20px)' },
  "&[data-shape='extraLarge']": { borderRadius: 'var(--md-sys-shape-corner-extra-large, 28px)' },
  "&[data-shape='extraLargeIncreased']": { borderRadius: 'var(--md-sys-shape-corner-extra-large-increased, 32px)' },
  "&[data-shape='extraExtraLarge']": { borderRadius: 'var(--md-sys-shape-corner-extra-extra-large, 48px)' },
  "&[data-shape='full']": { borderRadius: 'var(--md-sys-shape-corner-full, 9999px)' },
  "&[data-elevation='1']": { boxShadow: elevationShadow(1) },
  "&[data-elevation='2']": { boxShadow: elevationShadow(2) },
  "&[data-elevation='3']": { boxShadow: elevationShadow(3) },
  "&[data-elevation='4']": { boxShadow: elevationShadow(4) },
  "&[data-elevation='5']": { boxShadow: elevationShadow(5) },
  "&[data-surface-variant='outlined']": { borderWidth: 1, borderColor: color('outlineVariant') },
  "&[data-clip='true']": { overflow: 'hidden' },
  '@media (forced-colors: active)': {
    'backgroundColor': 'Canvas',
    'color': 'CanvasText',
    'border': '1px solid CanvasText',
    'boxShadow': 'none',
    '&[data-color]': { backgroundColor: 'Canvas', color: 'CanvasText' },
    '&[data-elevation]': { boxShadow: 'none' },
  },
} satisfies StyleObject;

export const surfaceRoot = css`
  ${rootStyles}
`;
