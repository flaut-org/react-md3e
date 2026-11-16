import {
  argbFromHex,
  hexFromArgb,
  Hct,
  DynamicScheme,
  Variant,
  TonalPalette,
  customColor,
} from '@material/material-color-utilities';

import { colorRoles, kebabCase, paletteRoles, paletteTones, typeScaleTokenName } from '../tokens/material-tokens';
import { createTypography } from './create-typography';
import type { ColorRole, ColorScheme, HexColor, PaletteRole, Theme, ThemeOptions } from './theme.types';

function hex(value: string, name: string): HexColor {
  if (!/^#[\da-f]{6}$/i.test(value)) {
    throw new TypeError(`${name} must be an opaque six-digit hex color, such as #6750a4.`);
  }

  return value.toLowerCase() as HexColor;
}

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }

  return value;
}

/** Generate serializable MD3 tokens in build scripts or server code, never during client rendering. */
export function createTheme(options: ThemeOptions = {}): Theme {
  const sourceColor = hex(options.sourceColor ?? '#6750a4', 'sourceColor');
  const source = Hct.fromInt(argbFromHex(sourceColor));
  const variant = options.variant ?? 'tonalSpot';

  if (variant !== 'tonalSpot' && variant !== 'expressive') {
    throw new TypeError('Unknown theme variant.');
  }

  const contrastLevel = options.contrastLevel ?? 0;

  if (!Number.isFinite(contrastLevel) || contrastLevel < -1 || contrastLevel > 1) {
    throw new RangeError('contrastLevel must be between -1 and 1.');
  }

  const overrides: Partial<Record<`${PaletteRole}Palette`, TonalPalette>> = {};

  for (const role of paletteRoles) {
    const value = options.keyColors?.[role];

    if (value !== undefined) {
      overrides[`${role}Palette`] = TonalPalette.fromInt(argbFromHex(hex(value, `keyColors.${role}`)));
    }
  }

  const makeScheme = (isDark: boolean) =>
    new DynamicScheme({
      sourceColorHct: source,
      variant: variant === 'expressive' ? Variant.EXPRESSIVE : Variant.TONAL_SPOT,
      contrastLevel,
      isDark,
      specVersion: '2025',
      ...overrides,
    });
  const light = makeScheme(false);
  const dark = makeScheme(true);
  const schemes = {} as { light: ColorScheme; dark: ColorScheme };

  for (const [mode, scheme] of [
    ['light', light],
    ['dark', dark],
  ] as const) {
    const roles = {} as Record<ColorRole, HexColor>;

    for (const role of colorRoles) {
      roles[role] = hexFromArgb(scheme[role]) as HexColor;
    }

    for (const [role, value] of Object.entries(options.schemes?.[mode] ?? {})) {
      if (!colorRoles.includes(role as ColorRole)) {
        throw new TypeError(`Unknown MD3 color role: ${role}`);
      }

      roles[role as ColorRole] = hex(value, `schemes.${mode}.${role}`);
    }

    schemes[mode] = roles;
  }

  const palettes = Object.fromEntries(
    paletteRoles.map((role) => [
      role,
      Object.fromEntries(paletteTones.map((tone) => [tone, hexFromArgb(light[`${role}Palette`].tone(tone))])),
    ]),
  ) as Theme['palettes'];

  const customColors: Record<string, Theme['customColors'][string]> = {};

  for (const [name, value] of Object.entries(options.customColors ?? {})) {
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
      throw new TypeError('Custom color names must be lower-case kebab-case identifiers.');
    }

    const group = customColor(source.toInt(), {
      name,
      value: argbFromHex(hex(value.value, `customColors.${name}`)),
      blend: value.harmonize ?? true,
    });
    const toHex = (colors: typeof group.light) =>
      Object.fromEntries(
        Object.entries(colors).map(([role, color]) => [role, hexFromArgb(color)]),
      ) as Theme['customColors'][string]['light'];

    customColors[name] = {
      value: hexFromArgb(group.value) as HexColor,
      harmonized: value.harmonize ?? true,
      light: toHex(group.light),
      dark: toHex(group.dark),
    };
  }

  const typography = createTypography(options.typography);
  const shape = {
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    largeIncreased: 20,
    extraLarge: 28,
    extraLargeIncreased: 32,
    extraExtraLarge: 48,
    ...options.shape,
    full: 9999,
  };

  for (const [name, value] of Object.entries(shape)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`shape.${name} must be a non-negative radius in px.`);
    }
  }

  const cssVariables: Record<`--${string}`, string> = {};

  for (const role of colorRoles) {
    cssVariables[`--md-sys-color-${kebabCase(role)}`] = `light-dark(${schemes.light[role]}, ${schemes.dark[role]})`;
  }

  for (const [name, group] of Object.entries(customColors)) {
    for (const role of ['color', 'onColor', 'colorContainer', 'onColorContainer'] as const) {
      cssVariables[`--md-custom-color-${name}-${kebabCase(role)}`] =
        `light-dark(${group.light[role]}, ${group.dark[role]})`;
    }
  }

  for (const [role, style] of Object.entries(typography)) {
    const prefix = `--md-sys-typescale-${typeScaleTokenName(role)}` as const;

    cssVariables[`${prefix}-font`] = style.fontFamily;
    cssVariables[`${prefix}-size`] = `${style.fontSize / 16}rem`;
    cssVariables[`${prefix}-line-height`] = `${style.lineHeight / 16}rem`;
    cssVariables[`${prefix}-weight`] = String(style.fontWeight);
    cssVariables[`${prefix}-tracking`] = `${style.letterSpacing / 16}rem`;
  }

  for (const [role, radius] of Object.entries(shape)) {
    cssVariables[`--md-sys-shape-corner-${kebabCase(role)}`] = `${radius}px`;
  }

  return freeze({
    sourceColor,
    variant,
    contrastLevel,
    schemes,
    palettes,
    customColors,
    typography,
    shape,
    cssVariables,
  });
}

function invalidCss(value: string): boolean {
  return /[{};<>]/.test(value) || Array.from(value).some((character) => character.charCodeAt(0) < 32);
}

/** Export a custom theme as static CSS; write the result to a file in the consumer's build. */
export function themeToCss(theme: Theme, options: { selector: string }): string {
  const selector = options.selector.trim();

  if (!selector || invalidCss(selector)) {
    throw new TypeError('Invalid theme selector.');
  }

  const declarations = Object.entries(theme.cssVariables).map(([name, value]) => {
    if (invalidCss(value)) {
      throw new TypeError(`Invalid CSS token value: ${name}`);
    }

    return `  ${name}: ${value};`;
  });

  return `${selector} {\n${declarations.join('\n')}\n}\n`;
}
