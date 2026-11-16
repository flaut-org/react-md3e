import { createElement } from 'react';
import { surfaceRoot } from './surface.styles';
import type { SurfaceElement, SurfaceProps } from './surface.types';

/** A CSS-only surface. No client boundary, context or theme calculations are needed. */
export function Surface<C extends SurfaceElement = 'div'>({
  component,
  shape = 'medium',
  color = 'surface',
  elevation = 0,
  variant = 'filled',
  clip = false,
  className,
  ...props
}: SurfaceProps<C>) {
  return createElement(component ?? 'div', {
    ...props,
    'className': [surfaceRoot, className].filter(Boolean).join(' '),
    'data-md3-surface': '',
    'data-shape': shape,
    'data-color': color,
    'data-elevation': elevation,
    'data-surface-variant': variant,
    'data-clip': clip,
  });
}
