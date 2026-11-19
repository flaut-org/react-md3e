import '@flaut-travel/react-md3e/segmented-button/styles.css';

import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ButtonSegment, SegmentedButton } from '@flaut-travel/react-md3e';

const frame: Decorator = (Story) => (
  <main>
    <h1>SegmentedButton</h1>
    <Story />
  </main>
);

const meta = {
  title: 'Components/SegmentedButton',
  component: SegmentedButton,
  tags: ['autodocs'],
  decorators: [frame],
  args: {
    'aria-label': 'Calendar view',
    'defaultValue': 'week',
    'children': (
      <>
        <ButtonSegment value="day">Day</ButtonSegment>
        <ButtonSegment value="week">Week</ButtonSegment>
        <ButtonSegment value="month">Month</ButtonSegment>
      </>
    ),
  },
} satisfies Meta<typeof SegmentedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Multiple: Story = { args: { selectionMode: 'multiple', defaultValue: ['day', 'week'] } };
export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true } };
export const RightToLeft: Story = { args: { dir: 'rtl' } };
export const Icons: Story = {
  args: {
    children: (
      <>
        <ButtonSegment value="day" icon="☀">
          Day
        </ButtonSegment>
        <ButtonSegment value="week" icon="▦">
          Week
        </ButtonSegment>
        <ButtonSegment value="month" icon="▤">
          Month
        </ButtonSegment>
      </>
    ),
  },
};
export const IconOnly: Story = {
  args: {
    'aria-label': 'Alignment',
    'defaultValue': 'left',
    'children': (
      <>
        <ButtonSegment value="left" icon="≡" aria-label="Align left" />
        <ButtonSegment value="center" icon="≡" aria-label="Align center" />
        <ButtonSegment value="right" icon="≡" aria-label="Align right" />
      </>
    ),
  },
};
export const CustomIndicator: Story = { args: { selectedIcon: <span>◆</span> } };
export const HiddenIndicator: Story = { args: { hideSelectionIndicator: true } };
