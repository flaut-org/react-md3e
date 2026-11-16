import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextField } from '@flaut-org/react-md3e';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Traveler name', helperText: 'Name shown on your booking', variant: 'outlined' },
  argTypes: { variant: { control: 'inline-radio', options: ['filled', 'outlined'] } },
  parameters: {
    docs: {
      description: {
        component:
          'MD3 filled/outlined text field with a CSS floating label and measured-by-layout outline notch. Base UI Input supplies native input behavior. Label/helper IDs are connected in server HTML. CSS is precompiled; no style measurements or runtime rule insertion.',
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Filled: Story = { args: { variant: 'filled' } };
export const WithValue: Story = { args: { defaultValue: 'Alex Morgan' } };
export const Error: Story = { args: { error: true, defaultValue: '?', helperText: 'Use the name on your passport' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Alex Morgan' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Alex Morgan' } };
export const Required: Story = { args: { required: true } };
export const Multiline: Story = {
  args: { label: 'Notes', multiline: true, rows: 3, defaultValue: 'A window seat, please.' },
};
export const WithAdornments: Story = {
  args: {
    label: 'Price',
    type: 'number',
    defaultValue: '25',
    InputProps: { startAdornment: '€', endAdornment: 'EUR' },
  },
};
export const RightToLeft: Story = { args: { dir: 'rtl', label: 'الاسم', defaultValue: 'علي' } };

function ControlledExample() {
  const [value, setValue] = useState('');

  return (
    <>
      <TextField label="Traveler name" value={value} onChange={(event) => setValue(event.target.value)} />
      <p>Value: {value}</p>
    </>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
