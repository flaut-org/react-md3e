import '@flaut-travel/react-md3e/navigation-rail/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/extended-fab/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/badge/styles.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationRail } from '@flaut-travel/react-md3e/navigation-rail';
import type { NavigationRailProps } from '@flaut-travel/react-md3e/navigation-rail';
import { Button } from '@flaut-travel/react-md3e/button';
import { NavigationItems } from './navigation-items/navigation-items.component';
import { ExpandableRail } from './expandable-rail/expandable-rail.component';

const meta = {
  title: 'Components/NavigationRail',
  component: NavigationRail,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main style={{ padding: 24 }}>
        <h1>Navigation rail</h1>
        <div style={{ blockSize: 600 }}>
          <Story />
        </div>
      </main>
    ),
  ],
  args: { 'aria-label': 'Primary destinations', 'defaultValue': 'home', 'children': <NavigationItems /> },
} satisfies Meta<typeof NavigationRail>;

export default meta;
type Story = StoryObj<NavigationRailProps>;
export const Collapsed: Story = { args: { ...meta.args } };
export const Expanded: Story = { args: { ...meta.args, expanded: true } };
export const FullWidthIndicator: Story = { args: { ...meta.args, expanded: true, indicator: 'fullWidth' } };
export const Baseline: Story = { args: { ...meta.args, appearance: 'baseline' } };
export const Centered: Story = { args: { ...meta.args, alignment: 'center' } };
export const BottomAligned: Story = { args: { ...meta.args, alignment: 'end' } };
export const Expandable: Story = { args: { ...meta.args }, render: () => <ExpandableRail /> };
export const RightToLeft: Story = { args: { ...meta.args }, render: () => <ExpandableRail dir="rtl" /> };
export const Modal: Story = {
  args: { ...meta.args, variant: 'modal', trigger: <Button>Open navigation rail</Button> },
};
