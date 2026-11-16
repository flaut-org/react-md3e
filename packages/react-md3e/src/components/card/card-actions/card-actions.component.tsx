import { cardActions } from './card-actions.styles';
import type { CardActionsProps } from './card-actions.types';

export function CardActions({ disableSpacing = false, className, ...props }: CardActionsProps) {
  return (
    <div
      {...props}
      className={[cardActions, className].filter(Boolean).join(' ')}
      data-md3-card-actions=""
      data-disable-spacing={disableSpacing}
    />
  );
}
