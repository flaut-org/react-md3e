import { css } from '@linaria/core';
import { motionEasing } from '../../../styles/theme-tokens';
import { circularWave, waveFrames } from '../progress-geometry';
import type { WaveStyles } from '../progress-geometry';
import type { StyleObject } from '../../../styles/style-object.types';

const waves: WaveStyles = Object.fromEntries<WaveStyles[keyof WaveStyles]>(
  ([4, 8] as const).flatMap((thickness) => {
    const name = `md3-circular-wave-${thickness}`;
    const path = (phase: number) => circularWave(thickness, phase);

    return [
      [
        `&[data-appearance='wavy'][data-thickness='${thickness}'][data-wave='true'] [data-md3-progress-active]`,
        { d: `path("${path(0)}")`, animation: `${name} 1s linear infinite` } satisfies StyleObject,
      ],
      [
        `&[data-appearance='wavy'][data-thickness='${thickness}'][data-wave='true'][data-indeterminate='true'] [data-md3-progress-active]`,
        {
          d: `path("${path(0)}")`,
          animation: `${name} 1s linear infinite, md3-circular-sweep 1333ms ${motionEasing('spatial', 'default')} infinite`,
        } satisfies StyleObject,
      ],
    ];
  }),
);
const waveKeyframes = Object.fromEntries(
  ([4, 8] as const).map((thickness) => [
    `@keyframes md3-circular-wave-${thickness}`,
    waveFrames((phase) => circularWave(thickness, phase)),
  ]),
) as Record<`@keyframes ${string}`, ReturnType<typeof waveFrames>>;
const orbitFrames = Object.fromEntries(
  Array.from({ length: 9 }, (_, index) => [`${index * 12.5}%`, { transform: `rotate(${index * 135}deg)` }]),
) as Record<`${number}%`, { transform: string }>;
const root = {
  ...waveKeyframes,
  'display': 'block',
  'inlineSize': '100%',
  'blockSize': '100%',
  'overflow': 'visible',
  'transformOrigin': 'center',
  'fill': 'none',
  'strokeWidth': 'var(--_progress-thickness)',
  'strokeLinecap': 'round',
  "&[data-indeterminate='true']": { animation: 'md3-circular-turn 1568ms linear infinite' },
  "&[data-indeterminate='true'] [data-md3-progress-active]": {
    strokeDasharray: '25 75',
    strokeDashoffset: '0',
    animation: `md3-circular-sweep 1333ms ${motionEasing('spatial', 'default')} infinite`,
  },
  "&[data-indeterminate='true'] [data-md3-progress-track]": {
    strokeDasharray: 'max(0, calc(75 - 2 * var(--_progress-gap))) 100',
    strokeDashoffset: 'calc(-25 - var(--_progress-gap))',
    animation: `md3-circular-track 1333ms ${motionEasing('spatial', 'default')} infinite`,
  },
  '& [data-md3-progress-orbit]': { transformOrigin: 'center', transformBox: 'view-box' },
  "&[data-indeterminate='true'] [data-md3-progress-orbit]": {
    animation: `md3-circular-orbit 5332ms ${motionEasing('spatial')} infinite`,
  },
  '@keyframes md3-circular-orbit': orbitFrames,
  '@keyframes md3-circular-track': {
    '0%': {
      strokeDasharray: 'max(0, calc(95 - 2 * var(--_progress-gap))) 100',
      strokeDashoffset: 'calc(-5 - var(--_progress-gap))',
    },
    '50%': {
      strokeDasharray: 'max(0, calc(25 - 2 * var(--_progress-gap))) 100',
      strokeDashoffset: 'calc(-95 - var(--_progress-gap))',
    },
    '100%': {
      strokeDasharray: 'max(0, calc(95 - 2 * var(--_progress-gap))) 100',
      strokeDashoffset: 'calc(-5 - var(--_progress-gap))',
    },
  },
  '@keyframes md3-circular-turn': { to: { transform: 'rotate(360deg)' } },
  '@keyframes md3-circular-sweep': {
    '0%': { strokeDasharray: '5 95', strokeDashoffset: '0' },
    '100%': { strokeDasharray: '5 95', strokeDashoffset: '0' },
    '50%': { strokeDasharray: '75 25', strokeDashoffset: '-20' },
  },
  '@supports (d: path("M0 0L1 1"))': waves,
} satisfies StyleObject;

export const circularGraphic = css`
  ${root}
`;
