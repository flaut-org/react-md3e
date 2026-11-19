import type { CSSProperties, ReactNode } from 'react';
import type { SliderMark, SliderSize, SliderVariant } from '../slider.types';
import { sliderTrackSegments } from './slider-track.helpers';
import {
  sliderTrack,
  sliderTrackSegment,
  sliderStops,
  sliderStop,
  sliderInsetIcon,
  sliderMarkLabel,
} from '../slider.styles';

interface SliderTrackProps {
  readonly variant: SliderVariant;
  readonly size: SliderSize;
  readonly orientation: 'horizontal' | 'vertical';
  readonly values: readonly number[];
  readonly min: number;
  readonly max: number;
  readonly marks: readonly SliderMark[];
  readonly icon: ReactNode;
}

export function SliderTrack({ variant, size, orientation, values, min, max, marks, icon }: SliderTrackProps) {
  const positions = values.map((value) => ((value - min) / (max - min)) * 100);
  const segments = sliderTrackSegments(variant, positions);
  const stops = new Set([...marks.map((mark) => mark.value), max, ...(variant === 'standard' ? [] : [min])]);
  const stopPoints = [...stops].map((value) => {
    const position = ((value - min) / (max - min)) * 100;
    const contains = (segment: (typeof segments)[number]) => position >= segment.from && position <= segment.to;
    const owner = segments.find((segment) => segment.active && contains(segment)) ?? segments.find(contains)!;

    return { value, owner, fraction: owner.to === owner.from ? 0 : (position - owner.from) / (owner.to - owner.from) };
  });

  return (
    <div className={sliderTrack} data-md3-slider-track="" aria-hidden="true">
      {segments.map((segment) => (
        <span
          key={segment.part}
          className={sliderTrackSegment}
          data-md3-slider-segment=""
          data-part={segment.part}
          data-active={segment.active}
          style={
            {
              '--_from': `${segment.from}%`,
              '--_to': `${segment.to}%`,
              '--_gap-start': segment.gapStart ? 'var(--_gap)' : '0px',
              '--_gap-end': segment.gapEnd ? 'var(--_gap)' : '0px',
              '--_start-radius': segment.from === 0 && !segment.gapStart ? 'var(--_track-radius)' : '2px',
              '--_end-radius': segment.to === 100 && !segment.gapEnd ? 'var(--_track-radius)' : '2px',
            } as CSSProperties
          }
        >
          <span className={sliderStops}>
            {stopPoints
              .filter((point) => point.owner === segment)
              .map((point) => (
                <span
                  key={point.value}
                  className={sliderStop}
                  data-md3-slider-stop=""
                  data-active={segment.active}
                  data-at-start={point.value === min}
                  data-at-end={point.value === max}
                  data-hidden={values.includes(point.value)}
                  style={{ '--_mark-fraction': point.fraction } as CSSProperties}
                />
              ))}
          </span>
          {segment.active && icon != null && (
            <>
              <span
                className={sliderInsetIcon}
                data-placement="active"
                data-orientation={orientation}
                data-size={size}
                data-md3-slider-icon=""
              >
                {icon}
              </span>
              <span
                className={sliderInsetIcon}
                data-placement="inactive"
                data-orientation={orientation}
                data-size={size}
                data-md3-slider-icon=""
              >
                {icon}
              </span>
            </>
          )}
        </span>
      ))}
      {marks
        .filter((mark) => mark.label != null)
        .map((mark) => (
          <span
            key={mark.value}
            className={sliderMarkLabel}
            data-md3-slider-mark-label=""
            style={{ '--_mark-position': `${((mark.value - min) / (max - min)) * 100}%` } as CSSProperties}
          >
            <span>{mark.label}</span>
          </span>
        ))}
    </div>
  );
}
