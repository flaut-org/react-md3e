import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, ListItem } from '@flaut-travel/react-md3e';
import type { StaticListItemProps } from '@flaut-travel/react-md3e/list';
import { starIcon } from './example-icons';

const meta = {
  title: 'Components/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  args: { primary: 'Saved journey', secondary: 'Supporting text', leading: starIcon, lines: 2 },
  argTypes: {
    primary: { control: 'text' },
    secondary: { control: 'text' },
    overline: { control: 'text' },
    lines: { control: 'inline-radio', options: [1, 2, 3] },
    leading: { control: false },
    leadingKind: { control: 'select', options: ['icon', 'avatar', 'image', 'video'] },
    trailing: { control: 'text' },
    trailingKind: { control: 'inline-radio', options: ['text', 'icon'] },
    ref: { table: { disable: true } },
    value: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="story-list">
        <List>
          <Story />
        </List>
      </div>
    ),
  ],
} satisfies Meta<StaticListItemProps>;

export default meta;
type Story = StoryObj<StaticListItemProps>;
export const Playground: Story = {};
export const ThreeLines: Story = {
  args: { overline: 'Recently saved', secondary: 'Room for more details without clipping text.', lines: 3 },
};
export const WithDivider: Story = { args: { divider: true } };
