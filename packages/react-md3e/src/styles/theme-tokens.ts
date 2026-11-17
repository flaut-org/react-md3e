import defaultTheme from '../theme/default-theme.generated.json';
import { kebabCase } from '../tokens/material-tokens';
import type {
  Breakpoint,
  ColorRole,
  MotionKind,
  MotionSpeed,
  TypeScaleRole,
  TypographyTokenRole,
} from '../theme/theme.types';
import type { StyleObject } from './style-object.types';

export const breakpoint = (name: Breakpoint) => `var(--md-breakpoint-${name}, ${defaultTheme.breakpoints[name]}px)`;

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

/** Token references and fallback values are resolved by the CSS compiler, never an animation loop. */
export function motionDuration(kind: MotionKind, speed: MotionSpeed = 'fast') {
  return `var(--md-sys-motion-spring-${speed}-${kind}-duration, ${defaultTheme.motion[speed][kind].duration}ms)`;
}

export function motionEasing(kind: MotionKind, speed: MotionSpeed = 'fast') {
  return `var(--md-sys-motion-spring-${speed}-${kind}-easing, ${defaultTheme.motion[speed][kind].easing})`;
}

export function motion(kind: MotionKind, speed: MotionSpeed = 'fast') {
  return `${motionDuration(kind, speed)} ${motionEasing(kind, speed)}`;
}
