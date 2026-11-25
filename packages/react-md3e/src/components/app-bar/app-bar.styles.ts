import { css } from '@linaria/core';
import { motion, color, typography } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

const compactTitle = typography('titleLarge');
const compactSubtitle = typography('labelMedium');
const collapse = 'var(--_app-bar-collapse, 0)';
const labelSelector = '& > [data-md3-app-bar-content] > [data-md3-app-bar-label]';
const labelTransition = `inset-inline-start ${motion('spatial', 'default')}, inset-inline-end ${motion('spatial', 'default')}, bottom ${motion('spatial', 'default')}, transform ${motion('spatial', 'default')}`;
const typeTransition = `font-size ${motion('spatial', 'default')}, line-height ${motion('spatial', 'default')}, letter-spacing ${motion('spatial', 'default')}, font-weight ${motion('spatial', 'default')}`;

function collapsingType(compact: ReturnType<typeof typography>) {
  return {
    fontSize: `calc((1 - ${collapse}) * var(--_app-bar-type-size) + ${collapse} * ${compact.fontSize})`,
    lineHeight: `calc((1 - ${collapse}) * var(--_app-bar-type-height) + ${collapse} * ${compact.lineHeight})`,
    letterSpacing: `calc((1 - ${collapse}) * var(--_app-bar-type-tracking) + ${collapse} * ${compact.letterSpacing})`,
    fontWeight: `calc((1 - ${collapse}) * var(--_app-bar-type-weight) + ${collapse} * ${compact.fontWeight})`,
  } satisfies StyleObject;
}

function expandedType(role: 'headlineMedium' | 'displaySmall' | 'labelLarge' | 'titleMedium') {
  const type = typography(role);

  return {
    ...type,
    '--_app-bar-type-size': type.fontSize,
    '--_app-bar-type-height': type.lineHeight,
    '--_app-bar-type-tracking': type.letterSpacing,
    '--_app-bar-type-weight': type.fontWeight,
    'margin': 0,
  } satisfies StyleObject;
}

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
  'transition': `background-color ${motion('effects')}, box-shadow ${motion('effects')}`,
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
  "&[data-variant='search']": {
    '& > [data-md3-app-bar-content] > [data-md3-app-bar-row]': { columnGap: 8 },
    '& [data-md3-app-bar-navigation]': {
      '--md-comp-icon-button-standard-color': color('onSurfaceVariant'),
      'minInlineSize': 0,
      'color': color('onSurfaceVariant'),
    },
  },
  "&[data-variant='search'][data-scrolled='true']": {
    'boxShadow': 'none',
    '& [data-md3-app-bar-search]': { '--_search-bar-container-color': color('surfaceContainerHighest') },
  },
  "&:is([data-variant='mediumFlexible'], [data-variant='largeFlexible']) > [data-md3-app-bar-content] > [data-md3-app-bar-label]":
    {
      flexGrow: 1,
      justifyContent: 'flex-end',
      paddingInline: 16,
      paddingBlockEnd: 12,
    },
  "&[data-variant='mediumFlexible'][data-has-subtitle='true'] > [data-md3-app-bar-content] > [data-md3-app-bar-label]":
    { paddingBlockEnd: 16 },
  "&[data-variant='largeFlexible'][data-has-subtitle='true'] > [data-md3-app-bar-content] > [data-md3-app-bar-label]": {
    paddingBlockEnd: 20,
  },
  "&[data-title-align='center'] [data-md3-app-bar-label]": { textAlign: 'center' },
  "&[data-title-align='center'][data-variant='small'] > [data-md3-app-bar-content] > [data-md3-app-bar-row]": {
    gridTemplateColumns: 'minmax(max-content, 1fr) minmax(0, auto) minmax(max-content, 1fr)',
  },
  "&:not([data-scroll-behavior='none'])": {
    position: 'relative',
    insetBlockStart: 'auto',
    insetInline: 'auto',
    zIndex: 'auto',
    pointerEvents: 'auto',
  },
  "&[data-scroll-ready='true']:not([data-scroll-measuring='expanded'])": {
    'blockSize': `calc(var(--_app-bar-expanded-height) - (var(--_app-bar-expanded-height) - var(--_app-bar-compact-height)) * ${collapse})`,
    'minBlockSize': 'var(--_app-bar-compact-height)',
    'transform': 'translateY(calc(-1 * var(--_app-bar-hidden-offset, 0px)))',
    '& > [data-md3-app-bar-content]': { minBlockSize: 0, blockSize: '100%' },
    '& > [data-md3-app-bar-content] > [data-md3-app-bar-row]': {
      minBlockSize: `calc((1 - ${collapse}) * var(--_app-bar-row-height) + ${collapse} * (var(--_app-bar-compact-height) - var(--_app-bar-border-height)))`,
    },
    "&:is([data-variant='mediumFlexible'], [data-variant='largeFlexible']):not([data-scroll-behavior='pinned'])": {
      [labelSelector]: {
        position: 'absolute',
        insetInlineStart: `calc((1 - ${collapse}) * 16px + ${collapse} * var(--_app-bar-label-start))`,
        insetInlineEnd: `calc((1 - ${collapse}) * 16px + ${collapse} * var(--_app-bar-label-end))`,
        insetBlockEnd: `calc((1 - ${collapse}) * var(--_app-bar-label-padding) + ${collapse} * var(--_app-bar-compact-height) / 2)`,
        transform: `translateY(calc(${collapse} * 50%))`,
        padding: 0,
      },
      '& [data-md3-app-bar-title]': collapsingType(compactTitle),
      '& [data-md3-app-bar-subtitle]': collapsingType(compactSubtitle),
    },
  },
  "&[data-collapsed='true'] [data-md3-app-bar-title]": { fontFamily: compactTitle.fontFamily },
  "&[data-collapsed='true'] [data-md3-app-bar-subtitle]": { fontFamily: compactSubtitle.fontFamily },
  "&[data-settling='true']": {
    'transition': `block-size ${motion('spatial', 'default')}, transform ${motion('spatial', 'default')}, background-color ${motion('effects')}, box-shadow ${motion('effects')}`,
    [labelSelector]: { transition: labelTransition },
    '& > [data-md3-app-bar-content] > [data-md3-app-bar-row]': {
      transition: `min-block-size ${motion('spatial', 'default')}`,
    },
    '& [data-md3-app-bar-title], & [data-md3-app-bar-subtitle]': { transition: typeTransition },
  },
  '&[data-scroll-measuring]': {
    'transition': 'none',
    [labelSelector]: { transition: 'none' },
    '& > [data-md3-app-bar-content] > [data-md3-app-bar-row]': { transition: 'none' },
    '& [data-md3-app-bar-title], & [data-md3-app-bar-subtitle]': { transition: 'none' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    'transition': 'none',
    "&[data-scroll-ready='true']": {
      'transition': 'none',
      [labelSelector]: { transition: 'none' },
      '& > [data-md3-app-bar-content] > [data-md3-app-bar-row]': { transition: 'none' },
      '& [data-md3-app-bar-title], & [data-md3-app-bar-subtitle]': { transition: 'none' },
    },
  },
  '@media (forced-colors: active)': { borderBlockEnd: '1px solid CanvasText' },
} satisfies StyleObject;

