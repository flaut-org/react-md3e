import { Radio } from '@flaut-travel/react-md3e/radio';

export const radio = <Radio value="economy" aria-label="Economy" />;
// @ts-expect-error RadioGroup owns checked state.
export const invalidChecked = <Radio value="economy" checked />;
// @ts-expect-error value identifies the radio in its group.
export const missingValue = <Radio />;
