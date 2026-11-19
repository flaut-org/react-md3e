import type { SliderVariant } from '../slider.types';

export interface TrackSegment {
  readonly part: 'before' | 'active' | 'after';
  readonly from: number;
  readonly to: number;
  readonly gapStart: boolean;
  readonly gapEnd: boolean;
  readonly active: boolean;
}

export function sliderTrackSegments(variant: SliderVariant, positions: readonly number[]): TrackSegment[] {
  const value = positions[0]!;

  if (variant === 'standard') {
    return [
      { part: 'active', from: 0, to: value, gapStart: false, gapEnd: true, active: true },
      { part: 'after', from: value, to: 100, gapStart: true, gapEnd: false, active: false },
    ];
  }

  const start = variant === 'range' ? value : Math.min(50, value);
  const end = variant === 'range' ? positions[1]! : Math.max(50, value);
  const gapStart = variant === 'range' || value <= 50;
  const gapEnd = variant === 'range' || value >= 50;

  return [
    { part: 'before', from: 0, to: start, gapStart: false, gapEnd: gapStart, active: false },
    { part: 'active', from: start, to: end, gapStart, gapEnd, active: true },
    { part: 'after', from: end, to: 100, gapStart: gapEnd, gapEnd: false, active: false },
  ];
}
