import type { DateFormat, DateSection } from './date-entry-format';

export interface DateMaskSection {
  readonly unit: DateSection;
  readonly width: number;
  readonly placeholder: string;
  readonly start: number;
  readonly end: number;
}

/** Native input selection over numeric sections; date existence remains Temporal's responsibility. */
export function createDateMask(format: DateFormat, range: boolean) {
  const units = range ? [...format.sections, ...format.sections] : format.sections;
  const placeholder = format.placeholder.toLowerCase();
  const sequence = format.parts.reduceRight((pattern, part) => {
    const token = part.section
      ? `(\\d*|${{ month: 'm{1,2}', day: 'd{1,2}', year: 'y{1,4}' }[part.section]})`
      : part.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return pattern ? `${token}(?:${pattern})?` : token;
  }, '');
  const pattern = new RegExp(`^(?:${sequence})?$`, 'i');
  const endpoints = (raw: string) => (range ? raw.split(/\s+[–—-]\s*/) : [raw]);
  const readDate = (raw: string) => {
    const normalized = format.normalize(raw);

    if (/^\d{8}$/.test(normalized)) {
      let offset = 0;

      return format.sections.map((unit) => {
        const width = unit === 'year' ? 4 : 2;
        const value = normalized.slice(offset, offset + width);

        offset += width;

        return value;
      });
    }

    const match = pattern.exec(normalized.trim());

    return match
      ? format.sections.map((_unit, index) => (/^\d+$/.test(match[index + 1] ?? '') ? match[index + 1]! : ''))
      : null;
  };
  const read = (raw: string) => {
    const dates = endpoints(raw);

    return Array.from(
      { length: range ? 2 : 1 },
      (_, index) => readDate(dates[index] ?? '') ?? format.sections.map(() => ''),
    ).flat();
  };
  const render = (values: readonly string[]) => {
    const sections: DateMaskSection[] = [];
    let value = '';

    for (let endpoint = 0; endpoint < (range ? 2 : 1); endpoint += 1) {
      if (endpoint > 0) {
        value += ' – ';
      }

      for (const part of format.parts) {
        if (part.section) {
          const index = sections.length;
          const width = part.section === 'year' ? 4 : 2;
          const token = { year: 'yyyy', month: 'mm', day: 'dd' }[part.section];
          const content = values[index] ? format.localize(values[index]) : token;

          sections.push({
            unit: part.section,
            width,
            placeholder: token,
            start: value.length,
            end: value.length + content.length,
          });
          value += content;
        } else {
          value += part.text;
        }
      }
    }

    return { value, sections };
  };
  const serialize = (values: readonly string[]) => (values.some(Boolean) ? render(values).value : '');
  const canRead = (raw: string) => {
    const dates = endpoints(raw);

    return (
      dates.length <= (range ? 2 : 1) &&
      dates.every((date) => format.normalize(date).replace(/\D/g, '').length <= 8 && readDate(date) !== null)
    );
  };
  const locate = (sections: readonly DateMaskSection[], caret: number) => {
    const index = sections.findIndex((section) => section.end >= caret);

    return index < 0 ? sections.length - 1 : index;
  };
  const digit = (values: readonly string[], index: number, buffer: string, character: string) => {
    const unit = units[index]!;
    const width = unit === 'year' ? 4 : 2;
    const nextBuffer = `${buffer}${format.normalize(character)}`.slice(-width);
    const complete =
      nextBuffer.length === width || (unit !== 'year' && Number(nextBuffer) > (unit === 'month' ? 1 : 3));
    const content = complete ? nextBuffer.padStart(width, '0') : nextBuffer;
    const next = values.map((value, position) => (position === index ? content : value));

    return {
      values: next,
      index: complete ? Math.min(index + 1, units.length - 1) : index,
      buffer: complete ? '' : nextBuffer,
    };
  };

  return {
    read,
    render,
    serialize,
    locate,
    digit,
    canRead,
    units,
    placeholder: range ? `${placeholder} – ${placeholder}` : placeholder,
  };
}

export type DateMask = ReturnType<typeof createDateMask>;
