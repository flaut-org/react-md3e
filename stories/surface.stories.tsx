import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from '@flaut-travel/react-md3e';

const corners = [
  'none',
  'extraSmall',
  'small',
  'medium',
  'large',
  'largeIncreased',
  'extraLarge',
  'extraLargeIncreased',
  'extraExtraLarge',
  'full',
] as const;
const colors = [
  'surface',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'primary',
  'primaryContainer',
  'secondaryContainer',
  'tertiaryContainer',
  'errorContainer',
  'inverseSurface',
] as const;
const meta = {
  title: 'Components/Surface',
  component: Surface,
  tags: ['autodocs'],
  args: {
    children: 'A theme-aware surface',
    shape: 'medium',
    color: 'surfaceContainerLow',
    elevation: 1,
    variant: 'filled',
    style: { padding: 24, maxInlineSize: 360 },
  },
  argTypes: {
    shape: { control: 'select', options: corners },
    color: { control: 'select', options: colors },
    elevation: { control: 'select', options: [0, 1, 2, 3, 4, 5] },
    variant: { control: 'select', options: ['filled', 'outlined'] },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Server-compatible surface with MD3 color/content pairs, corner tokens and elevation levels. No hooks, client theme context or runtime CSS. Card composes this primitive.',
      },
    },
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Outlined: Story = { args: { variant: 'outlined', elevation: 0 } };
export const Elevations: Story = {
  render: () => (
    <div className="surface-example-grid">
      {([0, 1, 2, 3, 4, 5] as const).map((level) => (
        <Surface key={level} elevation={level} className="surface-example-pad">
          Level {level}
        </Surface>
      ))}
    </div>
  ),
};
export const Corners: Story = {
  render: () => (
    <div className="surface-example-grid">
      {corners.map((shape) => (
        <Surface key={shape} shape={shape} color="secondaryContainer" className="surface-example-pad">
          {shape}
        </Surface>
      ))}
    </div>
  ),
};
export const Colors: Story = {
  render: () => (
    <div className="surface-example-grid">
      {colors.map((color) => (
        <Surface key={color} color={color} className="surface-example-pad">
          {color}
        </Surface>
      ))}
    </div>
  ),
};
