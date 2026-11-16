import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { IconButton } from '@flaut-org/react-md3e';
import { starIcon } from './example-icons';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Favorite',
    'children': starIcon,
    'variant': 'filled',
    'size': 'small',
    'shape': 'round',
    'width': 'default',
    'disabled': false,
  },
  argTypes: {
    variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'standard'] },
    size: { control: 'select', options: ['extraSmall', 'small', 'medium', 'large', 'extraLarge'] },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
    width: { control: 'inline-radio', options: ['narrow', 'default', 'wide'] },
    selected: { control: 'boolean' },
    disableRipple: { control: 'boolean' },
    children: { control: false },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'MD3 Expressive icon button with Base UI behavior, a minimum 48×48 interaction target, compiled shape motion and press ripple. Accessible name is required. The theme toolbar controls color and shape tokens.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <div className="story-row">
      {(['filled', 'tonal', 'outlined', 'standard'] as const).map((variant) => (
        <IconButton key={variant} aria-label={variant} variant={variant}>
          {starIcon}
        </IconButton>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="story-row">
      {(['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
        <IconButton key={size} aria-label={size} size={size}>
          {starIcon}
        </IconButton>
      ))}
    </div>
  ),
};
export const Widths: Story = {
  render: () => (
    <div className="story-row">
      {(['narrow', 'default', 'wide'] as const).map((width) => (
        <IconButton key={width} aria-label={width} width={width} size="medium">
          {starIcon}
        </IconButton>
      ))}
    </div>
  ),
};
export const Shapes: Story = {
  render: () => (
    <div className="story-row">
      <IconButton aria-label="Round" shape="round" size="medium">
        {starIcon}
      </IconButton>
      <IconButton aria-label="Square" shape="square" size="medium">
        {starIcon}
      </IconButton>
    </div>
  ),
};
export const Disabled: Story = {
  render: () => (
    <div className="story-row">
      {(['filled', 'tonal', 'outlined', 'standard'] as const).map((variant) => (
        <IconButton key={variant} aria-label={variant} variant={variant} disabled>
          {starIcon}
        </IconButton>
      ))}
    </div>
  ),
};

function ToggleExample() {
  const [selected, setSelected] = useState(false);

  return (
    <IconButton aria-label="Favorite" variant="tonal" selected={selected} onClick={() => setSelected(!selected)}>
      {starIcon}
    </IconButton>
  );
}

export const Toggle: Story = { render: () => <ToggleExample /> };
export const WithoutRipple: Story = { args: { disableRipple: true } };
export const LabelledBy: Story = {
  render: () => (
    <div className="story-row">
      <span id="favorite-label">Favorite collection</span>
      <IconButton aria-labelledby="favorite-label">{starIcon}</IconButton>
    </div>
  ),
};
