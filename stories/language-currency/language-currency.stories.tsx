import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageCurrencyDemo } from './language-currency-demo/language-currency-demo.component';

const meta = {
  title: 'Examples/Language and currency',
  component: LanguageCurrencyDemo,
  parameters: {
    docs: {
      description: {
        component:
          'Two independently controlled single-select lists inside Dialog. Filtering, draft state and locale/currency policy belong to the application. These examples use local data and do not change the real Flaut application.',
      },
    },
  },
} satisfies Meta<typeof LanguageCurrencyDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Picker: Story = {};
