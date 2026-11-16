import '@flaut-travel/react-md3e/avatar/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/list/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Avatar, List, ListItem, Button } from '@flaut-travel/react-md3e';
import type { ReadOnlyListProps } from '@flaut-travel/react-md3e';
import { starIcon } from './example-icons';

type ListStoryArgs = Pick<ReadOnlyListProps, 'variant' | 'disablePadding'>;

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  args: { variant: 'segmented', disablePadding: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['standard', 'segmented'] },
  },
  decorators: [
    (Story) => (
      <div className="story-list">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'MD3 Expressive list. Static ul/li is server-compatible. Selectable lists adapt Base UI ToggleGroup/Toggle to listbox/option semantics, with radio or checkbox visuals, roving focus, typeahead and compiled ripple. No theme context is used.',
      },
    },
  },
} satisfies Meta<ListStoryArgs>;

export default meta;
type Story = StoryObj<ListStoryArgs>;
export const Playground: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem primary="Your journeys" leading={starIcon} />
      <ListItem primary="Travel inspiration" secondary="Discover somewhere new" leading={starIcon} />
      <ListItem
        primary="Saved collection"
        secondary="Journeys worth returning to, with supporting text that can wrap over more than one line."
        lines={3}
        leading={starIcon}
        trailing="12"
      />
    </List>
  ),
};
export const Standard: Story = { ...Playground, args: { variant: 'standard' } };
export const OneTwoThreeLines: Story = { ...Playground };
export const MediaAndOverline: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem
        overline="Favorite destination"
        primary="Lisbon"
        secondary="Portugal"
        leading={<Avatar>L</Avatar>}
        leadingKind="avatar"
        trailing="3 days"
      />
      <ListItem
        primary="Helsinki"
        secondary="Explore the harbor"
        leadingKind="image"
        leading={
          <svg viewBox="0 0 56 56">
            <rect width="56" height="56" fill="#91b5ce" />
            <path d="M0 40 24 12l32 28v16H0" fill="#35596b" />
          </svg>
        }
      />
      <ListItem
        primary="A weekend away"
        secondary="Watch the travel guide"
        leadingKind="video"
        leading={
          <svg viewBox="0 0 100 56">
            <rect width="100" height="56" fill="#beabda" />
            <path d="m42 16 20 12-20 12z" fill="#473660" />
          </svg>
        }
      />
    </List>
  ),
};
export const SingleSelect: Story = {
  render: (args) => (
    <List {...args} selectionMode="single" aria-label="Language" defaultValue="en">
      <ListItem value="en" primary="English" leading="🇬🇧" />
      <ListItem value="es" primary="Español" leading="🇪🇸" />
      <ListItem value="fr" primary="Français" leading="🇫🇷" />
      <ListItem value="de" primary="Deutsch" leading="🇩🇪" disabled />
    </List>
  ),
};
export const MultipleSelect: Story = {
  render: (args) => (
    <List
      {...args}
      selectionMode="multiple"
      aria-label="Travel interests"
      defaultValue={['nature']}
      controlPosition="start"
    >
      <ListItem value="nature" primary="Nature" secondary="Trails, parks and open skies" />
      <ListItem value="food" primary="Food" secondary="Local flavors and markets" />
      <ListItem value="museums" primary="Museums" secondary="Art, history and discovery" />
    </List>
  ),
};
export const ReadOnlySelection: Story = {
  render: (args) => (
    <List {...args} selectionMode="single" aria-label="Saved language" defaultValue="fr" readOnly>
      <ListItem value="en" primary="English" />
      <ListItem value="fr" primary="Français" />
    </List>
  ),
};
export const Disabled: Story = {
  render: (args) => (
    <List {...args} selectionMode="multiple" aria-label="Unavailable interests" defaultValue={['nature']} disabled>
      <ListItem value="nature" primary="Nature" />
      <ListItem value="food" primary="Food" />
    </List>
  ),
};
export const RightToLeft: Story = {
  render: (args) => (
    <List {...args} dir="rtl" selectionMode="single" aria-label="اللغة" defaultValue="ar">
      <ListItem value="ar" primary="العربية" />
      <ListItem value="en" primary="English" />
    </List>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState('EUR');

  return (
    <>
      <List
        selectionMode="single"
        value={value}
        onValueChange={setValue}
        selectionIndicator="checkmark"
        aria-label="Currency"
      >
        <ListItem value="EUR" primary="Euro" secondary="EUR" leading="€" />
        <ListItem value="USD" primary="US dollar" secondary="USD" leading="$" />
        <ListItem value="UAH" primary="Ukrainian hryvnia" secondary="UAH" leading="₴" />
      </List>
      <p>Selected: {value}</p>
      <Button variant="text" onClick={() => setValue('USD')}>
        Select USD from code
      </Button>
    </>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
