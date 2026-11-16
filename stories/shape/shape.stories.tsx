import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shape, shapeVariants } from '@flaut-org/react-md3e';
import { starIcon } from '../example-icons';
import landscape from '../card/assets/card-landscape.svg';
import { ShapeMorphDemo } from './shape-morph-demo/shape-morph-demo.component';

const meta = {
  title: 'Components/Shape',
  component: Shape,
  tags: ['autodocs'],
  args: { variant: 'cookie9Sided', size: 'large', color: 'primaryContainer', morph: true },
  argTypes: {
    variant: { control: 'select', options: shapeVariants },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    color: {
      control: 'select',
      options: [
        'primary',
        'primaryContainer',
        'secondary',
        'secondaryContainer',
        'tertiary',
        'tertiaryContainer',
        'errorContainer',
      ],
    },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'All 35 official MD3 Expressive shapes exported from AndroidX into static CSS masks. Decorative by default; aria-label names meaningful illustrations. CSS morphing changes the contour when variant changes; geometry is generated at build time. Use Surface for interactive content.',
      },
    },
  },
} satisfies Meta<typeof Shape>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Gallery: Story = {
  render: () => (
    <div className="shape-example-gallery">
      {shapeVariants.map((variant) => (
        <figure key={variant}>
          <Shape variant={variant} size="large" />
          <figcaption>{variant}</figcaption>
        </figure>
      ))}
    </div>
  ),
};
export const WithIcon: Story = {
  args: { 'variant': 'flower', 'children': starIcon, 'aria-label': 'Favorite illustration' },
};
export const ImageMask: Story = {
  args: { 'variant': 'clover4Leaf', 'aria-label': 'Mountain lake', 'children': <img src={landscape} alt="" /> },
};
export const Sizes: Story = {
  render: () => (
    <div className="story-row">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Shape key={size} variant="flower" size={size} />
      ))}
    </div>
  ),
};

export const Morphing: Story = { render: () => <ShapeMorphDemo /> };
export const WithoutMorphing: Story = { args: { morph: false } };
