import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/popover/styles.css';
import '@flaut-travel/react-md3e/text-field/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Popover, PopoverClose, TextField } from '@flaut-travel/react-md3e';
import { PassengerPickerDemo } from './passenger-picker-demo/passenger-picker-demo.component';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    'trigger': <Button>Open popover</Button>,
    'aria-label': 'Travel options',
    'placement': 'bottom-start',
    'modal': false,
    'keepMounted': false,
    'matchAnchorWidth': false,
    'disablePadding': false,
    'children': (
      <>
        <TextField label="Travel note" fullWidth />
        <PopoverClose variant="text">Done</PopoverClose>
      </>
    ),
  },
  argTypes: {
    trigger: { control: false },
    children: { control: false },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
    container: { control: false },
    anchorEl: { control: false },
    initialFocus: { control: false },
    finalFocus: { control: false },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An anchored interactive dialog on Base UI Popover, styled with Material 3 theme roles. Click toggles, Escape/outside press dismiss, focus returns appropriately, and nested themes survive the portal. Default is nonmodal; PopoverClose closes uncontrolled panels. This is a web composition, not a separately standardized MD3 component.',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Passengers: Story = { render: () => <PassengerPickerDemo /> };
export const TopEnd: Story = { args: { placement: 'top-end' } };
export const KeepMounted: Story = { args: { keepMounted: true } };
export const Modal: Story = { args: { modal: true } };
export const MatchAnchorWidth: Story = {
  args: { matchAnchorWidth: true, trigger: <Button className="popover-match-trigger">Open wide popover</Button> },
};
export const Disabled: Story = { args: { disabled: true } };
export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
    children: (
      <>
        <TextField label="الاسم" fullWidth />
        <PopoverClose variant="text">إغلاق</PopoverClose>
      </>
    ),
  },
};

function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover
        aria-label="Controlled options"
        trigger={<Button>Controlled popover</Button>}
        open={open}
        onOpenChange={(next) => setOpen(next)}
      >
        <TextField label="Travel note" fullWidth />
        <PopoverClose variant="text">Done</PopoverClose>
      </Popover>
      <p>Open: {String(open)}</p>
    </>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
