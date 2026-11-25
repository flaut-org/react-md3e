import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Tooltip } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main>
        <h1>Tooltip</h1>
        <Story />
      </main>
    ),
  ],
  args: { title: 'Helpful description', children: <Button>Hover or focus</Button>, placement: 'top' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };
export const DisabledControl: Story = {
  args: {
    children: (
      <span tabIndex={0} role="button" aria-disabled="true" aria-label="Unavailable action">
        <Button disabled>Unavailable</Button>
      </span>
    ),
  },
};
