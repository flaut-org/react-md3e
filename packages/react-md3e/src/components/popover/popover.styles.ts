import { css } from '@linaria/core';
import { motion, color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const portalStyles = { position: 'relative', zIndex: 1400, isolation: 'isolate' } satisfies StyleObject;

export const popoverPortal = css`
  ${portalStyles}
`;

const positionerStyles = {
  'zIndex': 1400,
  'maxInlineSize': 'var(--available-width)',
  'outline': 'none',
  '&[hidden]': { display: 'none' },
} satisfies StyleObject;

export const popoverPositioner = css`
  ${positionerStyles}
`;

const popupStyles = {
  ...typography('bodyLarge'),
  'position': 'relative',
  'boxSizing': 'border-box',
  'inlineSize': 320,
  'minInlineSize': 0,
  'maxInlineSize': 'min(560px, var(--available-width))',
  'maxBlockSize': 'min(80dvh, var(--available-height))',
  'overflowY': 'auto',
  'overscrollBehavior': 'contain',
  'overflowWrap': 'anywhere',
  'padding': 16,
  'borderRadius': 'var(--md-sys-shape-corner-large, 16px)',
  'backgroundColor': color('surfaceContainerHigh'),
  'color': color('onSurface'),
  'boxShadow': `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 2px 6px 2px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
  'outline': 'none',
  'opacity': 1,
  'transform': 'translateY(0) scale(1)',
  'transformOrigin': 'var(--transform-origin)',
  'transition': `opacity ${motion('effects')}, transform ${motion('spatial')}`,
  '&[hidden]': { display: 'none' },
  "&[data-match-anchor-width='true']": { inlineSize: 'var(--anchor-width)' },
  "&[data-disable-padding='true']": { padding: 0 },
  '&[data-starting-style], &[data-ending-style]': { opacity: 0, transform: 'translateY(-4px) scale(0.98)' },
  '&[data-instant]': { transition: 'none' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { border: '1px solid CanvasText', backgroundColor: 'Canvas', color: 'CanvasText' },
} satisfies StyleObject;

export const popoverPopup = css`
  ${popupStyles}
`;

const dismissStyles = {
  ...typography('labelLarge'),
  'position': 'absolute',
  'inlineSize': 1,
  'blockSize': 1,
  'padding': 0,
  'overflow': 'hidden',
  'whiteSpace': 'nowrap',
  'clipPath': 'inset(50%)',
  'border': 0,
  'backgroundColor': color('primary'),
  'color': color('onPrimary'),
  'borderRadius': 'var(--md-sys-shape-corner-full, 9999px)',
  '&:focus-visible': {
    inlineSize: 'auto',
    blockSize: 'auto',
    minBlockSize: 48,
    padding: '12px 20px',
    insetInlineEnd: 8,
    insetBlockStart: 8,
    clipPath: 'none',
    outline: `3px solid ${color('secondary')}`,
    outlineOffset: 2,
    zIndex: 1,
  },
  '@media (forced-colors: active)': { backgroundColor: 'ButtonFace', color: 'ButtonText' },
} satisfies StyleObject;

export const popoverDismiss = css`
  ${dismissStyles}
`;
