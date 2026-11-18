import { color } from './theme-tokens';
import type { StyleObject } from './style-object.types';

export const indicatorColors = {
  "&[data-color='secondary']": { color: color('secondary') },
  "&[data-color='tertiary']": { color: color('tertiary') },
  "&[data-color='inherit']": { color: 'inherit' },
} satisfies StyleObject;
