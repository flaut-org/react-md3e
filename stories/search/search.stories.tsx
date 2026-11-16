import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/search/styles.css';
import '@flaut-travel/react-md3e/text-field/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Search, TextField } from '@flaut-travel/react-md3e';
import { DestinationSearchDemo } from './destination-search-demo/destination-search-demo.component';

const meta = {
  title: 'Components/Search',
  component: Search,
  tags: ['autodocs'],
  args: {
    label: 'Search',
    layout: 'auto',
    emptyText: 'Start typing to search',
    keepMounted: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    layout: { control: 'select', options: ['auto', 'docked', 'fullScreen'] },
    children: { control: false },
    leading: { control: false },
    trailing: { control: false },
    container: { control: false },
    viewProps: { control: false },
    inputProps: { control: false },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'MD3 Expressive contained search. Base UI Dialog owns modal focus, dismissal and scroll locking. CSS springs expand the docked results or morph the bar into a fullscreen view on compact screens. Supply application-owned results through children; query input is freeform, separate from Autocomplete selection.',
      },
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Destinations: Story = {
  args: { label: 'Search destinations' },
  render: (args) => <DestinationSearchDemo {...args} />,
};
export const Docked: Story = { render: (args) => <DestinationSearchDemo {...args} />, args: { layout: 'docked' } };
export const Fullscreen: Story = {
  render: (args) => <DestinationSearchDemo {...args} />,
  args: { layout: 'fullScreen' },
};
export const Loading: Story = { args: { loading: true, loadingText: 'Searching destinations…' } };
export const WithQuery: Story = { args: { defaultValue: 'Paris', emptyText: 'Results for Paris' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Paris' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Paris' } };
export const RetainedContent: Story = { args: { keepMounted: true, children: <TextField label="Search filter" /> } };
export const ArbitraryResults: Story = {
  args: {
    children: (
      <>
        <TextField label="Filter by author" />
        <Button variant="text">View all results</Button>
      </>
    ),
  },
};
export const RightToLeft: Story = {
  args: { dir: 'rtl', label: 'البحث', backText: 'رجوع', clearText: 'مسح', emptyText: 'نتائج البحث' },
};

export const InitiallyOpen: Story = { args: { defaultOpen: true } };
export const SubmissionCancelled: Story = { args: { onSearch: () => false } };
