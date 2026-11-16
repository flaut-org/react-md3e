import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppBar, IconButton } from '@flaut-travel/react-md3e';
import { menuIcon, moreIcon, starIcon } from './example-icons';

const navigation = (
  <IconButton variant="standard" aria-label="Open navigation">
    {menuIcon}
  </IconButton>
);
const actions = (
  <>
    <IconButton variant="standard" aria-label="Favorite">
      {starIcon}
    </IconButton>
    <IconButton variant="standard" aria-label="More options">
      {moreIcon}
    </IconButton>
  </>
);
const meta = {
  title: 'Components/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  args: {
    title: 'Your collection',
    position: 'static',
    variant: 'small',
    titleAlign: 'start',
    scrolled: false,
    navigationIcon: navigation,
    actions,
  },
  argTypes: {
    variant: { control: 'select', options: ['small', 'mediumFlexible', 'largeFlexible'] },
    position: { control: 'select', options: ['static', 'relative', 'sticky', 'fixed', 'absolute'] },
    titleAlign: { control: 'inline-radio', options: ['start', 'center'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    navigationIcon: { control: false },
    actions: { control: false },
    children: { control: false },
    ref: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="story-app-bar">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Server-compatible MD3 Expressive app bar. Flexible variants replace the older medium/large designs. Scroll elevation is controlled by scrolled; no scroll listener or client theme context is installed. Stories use static positioning unless stated otherwise.',
      },
    },
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Variants: Story = {
  render: (args) => (
    <div className="story-grid">
      {(['small', 'mediumFlexible', 'largeFlexible'] as const).map((variant) => (
        <AppBar {...args} key={variant} variant={variant} title={variant} />
      ))}
    </div>
  ),
};
export const WithSubtitle: Story = {
  render: (args) => (
    <div className="story-grid">
      {(['small', 'mediumFlexible', 'largeFlexible'] as const).map((variant) => (
        <AppBar {...args} key={variant} variant={variant} subtitle="Recently added to your library" />
      ))}
    </div>
  ),
};
export const Centered: Story = { args: { titleAlign: 'center', title: 'Collection' } };
export const Scrolled: Story = { args: { scrolled: true } };
export const RightToLeft: Story = { args: { dir: 'rtl', title: 'المكتبة', subtitle: 'المجموعات المحفوظة' } };
export const CustomTitle: Story = { args: { children: <strong>Flaut · Discover a new journey</strong> } };

function ScrollExample() {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div className="story-scroll" onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}>
      <AppBar
        title="Scroll this panel"
        navigationIcon={navigation}
        actions={actions}
        position="sticky"
        scrolled={scrolled}
      />
      <div className="story-scroll-content">Scroll elevation is owned by the application.</div>
    </div>
  );
}

export const Sticky: Story = { render: () => <ScrollExample /> };
export const Fixed: Story = {
  render: (args) => (
    <div className="story-fixed">
      <AppBar {...args} position="fixed" />
      <div className="story-scroll-content">Fixed bars require a content offset in the application.</div>
    </div>
  ),
};
