import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Toolbar,
  Button,
  IconButton,
  Divider,
  Fab,
  TextField,
  Checkbox,
  Switch,
  ButtonGroup,
  ButtonGroupButton,
  Tooltip,
} from '@flaut-travel/react-md3e';
import {
  ExpandableToolbarExample,
  OverflowToolbarExample,
  ScrollToolbarExample,
} from './toolbar-examples/toolbar-examples.component';

const actions = (
  <>
    <IconButton aria-label="Undo" variant="standard">
      ↶
    </IconButton>
    <IconButton aria-label="Redo" variant="standard">
      ↷
    </IconButton>
    <IconButton aria-label="Bold" variant="tonal" selected>
      B
    </IconButton>
    <IconButton aria-label="Share" variant="standard">
      S
    </IconButton>
  </>
);
const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  args: { 'aria-label': 'Editor actions', 'variant': 'docked', 'children': actions },
  argTypes: {
    color: { control: 'select', options: ['standard', 'vibrant'] },
    variant: { control: 'select', options: ['docked', 'floating'] },
    children: { control: false },
    leading: { control: false },
    trailing: { control: false },
    primaryAction: { control: false },
    fab: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'MD3 Expressive docked/floating action panels. Standard/vibrant colors include scoped Button, IconButton, Divider and FAB roles. Arrow keys use one roving tab stop; fields retain their editing keys. keyboardNavigation={false} preserves a passive RSC group. Overflow actions provide both their toolbar control and MenuItem explicitly. See docs/components/toolbar.md for tokens, provenance and platform limits.',
      },
    },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docked: Story = {};
export const DockedStandard: Story = { args: { color: 'standard' } };
export const DockedVibrant: Story = { args: { color: 'vibrant' } };
export const DockedWithPrimaryAction: Story = {
  args: { primaryAction: <Button>Publish</Button>, trailing: <Button variant="text">Settings</Button> },
};
export const DockedWithGroupedActions: Story = {
  args: {
    children: (
      <>
        <IconButton aria-label="Undo" variant="standard">
          ↶
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <ButtonGroup aria-label="Text styles" variant="standard">
          <ButtonGroupButton value="bold">Bold</ButtonGroupButton>
          <ButtonGroupButton value="italic">Italic</ButtonGroupButton>
          <ButtonGroupButton value="underline">Underline</ButtonGroupButton>
        </ButtonGroup>
      </>
    ),
  },
};
export const DesktopTextEditor: Story = {
  args: {
    shape: 'rounded',
    leading: <Button variant="text">Undo</Button>,
    children: (
      <>
        <Button variant="text">File</Button>
        <Button variant="text">Edit</Button>
        <Divider orientation="vertical" flexItem />
        {actions}
      </>
    ),
    trailing: <TextField label="Find in document" />,
  },
};
export const HorizontalFloating: Story = { args: { variant: 'floating' } };
export const VerticalFloating: Story = { args: { variant: 'floating', orientation: 'vertical' } };
export const FloatingStandard: Story = { args: { variant: 'floating', color: 'standard' } };
export const FloatingVibrant: Story = { args: { variant: 'floating', color: 'vibrant' } };
export const HorizontalFloatingWithFab: Story = {
  args: { variant: 'floating', fab: <Fab aria-label="Create">+</Fab> },
};
export const VerticalFloatingWithFab: Story = {
  args: {
    variant: 'floating',
    color: 'vibrant',
    orientation: 'vertical',
    fabPosition: 'start',
    fab: <Fab aria-label="Create">+</Fab>,
  },
};
export const FloatingWithOverflowMenu: Story = { render: () => <OverflowToolbarExample /> };
export const Responsive: Story = { render: () => <OverflowToolbarExample /> };
export const Expandable: Story = { render: () => <ExpandableToolbarExample /> };
export const Collapsible: Story = { render: () => <ExpandableToolbarExample fab /> };
export const HideOnScroll: Story = { render: () => <ScrollToolbarExample behavior="hide" /> };
export const CollapseOnScroll: Story = { render: () => <ScrollToolbarExample behavior="collapse" /> };
export const WithTextField: Story = { args: { trailing: <TextField label="Search tools" /> } };
export const MixedComponents: Story = {
  args: {
    children: (
      <>
        <Tooltip title="Undo">
          <IconButton variant="standard" aria-label="Undo">
            ↶
          </IconButton>
        </Tooltip>
        <Checkbox aria-label="Show marks" />
        <Switch aria-label="Live preview" />
        <Divider orientation="vertical" flexItem />
        <Button variant="text">Preview</Button>
      </>
    ),
  },
};
export const Rtl: Story = { args: { variant: 'floating', dir: 'rtl' } };
export const DisabledActions: Story = {
  args: {
    children: (
      <>
        <IconButton aria-label="Undo" variant="standard">
          ↶
        </IconButton>
        <IconButton disabled aria-label="Redo" variant="standard">
          ↷
        </IconButton>
        <Button disabled variant="text">
          Share
        </Button>
        <Button>Publish</Button>
      </>
    ),
  },
};
export const Dense: Story = { args: { dense: true } };
export const WithoutElevation: Story = { args: { variant: 'floating', elevation: 0 } };
