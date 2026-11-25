import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fab } from '@flaut-travel/react-md3e';

const add = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
  </svg>
);
const colors = [
  'primaryContainer',
  'secondaryContainer',
  'tertiaryContainer',
  'primary',
  'secondary',
  'tertiary',
  'surface',
] as const;
const meta = {
  title: 'Components/Fab',
  component: Fab,
  tags: ['autodocs'],
  args: { 'children': add, 'aria-label': 'Create', 'size': 'regular', 'color': 'primaryContainer' },
  argTypes: {
    children: { control: false },
    size: { control: 'select', options: ['regular', 'medium', 'large', 'small'] },
    color: { control: 'select', options: colors },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Material 3 Expressive FAB in 56/80/96px sizes, with explicit container/tone colors and lowered elevation. The legacy 40px small size remains available. Name icon-only actions with aria-label or aria-labelledby.',
      },
    },
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Medium: Story = { args: { size: 'medium' } };
export const Large: Story = { args: { size: 'large' } };
export const Lowered: Story = { args: { lowered: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LegacySmall: Story = { args: { size: 'small' } };
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {(['regular', 'medium', 'large'] as const).map((size) => (
        <Fab {...args} key={size} size={size} aria-label={`Create ${size}`} />
      ))}
    </div>
  ),
};
export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {colors.map((color) => (
        <Fab {...args} key={color} color={color} aria-label={`Create ${color}`} />
      ))}
    </div>
  ),
};
export const Link: Story = {
  render: () => (
    <Fab
      href="https://m3.material.io/components/floating-action-button/overview"
      aria-label="Read the FAB specification"
    >
      {add}
    </Fab>
  ),
};
