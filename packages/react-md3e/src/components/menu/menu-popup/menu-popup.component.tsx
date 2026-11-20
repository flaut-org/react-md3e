'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { usePortalContainer } from '../../../internal/hooks/use-portal-container.hook';
import { menuPortal, menuPositioner, menuPopup } from '../menu.styles';
import type { MenuProps, MenuSurfaceProps } from '../menu.types';

interface MenuPopupProps extends MenuSurfaceProps {
  readonly labelledBy: string;
  readonly side: 'top' | 'bottom' | 'left' | 'right' | 'inline-end';
  readonly align: 'start' | 'end' | 'center';
  readonly anchorEl?: MenuProps['anchorEl'];
  readonly nested?: boolean;
}

export function MenuPopup({
  labelledBy,
  side,
  align,
  anchorEl,
  nested = false,
  container,
  keepMounted = true,
  offset = 4,
  collisionPadding = 8,
  positionMethod = 'fixed',
  variant = 'standard',
  density = 0,
  layout = 'standard',
  finalFocus,
  className,
  dir,
  ...props
}: MenuPopupProps) {
  const { anchorRef, host, direction } = usePortalContainer(container);
  const resolvedDirection = dir ?? direction;

  return (
    <>
      <span hidden ref={anchorRef} />
      {host && (
        <BaseMenu.Portal container={host} keepMounted={keepMounted} className={menuPortal} dir={resolvedDirection}>
          <BaseMenu.Positioner
            anchor={anchorEl}
            side={side}
            align={align}
            sideOffset={offset}
            collisionPadding={collisionPadding}
            positionMethod={positionMethod}
            className={menuPositioner}
            data-md3-menu-layout={layout}
          >
            <BaseMenu.Popup
              {...props}
              finalFocus={finalFocus}
              dir={resolvedDirection}
              aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelledBy)}
              className={[menuPopup, className].filter(Boolean).join(' ')}
              data-md3-menu=""
              data-variant={variant}
              data-density={density}
              data-layout={layout}
              data-nested={nested}
            />
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      )}
    </>
  );
}
