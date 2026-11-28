import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, DatePicker, DateRangePicker } from '@flaut-travel/react-md3e';
import { OverlayStress } from './overlay-stress/overlay-stress.component';

const meta = {
  title: 'QA/DatePicker',
  component: DatePicker,
  args: { label: 'Departure', today: '2024-02-29', referenceDate: '2024-02-29', variant: 'docked' },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Selected: Story = { args: { defaultValue: '2024-02-29' } };
export const OpenModal: Story = { args: { variant: 'modal', defaultOpen: true } };
export const NestedOverlays: Story = { render: () => <OverlayStress /> };
export const Localized: Story = {
  args: { locale: 'uk-UA', label: 'Дата початку тривалої подорожі для всієї родини', fullWidth: true },
  parameters: { uiQuality: { layout: 'narrow', fontScale: 1.5 } },
};
export const RangePreview: Story = {
  render: () => (
    <DateRangePicker
      label="Travel dates"
      variant="docked"
      calendars={1}
      today="2024-02-29"
      referenceDate="2024-02-01"
    />
  ),
};
export const ButtonStates: Story = {
  render: () => (
    <div className="story-row">
      <Button>Continue</Button>
      <Button variant="tonal">Secondary</Button>
      <Button variant="outlined" disabled>
        Unavailable
      </Button>
    </div>
  ),
};
