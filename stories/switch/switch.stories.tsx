import './switch.stories.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@flaut-travel/react-md3e';
import { SwitchControlledDemo } from './switch-controlled-demo/switch-controlled-demo.component';

const check = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="m9 16-4-4-1.4 1.4L9 18.8 21.4 6.4 20 5z" />
  </svg>
);
const close = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z" />
  </svg>
);
const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { 'aria-label': 'Notifications' },
  parameters: {
    docs: {
      description: {
        component:
          'Material Switch with a 52×32px track and a 52×48px interaction target. Base UI owns state, keyboard behavior and native form inputs. Pointer dragging mirrors in RTL. Handle movement/size use the shared spatial spring, colors use effects springs, and reduced motion disables transitions. Label with adjacent text; onChange receives a native Event and the next checked boolean.',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const SelectedIcon: Story = { args: { defaultChecked: true, checkedIcon: check } };
export const BothIcons: Story = { args: { icon: close, checkedIcon: check } };
export const Disabled: Story = {
  render: () => (
    <div className="story-row">
      <label className="story-switch-setting">
        <Switch disabled /> Notifications
      </label>
      <label className="story-switch-setting">
        <Switch disabled defaultChecked checkedIcon={check} /> Automatic updates
      </label>
    </div>
  ),
};
export const ReadOnly: Story = { args: { readOnly: true, defaultChecked: true } };
export const WithoutRipple: Story = { args: { disableRipple: true } };
export const Controlled: Story = { render: () => <SwitchControlledDemo /> };
export const RightToLeft: Story = {
  render: () => (
    <div className="story-row" dir="rtl">
      <label className="story-switch-setting">
        <Switch /> Notifications
      </label>
      <label className="story-switch-setting">
        <Switch defaultChecked icon={close} checkedIcon={check} /> Automatic updates
      </label>
    </div>
  ),
};
