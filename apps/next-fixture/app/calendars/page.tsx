import Link from 'next/link';
import { Calendar, RangeCalendar, ThemeProvider } from '@flaut-travel/react-md3e';
import { CalendarDemo } from './calendar-demo/calendar-demo.component';

export default function CalendarsPage() {
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Material calendars</h1>
        <section>
          <h2>Server-rendered calendars</h2>
          <div className="fixture-row">
            <Calendar aria-label="Server calendar" defaultValue="2024-02-29" today="2024-02-29" readOnly />
            <Calendar aria-label="Disabled calendar" defaultValue="2024-02-29" today="2024-02-29" disabled />
          </div>
          <RangeCalendar
            aria-label="Server range"
            defaultValue={['2024-02-27', '2024-03-04']}
            today="2024-02-29"
            readOnly
          />
        </section>
        <CalendarDemo />
        <section>
          <h2>Locale, direction and date boundaries</h2>
          <div className="fixture-row">
            <Calendar aria-label="Ukrainian calendar" locale="uk-UA" defaultValue="2024-03-15" today="2024-03-15" />
            <Calendar
              aria-label="Arabic calendar"
              locale="ar-EG"
              dir="rtl"
              defaultValue="2024-03-15"
              today="2024-03-15"
            />
            <Calendar
              aria-label="Zoned calendar"
              timezone="America/Los_Angeles"
              value="2024-03-01T01:30:00Z"
              today="2024-02-29"
            />
          </div>
          <Calendar
            aria-label="Weeks calendar"
            referenceDate="2024-02-15"
            today="2024-02-29"
            locale="en-GB"
            fixedWeekNumber={6}
            showDaysOutsideCurrentMonth
            displayWeekNumber
          />
        </section>
        <ThemeProvider colorScheme="dark">
          <h2>Dark theme</h2>
          <Calendar aria-label="Dark calendar" defaultValue="2024-02-29" today="2024-02-29" />
        </ThemeProvider>
        <Link href="/">Back to components</Link>
      </main>
    </ThemeProvider>
  );
}
