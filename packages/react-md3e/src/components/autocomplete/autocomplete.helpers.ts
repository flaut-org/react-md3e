export function defaultOptionLabel<T>(option: T): string {
  if (typeof option === 'string') {
    return option;
  }

  if (option && typeof option === 'object' && 'label' in option && typeof option.label === 'string') {
    return option.label;
  }

  throw new TypeError('Object options without a string label require getOptionLabel.');
}

export function defaultOptionValue<T>(option: T, label: (option: T) => string = defaultOptionLabel): string {
  if (
    option &&
    typeof option === 'object' &&
    'value' in option &&
    (typeof option.value === 'string' || typeof option.value === 'number')
  ) {
    return String(option.value);
  }

  return label(option);
}

export const normalizeOptionText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Mark}/gu, '')
    .toLocaleLowerCase()
    .trim();
