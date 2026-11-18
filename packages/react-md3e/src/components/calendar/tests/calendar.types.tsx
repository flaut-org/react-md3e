import { createRef } from 'react';
import { Calendar, CalendarDay } from '@flaut-travel/react-md3e/calendar';
import type { CalendarProps } from '@flaut-travel/react-md3e/calendar';

export const calendar = (
  <Calendar
    ref={createRef<HTMLDivElement>()}
    value={Temporal.PlainDate.from('2024-02-29')}
    onChange={(date, state, view) => `${date.day}/${state}/${view}`}
    views={['year', 'month', 'day']}
    slots={{ day: CalendarDay }}
    slotProps={{ day: ({ day }) => ({ title: day.toString() }) }}
  />
);
export const isoCalendar = <Calendar valueFormat="iso" value="2024-02-29" onChange={(date) => date.toUpperCase()} />;
export const precise: CalendarProps = { value: null, shouldDisableDate: (day) => day.dayOfWeek === 7 };
// @ts-expect-error Legacy Date is not a Calendar value.
export const legacy = <Calendar value={new Date()} />;
// @ts-expect-error The static calendar has no picker open state.
export const picker = <Calendar open />;
// @ts-expect-error There is no time view.
export const time = <Calendar view="hours" />;
// @ts-expect-error ISO callbacks return strings.
export const wrongFormat = <Calendar valueFormat="iso" onChange={(date: Temporal.PlainDate) => date.day} />;
