import { useState } from 'react';
import { RangeCalendar, Surface } from '@flaut-travel/react-md3e';
import type { RangeCalendarValue } from '@flaut-travel/react-md3e';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  args: {
    'defaultValue': ['2026-11-18', '2026-12-04'],
    'today': '2026-11-18',
    'aria-label': 'Choose a date range',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Range selection composed from Calendar, with contiguous range bands, previews and mouse/pen endpoint dragging. Use DateRangePicker for integrated fields, modal confirmation and date entry. Calendar and its dependency styles load automatically.',
      },
    },
  },
} satisfies Meta<typeof RangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithSurface: Story = {
  render: (args) => (
    <Surface color="surfaceContainerHigh" shape="extraLarge" style={{ inlineSize: 'fit-content' }}>
      <RangeCalendar {...args} />
    </Surface>
  ),
};
export const OneMonth: Story = { args: { calendars: 1 } };
export const ThreeMonths: Story = { args: { calendars: 3, currentMonthCalendarPosition: 2 } };
export const RightToLeft: Story = { args: { locale: 'ar-EG', dir: 'rtl' } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const WithoutDragging: Story = { args: { disableDragEditing: true } };
export const PositionValidation: Story = {
  args: { shouldDisableDate: (day, position) => position === 'end' && day.dayOfWeek > 5 },
};

function ControlledRange() {
  const [value, setValue] = useState<RangeCalendarValue<'iso'>>(['2026-11-18', '2026-12-04']);

  return (
    <div>
      <RangeCalendar value={value} valueFormat="iso" onChange={setValue} today="2026-11-18" />
      <output>{value.join(' – ')}</output>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledRange /> };
