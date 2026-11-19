import { useState } from 'react';
import { Switch } from '@flaut-travel/react-md3e';

export function SwitchControlledDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <label className="story-switch-setting">
        <Switch checked={checked} onChange={(_event, next) => setChecked(next)} /> Notifications
      </label>
      <p>Notifications are {checked ? 'on' : 'off'}.</p>
    </div>
  );
}
