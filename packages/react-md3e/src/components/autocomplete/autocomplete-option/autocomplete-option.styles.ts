import { css } from '@linaria/core';
import { color, typography } from '../../../styles/theme-tokens';
import type { StyleObject } from '../../../styles/style-object.types';

const styles = {
  ...typography('bodyLarge'),
  '--_list-label': color('onSurface'),
  '--_list-supporting': color('onSurfaceVariant'),
  '--_list-icon': color('onSurfaceVariant'),
  'color': 'var(--_list-label)',
  'position': 'relative',
  'display': 'flex',
  'alignItems': 'center',
  'gap': 12,
  'minBlockSize': 48,
  'padding': '8px 12px',
  'boxSizing': 'border-box',
  'borderRadius': 'var(--md-sys-shape-corner-extra-small, 4px)',
  'cursor': 'default',
  'outline': 'none',
  'userSelect': 'none',
  'overflowWrap': 'anywhere',
  '&[data-selected]': {
    '--_list-label': color('onSecondaryContainer'),
    '--_list-icon': color('onSecondaryContainer'),
    'backgroundColor': color('secondaryContainer'),
  },
  '&[data-highlighted]': {
    backgroundImage: `linear-gradient(color-mix(in srgb, ${color('onSurface')} 8%, transparent), color-mix(in srgb, ${color('onSurface')} 8%, transparent))`,
    outline: `2px solid ${color('secondary')}`,
    outlineOffset: -2,
  },
  '&[data-disabled]': {
    '--_list-label': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
    '--_list-icon': `color-mix(in srgb, ${color('onSurface')} 38%, transparent)`,
  },
  '@media (forced-colors: active)': {
    '--_list-label': 'CanvasText',
    '--_list-icon': 'CanvasText',
    '&[data-selected], &[data-highlighted]': {
      '--_list-label': 'HighlightText',
      '--_list-icon': 'HighlightText',
      'color': 'HighlightText',
      'backgroundColor': 'Highlight',
      'backgroundImage': 'none',
      'forcedColorAdjust': 'none',
      'outlineColor': 'HighlightText',
    },
    '&[data-disabled]': { '--_list-label': 'GrayText', '--_list-icon': 'GrayText' },
  },
} satisfies StyleObject;

export const autocompleteOption = css`
  ${styles}
`;
