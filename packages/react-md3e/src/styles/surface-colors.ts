import { color } from './theme-tokens';
import type { ColorRole } from '../theme/theme.types';
import type { StyleObject } from './style-object.types';

/** Build-time surface/content pairs; never compute theme colors in a component. */
const surfaceColors = {
  surface: 'onSurface',
  surfaceDim: 'onSurface',
  surfaceBright: 'onSurface',
  surfaceContainerLowest: 'onSurface',
  surfaceContainerLow: 'onSurface',
  surfaceContainer: 'onSurface',
  surfaceContainerHigh: 'onSurface',
  surfaceContainerHighest: 'onSurface',
  inverseSurface: 'inverseOnSurface',
  primary: 'onPrimary',
  primaryContainer: 'onPrimaryContainer',
  secondary: 'onSecondary',
  secondaryContainer: 'onSecondaryContainer',
  tertiary: 'onTertiary',
  tertiaryContainer: 'onTertiaryContainer',
  error: 'onError',
  errorContainer: 'onErrorContainer',
} as const satisfies Partial<Record<ColorRole, ColorRole>>;

export type SurfaceColor = keyof typeof surfaceColors;

export function surfaceColorStyles() {
  return Object.fromEntries(
    Object.entries(surfaceColors).map(([background, foreground]) => [
      `&[data-color='${background}']`,
      { backgroundColor: color(background as SurfaceColor), color: color(foreground) } satisfies StyleObject,
    ]),
  ) as Record<`&[data-color='${SurfaceColor}']`, { backgroundColor: string; color: string }>;
}
