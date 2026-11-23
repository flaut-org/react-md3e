import { Button } from '../button/button.component';
import { fabButton } from './fab-button.styles';
import type { FabButtonProps } from './fab-button.types';

/** Shared presentation; Button retains the native interaction/ripple client boundary. */
export function FabButton({
  size = 'regular',
  color = 'primaryContainer',
  lowered = false,
  iconOnly = false,
  extended = true,
  startIcon,
  className,
  children,
  ...props
}: FabButtonProps) {
  const appearance = {
    'className': [fabButton, className].filter(Boolean).join(' '),
    'data-md3-fab-button': '',
    'data-fab-size': size,
    'data-fab-color': color,
    'data-lowered': lowered,
    'data-icon-only': iconOnly,
    'data-extended': extended,
    'startIcon': startIcon,
  } as const;
  const content = iconOnly ? (
    <span data-md3-fab-icon="" aria-hidden="true">
      {children}
    </span>
  ) : (
    children
  );

  if ('href' in props) {
    return (
      <Button {...props} {...appearance}>
        {content}
      </Button>
    );
  }

  return (
    <Button {...props} {...appearance}>
      {content}
    </Button>
  );
}
