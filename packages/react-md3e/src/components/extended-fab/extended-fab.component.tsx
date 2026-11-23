import type { ReactElement } from 'react';
import { FabButton } from '../fab-button/fab-button.component';
import { extendedFab } from './extended-fab.styles';
import type { ExtendedFabProps, ExtendedFabLinkProps } from './extended-fab.types';

export function ExtendedFab(props: ExtendedFabLinkProps): ReactElement;
export function ExtendedFab(props: ExtendedFabProps): ReactElement;

export function ExtendedFab({
  size = 'small',
  extended = true,
  startIcon,
  className,
  children,
  ...props
}: ExtendedFabProps | ExtendedFabLinkProps) {
  const label = props['aria-label'] ?? (typeof children === 'string' ? children : undefined);

  if (!extended && (startIcon == null || (!label && !props['aria-labelledby']))) {
    throw new TypeError('A collapsed ExtendedFab needs an icon and an accessible name.');
  }

  return (
    <FabButton
      {...props}
      size={size === 'small' ? 'regular' : size}
      startIcon={startIcon}
      extended={extended}
      aria-label={props['aria-labelledby'] ? props['aria-label'] : label}
      className={[extendedFab, className].filter(Boolean).join(' ')}
      data-md3-extended-fab=""
    >
      <span data-md3-extended-fab-label="" aria-hidden={!extended || undefined}>
        {children}
      </span>
    </FabButton>
  );
}
