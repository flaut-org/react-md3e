import '@flaut-travel/react-md3e/typography/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@flaut-travel/react-md3e';

const variants = [
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'headlineLarge',
  'headlineMedium',
  'headlineSmall',
  'titleLarge',
  'titleMedium',
  'titleSmall',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'labelLarge',
  'labelMedium',
  'labelSmall',
] as const;
const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  args: {
    children: 'Explore your next destination',
    component: 'p',
    variant: 'bodyLarge',
    color: 'inherit',
    emphasized: false,
    align: 'inherit',
    noWrap: false,
  },
  argTypes: {
    component: {
      control: 'select',
      options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'label', 'a'],
    },
    variant: { control: 'select', options: [...variants, 'inherit'] },
    color: {
      control: 'select',
      options: [
        'inherit',
        'primary',
        'secondary',
        'tertiary',
        'error',
        'onSurface',
        'onSurfaceVariant',
        'onPrimaryContainer',
      ],
    },
    align: { control: 'select', options: ['inherit', 'start', 'end', 'left', 'right', 'center', 'justify'] },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Server-compatible Typography: 15 MD3 baseline styles and their emphasized counterparts, independent HTML semantics through component, inherited or theme-role color, logical alignment and noWrap. Font metrics and selectors compile to CSS; the browser consumes theme variables without a client provider.',
      },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const TypeScale: Story = {
  render: () => (
    <main className="typography-gallery">
      <Typography component="h1" variant="headlineMedium">
        Type scale
      </Typography>
      {variants.map((variant) => (
        <div key={variant} className="typography-example-row">
          <Typography component="p" variant={variant}>
            {variant}
          </Typography>
          <Typography component="p" variant={variant} emphasized>
            {variant} emphasized
          </Typography>
        </div>
      ))}
    </main>
  ),
};
export const Semantics: Story = {
  render: () => (
    <>
      <Typography component="h1" variant="headlineLarge">
        Trip planning
      </Typography>
      <Typography component="h2" variant="titleLarge">
        Your destinations
      </Typography>
      <Typography component="p" variant="bodyLarge">
        Travel <strong>direct</strong> and leave <em>today</em>.
      </Typography>
      <Typography component="strong" variant="labelLarge" emphasized>
        Recommended
      </Typography>
    </>
  ),
};
export const Emphasized: Story = { args: { variant: 'titleMedium', emphasized: true } };
export const Truncated: Story = {
  args: {
    noWrap: true,
    className: 'typography-truncated',
    children: 'A long destination name that should be truncated when the available width is limited.',
  },
};
export const RightToLeft: Story = { args: { dir: 'rtl', align: 'start', children: 'ابحث عن رحلتك القادمة' } };
export const Inherited: Story = {
  render: () => (
    <Typography component="p" variant="titleMedium">
      Parent style <Typography variant="inherit">continues inline</Typography>.
    </Typography>
  ),
};
