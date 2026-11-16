import { cardMedia } from './card-media.styles';
import type { CardMediaProps } from './card-media.types';

export function CardMedia({ className, alt, ...props }: CardMediaProps) {
  return (
    <img {...props} alt={alt} className={[cardMedia, className].filter(Boolean).join(' ')} data-md3-card-media="" />
  );
}
