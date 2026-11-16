import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Collapsible, TextField } from '@flaut-org/react-md3e';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main>
        <h1>Collapsible</h1>
        <Story />
      </main>
    ),
  ],
  args: { trigger: <Button>Travel details</Button>, children: <TextField label="Travel note" />, keepMounted: true },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const InitiallyOpen: Story = { args: { defaultOpen: true } };
export const Disabled: Story = { args: { disabled: true } };
