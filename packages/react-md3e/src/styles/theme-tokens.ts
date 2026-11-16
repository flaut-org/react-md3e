import defaultTheme from '../theme/default-theme.generated.json';
import { kebabCase } from '../tokens/material-tokens';
import type { ColorRole, TypeScaleRole, TypographyTokenRole } from '../theme/theme.types';
import type { StyleObject } from './style-object.types';

/** Build-time token references with defaults for components outside ThemeProvider. */
export const color = (role: ColorRole) =>
  `var(--md-sys-color-${kebabCase(role)}, light-dark(${defaultTheme.schemes.light[role]}, ${defaultTheme.schemes.dark[role]}))`;

export function typography(role: TypeScaleRole, emphasized = false) {
  const token = `--md-sys-typescale-${emphasized ? 'emphasized-' : ''}${kebabCase(role)}`;
  const tokenRole: TypographyTokenRole = emphasized ? `${role}Emphasized` : role;
  const fallback = defaultTheme.typography[tokenRole];

  return {
    fontFamily: `var(${token}-font, ${fallback.fontFamily})`,
    fontSize: `var(${token}-size, ${fallback.fontSize / 16}rem)`,
    lineHeight: `var(${token}-line-height, ${fallback.lineHeight / 16}rem)`,
    fontWeight: `var(${token}-weight, ${fallback.fontWeight})`,
    letterSpacing: `var(${token}-tracking, ${fallback.letterSpacing / 16}rem)`,
  } satisfies StyleObject;
}

// Static sampling of the MD3 Expressive fast-spatial spring (stiffness 800, damping 0.6).
// The browser interpolates a precompiled CSS curve; no JavaScript animation loop is used.
export const springCurve = `linear(${Array.from({ length: 41 }, (_, index) => {
  if (index === 0) {
    return '0';
  }

  if (index === 40) {
    return '1';
  }

  const t = (index / 40) * 0.4;
  const omega = Math.sqrt(800);
  const damped = omega * Math.sqrt(1 - 0.6 ** 2);

  return (
    1 -
    Math.exp(-0.6 * omega * t) * (Math.cos(damped * t) + (0.6 / Math.sqrt(1 - 0.6 ** 2)) * Math.sin(damped * t))
  ).toFixed(5);
}).join(', ')})`;
