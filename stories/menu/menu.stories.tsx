import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Menu,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSubmenu,
  MenuGroup,
  MenuDivider,
} from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    trigger: <Button>Open menu</Button>,
    variant: 'standard',
    density: 0,
    placement: 'bottom-start',
    children: (
      <>
        <MenuItem leading="☆" trailing="⌘N">
          New document
        </MenuItem>
        <MenuItem supportingText="Open an existing document">Open document</MenuItem>
        <MenuItem disabled>Unavailable command</MenuItem>
        <MenuDivider />
        <MenuItem href="https://m3.material.io/components/menus/overview">Material guidance</MenuItem>
      </>
    ),
  },
  argTypes: {
    trigger: { control: false },
    children: { control: false },
    container: { control: false },
    variant: { control: 'select', options: ['standard', 'vibrant'] },
    density: { control: 'select', options: [0, -1, -2, -3] },
    layout: {
      control: false,
      description: 'Grouped layout requires MenuGroup/RadioGroup surfaces; see Vertical menu with gap.',
    },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Material 3 Expressive vertical menus with command/link items, checkbox and radio selection, groups and cascading submenus. Base UI owns focus, typeahead, keyboard/pointer navigation and dismissal. Component and dependency styles load automatically.',
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Vibrant: Story = { args: { variant: 'vibrant' } };
export const Dense: Story = { args: { density: -3 } };
export const Selection: Story = {
  args: {
    variant: 'vibrant',
    children: (
      <>
        <MenuGroup label="Formatting">
          <MenuCheckboxItem defaultChecked>Bold</MenuCheckboxItem>
          <MenuCheckboxItem>Italic</MenuCheckboxItem>
        </MenuGroup>
        <MenuDivider />
        <MenuRadioGroup label="Sort order" defaultValue="date">
          <MenuRadioItem value="date">Date</MenuRadioItem>
          <MenuRadioItem value="name">Name</MenuRadioItem>
        </MenuRadioGroup>
      </>
    ),
  },
};
export const Submenus: Story = {
  args: {
    children: (
      <>
        <MenuSubmenu label="Share">
          <MenuItem>Copy link</MenuItem>
          <MenuSubmenu label="Export">
            <MenuItem>PDF document</MenuItem>
            <MenuItem>Text document</MenuItem>
          </MenuSubmenu>
        </MenuSubmenu>
        <MenuItem>Other command</MenuItem>
      </>
    ),
  },
};
export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
    children: (
      <>
        <MenuSubmenu label="خيارات">
          <MenuItem>نسخ</MenuItem>
        </MenuSubmenu>
        <MenuItem>حفظ</MenuItem>
      </>
    ),
  },
};

export const VerticalMenuWithGap: Story = {
  name: 'Vertical menu with gap',
  argTypes: { layout: { control: 'select', options: ['standard', 'grouped'] } },
  args: {
    layout: 'grouped',
    style: { width: 216 },
    trigger: <Button>Vertical menu with gap</Button>,
    children: (
      <>
        <MenuGroup aria-label="Main actions">
          <MenuItem leading="◎">Item 1</MenuItem>
          <MenuItem leading="▣" trailing="⌘C">
            Item 2
          </MenuItem>
          <MenuItem leading="✎" selected>
            Item 3
          </MenuItem>
        </MenuGroup>
        <MenuGroup aria-label="More actions">
          <MenuSubmenu label="Item 4" leading="☁">
            <MenuItem>Send to device</MenuItem>
            <MenuItem>Copy cloud link</MenuItem>
          </MenuSubmenu>
        </MenuGroup>
      </>
    ),
  },
};

export const VibrantMenuWithGap: Story = { args: { ...VerticalMenuWithGap.args, variant: 'vibrant' } };
export const RightToLeftWithGap: Story = { args: { ...VerticalMenuWithGap.args, dir: 'rtl' } };