export const appBarRoot = css`
  ${rootStyles}
`;

const contentStyles = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minBlockSize: 'inherit',
} satisfies StyleObject;

export const appBarContent = css`
  ${contentStyles}
`;

const scrollFrameStyles = {
  'inlineSize': '100%',
  'minInlineSize': 0,
  'blockSize': 'var(--_app-bar-expanded-height, auto)',
  'pointerEvents': 'none',
  'overflowAnchor': 'none',
  "&[data-scroll-behavior='none']": { display: 'contents', pointerEvents: 'auto' },
  "&[data-position='static']": { position: 'static' },
  "&[data-position='relative']": { position: 'relative' },
  "&[data-position='sticky']": { position: 'sticky', insetBlockStart: 0, zIndex: 1100 },
  "&[data-position='fixed']": { position: 'fixed', insetBlockStart: 0, insetInline: 0, zIndex: 1100 },
  "&[data-position='absolute']": { position: 'absolute', insetBlockStart: 0, insetInline: 0, zIndex: 1100 },
} satisfies StyleObject;

export const appBarScrollFrame = css`
  ${scrollFrameStyles}
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

// Scope adaptations to the persistent input; the portaled SearchView keeps Search's presentation.
const searchStyles = {
  'display': 'flex',
  'minInlineSize': 0,
  '--_search-bar-container-color': color('surfaceContainer'),
  '--_search-bar-leading-color': color('onSurfaceVariant'),
  '& > [data-md3-search]': { inlineSize: '100%', maxInlineSize: 'none' },
  '& > [data-md3-search] > [data-md3-search-anchor]': { marginInline: 0 },
  '& > [data-md3-search] > [data-md3-search-anchor] > [data-md3-search-bar]': { maxInlineSize: 'none' },
  "&[data-title-align='center'] [data-md3-search-input]": { textAlign: 'center' },
} satisfies StyleObject;

export const appBarSearch = css`
  ${searchStyles}
`;

const smallTitleStyles = { ...typography('titleLarge'), margin: 0 } satisfies StyleObject;
const mediumTitleStyles = expandedType('headlineMedium') satisfies StyleObject;
const largeTitleStyles = expandedType('displaySmall') satisfies StyleObject;
const smallSubtitleStyles = {
  ...typography('labelMedium'),
  color: color('onSurfaceVariant'),
  margin: 0,
} satisfies StyleObject;
const mediumSubtitleStyles = {
  ...expandedType('labelLarge'),
  color: color('onSurfaceVariant'),
  margin: 0,
} satisfies StyleObject;
const largeSubtitleStyles = {
  ...expandedType('titleMedium'),
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
