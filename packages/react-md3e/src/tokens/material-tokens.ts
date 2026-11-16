// MD3 system roles, including tone-based surfaces and fixed accents.
export const colorRoles = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'inversePrimary',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'surface',
  'onSurface',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'inverseSurface',
  'inverseOnSurface',
  'shadow',
  'scrim',
  'surfaceTint',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
  'secondaryFixed',
  'secondaryFixedDim',
  'onSecondaryFixed',
  'onSecondaryFixedVariant',
  'tertiaryFixed',
  'tertiaryFixedDim',
  'onTertiaryFixed',
  'onTertiaryFixedVariant',
] as const;

export const paletteRoles = ['primary', 'secondary', 'tertiary', 'neutral', 'neutralVariant', 'error'] as const;
export const paletteTones = [
  0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100,
] as const;

// Measurements from AndroidX TypeScaleTokens v0_11_0; see docs/components/button.md.
// Each tuple is [font size, line height, weight, tracking], in CSS px.
export const typeScale = {
  displayLarge: [57, 64, 400, -0.2],
  displayMedium: [45, 52, 400, 0],
  displaySmall: [36, 44, 400, 0],
  headlineLarge: [32, 40, 400, 0],
  headlineMedium: [28, 36, 400, 0],
  headlineSmall: [24, 32, 400, 0],
  titleLarge: [22, 28, 400, 0],
  titleMedium: [16, 24, 500, 0.2],
  titleSmall: [14, 20, 500, 0.1],
  bodyLarge: [16, 24, 400, 0.5],
  bodyMedium: [14, 20, 400, 0.2],
  bodySmall: [12, 16, 400, 0.4],
  labelLarge: [14, 20, 500, 0.1],
  labelMedium: [12, 16, 500, 0.5],
  labelSmall: [11, 16, 500, 0.5],
} as const;

// Expressive emphasized metrics from AndroidX TypeScaleTokens v0_103, revision
// 160825094a81825468a95b115bfb1b541e549856. See docs/components/typography.md.
export const emphasizedTypeScale = {
  displayLargeEmphasized: [57, 64, 500, 0],
  displayMediumEmphasized: [45, 52, 500, 0],
  displaySmallEmphasized: [36, 44, 500, 0],
  headlineLargeEmphasized: [32, 40, 500, 0],
  headlineMediumEmphasized: [28, 36, 500, 0],
  headlineSmallEmphasized: [24, 32, 500, 0],
  titleLargeEmphasized: [22, 28, 500, 0],
  titleMediumEmphasized: [16, 24, 700, 0.15],
  titleSmallEmphasized: [14, 20, 700, 0.1],
  bodyLargeEmphasized: [16, 24, 500, 0.15],
  bodyMediumEmphasized: [14, 20, 500, 0.25],
  bodySmallEmphasized: [12, 16, 500, 0.4],
  labelLargeEmphasized: [14, 20, 700, 0.1],
  labelMediumEmphasized: [12, 16, 700, 0.5],
  labelSmallEmphasized: [11, 16, 700, 0.5],
} as const;

export function kebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Build/server-only token naming shared by theme export and CSS extraction. */
export function typeScaleTokenName(role: string): string {
  return role.endsWith('Emphasized') ? `emphasized-${kebabCase(role.replace(/Emphasized$/, ''))}` : kebabCase(role);
}
