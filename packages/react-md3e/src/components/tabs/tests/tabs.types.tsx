import { createRef } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@flaut-travel/react-md3e/tabs';
import type { TabsProps, TabProps, TabListProps, TabPanelProps, TabValue } from '@flaut-travel/react-md3e';

export const composition = (
  <Tabs
    variant="primary"
    defaultValue="one"
    ref={createRef<HTMLDivElement>()}
    onChange={(event, value) => {
      event.preventDefault();

      const next: TabValue | null = value;

      return next === 'one';
    }}
  >
    <TabList aria-label="View" scrollable selectionFollowsFocus ref={createRef<HTMLDivElement>()}>
      <Tab value="one" label="One" icon="◇" iconPosition="start" badge="2" ref={createRef<HTMLButtonElement>()} />
      <Tab value={2} disableRipple>
        Two
      </Tab>
    </TabList>
    <TabPanel value="one" keepMounted ref={createRef<HTMLDivElement>()}>
      First
    </TabPanel>
    <TabPanel value={2}>Second</TabPanel>
  </Tabs>
);
export const empty: TabsProps = { value: null };
// @ts-expect-error Material tabs have primary/secondary visual variants.
export const invalidVariant: TabsProps = { variant: 'contained' };
// @ts-expect-error Values are stable strings or numbers.
export const invalidValue: TabProps = { value: {} };
// @ts-expect-error Each tab requires a value.
export const missingValue: TabProps = { label: 'Missing' };
// @ts-expect-error Tabs own selection semantics.
export const invalidSelected: TabProps = { 'value': 0, 'aria-selected': true };
// @ts-expect-error Tabs own activation and never submit forms.
export const invalidType: TabProps = { value: 0, type: 'submit' };
// @ts-expect-error TabList owns its role.
export const invalidList: TabListProps = { role: 'menu' };
// @ts-expect-error Panel visibility is derived from selection.
export const invalidPanel: TabPanelProps = { value: 'one', hidden: true };
