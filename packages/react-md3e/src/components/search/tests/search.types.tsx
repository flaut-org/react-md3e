import { createRef } from 'react';
import { Search } from '@flaut-org/react-md3e/search';
import type { SearchCloseReason } from '@flaut-org/react-md3e/search';

export const search = (
  <Search
    label="Search destinations"
    layout="docked"
    ref={createRef<HTMLDivElement>()}
    inputRef={createRef<HTMLInputElement>()}
    viewInputRef={createRef<HTMLInputElement>()}
    onChange={(event, value, reason) => {
      event.preventDefault();
      value.toUpperCase();

      return reason;
    }}
    onClose={(_event, reason: SearchCloseReason) => reason !== 'clickAway'}
    viewProps={{ 'ref': createRef<HTMLDivElement>(), 'aria-describedby': 'search-help' }}
  >
    <p>Results</p>
  </Search>
);
// @ts-expect-error Search requires an accessible input/view label.
export const unnamed = <Search />;
// @ts-expect-error layout has a finite MD3 vocabulary.
export const invalidLayout = <Search label="Search" layout="dropdown" />;
// @ts-expect-error freeform query values are strings, not selected objects.
export const invalidValue = <Search label="Search" value={{ id: 1 }} />;
// @ts-expect-error Base UI implementation props are not public.
export const internalProp = <Search label="Search" modal={false} />;
