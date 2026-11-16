import { css } from '@linaria/core';
import { color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  '--_app-bar-height': '64px',
  'display': 'flex',
  'flexDirection': 'column',
  'boxSizing': 'border-box',
  'inlineSize': '100%',
  'minInlineSize': 0,
  'minBlockSize': 'var(--_app-bar-height)',
  'borderRadius': 0,
  'backgroundColor': color('surface'),
  'color': color('onSurface'),
  'transition': 'background-color 150ms ease, box-shadow 150ms ease',
  "&[data-position='static']": { position: 'static' },
  "&[data-position='relative']": { position: 'relative' },
  "&[data-position='sticky']": { position: 'sticky', insetBlockStart: 0, zIndex: 1100 },
  "&[data-position='fixed']": { position: 'fixed', insetBlockStart: 0, insetInline: 0, zIndex: 1100 },
  "&[data-position='absolute']": { position: 'absolute', insetBlockStart: 0, insetInline: 0, zIndex: 1100 },
  "&[data-scrolled='true']": {
    backgroundColor: color('surfaceContainer'),
    boxShadow: `0 1px 2px color-mix(in srgb, ${color('shadow')} 30%, transparent), 0 2px 6px color-mix(in srgb, ${color('shadow')} 15%, transparent)`,
  },
  "&[data-variant='mediumFlexible']": { '--_app-bar-height': '112px' },
  "&[data-variant='largeFlexible']": { '--_app-bar-height': '120px' },
  "&[data-variant='mediumFlexible'][data-has-subtitle='true']": { '--_app-bar-height': '136px' },
  "&[data-variant='largeFlexible'][data-has-subtitle='true']": { '--_app-bar-height': '152px' },
  "&:not([data-variant='small']) > [data-md3-app-bar-label]": {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingInline: 16,
    paddingBlockEnd: 12,
  },
  "&[data-variant='mediumFlexible'][data-has-subtitle='true'] > [data-md3-app-bar-label]": { paddingBlockEnd: 16 },
  "&[data-variant='largeFlexible'][data-has-subtitle='true'] > [data-md3-app-bar-label]": { paddingBlockEnd: 20 },
  "&[data-title-align='center'] [data-md3-app-bar-label]": { textAlign: 'center' },
  "&[data-title-align='center'][data-variant='small'] > [data-md3-app-bar-row]": {
    gridTemplateColumns: 'minmax(max-content, 1fr) minmax(0, auto) minmax(max-content, 1fr)',
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@media (forced-colors: active)': { borderBlockEnd: '1px solid CanvasText' },
} satisfies StyleObject;

export const appBarRoot = css`
  ${rootStyles}
`;

const rowStyles = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  alignItems: 'center',
  minBlockSize: 64,
  flexShrink: 0,
  paddingInline: 4,
  boxSizing: 'border-box',
} satisfies StyleObject;

export const appBarRow = css`
  ${rowStyles}
`;

const navigationStyles = {
  '--md-comp-icon-button-standard-color': color('onSurface'),
  'display': 'flex',
  'alignItems': 'center',
  'minInlineSize': 8,
  'justifySelf': 'start',
  'color': color('onSurface'),
} satisfies StyleObject;

export const appBarNavigation = css`
  ${navigationStyles}
`;

const actionsStyles = {
  '--md-comp-icon-button-standard-color': color('onSurfaceVariant'),
  'display': 'flex',
  'alignItems': 'center',
  'justifySelf': 'end',
  'color': color('onSurfaceVariant'),
} satisfies StyleObject;

export const appBarActions = css`
  ${actionsStyles}
`;

const labelStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minInlineSize: 0,
  boxSizing: 'border-box',
  paddingInline: 4,
  overflowWrap: 'anywhere',
} satisfies StyleObject;

export const appBarLabel = css`
  ${labelStyles}
`;

const smallTitleStyles = { ...typography('titleLarge'), margin: 0 } satisfies StyleObject;
const mediumTitleStyles = { ...typography('headlineMedium'), margin: 0 } satisfies StyleObject;
const largeTitleStyles = { ...typography('displaySmall'), margin: 0 } satisfies StyleObject;
const smallSubtitleStyles = {
  ...typography('labelMedium'),
  color: color('onSurfaceVariant'),
  margin: 0,
} satisfies StyleObject;
const mediumSubtitleStyles = {
  ...typography('labelLarge'),
  color: color('onSurfaceVariant'),
  margin: 0,
} satisfies StyleObject;
const largeSubtitleStyles = {
  ...typography('titleMedium'),
  color: color('onSurfaceVariant'),
  margin: 0,
} satisfies StyleObject;

export const appBarSmallTitle = css`
  ${smallTitleStyles}
`;
export const appBarMediumTitle = css`
  ${mediumTitleStyles}
`;
export const appBarLargeTitle = css`
  ${largeTitleStyles}
`;
export const appBarSmallSubtitle = css`
  ${smallSubtitleStyles}
`;
export const appBarMediumSubtitle = css`
  ${mediumSubtitleStyles}
`;
export const appBarLargeSubtitle = css`
  ${largeSubtitleStyles}
`;
