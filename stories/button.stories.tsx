import '@flaut-travel/react-md3e/button/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Get started',
    variant: 'filled',
    size: 'small',
    shape: 'round',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'text', 'elevated'] },
    size: { control: 'select', options: ['extraSmall', 'small', 'medium', 'large', 'extraLarge'] },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
    startIcon: { control: false },
    endIcon: { control: false },
    disableRipple: { control: 'boolean' },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Material 3 Expressive button. Change the brand and color-scheme toolbars to apply precomputed createTheme tokens. Uses Base UI button semantics, a pointer/keyboard ripple, and compiled CSS. The Button is a client component importable from RSC; ThemeProvider remains server-compatible.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="story-row">
      {(['filled', 'tonal', 'outlined', 'text', 'elevated'] as const).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="story-row">
      {(['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="story-row">
      <Button shape="round" size="medium">
        Round
      </Button>
      <Button shape="square" size="medium">
        Square
      </Button>
    </div>
  ),
};

export const LeadingIcon: Story = {
  args: {
    children: 'Add to collection',
    startIcon: (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
      </svg>
    ),
  },
};

export const TrailingIcon: Story = {
  args: {
    children: 'Continue',
    endIcon: (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="m12 4-1.4 1.4 5.6 5.6H4v2h12.2l-5.6 5.6L12 20l8-8z" />
      </svg>
    ),
  },
};

export const BothIcons: Story = {
  args: {
    startIcon: LeadingIcon.args?.startIcon,
    endIcon: TrailingIcon.args?.endIcon,
    children: 'Add and continue',
  },
};

export const WithoutRipple: Story = { args: { disableRipple: true } };

export const Disabled: Story = {
  render: () => (
    <div className="story-row">
      {(['filled', 'tonal', 'outlined', 'text', 'elevated'] as const).map((variant) => (
        <Button key={variant} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

function ToggleExample() {
  const [selected, setSelected] = useState(false);

  return (
    <Button variant="tonal" selected={selected} onClick={() => setSelected(!selected)}>
      Favorite
    </Button>
  );
}

export const Toggle: Story = { render: () => <ToggleExample /> };

export const Loading: Story = { args: { loading: true, children: 'Find flights' } };
export const LinkButton: Story = { render: () => <Button href="/articles">All articles</Button> };
export const FullWidth: Story = { args: { fullWidth: true } };
