import { weekStart } from './calendar-date';

export function keyboardDate(day: Temporal.PlainDate, key: string, shift: boolean, rtl: boolean, firstDay: number) {
  switch (key) {
    case 'ArrowLeft':
      return day.add({ days: rtl ? 1 : -1 });
    case 'ArrowRight':
      return day.add({ days: rtl ? -1 : 1 });
    case 'ArrowUp':
      return day.subtract({ days: 7 });
    case 'ArrowDown':
      return day.add({ days: 7 });
    case 'Home':
      return weekStart(day, firstDay);
    case 'End':
      return weekStart(day, firstDay).add({ days: 6 });
    case 'PageUp':
      return day.subtract(shift ? { years: 1 } : { months: 1 });
    case 'PageDown':
      return day.add(shift ? { years: 1 } : { months: 1 });
    default:
      return null;
  }
}
