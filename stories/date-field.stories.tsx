import { DateField } from '@flaut-travel/react-md3e';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/DateField',
  component: DateField,
  tags: ['autodocs'],
  args: { label: 'Date', today: '2024-02-29' },
  parameters: {
    docs: {
      description: {
        component:
          'Section-masked Gregorian entry using Temporal and the existing TextField. Digits advance through the locale sections automatically. Incomplete text stays editable; native forms submit ISO dates. No adapter/provider is required.',
      },
    },
  },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const InputMask: Story = {
  args: {
    label: 'Date field',
    helperText: 'Click, then type 02292024. Separators and section selection are automatic.',
  },
};
export const Filled: Story = { args: { variant: 'filled', defaultValue: '2024-02-29' } };
export const Outlined: Story = { args: { variant: 'outlined', defaultValue: '2024-02-29' } };
export const Clearable: Story = { args: { clearable: true, defaultValue: '2024-02-29' } };
export const Ukrainian: Story = { args: { locale: 'uk-UA', label: 'Дата', defaultValue: '2024-02-29' } };
export const Arabic: Story = { args: { locale: 'ar-EG', dir: 'rtl', defaultValue: '2024-02-29' } };
export const ExplicitFormat: Story = { args: { format: 'yyyy-MM-dd', helperText: 'YYYY-MM-DD' } };
export const Validation: Story = {
  args: {
    minDate: '2024-02-10',
    maxDate: '2024-03-20',
    shouldDisableDate: (day) => day.dayOfWeek > 5,
    helperText: 'Try 02/31/2024, 02/2 or a weekend',
  },
};
export const Required: Story = { args: { required: true } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: '2024-02-29' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: '2024-02-29' } };
