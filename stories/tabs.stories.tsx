import '@flaut-travel/react-md3e/tabs/styles.css';

import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabList, Tab, TabPanel } from '@flaut-travel/react-md3e/tabs';

const frame: Decorator = (Story) => (
  <main>
    <h1>Tabs</h1>
    <Story />
  </main>
);
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  decorators: [frame],
  args: {
    defaultValue: 'flights',
    children: (
      <>
        <TabList aria-label="Travel">
          <Tab value="flights">Flights</Tab>
          <Tab value="hotels">Hotels</Tab>
          <Tab value="cars" disabled>
            Cars
          </Tab>
        </TabList>
        <TabPanel value="flights">Find a flight</TabPanel>
        <TabPanel value="hotels">Find a hotel</TabPanel>
        <TabPanel value="cars">Rent a car</TabPanel>
      </>
    ),
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const RightToLeft: Story = { args: { dir: 'rtl' } };
export const Icons: Story = {
  args: {
    children: (
      <>
        <TabList aria-label="Media">
          <Tab value="flights" icon="▣">
            Video
          </Tab>
          <Tab value="hotels" icon="♫">
            Audio
          </Tab>
          <Tab value="cars" icon="☆">
            Favorites
          </Tab>
        </TabList>
        <TabPanel value="flights">Video library</TabPanel>
        <TabPanel value="hotels">Audio library</TabPanel>
        <TabPanel value="cars">Favorite media</TabPanel>
      </>
    ),
  },
};
export const IconOnly: Story = {
  args: {
    children: (
      <>
        <TabList aria-label="Media view">
          <Tab value="flights" icon="▣" aria-label="Grid" />
          <Tab value="hotels" icon="≡" aria-label="List" />
        </TabList>
        <TabPanel value="flights">Grid view</TabPanel>
        <TabPanel value="hotels">List view</TabPanel>
      </>
    ),
  },
};
export const Scrollable: Story = {
  args: {
    defaultValue: 0,
    style: { maxWidth: 480 },
    children: (
      <>
        <TabList aria-label="Destinations" scrollable selectionFollowsFocus>
          {Array.from({ length: 10 }, (_, index) => (
            <Tab key={index} value={index}>
              Destination {index + 1}
            </Tab>
          ))}
        </TabList>
        {Array.from({ length: 10 }, (_, index) => (
          <TabPanel key={index} value={index}>
            Content for destination {index + 1}
          </TabPanel>
        ))}
      </>
    ),
  },
};
