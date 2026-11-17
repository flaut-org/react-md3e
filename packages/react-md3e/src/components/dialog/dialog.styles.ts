import { css } from '@linaria/core';
import { motion, breakpoint, color, typography } from '../../styles/theme-tokens';
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
  'transition': `opacity ${motion('effects')}`,
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
  'padding': `clamp(24px, calc(24px + 100vi - ${breakpoint('sm')}), 56px)`,
  'minBlockSize': 0,
  'overflow': 'hidden',
  'overscrollBehavior': 'contain',
  "&[data-scroll='body']": { alignItems: 'flex-start', overflowY: 'auto' },
  "&[data-full-screen='true']": { padding: 0, alignItems: 'stretch' },
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
  '--md-dialog-max-width': '560px',
  'minInlineSize': 'min(280px, var(--md-dialog-max-width), 100%)',
  'maxInlineSize': 'min(var(--md-dialog-max-width), 100%)',
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
  'transition': `opacity ${motion('effects')}, transform ${motion('spatial', 'default')}`,
  'overflowWrap': 'anywhere',
  '&[data-starting-style], &[data-ending-style]': { opacity: 0, transform: 'translateY(8px) scale(0.96)' },
  // xs is the zero-width range; use MUI's 444px dialog floor for that named cap.
  "&[data-max-width='xs']": { '--md-dialog-max-width': `max(444px, ${breakpoint('xs')})` },
  "&[data-max-width='sm']": { '--md-dialog-max-width': breakpoint('sm') },
  "&[data-max-width='md']": { '--md-dialog-max-width': breakpoint('md') },
  "&[data-max-width='lg']": { '--md-dialog-max-width': breakpoint('lg') },
  "&[data-max-width='xl']": { '--md-dialog-max-width': breakpoint('xl') },
  "&[data-max-width='false']": { '--md-dialog-max-width': '100%' },
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
