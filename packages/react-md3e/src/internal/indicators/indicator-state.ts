export function indicatorState(value: number | null | undefined, min = 0, max = 100) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min || !Number.isFinite(max - min)) {
    throw new RangeError('Indicator range must have finite min < max.');
  }

  if (value != null && !Number.isFinite(value)) {
    throw new TypeError('Indicator value must be finite, or null for indeterminate progress.');
  }

  const current = value == null ? undefined : Math.min(max, Math.max(min, value));
  const fraction = current === undefined ? 0 : (current - min) / (max - min);

  return { min, max, current, fraction, indeterminate: current === undefined };
}
