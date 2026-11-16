import { ButtonGroup, ButtonGroupButton } from '@flaut-org/react-md3e/button-group';
import type { ButtonGroupProps } from '@flaut-org/react-md3e/button-group';

export const single = (
  <ButtonGroup aria-label="Theme" defaultValue="light" onChange={(_event, value) => value?.toUpperCase() === null}>
    <ButtonGroupButton value="light">Light</ButtonGroupButton>
  </ButtonGroup>
);
export const multiple = (
  <ButtonGroup
    aria-label="Filters"
    selectionMode="multiple"
    value={['one']}
    onChange={(_event, value) => value.includes('one')}
  />
);
export const actions = <ButtonGroup aria-label="Actions" selectionMode="none" />;
// @ts-expect-error Multiple selection requires an array.
export const invalid: ButtonGroupProps = { selectionMode: 'multiple', value: 'one' };
// @ts-expect-error Ordinary action groups have no selected value.
export const invalidAction: ButtonGroupProps = { selectionMode: 'none', value: 'one' };
// @ts-expect-error Each selectable child has a stable value.
export const missingValue = <ButtonGroupButton>Missing value</ButtonGroupButton>;
