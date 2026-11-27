import { defaultLocaleText } from '../calendar/calendar-date';
import type { DatePickerLocaleText, DateValidationError } from './date-entry.types';

const englishErrors: Record<Exclude<DateValidationError, null>, string> = {
  invalidDate: 'Enter a valid date',
  incompleteDate: 'Complete the date',
  required: 'A date is required',
  minDate: 'Date is before the minimum',
  maxDate: 'Date is after the maximum',
  disablePast: 'Past dates are unavailable',
  disableFuture: 'Future dates are unavailable',
  shouldDisableDate: 'This date is unavailable',
  shouldDisableMonth: 'This month is unavailable',
  shouldDisableYear: 'This year is unavailable',
  incompleteRange: 'Enter both start and end dates',
  invalidRange: 'End date must be on or after start date',
};
const english: DatePickerLocaleText = {
  ...defaultLocaleText,
  chooseDate: 'Choose date',
  chooseRange: 'Choose date range',
  selectDate: 'Select date',
  selectRange: 'Select date range',
  enterDate: 'Enter date',
  enterRange: 'Enter date range',
  start: 'Start date',
  end: 'End date',
  cancel: 'Cancel',
  accept: 'OK',
  clear: 'Clear',
  calendarMode: 'Switch to calendar',
  inputMode: 'Switch to text input',
  previousMonths: 'Previous months',
  nextMonths: 'Next months',
  error: (error, format) => `${englishErrors[error]}. ${format}`,
};
const ukrainianErrors: typeof englishErrors = {
  invalidDate: 'Введіть коректну дату',
  incompleteDate: 'Введіть повну дату',
  required: 'Дата обов’язкова',
  minDate: 'Дата раніше мінімальної',
  maxDate: 'Дата пізніше максимальної',
  disablePast: 'Минулі дати недоступні',
  disableFuture: 'Майбутні дати недоступні',
  shouldDisableDate: 'Ця дата недоступна',
  shouldDisableMonth: 'Цей місяць недоступний',
  shouldDisableYear: 'Цей рік недоступний',
  incompleteRange: 'Введіть початок і кінець періоду',
  invalidRange: 'Кінцева дата має бути не раніше початкової',
};
const ukrainian: DatePickerLocaleText = {
  ...defaultLocaleText,
  previousMonth: 'Попередній місяць',
  nextMonth: 'Наступний місяць',
  calendarLabel: 'Календар',
  loading: 'Завантаження календаря',
  weekNumber: 'Тиждень',
  switchView: (view) => ({ day: 'Вибрати день', month: 'Вибрати місяць', year: 'Вибрати рік' })[view],
  chooseDate: 'Вибрати дату',
  chooseRange: 'Вибрати період',
  selectDate: 'Виберіть дату',
  selectRange: 'Виберіть період',
  enterDate: 'Введіть дату',
  enterRange: 'Введіть період',
  start: 'Початкова дата',
  end: 'Кінцева дата',
  cancel: 'Скасувати',
  accept: 'ОК',
  clear: 'Очистити',
  calendarMode: 'Перейти до календаря',
  inputMode: 'Перейти до введення дати',
  previousMonths: 'Попередні місяці',
  nextMonths: 'Наступні місяці',
  error: (error, format) => `${ukrainianErrors[error]}. ${format}`,
};

export function dateEntryLocale(locale: string, overrides?: Partial<DatePickerLocaleText>): DatePickerLocaleText {
  return { ...(new Intl.Locale(locale).language === 'uk' ? ukrainian : english), ...overrides };
}
