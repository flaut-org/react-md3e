import { useState } from 'react';
import { Button, DateRangePicker } from '@flaut-travel/react-md3e';
import type { RangeCalendarValue } from '@flaut-travel/react-md3e';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: { label: 'Travel dates', today: '2024-02-29', referenceDate: '2024-02-29' },
  argTypes: {
    variant: { control: 'select', options: ['responsive', 'docked', 'modal'] },
    fieldType: { control: 'select', options: ['single-input', 'multi-input'] },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const SingleInput: Story = { args: { fieldType: 'single-input' } };
export const MultiInput: Story = { args: { fieldType: 'multi-input' } };
export const Docked: Story = { args: { variant: 'docked' } };
export const Modal: Story = { args: { variant: 'modal' } };
export const Responsive: Story = { args: { variant: 'responsive' } };
export const FullScreen: Story = { args: { variant: 'modal', fullScreen: true } };
export const ModalRangeInput: Story = { args: { variant: 'modal', defaultMode: 'input' } };
export const MultipleMonths: Story = {
  args: { variant: 'docked', calendars: 3, defaultValue: ['2024-02-29', '2024-04-10'] },
};
export const AcrossYears: Story = { args: { defaultValue: ['2024-12-31', '2025-01-05'] } };
export const Validation: Story = {
  args: {
    minDate: '2024-02-10',
    maxDate: '2024-05-20',
    shouldDisableDate: (day, position) => position === 'end' && day.dayOfWeek > 5,
  },
};
export const Clearable: Story = { args: { defaultValue: ['2024-02-29', '2024-03-10'], clearable: true } };
export const RightToLeft: Story = { args: { locale: 'ar-EG', dir: 'rtl' } };

function ControlledRange() {
  const [value, setValue] = useState<RangeCalendarValue<'iso'>>([null, null]);

  return (
    <>
      <DateRangePicker
        label="Controlled range"
        value={value}
        valueFormat="iso"
        onChange={setValue}
        today="2024-02-29"
      />
      <output>{value.join(' – ')}</output>
    </>
  );
}

export const Controlled: Story = { render: () => <ControlledRange /> };

function RangeForm() {
  const [result, setResult] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
      }}
    >
      <DateRangePicker label="Travel dates" name="trip" required today="2024-02-29" />
      <Button type="submit">Submit</Button>
      <Button type="reset">Reset</Button>
      <output>{result}</output>
    </form>
  );
}

export const HtmlForm: Story = { render: () => <RangeForm /> };
