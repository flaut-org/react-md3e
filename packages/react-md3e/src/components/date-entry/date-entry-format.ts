import { dateFormatter } from '../calendar/calendar-date';
import type { DateValidationError } from './date-entry.types';

export type DateSection = 'year' | 'month' | 'day';
interface FormatPart {
  readonly section: DateSection | null;
  readonly text: string;
}

/** Numeric Gregorian formats only. Parsing never passes through Date, UTC or overflow constraining. */
export function createDateFormat(locale: string, format?: string) {
  const sample = Temporal.PlainDate.from('2006-11-22');
  const number = new Intl.NumberFormat(locale, { useGrouping: false });
  const digits = Array.from({ length: 10 }, (_, index) => number.format(index));
  const localize = (value: string) => value.replace(/\d/g, (digit) => digits[Number(digit)]!);
  const normalize = (value: string) =>
    digits
      .reduce((text, digit, index) => text.replaceAll(digit, String(index)), value)
      .replace(/[\u200e\u200f\u061c]/g, '');
  const tokens: Record<string, DateSection> = { yyyy: 'year', YYYY: 'year', MM: 'month', dd: 'day', DD: 'day' };
  let parts: FormatPart[];

  if (format) {
    parts = format
      .split(/(yyyy|YYYY|MM|dd|DD)/)
      .filter(Boolean)
      .map((text) => ({ section: tokens[text] ?? null, text }));
  } else {
    parts = dateFormatter(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(sample)
      .map((part) => ({
        section: ['year', 'month', 'day'].includes(part.type) ? (part.type as DateSection) : null,
        text: normalize(part.value),
      }));
  }

  if (
    parts.filter((part) => part.section).length !== 3 ||
    new Set(parts.map((part) => part.section).filter(Boolean)).size !== 3 ||
    parts.some((part) => !part.section && /[a-z]/i.test(part.text))
  ) {
    throw new RangeError('Date fields support numeric yyyy, MM and dd exactly once, separated by punctuation.');
  }

  const placeholder = parts
    .map((part) => (part.section ? { year: 'YYYY', month: 'MM', day: 'DD' }[part.section] : part.text))
    .join('');
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `^${parts
      .map((part) => {
        if (!part.section) {
          return escape(part.text);
        }

        return part.section === 'year' ? '(\\d{4})' : '(\\d{1,2})';
      })
      .join('')}$`,
  );
  const sections = parts.filter((part) => part.section).map((part) => part.section!);
  const parse = (raw: string): { date: Temporal.PlainDate | null; error: DateValidationError } => {
    const text = normalize(raw).trim();

    if (!text) {
      return { date: null, error: null };
    }

    let expanded = text;

    // Numeric mobile keyboards can enter all eight digits without punctuation.
    if (/^\d{8}$/.test(text)) {
      let offset = 0;

      expanded = parts
        .map((part) => {
          if (!part.section) {
            return part.text;
          }

          const length = part.section === 'year' ? 4 : 2;
          const section = text.slice(offset, offset + length);

          offset += length;

          return section;
        })
        .join('');
    }

    const match = pattern.exec(expanded);

    if (!match) {
      return { date: null, error: text.replace(/\D/g, '').length < 8 ? 'incompleteDate' : 'invalidDate' };
    }

    const values = Object.fromEntries(sections.map((section, index) => [section, Number(match[index + 1])])) as Record<
      DateSection,
      number
    >;

    try {
      return { date: Temporal.PlainDate.from(values, { overflow: 'reject' }), error: null };
    } catch {
      return { date: null, error: 'invalidDate' };
    }
  };
  const display = (date: Temporal.PlainDate | null) =>
    date
      ? parts
          .map((part) => {
            if (!part.section) {
              return part.text;
            }

            return String(date[part.section])
              .padStart(part.section === 'year' ? 4 : 2, '0')
              .replace(/\d/g, (digit) => digits[Number(digit)]!);
          })
          .join('')
      : '';

  return { parse, display, placeholder, normalize, localize, sections, parts };
}

export type DateFormat = ReturnType<typeof createDateFormat>;
