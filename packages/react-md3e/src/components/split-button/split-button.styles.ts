import { css } from '@linaria/core';
import { motion } from '../../styles/theme-tokens';
import { createMotion } from '../../theme/create-motion';
import type { StyleObject } from '../../styles/style-object.types';

// MD3/AndroidX SplitButton*Tokens v18_0_18. Numerical data; sources/adaptations in docs/components/split-button.md.
const rootStyles = {
  '--_split-leading-start': '16px',
  '--_split-leading-end': '12px',
  '--_split-trailing-padding': '13px',
  '--_split-chevron-size': '22px',
  '--_split-inner': 'var(--md-sys-shape-corner-extra-small, 4px)',
  '--_split-interactive-inner': 'var(--md-sys-shape-corner-medium, 12px)',
  '--_split-icon-offset': '-1px',
  '--_split-icon-direction': '1',
  '--_split-expanded-angle': '180deg',
  'display': 'inline-flex',
  'alignItems': 'center',
  'verticalAlign': 'middle',
  'maxInlineSize': '100%',
  'gap': 2,
  '&[hidden]': { display: 'none' },
  '&:dir(rtl)': { '--_split-icon-direction': '-1', '--_split-expanded-angle': '-180deg' },
  '&[data-full-width="true"]': { display: 'flex', inlineSize: '100%' },
  '&[data-size="extraSmall"]': {
    '--_split-leading-start': '12px',
    '--_split-leading-end': '10px',
    '--_split-interactive-inner': 'var(--md-sys-shape-corner-small, 8px)',
  },
  '&[data-size="medium"]': {
    '--_split-leading-start': '24px',
    '--_split-leading-end': '24px',
    '--_split-trailing-padding': '15px',
    '--_split-chevron-size': '26px',
    '--_split-icon-offset': '-2px',
  },
  '&[data-size="large"]': {
    '--_split-leading-start': '48px',
    '--_split-leading-end': '48px',
    '--_split-trailing-padding': '29px',
    '--_split-chevron-size': '38px',
    '--_split-inner': 'var(--md-sys-shape-corner-small, 8px)',
    '--_split-interactive-inner': 'var(--md-sys-shape-corner-large-increased, 20px)',
    '--_split-icon-offset': '-3px',
  },
  '&[data-size="extraLarge"]': {
    '--_split-leading-start': '64px',
    '--_split-leading-end': '64px',
    '--_split-trailing-padding': '43px',
    '--_split-chevron-size': '50px',
    '--_split-inner': 'var(--md-sys-shape-corner-medium, 12px)',
    '--_split-interactive-inner': 'var(--md-sys-shape-corner-large-increased, 20px)',
    '--_split-icon-offset': '-6px',
  },
} satisfies StyleObject;

export const splitButtonRoot = css`
  ${rootStyles}
`;

const actionStyles = {
  '&[data-md3-split-action]': {
    '--_split-current-inner': 'var(--_split-inner)',
    '--_radius': '9999px var(--_split-current-inner) var(--_split-current-inner) 9999px',
    '--_pressed': 'var(--_radius)',
    'flex': '1 1 auto',
    'paddingInlineStart': 'calc(var(--_split-leading-start) - var(--_outline-width))',
    'paddingInlineEnd': 'calc(var(--_split-leading-end) - var(--_outline-width))',
  },
  '&[data-md3-split-action]:dir(rtl)': {
    '--_radius': 'var(--_split-current-inner) 9999px 9999px var(--_split-current-inner)',
  },
  '&:is(:focus-visible, :active):not(:disabled)': { '--_split-current-inner': 'var(--_split-interactive-inner)' },
  '@media (hover: hover)': {
    '&:hover:not(:disabled)': { '--_split-current-inner': 'var(--_split-interactive-inner)' },
  },
} satisfies StyleObject;

export const splitButtonAction = css`
  ${actionStyles}
`;

const menuButtonStyles = {
  '&[data-md3-split-menu-button]': {
    '--_split-current-inner': 'var(--_split-inner)',
    '--_radius': 'var(--_split-current-inner) 9999px 9999px var(--_split-current-inner)',
    '--_pressed': 'var(--_radius)',
    'flex': '0 0 auto',
    'inlineSize': 'calc(var(--_split-chevron-size) + 2 * var(--_split-trailing-padding))',
    'paddingInline': 'calc(var(--_split-trailing-padding) - var(--_outline-width))',
  },
  '&[data-md3-split-menu-button]:dir(rtl)': {
    '--_radius': '9999px var(--_split-current-inner) var(--_split-current-inner) 9999px',
  },
  '&[data-md3-split-menu-button][data-popup-open]': {
    '--_split-current-inner': '9999px',
    '--_split-icon-offset': '0px',
    '--_split-icon-angle': 'var(--_split-expanded-angle)',
  },
  '&:focus-visible:not([data-popup-open]):not(:disabled), &:active:not(:disabled)': {
    '--_split-current-inner': 'var(--_split-interactive-inner)',
  },
  '@media (hover: hover)': {
    '&:hover:not([data-popup-open]):not(:disabled)': { '--_split-current-inner': 'var(--_split-interactive-inner)' },
  },
} satisfies StyleObject;

export const splitButtonMenuButton = css`
  ${menuButtonStyles}
`;

// The specification requires standard motion for rotation, even inside an expressive theme.
// Sampling happens during CSS extraction; only the chevron's existing token scope is overridden.
const standardSpring = createMotion('standard').motion.fast.spatial;
const chevronStyles = {
  '--md-sys-motion-spring-fast-spatial-damping': String(standardSpring.damping),
  '--md-sys-motion-spring-fast-spatial-stiffness': String(standardSpring.stiffness),
  '--md-sys-motion-spring-fast-spatial-duration': `${standardSpring.duration}ms`,
  '--md-sys-motion-spring-fast-spatial-easing': standardSpring.easing,
  'display': 'block',
  'inlineSize': 'var(--_split-chevron-size)',
  'blockSize': 'var(--_split-chevron-size)',
  'fill': 'none',
  'stroke': 'currentColor',
  'strokeWidth': 2,
  'transform': 'translateX(calc(var(--_split-icon-offset) * var(--_split-icon-direction))) rotate(var(--_split-icon-angle, 0deg))',
  'transition': `transform ${motion('spatial')}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} satisfies StyleObject;

export const splitButtonChevron = css`
  ${chevronStyles}
`;
