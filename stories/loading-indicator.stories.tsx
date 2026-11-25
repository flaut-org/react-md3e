import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingIndicator } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/LoadingIndicator',
  component: LoadingIndicator,
  tags: ['autodocs'],
  args: { 'aria-label': 'Loading results', 'variant': 'uncontained', 'size': 48, 'color': 'primary' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['uncontained', 'contained'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'inherit'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'RSC-compatible MD3 loading indicator. Seven official shapes morph in a CSS-only indeterminate loop. Numeric value selects a circle-to-soft-burst morph. Contained/uncontained, custom themes and reduced motion are supported.',
      },
    },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Contained: Story = { args: { variant: 'contained' } };
export const Determinate: Story = { args: { value: 60 } };
export const Sizes: Story = {
  render: (args) => (
    <div className="story-row">
      {[24, 48, 72].map((size) => (
        <LoadingIndicator {...args} size={size} key={size} />
      ))}
    </div>
  ),
};
