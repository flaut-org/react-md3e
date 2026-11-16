import { createElement } from 'react';
import type { ElementType } from 'react';
import { typographyRoot } from './typography.styles';
import type { TypographyProps } from './typography.types';

/** Semantic HTML and compiled type tokens; no hooks, context or client boundary. */
export function Typography<C extends ElementType = 'span'>({
  component,
  variant = 'bodyLarge',
  emphasized = false,
  color = 'inherit',
  align = 'inherit',
  noWrap = false,
  className,
  ...props
}: TypographyProps<C>) {
  return createElement(component ?? 'span', {
    ...props,
    'className': [typographyRoot, className].filter(Boolean).join(' '),
    'data-md3-typography': '',
    'data-variant': variant,
    'data-emphasized': emphasized,
    'data-color': color,
    'data-align': align,
    'data-no-wrap': noWrap,
  });
}
