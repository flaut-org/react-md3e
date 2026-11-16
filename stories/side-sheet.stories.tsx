import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Button, SideSheet, TextField, Typography } from '@flaut-travel/react-md3e';

const frame: Decorator = (Story) => (
  <main>
    <h1>SideSheet</h1>
    <Story />
  </main>
);

const meta = {
  title: 'Components/SideSheet',
  component: SideSheet,
  tags: ['autodocs'],
  decorators: [frame],
  args: {
    'aria-label': 'Settings',
    'trigger': <Button>Open settings</Button>,
    'header': (
      <Typography component="h2" variant="titleLarge">
        Settings
      </Typography>
    ),
    'children': <TextField label="Setting" />,
  },
} satisfies Meta<typeof SideSheet>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Standard: Story = { args: { variant: 'standard', defaultOpen: true } };
export const RightToLeft: Story = { args: { dir: 'rtl' } };
export const Start: Story = { args: { anchor: 'start' } };
