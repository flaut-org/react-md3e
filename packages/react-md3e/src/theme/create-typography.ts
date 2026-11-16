import { typeScale, emphasizedTypeScale } from '../tokens/material-tokens';
import type { TypographyOptions, TypographyTokenRole, TypeStyle } from './theme.types';

const definitions = { ...typeScale, ...emphasizedTypeScale };
const properties = ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing'] as const;

/** Resolve all 30 MD3 styles in server/build code, keeping component rendering CSS-only. */
export function createTypography(options: TypographyOptions = {}): Record<TypographyTokenRole, TypeStyle> {
  const brand = options.brandFontFamily ?? 'Roboto, system-ui, sans-serif';
  const plain = options.plainFontFamily ?? 'Roboto, system-ui, sans-serif';

  if (typeof brand !== 'string' || typeof plain !== 'string' || !brand.trim() || !plain.trim()) {
    throw new TypeError('Font families must not be empty.');
  }

  for (const name of Object.keys(options)) {
    if (name !== 'brandFontFamily' && name !== 'plainFontFamily' && !Object.hasOwn(definitions, name)) {
      throw new TypeError(`Unknown typography role: ${name}`);
    }
  }

  return Object.fromEntries(
    Object.entries(definitions).map(([name, [fontSize, lineHeight, fontWeight, letterSpacing]]) => {
      const role = name as TypographyTokenRole;
      const overrides = options[role];

      if (overrides !== undefined && (!overrides || typeof overrides !== 'object' || Array.isArray(overrides))) {
        throw new TypeError(`typography.${role} must be a style object.`);
      }

      const style: TypeStyle = {
        fontFamily: /^(display|headline)|^titleLarge/.test(role) ? brand : plain,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,
        ...overrides,
      };

      for (const property of Object.keys(overrides ?? {})) {
        if (!properties.includes(property as keyof TypeStyle)) {
          throw new TypeError(`Unknown typography property: ${role}.${property}`);
        }
      }

      if (typeof style.fontFamily !== 'string' || !style.fontFamily.trim()) {
        throw new TypeError(`typography.${role}.fontFamily must not be empty.`);
      }

      for (const property of ['fontSize', 'lineHeight', 'fontWeight', 'letterSpacing'] as const) {
        const value = style[property];
        const positive = property === 'fontSize' || property === 'lineHeight';
        const invalidWeight = property === 'fontWeight' && (value < 1 || value > 1000);

        if (!Number.isFinite(value) || (positive && value <= 0) || invalidWeight) {
          throw new TypeError(`Invalid typography.${role}.${property}.`);
        }
      }

      return [role, style];
    }),
  ) as Record<TypographyTokenRole, TypeStyle>;
}
