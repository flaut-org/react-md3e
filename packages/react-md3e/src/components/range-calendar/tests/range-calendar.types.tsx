import { createRef } from 'react';
import { RangeCalendar } from '@flaut-travel/react-md3e/range-calendar';
import type { RangeCalendarProps } from '@flaut-travel/react-md3e/range-calendar';

export const range = (
  <RangeCalendar
    ref={createRef<HTMLDivElement>()}
    defaultValue={['2024-02-29', null]}
    onChange={(value) => value[0]?.day}
  />
);
export const isoRange = <RangeCalendar valueFormat="iso" onChange={(value) => value[0]?.toUpperCase()} />;
export const options: RangeCalendarProps = {
  calendars: 3,
  rangePosition: 'end',
  shouldDisableDate: (day, position) => position === 'end' && day.day === 13,
};
// @ts-expect-error Ranges have exactly two endpoints.
export const missingEndpoint = <RangeCalendar value={['2024-02-29']} />;
// @ts-expect-error RangeCalendar only has a day view.
export const monthView = <RangeCalendar view="month" />;
// @ts-expect-error Legacy Date is not an endpoint.
export const legacyRange = <RangeCalendar value={[new Date(), null]} />;
