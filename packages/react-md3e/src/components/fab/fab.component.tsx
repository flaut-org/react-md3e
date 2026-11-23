import type { ReactElement } from 'react';
import { FabButton } from '../fab-button/fab-button.component';
import type { FabProps, FabLinkProps } from './fab.types';

export function Fab(props: FabLinkProps): ReactElement;
export function Fab(props: FabProps): ReactElement;

export function Fab(props: FabProps | FabLinkProps) {
  return <FabButton {...props} iconOnly data-md3-fab="" />;
}
