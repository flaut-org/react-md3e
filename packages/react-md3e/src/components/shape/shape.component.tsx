import { shapeRoot } from './shape.styles';
import type { ShapeProps } from './shape.types';

/** Build-time expressive contours; CSS handles morphing without a client boundary. */
export function Shape({
  variant = 'cookie9Sided',
  morph = true,
  size = 'medium',
  color = 'primaryContainer',
  className,
  ...props
}: ShapeProps) {
  const named = Boolean(props['aria-label']?.trim() || props['aria-labelledby']?.trim());

  return (
    <div
      {...props}
      className={[shapeRoot, className].filter(Boolean).join(' ')}
      data-md3-shape=""
      data-variant={variant}
      data-morph={morph}
      data-size={size}
      data-color={color}
      role={named ? 'img' : undefined}
      aria-hidden={props['aria-hidden'] ?? (!named || undefined)}
    />
  );
}
