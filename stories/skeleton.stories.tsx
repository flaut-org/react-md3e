import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main>
        <h1>Skeleton</h1>
        <Story />
      </main>
    ),
  ],
  args: { variant: 'rounded', width: 240, height: 80, animation: 'pulse' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Text: Story = { args: { variant: 'text', height: 24 } };
export const Circular: Story = { args: { variant: 'circular', width: 48, height: 48 } };
export const Wave: Story = { args: { animation: 'wave' } };
export const Static: Story = { args: { animation: false } };
