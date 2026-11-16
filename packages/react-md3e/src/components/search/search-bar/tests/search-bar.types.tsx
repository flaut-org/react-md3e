import { createRef } from 'react';
import { SearchBar } from '@flaut-org/react-md3e/search';

export const bar = (
  <SearchBar
    label="Search"
    name="q"
    defaultValue="Paris"
    inputRef={createRef<HTMLInputElement>()}
    inputProps={{ maxLength: 100 }}
    onSearch={(event, query) => {
      event.preventDefault();

      return query.length > 0;
    }}
  />
);
// @ts-expect-error an accessible label is required.
export const unnamed = <SearchBar />;
// @ts-expect-error no string CSS / sx runtime layer.
export const invalidStyles = <SearchBar label="Search" sx={{ color: 'red' }} />;
// @ts-expect-error native type is owned by SearchBar.
export const invalidInput = <SearchBar label="Search" inputProps={{ type: 'number' }} />;
