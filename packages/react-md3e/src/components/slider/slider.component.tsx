'use client';

import { useId, useMemo } from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useInheritedDirection } from '../../internal/hooks/use-inherited-direction.hook';
import { defaultSliderValue, resolveSliderMarks, validateSlider } from './slider.helpers';
import { SliderTrack } from './slider-track/slider-track.component';
import { SliderThumb } from './slider-thumb/slider-thumb.component';
import { sliderRoot, sliderControl, sliderLabel } from './slider.styles';
import type { SliderProps } from './slider.types';

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  shiftStep = 10,
  disabled = false,
  size = 'extraSmall',
  orientation = 'horizontal',
  marks = false,
  valueLabelDisplay = 'off',
  valueLabelFormat,
  getAriaLabel,
  getAriaValueText,
  locale = 'en-US',
  format,
  icon,
  inputRef,
  className,
  ...props
}: SliderProps) {
  const { variant = 'standard', value, defaultValue, onChange, onChangeCommitted, ...domProps } = props;
  const labelId = useId();
  const { anchorRef, direction } = useInheritedDirection(domProps.dir);
  const formatter = useMemo(() => new Intl.NumberFormat(locale, format), [format, locale]);
  const labelledBy = domProps['aria-labelledby'] ?? (label != null ? labelId : undefined);
  const initial = defaultValue ?? defaultSliderValue(variant, min, max);
  const thumbIndices = variant === 'range' ? [0, 1] : [0];
  const minStepsBetweenValues = props.variant === 'range' ? props.minStepsBetweenValues : 0;

  validateSlider(
    { ...props, min, max, step, shiftStep, size, icon, getAriaLabel } as SliderProps,
    min,
    max,
    step,
    shiftStep,
  );

  const points = resolveSliderMarks(marks, min, max, step);

  if (label == null && !domProps['aria-label']?.trim() && !labelledBy?.trim() && !getAriaLabel?.(0).trim()) {
    throw new TypeError('Slider requires a visible label, aria-label, aria-labelledby or getAriaLabel.');
  }

  return (
    <DirectionProvider direction={direction === 'rtl' ? 'rtl' : 'ltr'}>
      <BaseSlider.Root
        {...domProps}
        aria-labelledby={labelledBy}
        value={value}
        defaultValue={initial}
        min={min}
        max={max}
        step={step}
        largeStep={shiftStep}
        disabled={disabled}
        orientation={orientation}
        minStepsBetweenValues={minStepsBetweenValues}
        thumbCollisionBehavior="none"
        thumbAlignment="center"
        locale={locale}
        format={format}
        className={[sliderRoot, className].filter(Boolean).join(' ')}
        data-md3-slider=""
        data-md3-slider-direction={direction === 'rtl' ? 'rtl' : 'ltr'}
        data-variant={variant}
        data-size={size}
        data-has-mark-labels={points.some((mark) => mark.label != null)}
        onValueChange={(next, details) => {
          const prevented = details.event.defaultPrevented;
          let cancelled = false;

          if (onChange) {
            if (props.variant === 'range' && typeof next !== 'number') {
              cancelled = props.onChange?.(details.event, [next[0], next[1]], details.activeThumbIndex) === false;
            } else if (props.variant !== 'range' && typeof next === 'number') {
              cancelled = props.onChange?.(details.event, next, details.activeThumbIndex) === false;
            }
          }

          if (cancelled || (!prevented && details.event.defaultPrevented)) {
            details.cancel();
          }
        }}
        onValueCommitted={(next, details) => {
          if (onChangeCommitted) {
            if (props.variant === 'range' && typeof next !== 'number') {
              props.onChangeCommitted?.(details.event, [next[0], next[1]]);
            } else if (props.variant !== 'range' && typeof next === 'number') {
              props.onChangeCommitted?.(details.event, next);
            }
          }
        }}
        render={(rootProps, state) => (
          <div {...rootProps}>
            <span hidden ref={anchorRef} />
            {label != null && (
              <div id={labelId} className={sliderLabel}>
                {label}
              </div>
            )}
            <BaseSlider.Control className={sliderControl} data-md3-slider-control="">
              <SliderTrack
                variant={variant}
                size={size}
                orientation={orientation}
                min={min}
                max={max}
                values={state.values}
                marks={points}
                icon={icon}
              />
              {thumbIndices.map((index) => (
                <SliderThumb
                  key={index}
                  index={index}
                  active={state.activeThumbIndex === index}
                  dragging={state.dragging}
                  disabled={state.disabled}
                  inputRef={index === 0 ? inputRef : undefined}
                  ariaLabel={getAriaLabel?.(index) ?? domProps['aria-label']}
                  labelledBy={getAriaLabel ? undefined : labelledBy}
                  describedBy={domProps['aria-describedby']}
                  getAriaValueText={
                    getAriaValueText
                      ? (_formatted, currentValue, thumbIndex) => getAriaValueText(currentValue, thumbIndex)
                      : undefined
                  }
                  valueLabelDisplay={valueLabelDisplay}
                  valueLabel={
                    valueLabelFormat
                      ? valueLabelFormat(state.values[index]!, index)
                      : formatter.format(state.values[index]!)
                  }
                />
              ))}
            </BaseSlider.Control>
          </div>
        )}
      />
    </DirectionProvider>
  );
}
