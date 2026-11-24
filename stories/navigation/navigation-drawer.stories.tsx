import '@flaut-travel/react-md3e/navigation-drawer/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/divider/styles.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationDrawer, NavigationItem } from '@flaut-travel/react-md3e/navigation-drawer';
import type { NavigationDrawerProps } from '@flaut-travel/react-md3e/navigation-drawer';
import { Divider } from '@flaut-travel/react-md3e/divider';
import { Button } from '@flaut-travel/react-md3e/button';
import { NavigationIcon } from './navigation-icons/navigation-icons.component';

const meta = {
  title: 'Components/NavigationDrawer',
  component: NavigationDrawer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main style={{ padding: 24 }}>
        <h1>Navigation drawer</h1>
        <div style={{ blockSize: 600 }}>
          <Story />
        </div>
      </main>
    ),
  ],
  args: {
    'aria-label': 'Mail navigation',
    'variant': 'standard',
    'defaultValue': 'inbox',
    'header': 'Mail',
    'children': (
      <>
        <NavigationItem
          value="inbox"
          icon={<NavigationIcon kind="mail" />}
          selectedIcon={<NavigationIcon kind="mail" filled />}
          badge="24"
        >
          Inbox
        </NavigationItem>
        <NavigationItem value="saved" icon={<NavigationIcon kind="saved" />}>
          Saved
        </NavigationItem>
        <NavigationItem value="search" icon={<NavigationIcon kind="search" />}>
          Explore
        </NavigationItem>
        <Divider variant="middle" style={{ marginBlock: 16 }} />
        <NavigationItem value="settings">Settings</NavigationItem>
        <NavigationItem value="unavailable" disabled>
          Unavailable
        </NavigationItem>
      </>
    ),
  },
} satisfies Meta<typeof NavigationDrawer>;

export default meta;
type Story = StoryObj<NavigationDrawerProps>;
export const Standard: Story = { args: { ...meta.args } };
export const Modal: Story = {
  args: { ...meta.args, variant: 'modal', trigger: <Button>Open navigation drawer</Button> },
};
export const RightToLeft: Story = {
  args: { ...meta.args, dir: 'rtl', variant: 'modal', trigger: <Button>Open RTL drawer</Button> },
};
