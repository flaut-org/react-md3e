'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { useState } from 'react';
import type { ReactNode, Ref } from 'react';
import { useSliderValueMotion } from '../../../internal/hooks/use-slider-value-motion.hook';
import type { SliderValueLabelDisplay } from '../slider.types';
import { sliderThumb, sliderHandle, sliderValueLabel } from '../slider.styles';

interface SliderThumbProps {
  readonly index: number;
  readonly active: boolean;
  readonly dragging: boolean;
  readonly disabled: boolean;
  readonly inputRef?: Ref<HTMLInputElement> | undefined;
  readonly labelledBy?: string | undefined;
  readonly ariaLabel?: string | undefined;
  readonly describedBy?: string | undefined;
  readonly getAriaValueText?: ((formattedValue: string, value: number, index: number) => string) | undefined;
  readonly valueLabelDisplay: SliderValueLabelDisplay;
  readonly valueLabel: ReactNode;
}

/** Base UI positions the target; logical CSS margins center it before hydration and in inherited RTL. */
export function SliderThumb({
  index,
  active,
  dragging,
  disabled,
  inputRef,
  labelledBy,
  ariaLabel,
  describedBy,
  getAriaValueText,
  valueLabelDisplay,
  valueLabel,
}: SliderThumbProps) {
  const [focused, setFocused] = useState(false);
  const open =
    !disabled && (valueLabelDisplay === 'on' || (valueLabelDisplay === 'auto' && (active || (dragging && focused))));
  const valueRef = useSliderValueMotion(open, valueLabelDisplay === 'auto');

  return (
    <BaseSlider.Thumb
      index={index}
      inputRef={inputRef}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      getAriaValueText={getAriaValueText}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={sliderThumb}
      data-md3-slider-thumb=""
      data-active-thumb={active}
      render={(thumbProps) => <div {...thumbProps} style={{ ...thumbProps.style, translate: undefined }} />}
    >
      <span className={sliderHandle} data-md3-slider-handle="" aria-hidden="true" />
      {valueLabelDisplay !== 'off' && (
        <span
          ref={valueRef}
          className={sliderValueLabel}
          data-md3-slider-value-label=""
          data-open={open}
          data-auto={valueLabelDisplay === 'auto'}
          aria-hidden="true"
        >
          {valueLabel}
        </span>
      )}
    </BaseSlider.Thumb>
  );
}
