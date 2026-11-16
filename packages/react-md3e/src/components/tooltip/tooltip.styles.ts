import { css } from '@linaria/core';
import { color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const portal = { position: 'relative', zIndex: 1700 } satisfies StyleObject;
const positioner = { maxInlineSize: 'min(240px, calc(100vw - 16px))', outline: 'none' } satisfies StyleObject;
const popup = {
  ...typography('bodySmall'),
  'padding': '4px 8px',
  'minBlockSize': 24,
  'boxSizing': 'border-box',
  'borderRadius': 'var(--md-sys-shape-corner-extra-small, 4px)',
  'color': color('inverseOnSurface'),
  'backgroundColor': color('inverseSurface'),
  'overflowWrap': 'anywhere',
  'opacity': 1,
  'transform': 'scale(1)',
  'transformOrigin': 'var(--transform-origin)',
  'transition': 'opacity 150ms ease, transform 150ms ease',
  '&[data-starting-style], &[data-ending-style]': { opacity: 0, transform: 'scale(0.95)' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { backgroundColor: 'Canvas', color: 'CanvasText', border: '1px solid CanvasText' },
} satisfies StyleObject;

export const tooltipPortal = css`
  ${portal}
`;
export const tooltipPositioner = css`
  ${positioner}
`;
export const tooltipPopup = css`
  ${popup}
`;
