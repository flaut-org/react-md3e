import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import { Avatar } from '../avatar/avatar.component';
import {
  listLeading,
  listContent,
  listPrimary,
  listSecondary,
  listOverline,
  listTrailing,
} from './list-item-content.styles';
import type { ListItemContentProps, ListControlPosition } from './list-item-content.types';

export function ListItemContent({
  primary,
  secondary,
  overline,
  children,
  leading,
  leadingKind = 'icon',
  trailing,
  trailingKind = 'text',
  indicator,
  controlPosition = 'end',
}: ListItemContentProps & { readonly indicator?: ReactNode; readonly controlPosition?: ListControlPosition }) {
  return (
    <>
      {controlPosition === 'start' && indicator}
      {leading != null && (
        <span className={listLeading} data-leading-kind={leadingKind} aria-hidden="true">
          {leadingKind === 'avatar' && !isValidElement(leading) ? <Avatar>{leading}</Avatar> : leading}
        </span>
      )}
      <span className={listContent}>
        {overline != null && <span className={listOverline}>{overline}</span>}
        <span className={listPrimary} data-md3-list-primary="">
          {primary ?? children}
        </span>
        {secondary != null && (
          <span className={listSecondary} data-md3-list-secondary="">
            {secondary}
          </span>
        )}
      </span>
      {(trailing != null || (controlPosition === 'end' && indicator != null)) && (
        <span className={listTrailing} data-trailing-kind={trailingKind}>
          {trailing != null && <span>{trailing}</span>}
          {controlPosition === 'end' && indicator}
        </span>
      )}
    </>
  );
}
