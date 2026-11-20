import type { SliderMark, SliderProps, SliderRange, SliderVariant } from './slider.types';

export function defaultSliderValue(variant: SliderVariant, min: number, max: number): number | SliderRange {
  if (variant === 'range') {
    return [min, max];
  }

  return variant === 'centered' ? min + (max - min) / 2 : min;
}

export function validateSlider(props: SliderProps, min: number, max: number, step: number, shiftStep: number) {
  const supportsIcon =
    (props.variant ?? 'standard') === 'standard' &&
    ['medium', 'large', 'extraLarge'].includes(props.size ?? 'extraSmall');

  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min || !Number.isFinite(max - min)) {
    throw new RangeError('Slider requires finite min < max and a finite span.');
  }

  if (!Number.isFinite(step) || step <= 0 || !Number.isFinite(shiftStep) || shiftStep <= 0) {
    throw new RangeError('Slider step and shiftStep must be finite positive numbers.');
  }

  for (const value of [props.value, props.defaultValue]) {
    if (value !== undefined) {
      const values = typeof value === 'number' ? [value] : value;
      const expected = props.variant === 'range' ? 2 : 1;

      if (
        (props.variant !== 'range' && typeof value !== 'number') ||
        values.length !== expected ||
        values.some((item) => !Number.isFinite(item))
      ) {
        throw new TypeError('Slider requires one finite number or, for range, exactly two finite numbers.');
      }
    }
  }

  if (props.variant === 'range') {
    const distance = props.minStepsBetweenValues ?? 0;
    const values = props.value ?? props.defaultValue ?? [min, max];

    if (!Number.isInteger(distance) || distance < 0 || distance * step > max - min) {
      throw new RangeError('Slider minStepsBetweenValues must fit within the value range.');
    }

    const bounded = values.map((value) => Math.min(max, Math.max(min, value))).sort((a, b) => a - b);

    if (bounded[1]! - bounded[0]! < distance * step) {
      throw new RangeError('Slider range values must respect minStepsBetweenValues.');
    }

    if (!props.getAriaLabel || !props.getAriaLabel(0).trim() || !props.getAriaLabel(1).trim()) {
      throw new TypeError('A range Slider requires getAriaLabel to name both handles.');
    }
  }

  if (props.icon != null && !supportsIcon) {
    throw new TypeError('Slider inset icons require a standard slider with medium, large or extraLarge size.');
  }
}

/** Keep automatically generated and caller-supplied marks bounded for dense/continuous scales. */
export function resolveSliderMarks(
  marks: SliderProps['marks'],
  min: number,
  max: number,
  step: number,
): readonly SliderMark[] {
  if (!marks) {
    return [];
  }

  if (marks === true) {
    const count = Math.floor((max - min) / step + 1e-9);

    if (count > 1000) {
      throw new RangeError('Slider marks would exceed 1001 positions; supply a sparse marks array.');
    }

    return Array.from({ length: count + 1 }, (_, index) => ({ value: Number((min + index * step).toPrecision(12)) }));
  }

  if (marks.length > 1001 || marks.some(({ value }) => !Number.isFinite(value) || value < min || value > max)) {
    throw new RangeError('Slider marks must be finite, within min/max and contain at most 1001 positions.');
  }

  return [...new Map(marks.map((mark) => [mark.value, mark])).values()].sort((a, b) => a.value - b.value);
}
