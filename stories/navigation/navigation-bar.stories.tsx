import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationBar } from '@flaut-travel/react-md3e/navigation-bar';
import type { NavigationBarProps } from '@flaut-travel/react-md3e/navigation-bar';
import { NavigationItems } from './navigation-items/navigation-items.component';

const meta = {
  title: 'Components/NavigationBar',
  component: NavigationBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main style={{ padding: 24 }}>
        <h1>Navigation bar</h1>
        <Story />
      </main>
    ),
  ],
  args: {
    'aria-label': 'Primary destinations',
    'defaultValue': 'home',
    'iconPosition': 'top',
    'children': <NavigationItems />,
  },
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<NavigationBarProps>;
export const Flexible: Story = { args: { ...meta.args } };
export const Horizontal: Story = { args: { ...meta.args, iconPosition: 'start' } };
export const Responsive: Story = { args: { ...meta.args, iconPosition: 'auto' } };
export const Baseline: Story = { args: { ...meta.args, variant: 'baseline' } };
export const Links: Story = { args: { ...meta.args, children: <NavigationItems links /> } };
export const Disabled: Story = { args: { ...meta.args, children: <NavigationItems disabled /> } };
export const RightToLeft: Story = { args: { ...meta.args, dir: 'rtl', iconPosition: 'start' } };
