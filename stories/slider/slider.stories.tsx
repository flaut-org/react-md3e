import './slider.stories.css';

import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@flaut-travel/react-md3e';

const frame: Decorator = (Story) => (
  <main>
    <h1>Slider</h1>
    <div className="story-slider-stack">
      <Story />
    </div>
  </main>
);
const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [frame],
  args: { label: 'Volume', defaultValue: 40 },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = {
  render: () => (
    <>
      {(['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
        <Slider key={size} size={size} label={size} defaultValue={50} />
      ))}
    </>
  ),
};
export const Centered: Story = {
  args: { variant: 'centered', min: -100, max: 100, defaultValue: -35, label: 'Balance' },
};
export const Range: Story = {
  render: () => (
    <Slider
      label="Price range"
      variant="range"
      defaultValue={[20, 80]}
      getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
      valueLabelDisplay="auto"
    />
  ),
};
export const Stops: Story = { args: { marks: true, step: 10, valueLabelDisplay: 'auto' } };
export const LabeledStops: Story = {
  args: {
    marks: [
      { value: 0, label: 'Low' },
      { value: 50, label: 'Medium' },
      { value: 100, label: 'High' },
    ],
  },
};
export const InsetIcon: Story = {
  render: () => <Slider label="Brightness" size="medium" icon="☀" defaultValue={70} valueLabelDisplay="auto" />,
};
export const Vertical: Story = {
  render: () => (
    <div className="story-slider-vertical">
      <Slider label="Level" orientation="vertical" defaultValue={40} valueLabelDisplay="auto" />
      <Slider label="Balance" variant="centered" orientation="vertical" min={-100} max={100} defaultValue={-30} />
    </div>
  ),
};
export const ValueLabel: Story = { args: { valueLabelDisplay: 'on', valueLabelFormat: (value) => `${value}%` } };
export const Disabled: Story = { args: { disabled: true } };
export const RightToLeft: Story = { args: { dir: 'rtl' } };
