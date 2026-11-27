import Link from 'next/link';
import { DateField, DateRangeField, DatePicker, ThemeProvider } from '@flaut-travel/react-md3e';
import { DatePickerDemo } from './date-picker-demo/date-picker-demo.component';

export default function DatePickersPage() {
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Material date pickers</h1>
        <section aria-label="Server date fields">
          <DateField label="Server date" defaultValue="2024-02-29" today="2024-02-29" />
          <DateRangeField label="Server period" defaultValue={['2024-02-29', '2024-03-10']} today="2024-02-29" />
          <DatePicker label="Server picker" defaultValue="2024-02-29" today="2024-02-29" />
        </section>
        <DatePickerDemo />
        <Link href="/">Back to components</Link>
      </main>
    </ThemeProvider>
  );
}
