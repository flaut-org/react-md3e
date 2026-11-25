import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { BottomSheet, Button, TextField, Typography } from '@flaut-travel/react-md3e';

const frame: Decorator = (Story) => (
  <main>
    <h1>BottomSheet</h1>
    <Story />
  </main>
);

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  decorators: [frame],
  args: {
    'aria-label': 'Passengers',
    'trigger': <Button>Open passengers</Button>,
    'header': (
      <Typography component="h2" variant="titleLarge">
        Passengers
      </Typography>
    ),
    'children': <TextField label="Passenger note" />,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Standard: Story = { args: { variant: 'standard', defaultOpen: true } };
export const Retained: Story = { args: { keepMounted: true } };
export const NoGestures: Story = { args: { disableSwipe: true } };
