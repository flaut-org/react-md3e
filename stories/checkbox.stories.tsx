import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from '@flaut-org/react-md3e';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { 'aria-label': 'Travel updates' },
  parameters: {
    docs: {
      description: {
        component:
          'Base UI form checkbox with MD3 colors, a 48px target, mixed/error states, compiled state layers and ripple. Label with a wrapping label or aria-label. onChange receives the native event and checked boolean.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Error: Story = { args: { error: true, defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
export const ReadOnly: Story = { args: { readOnly: true, defaultChecked: true } };
export const WithoutRipple: Story = { args: { disableRipple: true } };

function ControlledExample() {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <label>
        <Checkbox checked={checked} onChange={(_event, next) => setChecked(next)} /> Travel updates
      </label>
      <p>Checked: {String(checked)}</p>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
