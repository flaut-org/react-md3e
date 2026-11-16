import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/card/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, CardContent, CardActions, CardMedia, CardActionArea } from '@flaut-travel/react-md3e';
import { CardActionDemo } from './card-action-demo/card-action-demo.component';
import landscape from './assets/card-landscape.svg';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    variant: 'filled',
    className: 'surface-example-card',
    children: (
      <CardContent>
        <h2 className="surface-example-title">Weekend in the mountains</h2>
        <p className="surface-example-description">Content and actions about one subject.</p>
      </CardContent>
    ),
  },
  argTypes: {
    variant: { control: 'select', options: ['filled', 'elevated', 'outlined'] },
    shape: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large', 'largeIncreased', 'extraLarge', 'extraExtraLarge'],
    },
    children: { control: false },
    ref: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'MD3 filled/elevated/outlined Card built on Surface. Container/content/actions/media remain server-compatible. Only CardActionArea hydrates for interaction and ripple. Keep secondary buttons outside the primary action area.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <div className="surface-example-grid surface-card-grid">
      {(['filled', 'elevated', 'outlined'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardMedia src={landscape} alt="Mountain lake" />
          <CardContent>
            <h2 className="surface-example-title">{variant}</h2>
            <p className="surface-example-description">Themed surface, corners and content.</p>
          </CardContent>
          <CardActions>
            <Button variant="outlined">Cancel</Button>
            <Button>Explore</Button>
          </CardActions>
        </Card>
      ))}
    </div>
  ),
};
export const PrimaryAction: Story = { render: () => <CardActionDemo /> };
export const Link: Story = {
  args: {
    children: (
      <CardActionArea href="#details">
        <CardContent>Read the travel guide</CardContent>
      </CardActionArea>
    ),
  },
};
export const Disabled: Story = {
  args: {
    children: (
      <CardActionArea disabled>
        <CardContent>Unavailable journey</CardContent>
      </CardActionArea>
    ),
  },
};
export const Dragged: Story = { args: { variant: 'elevated', dragged: true } };
export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
    children: (
      <>
        <CardContent>
          <h2 className="surface-example-title">رحلة إلى الجبال</h2>
          <p>بحيرة هادئة في نهاية الأسبوع</p>
        </CardContent>
        <CardActions>
          <Button variant="outlined">إلغاء</Button>
          <Button>حجز</Button>
        </CardActions>
      </>
    ),
  },
};
