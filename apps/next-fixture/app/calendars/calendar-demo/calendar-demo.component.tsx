'use client';

import { useRef, useState } from 'react';
import { Button, Calendar, CalendarDay, RangeCalendar } from '@flaut-travel/react-md3e';
import type { CalendarDayProps, RangeCalendarValue, RangePosition } from '@flaut-travel/react-md3e';

function DecoratedDay(props: CalendarDayProps) {
  const { children, day } = props;

  return (
    <CalendarDay {...props}>
      {children}
      {day.day === 20 && <span aria-hidden="true"> ·</span>}
    </CalendarDay>
  );
}

export function CalendarDemo() {
  const [single, setSingle] = useState<string | null>('2024-02-28');
  const [selection, setSelection] = useState('');
  const [viewSelection, setViewSelection] = useState('');
  const [range, setRange] = useState<RangeCalendarValue<'iso'>>(['2024-02-27', '2024-03-04']);
  const [position, setPosition] = useState<RangePosition>('start');
  const [rangeSelection, setRangeSelection] = useState('');
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section>
        <h2>Single date</h2>
        <Calendar
          ref={calendarRef}
          aria-label="Single date"
          value={single}
          valueFormat="iso"
          today="2024-02-29"
          minDate="2024-01-01"
          maxDate="2025-12-31"
          onChange={(day, state, view) => {
            setSingle(day);
            setSelection(`${day}/${state}/${view}`);
          }}
          slots={{ day: DecoratedDay }}
          slotProps={{
            day: (state) => ({
              onClick: (event) => {
                if (state.day.day === 15) {
                  event.preventDefault();
                }
              },
            }),
          }}
        />
        <output data-testid="single-selection">{selection}</output>
        <Button onClick={() => setSingle('2025-01-31')}>Set date from code</Button>
        <Button
          onClick={() => {
            calendarRef.current?.setAttribute('data-ref-checked', 'true');
            rangeRef.current?.setAttribute('data-ref-checked', 'true');
          }}
        >
          Check calendar refs
        </Button>
      </section>
      <section>
        <h2>Month and year selection</h2>
        <Calendar
          aria-label="Calendar views"
          defaultValue="2024-02-29"
          today="2024-02-29"
          minDate="2023-01-01"
          maxDate="2026-12-31"
          views={['year', 'month', 'day']}
          onChange={(day, state, view) => setViewSelection(`${day.toString()}/${state}/${view}`)}
        />
        <output data-testid="view-selection">{viewSelection}</output>
      </section>
      <section>
        <h2>Validation and loading</h2>
        <Calendar
          aria-label="Limited calendar"
          referenceDate="2024-02-10"
          today="2024-02-29"
          minDate="2024-02-05"
          maxDate="2024-04-15"
          shouldDisableDate={(day) => day.day === 14}
          loading={loading}
          renderLoading={() => <span>Fetching dates</span>}
        />
        <Button onClick={() => setLoading((current) => !current)}>Toggle calendar loading</Button>
        <Calendar aria-label="Past calendar" today="2024-02-15" referenceDate="2024-02-15" disablePast />
        <Calendar aria-label="Future calendar" today="2024-02-15" referenceDate="2024-02-15" disableFuture />
        <Calendar
          aria-label="Temporal calendar"
          defaultValue={Temporal.PlainDate.from('2024-02-29')}
          today="2024-02-29"
        />
      </section>
      <section>
        <h2>Date range</h2>
        <RangeCalendar
          ref={rangeRef}
          aria-label="Travel dates"
          value={range}
          valueFormat="iso"
          rangePosition={position}
          onRangePositionChange={setPosition}
          onChange={(next, state) => {
            setRange(next);
            setRangeSelection(`${next[0] ?? ''}/${next[1] ?? ''}/${state}`);
          }}
          today="2024-02-29"
          minDate="2024-01-01"
          maxDate="2024-12-31"
          shouldDisableDate={(day, rangePosition) => rangePosition === 'end' && day.day === 13}
        />
        <output data-testid="range-selection">{rangeSelection}</output>
        <output data-testid="range-position">{position}</output>
        <Button
          onClick={() => {
            setRange([null, null]);
            setPosition('start');
          }}
        >
          Clear range
        </Button>
        <Button onClick={() => setPosition('end')}>Edit end date</Button>
        <RangeCalendar aria-label="One month range" calendars={1} today="2024-02-29" referenceDate="2024-02-01" />
        <RangeCalendar
          aria-label="Three month range"
          calendars={3}
          currentMonthCalendarPosition={2}
          defaultValue={['2024-02-27', '2024-03-04']}
          today="2024-02-29"
        />
      </section>
    </>
  );
}
