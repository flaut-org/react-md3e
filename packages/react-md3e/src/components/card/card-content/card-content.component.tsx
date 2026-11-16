import { cardContent } from './card-content.styles';
import type { CardContentProps } from './card-content.types';

export function CardContent({ className, ...props }: CardContentProps) {
  return <div {...props} className={[cardContent, className].filter(Boolean).join(' ')} data-md3-card-content="" />;
}
