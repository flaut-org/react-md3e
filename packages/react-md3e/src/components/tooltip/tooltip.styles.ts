import { css } from '@linaria/core';
import { motion, color, typography } from '../../styles/theme-tokens';
import { elevationShadow, shadowColors } from '../../styles/elevation';
import type { StyleObject } from '../../styles/style-object.types';

const portal = { position: 'relative', zIndex: 1700 } satisfies StyleObject;
const positioner = {
  'zIndex': 1700,
  'maxInlineSize': 'min(200px, var(--available-width), calc(100dvw - 16px))',
  'outline': 'none',
  "&[data-variant='rich']": { maxInlineSize: 'min(320px, var(--available-width), calc(100dvw - 16px))' },
} satisfies StyleObject;
const popup = {
  ...typography('bodySmall'),
  'position': 'relative',
  'display': 'grid',
  'gridTemplateRows': 'auto minmax(0, 1fr) auto',
  'padding': '4px 8px',
  'minBlockSize': 24,
  'minInlineSize': 'min(40px, var(--available-width))',
  'maxInlineSize': '100%',
  'maxBlockSize': 'var(--available-height)',
  'boxSizing': 'border-box',
  'borderRadius': 'var(--md-sys-shape-corner-extra-small, 4px)',
  'color': color('inverseOnSurface'),
  'backgroundColor': color('inverseSurface'),
  'overflowWrap': 'anywhere',
  'whiteSpace': 'normal',
  'userSelect': 'text',
  'boxShadow': 'none',
  'opacity': 1,
  'transform': 'scale(1)',
  'transformOrigin': 'var(--transform-origin)',
  'transition': `opacity ${motion('effects')}, transform ${motion('spatial')}`,
  '&[data-starting-style], &[data-ending-style]': { opacity: 0, transform: 'scale(0.8)' },
  "&[data-variant='rich']": {
    ...typography('bodyMedium'),
    ...shadowColors,
    padding: '12px 16px 8px',
    borderRadius: 'var(--md-sys-shape-corner-medium, 12px)',
    color: color('onSurfaceVariant'),
    backgroundColor: color('surfaceContainer'),
    boxShadow: elevationShadow(2),
    outline: 'none',
  },
  "&[data-disable-interactive='true']": { pointerEvents: 'none' },
  '&[hidden]': { display: 'none' },
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

const headline = {
  ...typography('titleSmall'),
  gridRow: 1,
  marginBlockEnd: 4,
} satisfies StyleObject;
const body = {
  'minInlineSize': 0,
  'minBlockSize': 0,
  'gridRow': 2,
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  '& a': { color: color('primary') },
} satisfies StyleObject;
const actions = {
  ...typography('labelLarge'),
  display: 'flex',
  gridRow: 3,
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  minBlockSize: 36,
  marginBlockStart: 16,
  color: color('primary'),
} satisfies StyleObject;
const arrow = {
  'position': 'absolute',
  'inlineSize': 16,
  'blockSize': 8,
  'backgroundColor': color('inverseSurface'),
  'clipPath': 'polygon(0 0, 100% 0, 50% 100%)',
  "&[data-variant='rich']": { backgroundColor: color('surfaceContainer') },
  "&[data-side='top']": { bottom: -8 },
  "&[data-side='bottom']": { top: -8, transform: 'rotate(180deg)' },
  "&[data-side='left']": { right: -12, transform: 'rotate(-90deg)' },
  "&[data-side='right']": { left: -12, transform: 'rotate(90deg)' },
  '@media (forced-colors: active)': { backgroundColor: 'CanvasText' },
} satisfies StyleObject;

export const tooltipHeadline = css`
  ${headline}
`;
export const tooltipBody = css`
  ${body}
`;
export const tooltipActions = css`
  ${actions}
`;
export const tooltipArrow = css`
  ${arrow}
`;
