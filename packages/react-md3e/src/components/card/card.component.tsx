import { Surface } from '../surface/surface.component';
import { cardRoot } from './card.styles';
import type { SurfaceElement, SurfaceProps } from '../surface/surface.types';
import type { CardProps } from './card.types';

const colors = { filled: 'surfaceContainerHighest', elevated: 'surfaceContainerLow', outlined: 'surface' } as const;

/** A noninteractive container; compose a CardActionArea for an independently hydrated primary action. */
export function Card<C extends SurfaceElement = 'div'>({
  component,
  variant = 'filled',
  shape = 'medium',
  dragged = false,
  className,
  ...props
}: CardProps<C>) {
  return (
    <Surface<C>
      {...(props as SurfaceProps<C>)}
      component={component}
      shape={shape}
      color={colors[variant]}
      elevation={variant === 'elevated' ? 1 : 0}
      variant={variant === 'outlined' ? 'outlined' : 'filled'}
      clip
      className={[cardRoot, className].filter(Boolean).join(' ')}
      data-md3-card=""
      data-variant={variant}
      data-dragged={dragged}
    />
  );
}
