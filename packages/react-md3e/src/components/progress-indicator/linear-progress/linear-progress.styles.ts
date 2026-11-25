/**
 * Indeterminate motion parameters adapted from MUI LinearProgress (MIT).
 * Copyright (c) 2014 Call-Em-All. See licenses/mui-material.txt and THIRD_PARTY_NOTICES.md.
 */
import { css } from '@linaria/core';
import { linearWaveMask } from '../progress-geometry';
import type { StyleObject } from '../../../styles/style-object.types';

const waves = Object.fromEntries(
  ([4, 8] as const).flatMap((thickness) =>
    [false, true].flatMap((indeterminate) => {
      const wavelength = indeterminate ? 20 : 40;
      const name = `md3-linear-wave-${wavelength}`;
      const selector = `&[data-appearance='wavy'][data-thickness='${thickness}'][data-indeterminate='${indeterminate}'][data-wave='true'] [data-md3-progress-active]`;

      return [
        [
          selector,
          {
            maskImage: linearWaveMask(thickness, wavelength),
            maskSize: `${wavelength}px ${thickness + 6}px`,
            maskRepeat: 'repeat-x',
            maskPosition: '0 50%',
            y: '0',
            height: `${thickness + 6}px`,
            animation: `${name} 1s linear infinite`,
          } satisfies StyleObject,
        ],
      ];
    }),
  ),
) as Record<
  `&${string}`,
  {
    maskImage: string;
    maskSize: string;
    maskRepeat: string;
    maskPosition: string;
    y: string;
    height: string;
    animation: string;
  }
>;
// Numerical choreography from MUI LinearProgress 5eb2eee; see component docs for provenance.
// Each pair contains the trailing/leading edges as percentages of the whole track.
const firstTail = '--md3e-progress-linear-first-tail';
const firstHead = '--md3e-progress-linear-first-head';
const secondTail = '--md3e-progress-linear-second-tail';
const secondHead = '--md3e-progress-linear-second-head';
// Webpack/cssnano can shorten zero units in initial-value. Length-percentage accepts that
// unitless zero, keeping registrations valid while every animated edge remains a percentage.
const registrations = Object.fromEntries(
  [firstTail, firstHead, secondTail, secondHead].map((name) => [
    `@property ${name}`,
    { syntax: '"<length-percentage>"', inherits: 'true', initialValue: '0px' },
  ]),
) as Record<`@property --${string}`, { syntax: string; inherits: 'true'; initialValue: string }>;
const cutout = (tail: string, head: string) => {
  const gap = `clamp(0px, calc((min(100%, var(${head})) - max(0%, var(${tail}))) * 10000), 4px)`;

  return `linear-gradient(to right, #000 calc(var(${tail}) - ${gap}), transparent calc(var(${tail}) - ${gap}), transparent calc(var(${head}) + ${gap}), #000 calc(var(${head}) + ${gap}))`;
};
const root = {
  ...registrations,
  ...waves,
  [firstTail]: '0%',
  [firstHead]: '25%',
  [secondTail]: '110%',
  [secondHead]: '110%',
  'display': 'block',
  'inlineSize': '100%',
  'blockSize': '100%',
  'overflow': 'visible',
  'transformOrigin': 'center',
  '& rect': { y: 'calc(50% - var(--_progress-thickness) / 2)', height: 'var(--_progress-thickness)' },
  '& [data-md3-progress-active]': { x: 0, width: 'calc(var(--_progress) * 1%)' },
  '& [data-md3-progress-track]': {
    x: 'calc(var(--_progress) * 1% + 4px)',
    width: 'max(0px, calc((100 - var(--_progress)) * 1% - 4px))',
  },
  "&[data-indeterminate='true']": {
    overflow: 'hidden',
    animation:
      'md3-linear-first 2100ms cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite, md3-linear-second 2100ms cubic-bezier(0.165, 0.84, 0.44, 1) -950ms infinite',
  },
  "&[data-indeterminate='true'] [data-md3-progress-active]": {
    x: `var(${firstTail})`,
    width: `calc(var(${firstHead}) - var(${firstTail}))`,
  },
  "&[data-indeterminate='true'] [data-md3-progress-secondary]": {
    x: `var(${secondTail})`,
    width: `calc(var(${secondHead}) - var(${secondTail}))`,
  },
  "&[data-indeterminate='true'] [data-md3-progress-track]": {
    x: 0,
    width: '100%',
    maskImage: `${cutout(firstTail, firstHead)}, ${cutout(secondTail, secondHead)}`,
    maskComposite: 'intersect',
  },
  '@keyframes md3-linear-first': {
    '0%': { [firstTail]: '-35%', [firstHead]: '0%' },
    '60%': { [firstTail]: '100%', [firstHead]: '190%' },
    '100%': { [firstTail]: '100%', [firstHead]: '190%' },
  },
  '@keyframes md3-linear-second': {
    '0%': { [secondTail]: '-200%', [secondHead]: '0%' },
    '60%': { [secondTail]: '107%', [secondHead]: '108%' },
    '100%': { [secondTail]: '107%', [secondHead]: '108%' },
  },
  '@keyframes md3-linear-wave-40': { to: { maskPosition: '40px 50%' } },
  '@keyframes md3-linear-wave-20': { to: { maskPosition: '20px 50%' } },
  '@media (prefers-reduced-motion: reduce)': {
    "&[data-indeterminate='true']": { animation: 'none' },
  },
} satisfies StyleObject;

export const linearGraphic = css`
  ${root}
`;
