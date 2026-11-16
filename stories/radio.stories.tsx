import '@flaut-travel/react-md3e/radio/styles.css';
import '@flaut-travel/react-md3e/radio-group/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from '@flaut-travel/react-md3e';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { 'value': 'economy', 'aria-label': 'Economy' },
  decorators: [
    (Story) => (
      <RadioGroup aria-label="Cabin" defaultValue="economy">
        <Story />
        <label>
          <Radio value="business" /> Business
        </label>
      </RadioGroup>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Use Radio inside RadioGroup. The group owns value/defaultValue and onChange. Base UI manages radio semantics, hidden form inputs and arrow-key selection.',
      },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Error: Story = { args: { error: true } };
export const WithoutRipple: Story = { args: { disableRipple: true } };
