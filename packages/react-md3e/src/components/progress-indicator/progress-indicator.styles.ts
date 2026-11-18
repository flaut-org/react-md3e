import { css } from '@linaria/core';
import { color, motion } from '../../styles/theme-tokens';
import { indicatorColors } from '../../styles/indicator-colors';
import type { StyleObject } from '../../styles/style-object.types';

const root = {
  ...indicatorColors,
  '--_progress-thickness': '4px',
  '--_progress-track-color': `var(--md-progress-track-color, ${color('secondaryContainer')})`,
  'display': 'inline-block',
  'position': 'relative',
  'boxSizing': 'border-box',
  'verticalAlign': 'middle',
  'flexShrink': 0,
  'inlineSize': '100%',
  'blockSize': 4,
  'color': `var(--md-progress-active-color, ${color('primary')})`,
  "&[data-thickness='8']": { '--_progress-thickness': '8px', 'blockSize': 8 },
  "&[data-type='linear'][data-appearance='wavy']": { blockSize: 'calc(6px + var(--_progress-thickness))' },
  "&[data-type='circular']": {
    inlineSize: 'var(--md-progress-size, 40px)',
    blockSize: 'var(--md-progress-size, 40px)',
  },
  "&[data-type='circular'][data-appearance='wavy']": {
    inlineSize: 'var(--md-progress-size, 48px)',
    blockSize: 'var(--md-progress-size, 48px)',
  },
  '& [data-md3-progress-track]': {
    stroke: 'var(--_progress-track-color)',
    strokeDasharray: 'max(0, calc(100 - var(--_progress) - var(--_progress-gap))) 100',
    strokeDashoffset: 'calc(-1 * (var(--_progress) + var(--_progress-gap)))',
    transition: `stroke-dasharray ${motion('effects')}, stroke-dashoffset ${motion('effects')}`,
  },
  "&[data-type='circular'] [data-md3-progress-track]": {
    strokeDasharray: 'max(0, calc(100 - var(--_progress) - 2 * var(--_progress-gap))) 100',
  },
  '& [data-md3-progress-active]': {
    stroke: 'currentColor',
    strokeDasharray: 'var(--_progress) 100',
    transition: `stroke-dasharray ${motion('effects')}`,
  },
  "&[data-empty='true'] [data-md3-progress-active]": { visibility: 'hidden' },
  "&[data-track-visible='false'] [data-md3-progress-track]": { visibility: 'hidden' },
  "&[data-empty='true'] [data-md3-progress-track]": {
    strokeDasharray: 'none',
    strokeDashoffset: 0,
  },
  "&[data-type='linear'] [data-md3-progress-active]": {
    stroke: 'none',
    fill: 'currentColor',
    transition: `width ${motion('effects')}, x ${motion('effects')}`,
  },
  "&[data-type='linear'] [data-md3-progress-track]": {
    stroke: 'none',
    fill: 'var(--_progress-track-color)',
    transition: `width ${motion('effects')}, x ${motion('effects')}`,
  },
  "&[data-type='linear'][data-indeterminate='true'] [data-md3-progress-active], &[data-type='linear'][data-indeterminate='true'] [data-md3-progress-track]":
    {
      transition: 'none',
    },
  "&[data-type='linear'][data-empty='true'] [data-md3-progress-track]": { x: '0', width: '100%' },
  "&[data-type='linear']:dir(rtl) [data-md3-progress-svg], &[data-type='linear'][dir='rtl'] [data-md3-progress-svg]": {
    transform: 'scaleX(-1)',
  },
  '& [data-md3-progress-stop]': {
    position: 'absolute',
    insetInlineEnd: 0,
    insetBlockStart: '50%',
    transform: 'translateY(-50%)',
    inlineSize: 4,
    blockSize: 4,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  "&[data-complete='true'] [data-md3-progress-stop], &[data-indeterminate='true'] [data-md3-progress-stop]": {
    display: 'none',
  },
  '@media (prefers-reduced-motion: reduce)': {
    '&[data-md3-progress-indicator][data-type][data-appearance][data-indeterminate][data-thickness] [data-md3-progress-svg], &[data-md3-progress-indicator][data-type][data-appearance][data-indeterminate][data-thickness] [data-md3-progress-orbit], &[data-md3-progress-indicator][data-type][data-appearance][data-indeterminate][data-thickness] [data-md3-progress-active], &[data-md3-progress-indicator][data-type][data-appearance][data-indeterminate][data-thickness] [data-md3-progress-track]':
      { animation: 'none', transition: 'none' },
  },
  '@media (forced-colors: active)': {
    '--_progress-track-color': 'GrayText',
    'color': 'Highlight',
    '& [data-md3-progress-track]': { stroke: 'GrayText' },
    '& [data-md3-progress-active]': { stroke: 'Highlight' },
    "&[data-type='linear'] [data-md3-progress-active]": { stroke: 'none', fill: 'Highlight' },
    "&[data-type='linear'] [data-md3-progress-track]": {
      stroke: 'none',
      fill: 'GrayText',
    },
    '& [data-md3-progress-stop]': { backgroundColor: 'Highlight' },
  },
} satisfies StyleObject;

export const progressRoot = css`
  ${root}
`;
