import { Toolbar, ToolbarOverflow, Button, Fab, MenuItem } from '@flaut-travel/react-md3e';
import { Toolbar as SubpathToolbar } from '@flaut-travel/react-md3e/toolbar';
import type { ToolbarOverflowAction } from '@flaut-travel/react-md3e/toolbar';

const actions: readonly ToolbarOverflowAction[] = [
  { id: 'save', control: <Button>Save</Button>, menuItem: <MenuItem>Save</MenuItem>, overflow: 'never', priority: 2 },
];

export const docked = (
  <Toolbar aria-label="Commands" dense shape="rounded" fullWidth ref={(node) => node?.focus()}>
    <Button>Save</Button>
  </Toolbar>
);
export const floating = (
  <SubpathToolbar
    variant="floating"
    aria-label="Tools"
    color="vibrant"
    orientation="vertical"
    fab={<Fab aria-label="Create">+</Fab>}
    defaultExpanded={false}
    onExpandedChange={(next, event) => {
      if (next) {
        event.preventDefault();
      }
    }}
  >
    <ToolbarOverflow label="More tools" actions={actions} />
  </SubpathToolbar>
);
export const server = (
  <Toolbar aria-label="Status" keyboardNavigation={false}>
    <span>Saved</span>
  </Toolbar>
);
// @ts-expect-error Docked toolbars are horizontal.
export const verticalDocked = <Toolbar aria-label="Commands" variant="docked" orientation="vertical" />;
// @ts-expect-error A docked toolbar uses an embedded primary action.
export const dockedFab = <Toolbar aria-label="Commands" fab={<Fab aria-label="Create">+</Fab>} />;
// @ts-expect-error Collapse is a floating-only scroll behavior.
export const dockedCollapse = <Toolbar aria-label="Commands" scrollBehavior="collapse" />;
// @ts-expect-error Floating toolbars size to their content.
export const fullFloating = <Toolbar aria-label="Commands" variant="floating" fullWidth />;
// @ts-expect-error Toolbar colors use MD3 configurations.
export const palette = <Toolbar aria-label="Commands" color="primary" />;

// @ts-expect-error Overflow menu representation is explicit.
const implicitAction: ToolbarOverflowAction = { id: 'save', control: <Button>Save</Button> };

export const implicitMenu = <ToolbarOverflow label="More tools" actions={[implicitAction]} />;
