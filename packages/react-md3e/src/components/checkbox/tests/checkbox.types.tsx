import { createRef } from 'react';
import { Checkbox } from '@flaut-org/react-md3e/checkbox';

export const checkbox = (
  <Checkbox
    ref={createRef<HTMLSpanElement>()}
    inputRef={createRef<HTMLInputElement>()}
    aria-label="Updates"
    checked={false}
    indeterminate
    onChange={(event, checked) => {
      event.preventDefault();

      return checked;
    }}
  />
);
// @ts-expect-error checked is boolean, not a string.
export const invalid = <Checkbox checked="true" />;
