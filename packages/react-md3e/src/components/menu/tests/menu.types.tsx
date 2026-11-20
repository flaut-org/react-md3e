import { createRef } from 'react';
import { Button } from '@flaut-travel/react-md3e/button';
import {
  Menu,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioGroup,
  MenuSubmenu,
  MenuDivider,
  MenuGroup,
} from '@flaut-travel/react-md3e/menu';

export const menu = (
  <Menu
    trigger={<Button>Options</Button>}
    variant="vibrant"
    density={-2}
    placement="top-end"
    ref={createRef<HTMLDivElement>()}
    onOpenChange={(open, event) => {
      event.preventDefault();

      return open;
    }}
  >
    <MenuGroup label="Commands">
      <MenuItem ref={createRef<HTMLElement>()} href="/next" leading="☆">
        Next
      </MenuItem>
    </MenuGroup>
    <MenuDivider />
    <MenuCheckboxItem
      checked
      onChange={(event, checked) => {
        event.preventDefault();

        return checked;
      }}
    >
      Bold
    </MenuCheckboxItem>
    <MenuRadioGroup defaultValue="first" label="Order" onChange={(_event, value) => value === 'first'}>
      <MenuRadioItem value="first">First</MenuRadioItem>
    </MenuRadioGroup>
    <MenuSubmenu label="More">
      <MenuItem>Details</MenuItem>
    </MenuSubmenu>
  </Menu>
);

export const groupedMenu = (
  <Menu trigger={<Button>Grouped</Button>} layout="grouped">
    <MenuGroup label="Actions">
      <MenuItem>Copy</MenuItem>
    </MenuGroup>
  </Menu>
);
// @ts-expect-error Menu layouts are a finite public contract.
export const invalidLayout = <Menu trigger={<Button>Open</Button>} layout="separated" />;
// @ts-expect-error A button trigger is required.
export const missingTrigger = <Menu />;
// @ts-expect-error Native MD3 color styles are finite.
export const invalidVariant = <Menu trigger={<button type="button">Open</button>} variant="contained" />;
// @ts-expect-error Density has four defined levels.
export const invalidDensity = <Menu trigger={<button type="button">Open</button>} density={1} />;
// @ts-expect-error Radio items require a stable value.
export const missingRadioValue = <MenuRadioItem>First</MenuRadioItem>;
// @ts-expect-error Selection changes expose native events, not Base UI details.
export const privateEvent = <MenuCheckboxItem onChange={(event) => event.cancel()}>Bold</MenuCheckboxItem>;
// @ts-expect-error A menu always owns menu semantics.
export const invalidRole = <Menu trigger={<button type="button">Open</button>} role="dialog" />;
