import type { colorRoles } from '../tokens/material-tokens';

export type HexColor = `#${string}`;
export type ColorRole = (typeof colorRoles)[number];
export type ColorScheme = Readonly<Record<ColorRole, HexColor>>;
export type ColorSchemePreference = 'light' | 'dark' | 'system';
export type PaletteRole = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutralVariant' | 'error';
export type ShapeRole =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'largeIncreased'
  | 'extraLarge'
  | 'extraLargeIncreased'
  | 'extraExtraLarge'
  | 'full';
export type TypeScaleRole =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export type TypographyTokenRole = TypeScaleRole | `${TypeScaleRole}Emphasized`;

export type TypographyOptions = {
  readonly brandFontFamily?: string;
  readonly plainFontFamily?: string;
} & Readonly<Partial<Record<TypographyTokenRole, Partial<TypeStyle>>>>;

export interface TypeStyle {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly fontWeight: number;
  readonly letterSpacing: number;
}

export interface CustomColorOptions {
  readonly value: HexColor;
  readonly harmonize?: boolean;
}

export interface CustomColorGroup {
  readonly value: HexColor;
  readonly harmonized: boolean;
  readonly light: Readonly<Record<'color' | 'onColor' | 'colorContainer' | 'onColorContainer', HexColor>>;
  readonly dark: Readonly<Record<'color' | 'onColor' | 'colorContainer' | 'onColorContainer', HexColor>>;
}

export interface ThemeOptions {
  readonly sourceColor?: HexColor;
  readonly variant?: 'tonalSpot' | 'expressive';
  readonly contrastLevel?: number;
  readonly keyColors?: Partial<Record<PaletteRole, HexColor>>;
  readonly schemes?: {
    readonly light?: Partial<ColorScheme>;
    readonly dark?: Partial<ColorScheme>;
  };
  readonly customColors?: Readonly<Record<string, CustomColorOptions>>;
  readonly typography?: TypographyOptions;
  /** Corner radii in CSS px; the full shape always uses a pill radius. */
  readonly shape?: Partial<Record<Exclude<ShapeRole, 'full'>, number>>;
}

export interface Theme {
  readonly sourceColor: HexColor;
  readonly variant: 'tonalSpot' | 'expressive';
  readonly contrastLevel: number;
  readonly schemes: { readonly light: ColorScheme; readonly dark: ColorScheme };
  readonly palettes: Readonly<Record<PaletteRole, Readonly<Record<number, HexColor>>>>;
  readonly customColors: Readonly<Record<string, CustomColorGroup>>;
  readonly typography: Readonly<Record<TypographyTokenRole, TypeStyle>>;
  readonly shape: Readonly<Record<ShapeRole, number>>;
  readonly cssVariables: Readonly<Record<`--${string}`, string>>;
}
