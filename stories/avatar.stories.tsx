import '@flaut-travel/react-md3e/avatar/styles.css';
import '@flaut-travel/react-md3e/list/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, List, ListItem } from '@flaut-travel/react-md3e';

const portrait =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23d7e8cd"/%3E%3Ccircle cx="40" cy="28" r="15" fill="%23386a20"/%3E%3Cpath d="M10 80v-8a30 30 0 0 1 60 0v8" fill="%23386a20"/%3E%3C/svg%3E';
const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { alt: 'Alex Morgan', children: 'AM', size: 'medium', variant: 'circular' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    variant: { control: 'inline-radio', options: ['circular', 'rounded', 'square'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Initials-only avatars are server components. Image avatars compose Base UI for loading/error fallback; the img is present in server HTML. Default MD3 list size is 40px. Additional sizes and shapes are library conveniences. Empty alt is decorative.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Image: Story = { args: { src: portrait } };
export const FailedImage: Story = { args: { src: 'data:image/png;base64,invalid' } };
export const AutomaticInitial: Story = { args: { children: undefined } };
export const Sizes: Story = {
  render: (args) => (
    <div className="story-row">
      <Avatar {...args} size="small" />
      <Avatar {...args} size="medium" />
      <Avatar {...args} size="large" />
    </div>
  ),
};
export const Shapes: Story = {
  render: (args) => (
    <div className="story-row">
      <Avatar {...args} variant="circular" />
      <Avatar {...args} variant="rounded" />
      <Avatar {...args} variant="square" />
    </div>
  ),
};
export const InList: Story = {
  render: () => (
    <List>
      <ListItem primary="Alex Morgan" secondary="Trip organizer" leading={<Avatar>AM</Avatar>} leadingKind="avatar" />
    </List>
  ),
};
