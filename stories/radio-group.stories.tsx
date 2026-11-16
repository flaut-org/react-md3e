import '@flaut-travel/react-md3e/radio/styles.css';
import '@flaut-travel/react-md3e/radio-group/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio, RadioGroup } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { 'aria-label': 'Cabin', 'defaultValue': 'economy', 'name': 'cabin' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <label>
        <Radio value="economy" /> Economy
      </label>
      <label>
        <Radio value="business" /> Business
      </label>
      <label>
        <Radio value="first" disabled /> First class
      </label>
    </RadioGroup>
  ),
};
export const Horizontal: Story = { ...Playground, args: { row: true } };
export const RightToLeft: Story = { ...Playground, args: { row: true, dir: 'rtl' } };
export const ReadOnly: Story = { ...Playground, args: { readOnly: true } };
export const Disabled: Story = { ...Playground, args: { disabled: true } };

function ControlledExample() {
  const [value, setValue] = useState('economy');

  return (
    <>
      <RadioGroup aria-label="Cabin" value={value} onChange={(_event, next) => setValue(next)}>
        <label>
          <Radio value="economy" /> Economy
        </label>
        <label>
          <Radio value="business" /> Business
        </label>
      </RadioGroup>
      <p>Selected: {value}</p>
    </>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
