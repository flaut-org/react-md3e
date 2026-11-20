import { createRef } from 'react';
import { Slider } from '@flaut-travel/react-md3e/slider';
import type { SliderProps, SliderRange, SliderMark } from '@flaut-travel/react-md3e';

export const single = (
  <Slider
    label="Volume"
    defaultValue={40}
    onChange={(_event, value, index) => value.toFixed(index) === '0'}
    ref={createRef<HTMLDivElement>()}
    inputRef={createRef<HTMLInputElement>()}
  />
);
export const range = (
  <Slider
    label="Price"
    variant="range"
    value={[20, 80] as const}
    getAriaLabel={(index) => (index === 0 ? 'Minimum' : 'Maximum')}
    onChange={(_event, value) => value[0] < value[1]}
    onChangeCommitted={(_event, value) => value.join(',')}
    minStepsBetweenValues={2}
  />
);
export const centered = <Slider label="Balance" variant="centered" min={-100} max={100} marks />;
export const inset = <Slider label="Brightness" size="medium" icon="☀" />;
export const bounds: SliderRange = [10, 90];
export const mark: SliderMark = { value: 10, label: <span>Low</span> };
// @ts-expect-error Standard values are scalar.
export const invalidValue: SliderProps = { value: [20, 80] };
// @ts-expect-error Range values require two numbers and separate accessible handle names.
export const invalidRange: SliderProps = { variant: 'range', value: 20 };
// @ts-expect-error Two handle labels are required for a range.
export const missingNames: SliderProps = { variant: 'range', value: [20, 80] };
// @ts-expect-error A range contains exactly two handles.
export const tooMany: SliderProps = { variant: 'range', value: [10, 20, 30], getAriaLabel: String };
// @ts-expect-error Inset icons require M, L or XL sizes.
export const smallIcon = <Slider label="Brightness" size="small" icon="☀" />;
// @ts-expect-error Centered sliders have no inset icon.
export const centeredIcon = <Slider label="Balance" variant="centered" size="medium" icon="☀" />;
// @ts-expect-error Slider does not accept legacy track variants.
export const legacy: SliderProps = { variant: 'inverted' };
