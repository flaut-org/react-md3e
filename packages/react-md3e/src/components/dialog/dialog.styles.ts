import { css } from '@linaria/core';
import { color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const portalStyles = { position: 'relative', zIndex: 1300, isolation: 'isolate' } satisfies StyleObject;

export const dialogPortal = css`
  ${portalStyles}
`;

const backdropStyles = {
  'position': 'fixed',
  'inset': 0,
  'backgroundColor': `color-mix(in srgb, ${color('scrim')} 32%, transparent)`,
  'opacity': 1,
  'transition': 'opacity 150ms ease',
  '&[data-starting-style], &[data-ending-style]': { opacity: 0 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const dialogBackdrop = css`
  ${backdropStyles}
`;

const viewportStyles = {
  'position': 'fixed',
  'inset': 0,
  'display': 'flex',
  '&[hidden]': { display: 'none' },
  'alignItems': 'center',
  'justifyContent': 'center',
  'boxSizing': 'border-box',
  'padding': 24,
  'minBlockSize': 0,
  'overflow': 'hidden',
  'overscrollBehavior': 'contain',
  "&[data-scroll='body']": { alignItems: 'flex-start', overflowY: 'auto' },
  "&[data-full-screen='true']": { padding: 0, alignItems: 'stretch' },
  '@media (min-width: 600px)': { "&:not([data-full-screen='true'])": { padding: 56 } },
} satisfies StyleObject;

export const dialogViewport = css`
  ${viewportStyles}
`;

const popupStyles = {
  ...typography('bodyMedium'),
  'position': 'relative',
  'display': 'flex',
  'flexDirection': 'column',
  '&[hidden]': { display: 'none' },
  'boxSizing': 'border-box',
  'flexShrink': 0,
  'minInlineSize': 'min(280px, 100%)',
  'maxInlineSize': 'min(560px, 100%)',
  'inlineSize': 'fit-content',
  'maxBlockSize': '100%',
  'overflow': 'hidden',
  'borderRadius': 'var(--md-sys-shape-corner-extra-large, 28px)',
  'backgroundColor': color('surfaceContainerHigh'),
  'color': color('onSurface'),
  'boxShadow': `0 1px 3px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 4px 8px 3px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
  'outline': 'none',
  'opacity': 1,
  'transform': 'translateY(0) scale(1)',
  'transition': 'opacity 150ms ease, transform 200ms cubic-bezier(0.2, 0, 0, 1)',
  'overflowWrap': 'anywhere',
  '&[data-starting-style], &[data-ending-style]': { opacity: 0, transform: 'translateY(8px) scale(0.96)' },
  '&[data-ending-style]': { transitionDuration: '150ms' },
  "&[data-full-width='true']": { inlineSize: '100%' },
  "&[data-scroll='body']": { maxBlockSize: 'none', marginBlock: 'auto' },
  "&[data-scroll='body'] > [data-md3-dialog-content]": { overflowY: 'visible', flexShrink: 0 },
  "&[data-full-screen='true']": {
    inlineSize: '100%',
    maxInlineSize: 'none',
    blockSize: '100%',
    minBlockSize: '100%',
    maxBlockSize: '100%',
    borderRadius: 0,
    boxShadow: 'none',
  },
  "&[data-full-screen='true'] > [data-md3-dialog-title]": {
    ...typography('titleLarge'),
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minBlockSize: 56,
    paddingBlock: 4,
  },
  "&[data-full-screen='true'] > [data-md3-dialog-actions]": { minBlockSize: 56, paddingBlock: 4 },
  "&[data-full-screen='true'] > [data-md3-dialog-content]": { flexGrow: 1, paddingBlockStart: 24 },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { border: '1px solid CanvasText' },
} satisfies StyleObject;

export const dialogPopup = css`
  ${popupStyles}
`;
