import { RadioGroup } from '@flaut-travel/react-md3e/radio-group';

export const group = (
  <RadioGroup
    name="cabin"
    value="economy"
    row
    onChange={(event, value) => {
      event.preventDefault();

      return value;
    }}
  />
);
// @ts-expect-error this slice supports string values only.
export const invalidValue = <RadioGroup value={42} />;
