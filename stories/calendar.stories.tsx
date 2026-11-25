import { useState } from 'react';
import { Calendar, Surface } from '@flaut-travel/react-md3e';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { 'defaultValue': '2026-11-18', 'today': '2026-11-18', 'aria-label': 'Choose a date' },
  parameters: {
    docs: {
      description: {
        component:
          'Inline Material calendar using native Temporal.PlainDate and Intl. No field, popup, adapter or localization provider is required. Component styles load automatically.',
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithSurface: Story = {
  render: (args) => (
    <Surface color="surfaceContainerHigh" shape="extraLarge" style={{ inlineSize: 'fit-content' }}>
      <Calendar {...args} />
    </Surface>
  ),
};
export const ReducedMotion: Story = { args: { reduceAnimations: true } };
export const MonthAndYear: Story = { args: { views: ['year', 'month', 'day'] } };
export const YearView: Story = { args: { openTo: 'year' } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const FixedWeeks: Story = {
  args: { fixedWeekNumber: 6, showDaysOutsideCurrentMonth: true, displayWeekNumber: true },
};
export const Ukrainian: Story = { args: { locale: 'uk-UA' } };
export const RightToLeft: Story = { args: { locale: 'ar-EG', dir: 'rtl' } };
export const Validation: Story = {
  args: { minDate: '2026-11-10', maxDate: '2026-12-20', shouldDisableDate: (day) => day.dayOfWeek > 5 },
};

function ControlledCalendar() {
  const [value, setValue] = useState<string | null>('2026-11-18');

  return (
    <div>
      <Calendar value={value} valueFormat="iso" onChange={setValue} today="2026-11-18" />
      <output>{value}</output>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledCalendar /> };
