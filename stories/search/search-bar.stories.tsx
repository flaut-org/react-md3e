import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/search/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton, SearchBar } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: {
    label: 'Search',
    defaultValue: '',
    disabled: false,
    readOnly: false,
    fullWidth: false,
    disableClearable: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Standalone 56px contained search bar on Base UI Input. Leading/trailing actions, query clearing and native form behavior without a results overlay. For an expanding search experience use Search.',
      },
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const WithQuery: Story = { args: { defaultValue: 'Paris' } };
export const TrailingAction: Story = {
  args: {
    trailing: (
      <IconButton variant="standard" aria-label="Voice search">
        🎙
      </IconButton>
    ),
  },
};
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Paris' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Paris' } };
export const FullWidth: Story = { args: { fullWidth: true } };
