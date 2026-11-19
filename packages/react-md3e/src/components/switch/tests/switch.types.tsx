import { createRef } from 'react';
import { Switch } from '@flaut-travel/react-md3e/switch';
import type { SwitchProps } from '@flaut-travel/react-md3e';

export const props = { name: 'notifications', value: 'enabled', defaultChecked: true } satisfies SwitchProps;
export const toggle = (
  <Switch
    {...props}
    ref={createRef<HTMLSpanElement>()}
    inputRef={createRef<HTMLInputElement>()}
    aria-label="Notifications"
    checkedIcon={<svg viewBox="0 0 24 24" />}
    onChange={(event, checked) => {
      event.preventDefault();

      return checked;
    }}
  />
);

// @ts-expect-error Checked state is boolean.
export const invalidChecked = <Switch checked="on" />;
// @ts-expect-error The track follows native Material dimensions, without legacy small sizing.
export const invalidSize = <Switch size="small" />;
// @ts-expect-error Labels belong beside the control, not inside its handle.
export const invalidChildren = <Switch>Notifications</Switch>;
// @ts-expect-error Base UI event-detail props remain internal.
export const invalidCallback = <Switch onCheckedChange={() => {}} />;
