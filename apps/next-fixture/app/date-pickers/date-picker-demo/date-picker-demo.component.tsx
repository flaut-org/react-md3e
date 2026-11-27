'use client';

import { useState } from 'react';
import {
  Button,
  DateField,
  DateRangeField,
  DatePicker,
  DateRangePicker,
  Dialog,
  DialogTitle,
  DialogContent,
  ThemeProvider,
} from '@flaut-travel/react-md3e';
import type { RangeCalendarValue } from '@flaut-travel/react-md3e';

export function DatePickerDemo() {
  const [date, setDate] = useState<string | null>('2024-02-28');
  const [accepted, setAccepted] = useState('');
  const [source, setSource] = useState('');
  const [range, setRange] = useState<RangeCalendarValue<'iso'>>(['2024-02-27', '2024-03-04']);
  const [rangeAccepted, setRangeAccepted] = useState('');
  const [changedMonth, setChangedMonth] = useState('');
  const [open, setOpen] = useState(false);
  const [parent, setParent] = useState(false);
  const [submitted, setSubmitted] = useState('');

  return (
    <>
      <section aria-label="Docked example">
        <DatePicker
          label="Docked date"
          variant="docked"
          value={date}
          valueFormat="iso"
          today="2024-02-29"
          onChange={(next, context) => {
            setDate(next);
            setSource(context.source);
          }}
          onAccept={(next) => setAccepted(next ?? 'empty')}
          clearable
        />
        <output data-testid="draft-date">{date}</output>
        <output data-testid="accepted-date">{accepted}</output>
        <output data-testid="date-source">{source}</output>
      </section>
      <section aria-label="Modal example">
        <DatePicker
          label="Modal date"
          variant="modal"
          defaultValue="2024-02-28"
          today="2024-02-29"
          clearable
          onAccept={(next) => setAccepted(next?.toString() ?? 'empty')}
        />
        <DatePicker
          label="Modal input date"
          variant="modal"
          defaultMode="input"
          defaultValue="2024-02-28"
          today="2024-02-29"
          required
        />
        <DatePicker
          label="Controlled date"
          variant="docked"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          today="2024-02-29"
        />
        <Button onClick={() => setOpen(true)}>Open controlled picker</Button>
        <DatePicker label="Responsive date" today="2024-02-29" />
      </section>
      <section aria-label="Range examples">
        <DateRangePicker
          label="Docked range"
          variant="docked"
          value={range}
          valueFormat="iso"
          onChange={setRange}
          onAccept={(next) => setRangeAccepted(next.join('/'))}
          today="2024-02-29"
          clearable
        />
        <DateRangePicker
          label="Modal range"
          variant="modal"
          defaultValue={['2024-02-27', '2024-03-04']}
          today="2024-02-29"
          onAccept={(next) => setRangeAccepted(next.map((day) => day?.toString()).join('/'))}
          clearable
        />
        <DateRangePicker label="Range input" variant="modal" defaultMode="input" today="2024-02-29" />
        <DateRangePicker
          label="Multi range"
          fieldType="multi-input"
          startLabel="Multi start"
          endLabel="Multi end"
          variant="docked"
          today="2024-02-29"
        />
        <DateRangePicker
          label="Bounded range"
          variant="modal"
          today="2024-02-29"
          referenceDate="2028-12-31"
          minDate="2024-01-10"
          maxDate="2024-04-15"
          onMonthChange={(month) => setChangedMonth(month.toString())}
        />
        <output data-testid="range-month">{changedMonth}</output>
        <output data-testid="range-accepted">{rangeAccepted}</output>
      </section>
      <section aria-label="Date entry">
        <DateField label="Leap date" defaultValue="2024-02-29" today="2024-02-29" clearable />
        <DateField
          label="Bounded date"
          minDate="2024-02-10"
          maxDate="2024-03-20"
          today="2024-02-29"
          shouldDisableDate={(day) => day.dayOfWeek > 5}
        />
        <DateField label="Past restriction" today="2024-02-29" disablePast />
        <DateField label="Future restriction" today="2024-02-29" disableFuture />
        <DateField label="Ukrainian date" locale="uk-UA" today="2024-02-29" defaultValue="2024-02-29" />
        <DateField label="ISO format" format="yyyy-MM-dd" today="2024-02-29" />
        <DateRangeField label="Range field" today="2024-02-29" />
        <DateRangeField fieldType="multi-input" startLabel="Start field" endLabel="End field" today="2024-02-29" />
      </section>
      <section aria-label="Date form">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
          }}
        >
          <DatePicker
            name="departure"
            label="Form date"
            variant="docked"
            defaultValue="2024-02-29"
            today="2024-02-29"
            required
          />
          <DateRangePicker
            name="trip"
            label="Form range"
            variant="modal"
            today="2024-02-29"
            defaultValue={['2024-02-29', '2024-03-10']}
          />
          <DateField name="birthday" label="Form field" defaultValue="2024-02-29" today="2024-02-29" required />
          <Button type="submit">Submit dates</Button>
          <Button type="reset">Reset dates</Button>
        </form>
        <output data-testid="date-form-result">{submitted}</output>
      </section>
      <section aria-label="Nested picker">
        <Button onClick={() => setParent(true)}>Open parent dialog</Button>
        <Dialog open={parent} onClose={() => setParent(false)} role="dialog">
          <DialogTitle>Booking</DialogTitle>
          <DialogContent>
            <DatePicker label="Nested date" variant="docked" today="2024-02-29" />
            <Button onClick={() => setParent(false)}>Close booking</Button>
          </DialogContent>
        </Dialog>
      </section>
      <section aria-label="Scrollable picker" style={{ maxHeight: 160, overflow: 'auto' }}>
        <div style={{ minHeight: 300 }}>
          <DatePicker label="Scroll date" variant="docked" today="2024-02-29" />
        </div>
      </section>
      <ThemeProvider colorScheme="dark">
        <section aria-label="Dark picker">
          <DatePicker label="Dark date" variant="modal" defaultValue="2024-02-29" today="2024-02-29" />
        </section>
      </ThemeProvider>
      <section aria-label="RTL picker" dir="rtl">
        <DatePicker label="Arabic date" locale="ar-EG" variant="docked" today="2024-02-29" defaultValue="2024-02-29" />
      </section>
      <DatePicker label="Disabled date" disabled today="2024-02-29" />
      <DatePicker label="Read only date" readOnly variant="docked" defaultValue="2024-02-29" today="2024-02-29" />
    </>
  );
}
