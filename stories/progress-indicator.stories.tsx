import '@flaut-travel/react-md3e/progress-indicator/styles.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressIndicator } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Operation progress',
    'type': 'linear',
    'appearance': 'flat',
    'value': 40,
    'thickness': 4,
    'color': 'primary',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['linear', 'circular'] },
    appearance: { control: 'inline-radio', options: ['flat', 'wavy'] },
    variant: { control: 'select', options: [undefined, 'determinate', 'indeterminate'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
    thickness: { control: 'inline-radio', options: [4, 8] },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'MD3 linear/circular progress with flat/wavy appearances, rounded caps, track gaps, a linear stop indicator and thin/thick tracks. Numeric values are determinate; omit value or use variant="indeterminate" for unknown duration. Static RSC markup and native CSS animation.',
      },
    },
  },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Circular: Story = { args: { type: 'circular' } };
export const WavyLinear: Story = { args: { appearance: 'wavy' } };
export const WavyCircular: Story = { args: { type: 'circular', appearance: 'wavy' } };
export const Indeterminate: Story = { args: { variant: 'indeterminate', value: null } };
export const WavyLinearIndeterminate: Story = {
  args: { type: 'linear', appearance: 'wavy', variant: 'indeterminate', value: null },
  parameters: {
    docs: {
      description: {
        story:
          'Two moving wavy segments for unknown-duration work. Omit value; wave motion and segment travel are native CSS.',
      },
    },
  },
};
export const Thick: Story = { args: { appearance: 'wavy', thickness: 8 } };
export const RightToLeft: Story = { args: { dir: 'rtl' } };
