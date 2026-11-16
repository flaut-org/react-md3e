import '@flaut-travel/react-md3e/button-group/styles.css';

import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup, ButtonGroupButton } from '@flaut-travel/react-md3e';

const frame: Decorator = (Story) => (
  <main>
    <h1>ButtonGroup</h1>
    <Story />
  </main>
);

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  decorators: [frame],
  args: {
    'aria-label': 'Appearance',
    'defaultValue': 'light',
    'children': (
      <>
        <ButtonGroupButton value="light">Light</ButtonGroupButton>
        <ButtonGroupButton value="dark">Dark</ButtonGroupButton>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Standard: Story = { args: { variant: 'standard' } };
export const Multiple: Story = { args: { selectionMode: 'multiple', defaultValue: ['light'] } };
export const Disabled: Story = { args: { disabled: true } };
export const RightToLeft: Story = { args: { dir: 'rtl' } };
