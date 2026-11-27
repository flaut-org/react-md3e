import { useState } from 'react';
import { Button, DatePicker, Dialog, DialogContent, DialogTitle } from '@flaut-travel/react-md3e';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { label: 'Departure date', today: '2024-02-29', referenceDate: '2024-02-29' },
  argTypes: {
    variant: { control: 'select', options: ['responsive', 'docked', 'modal'] },
    defaultMode: { control: 'select', options: ['calendar', 'input'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'MD3 date selection and entry. Docked Popover accepts a final day; modal Dialog keeps a draft until OK and restores the saved date on Cancel/Escape. TextField appearance is configured through slotProps.textField.variant.',
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Filled: Story = { args: { slotProps: { textField: { variant: 'filled' } } } };
export const Outlined: Story = { args: { slotProps: { textField: { variant: 'outlined' } } } };
export const Docked: Story = { args: { variant: 'docked' } };
export const Modal: Story = { args: { variant: 'modal' } };
export const Responsive: Story = { args: { variant: 'responsive' } };
export const ModalDateInput: Story = { args: { variant: 'modal', defaultMode: 'input' } };
export const ExplicitConfirmation: Story = { args: { variant: 'docked', closeOnSelect: false, clearable: true } };
export const Clearable: Story = { args: { defaultValue: '2024-02-29', clearable: true } };
export const ReadOnly: Story = { args: { defaultValue: '2024-02-29', readOnly: true } };
export const Disabled: Story = { args: { defaultValue: '2024-02-29', disabled: true } };
export const Validation: Story = {
  args: { required: true, minDate: '2024-02-10', maxDate: '2024-03-20', shouldDisableDate: (day) => day.dayOfWeek > 5 },
};
export const Ukrainian: Story = { args: { locale: 'uk-UA', label: 'Дата вильоту', defaultValue: '2024-02-29' } };
export const RightToLeft: Story = {
  args: { locale: 'ar-EG', dir: 'rtl', variant: 'modal', defaultValue: '2024-02-29' },
};
export const MonthYearViews: Story = { args: { views: ['year', 'month', 'day'], openTo: 'year' } };

function ControlledDate() {
  const [value, setValue] = useState<string | null>('2024-02-29');
  const [accepted, setAccepted] = useState('');

  return (
    <>
      <DatePicker
        label="Controlled date"
        value={value}
        valueFormat="iso"
        onChange={setValue}
        onAccept={(next) => setAccepted(next ?? '')}
        today="2024-02-29"
        variant="modal"
      />
      <output>
        Draft: {value}; accepted: {accepted}
      </output>
    </>
  );
}

export const Controlled: Story = { render: () => <ControlledDate /> };

function ControlledOpening() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DatePicker
        label="Date"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        today="2024-02-29"
      />
      <Button onClick={() => setOpen(true)}>Open picker</Button>
    </>
  );
}

export const ControlledOpen: Story = { render: () => <ControlledOpening /> };

function InsideDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Booking</Button>
      <Dialog open={open} onClose={() => setOpen(false)} role="dialog">
        <DialogTitle>Booking dates</DialogTitle>
        <DialogContent>
          <DatePicker label="Departure" variant="docked" today="2024-02-29" />
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const NestedDialog: Story = { render: () => <InsideDialog /> };
export const ScrollContainer: Story = {
  render: (args) => (
    <div style={{ blockSize: 160, overflow: 'auto' }}>
      <div style={{ minBlockSize: 320 }}>
        <DatePicker {...args} variant="docked" />
      </div>
    </div>
  ),
};

function DateForm() {
  const [result, setResult] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
      }}
    >
      <DatePicker label="Departure" name="departure" required today="2024-02-29" />
      <Button type="submit">Submit</Button>
      <Button type="reset">Reset</Button>
      <output>{result}</output>
    </form>
  );
}

export const HtmlForm: Story = { render: () => <DateForm /> };
