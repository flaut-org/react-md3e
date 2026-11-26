import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Button, Tooltip, Typography } from '@flaut-travel/react-md3e';
import { DynamicTooltip } from './tooltip/dynamic-tooltip/dynamic-tooltip.component';

const frame: Decorator = (Story) => (
  <main>
    <h1>Tooltip</h1>
    <Story />
  </main>
);

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [frame],
  args: { title: 'Helpful description', children: <Button>Hover or focus</Button>, placement: 'top' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };
export const FormattedText: Story = {
  args: {
    title: (
      <>
        Delete <strong>selected items</strong>
      </>
    ),
  },
};
export const Rich: Story = {
  args: {
    'variant': 'rich',
    'aria-label': 'Baggage information',
    'title': 'Carry-on baggage: 8 kg. Checked baggage: 23 kg.',
  },
};
export const RichWithHeadline: Story = {
  args: { variant: 'rich', headline: 'Baggage allowance', title: 'Carry-on baggage: 8 kg.' },
};
export const RichWithActions: Story = {
  args: {
    variant: 'rich',
    headline: 'Baggage allowance',
    title: <Typography variant="bodyMedium">Review the allowance included in your fare.</Typography>,
    actions: (
      <>
        <Button variant="text">Got it</Button>
        <a href="#baggage">Learn more</a>
      </>
    ),
    arrow: true,
  },
};
export const CustomComponent: Story = {
  args: {
    title: (
      <Typography component="span" variant="bodySmall">
        Custom React content
      </Typography>
    ),
  },
};
export const DynamicContent: Story = { render: () => <DynamicTooltip /> };
export const LongContent: Story = {
  args: {
    variant: 'rich',
    headline: 'Baggage conditions',
    title: 'Carry-on baggage is included. Review the fare conditions before departure. '.repeat(6),
  },
};
export const DisabledInteractivity: Story = {
  args: { disableInteractive: true, title: 'This hint is also available in the visible instructions.' },
};
export const Persistent: Story = {
  args: {
    variant: 'rich',
    persistent: true,
    headline: 'New baggage feature',
    title: 'Open with a click or tap; Escape or click outside to dismiss.',
  },
};
export const DisabledControl: Story = {
  args: {
    children: (
      <span tabIndex={0} role="button" aria-disabled="true" aria-label="Unavailable action">
        <Button disabled>Unavailable</Button>
      </span>
    ),
  },
};
