import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExtendedFab } from '@flaut-travel/react-md3e';
import { CollapsibleExtendedFab } from './collapsible-extended-fab/collapsible-extended-fab.component';

const add = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
  </svg>
);
const meta = {
  title: 'Components/ExtendedFab',
  component: ExtendedFab,
  tags: ['autodocs'],
  args: { children: 'Compose', startIcon: add, size: 'small', color: 'primaryContainer' },
  argTypes: {
    startIcon: { control: false },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    color: {
      control: 'select',
      options: [
        'primaryContainer',
        'secondaryContainer',
        'tertiaryContainer',
        'primary',
        'secondary',
        'tertiary',
        'surface',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Extended FAB with current Expressive title typography, three sizes, optional leading icon, lowered elevation and an accessible collapsed state. Width and label motion use extracted CSS and shared spring tokens.',
      },
    },
  },
} satisfies Meta<typeof ExtendedFab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Medium: Story = { args: { size: 'medium' } };
export const Large: Story = { args: { size: 'large' } };
export const LabelOnly: Story = { args: { startIcon: null } };
export const Lowered: Story = { args: { lowered: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Collapsible: Story = { render: (args) => <CollapsibleExtendedFab size={args.size ?? 'small'} /> };
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <ExtendedFab {...args} key={size} size={size} />
      ))}
    </div>
  ),
};
