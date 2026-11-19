import { createRef } from 'react';
import { ButtonSegment, SegmentedButton } from '@flaut-travel/react-md3e/segmented-button';
import type { ButtonSegmentProps, SegmentedButtonProps } from '@flaut-travel/react-md3e';

export const single = (
  <SegmentedButton
    aria-label="View"
    defaultValue="week"
    onChange={(_event, value) => value?.toUpperCase() === 'DAY'}
    ref={createRef<HTMLDivElement>()}
  >
    <ButtonSegment value="day" ref={createRef<HTMLButtonElement>()}>
      Day
    </ButtonSegment>
    <ButtonSegment value="week">Week</ButtonSegment>
  </SegmentedButton>
);
export const multiple = (
  <SegmentedButton
    aria-label="Filters"
    selectionMode="multiple"
    value={['direct'] as const}
    onChange={(_event, value) => value.includes('direct')}
    name="filters"
    form="search"
  >
    <ButtonSegment value="direct" icon="→">
      Direct
    </ButtonSegment>
    <ButtonSegment value="bag" icon="◇" aria-label="Baggage" disableRipple />
  </SegmentedButton>
);
export const nullable: SegmentedButtonProps = { 'aria-label': 'View', 'value': null, 'allowEmpty': true };
// @ts-expect-error Multiple selection requires an array.
export const invalidMultiple: SegmentedButtonProps = { selectionMode: 'multiple', value: 'day' };
// @ts-expect-error Single selection requires a scalar.
export const invalidSingle: SegmentedButtonProps = { value: ['day'] };
// @ts-expect-error Segments require stable values.
export const missingValue = <ButtonSegment>Day</ButtonSegment>;
// @ts-expect-error Selection is owned by the group.
export const childSelection: ButtonSegmentProps = { value: 'day', selected: true };
// @ts-expect-error Segmented buttons use the baseline outlined design.
export const invalidVariant: SegmentedButtonProps = { variant: 'contained' };
// @ts-expect-error There is no ordinary action selection mode.
export const invalidAction: SegmentedButtonProps = { selectionMode: 'none' };
// @ts-expect-error Segments cannot submit or reset a form.
export const invalidType: ButtonSegmentProps = { value: 'day', type: 'submit' };
