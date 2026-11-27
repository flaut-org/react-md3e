import { DateRangeField } from '@flaut-travel/react-md3e';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/DateRangeField',
  component: DateRangeField,
  tags: ['autodocs'],
  args: { label: 'Dates', today: '2024-02-29' },
} satisfies Meta<typeof DateRangeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleInput: Story = { args: { defaultValue: ['2024-02-29', '2024-03-10'] } };
export const MultiInput: Story = { args: { fieldType: 'multi-input', defaultValue: ['2024-02-29', '2024-03-10'] } };
export const PartialRange: Story = { args: { defaultValue: ['2024-02-29', null] } };
export const ReversedRange: Story = { args: { defaultValue: ['2024-03-10', '2024-02-29'] } };
export const Localized: Story = {
  args: { locale: 'uk-UA', fieldType: 'multi-input', defaultValue: ['2024-02-29', '2024-03-10'] },
};
export const Clearable: Story = { args: { clearable: true, defaultValue: ['2024-02-29', '2024-03-10'] } };
