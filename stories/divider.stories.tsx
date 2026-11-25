import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main>
        <h1>Divider</h1>
        <Story />
      </main>
    ),
  ],
  args: { orientation: 'horizontal', variant: 'fullWidth' },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Inset: Story = { args: { variant: 'inset' } };
export const Vertical: Story = {
  args: { orientation: 'vertical', flexItem: true },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: 80, gap: 16 }}>
        <span>Language</span>
        <Story />
        <span>Currency</span>
      </div>
    ),
  ],
};
