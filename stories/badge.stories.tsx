import '@flaut-travel/react-md3e/badge/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, IconButton } from '@flaut-travel/react-md3e';

const mailIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5-8-5V6l8 5 8-5z" />
  </svg>
);
const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { badgeContent: 7, max: 999, showZero: false, invisible: false, children: mailIcon },
  argTypes: { variant: { control: 'inline-radio', options: ['small', 'large'] } },
  parameters: {
    docs: {
      description: {
        component:
          'Material small (6px) and large (16px minimum) badges. Error/onError colors, labelSmall text and fixed top-trailing icon placement mirror in RTL. Include the visible count/status in the destination’s accessible name and describe the full count when abbreviated. The visual badge is decorative. Server-compatible with extracted CSS and spring-based visibility transitions.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { variant: 'small', badgeContent: undefined } };
export const Counts: Story = {
  render: () => (
    <div className="story-row">
      {[1, 12, 123, 1000].map((count) => (
        <span key={count}>
          <IconButton
            variant="standard"
            aria-label={`Inbox, ${count > 999 ? '999+' : count} unread messages`}
            aria-describedby={count > 999 ? `badge-story-count-${count}` : undefined}
          >
            <Badge badgeContent={count}>{mailIcon}</Badge>
          </IconButton>
          {count > 999 && (
            <span id={`badge-story-count-${count}`} hidden>
              {count} unread messages in total
            </span>
          )}
        </span>
      ))}
    </div>
  ),
};
export const Text: Story = { args: { badgeContent: 'New' } };
export const Zero: Story = { args: { badgeContent: 0, showZero: true } };
export const Standalone: Story = { args: { children: undefined, badgeContent: 12 } };
export const InIconButton: Story = {
  render: () => (
    <IconButton variant="standard" aria-label="Inbox, 7 unread messages">
      <Badge badgeContent={7}>{mailIcon}</Badge>
    </IconButton>
  ),
};
export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl" className="story-row">
      <IconButton variant="standard" aria-label="Inbox, new notification">
        <Badge variant="small">{mailIcon}</Badge>
      </IconButton>
      <IconButton variant="standard" aria-label="Inbox, 7 unread messages">
        <Badge {...args} />
      </IconButton>
    </div>
  ),
};
