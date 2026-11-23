import { FabMenu, FabMenuItem } from '@flaut-travel/react-md3e';
import { FabMenu as StandaloneFabMenu } from '@flaut-travel/react-md3e/fab-menu';

const children = (
  <>
    <FabMenuItem icon="+" onClick={(event) => event.preventDefault()}>
      Document
    </FabMenuItem>
    <FabMenuItem href="/folder">Folder</FabMenuItem>
  </>
);
const props = { children, label: 'Create', icon: '+' };

export const menu = (
  <FabMenu
    {...props}
    color="secondary"
    size="medium"
    onOpenChange={(_open, event) => event.preventDefault()}
    onClose={() => false}
    fabProps={{ ref: (element) => element?.focus(), disableRipple: true }}
    menuProps={{ offset: 8, modal: false, ref: (element) => element?.focus() }}
    ref={(element) => element?.focus()}
  />
);
export const standalone = <StandaloneFabMenu {...props} defaultOpen />;
// @ts-expect-error The trigger needs an accessible action name.
export const noLabel = <FabMenu icon="+">{children}</FabMenu>;
// @ts-expect-error The menu needs its closed-state icon.
export const noIcon = <FabMenu label="Create">{children}</FabMenu>;
// @ts-expect-error FAB Menu supports the three tone families.
export const invalidColor = <FabMenu {...props} color="primaryContainer" />;
// @ts-expect-error The legacy 40px FAB is not a menu toggle size.
export const legacy = <FabMenu {...props} size="small" />;
// @ts-expect-error Toggle semantics cannot be replaced by native button props.
export const toggleSemantics = <FabMenu {...props} fabProps={{ 'aria-expanded': true }} />;
// @ts-expect-error Related actions are not selectable settings controls.
export const selected = <FabMenuItem selected>Document</FabMenuItem>;
