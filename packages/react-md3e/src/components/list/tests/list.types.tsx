import { createRef } from 'react';
import { List, ListItem } from '@flaut-travel/react-md3e';
import type { ListProps } from '@flaut-travel/react-md3e';

export const staticList = (
  <List ref={createRef<HTMLUListElement>()}>
    <ListItem primary="Read-only row" ref={createRef<HTMLLIElement>()} secondary="Details" lines={3} />
  </List>
);

export const single = (
  <List selectionMode="single" aria-label="Language" defaultValue="en" onValueChange={(value) => value.toUpperCase()}>
    <ListItem value="en" primary="English" />
    <ListItem value="fr" primary="Français" />
  </List>
);

export const multiple = (
  <List
    selectionMode="multiple"
    aria-label="Interests"
    defaultValue={['nature']}
    onValueChange={(values) => values.map((value) => value.toUpperCase())}
  >
    <ListItem value="nature" primary="Nature" />
  </List>
);

// @ts-expect-error Static lists have no value/selection controller.
export const staticSelection: ListProps = { value: 'en' };

// @ts-expect-error Selectable lists require an accessible name.
export const unnamed: ListProps = { selectionMode: 'single' };

// @ts-expect-error Single selection accepts one value.
export const invalidSingle: ListProps = { 'selectionMode': 'single', 'aria-label': 'Language', 'value': ['en'] };

// @ts-expect-error Multiple selection accepts an array.
export const invalidMultiple: ListProps = { 'selectionMode': 'multiple', 'aria-label': 'Interests', 'value': 'nature' };

// @ts-expect-error Checkbox visuals do not describe a single selection.
export const invalidIndicator: ListProps = {
  'selectionMode': 'single',
  'aria-label': 'Language',
  'selectionIndicator': 'checkbox',
};
