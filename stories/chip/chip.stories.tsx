import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, ChipSet } from '@flaut-travel/react-md3e';
import { starIcon } from '../example-icons';
import { ExclusiveFilters, InputChips } from './chip-examples/chip-examples.component';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main>
        <h1>Chip</h1>
        <Story />
      </main>
    ),
  ],
  args: { kind: 'assist', label: 'Add to calendar', icon: starIcon },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

export const Playground: Story = {};
export const AllTypes: Story = {
  render: () => (
    <ChipSet aria-label="Chip types">
      <Chip kind="assist" label="Add to calendar" icon={starIcon} />
      <Chip kind="filter" label="Nonstop" defaultSelected />
      <Chip kind="input" label="Alex Morgan" avatar="AM" readOnly />
      <Chip kind="suggestion" label="Try nearby airports" />
    </ChipSet>
  ),
};
export const Filter: Story = { args: { kind: 'filter', label: 'Nonstop', defaultSelected: true } };
export const Input: Story = { render: () => <InputChips /> };
export const ReadOnlyInput: Story = {
  args: { kind: 'input', label: 'Alex Morgan', avatar: 'AM', icon: null, readOnly: true },
};
export const Suggestion: Story = { args: { kind: 'suggestion', label: 'Try nearby airports', icon: null } };
export const Elevated: Story = {
  render: () => (
    <ChipSet aria-label="Elevated chips">
      <Chip kind="assist" label="Add to calendar" variant="elevated" icon={starIcon} />
      <Chip kind="filter" label="Baggage" variant="elevated" />
      <Chip kind="filter" label="Nonstop" variant="elevated" defaultSelected />
      <Chip kind="suggestion" label="Show alternatives" variant="elevated" />
    </ChipSet>
  ),
};
export const Expressive: Story = {
  render: () => (
    <ChipSet aria-label="Expressive shape changes">
      <Chip kind="filter" label="Baggage" shape="expressive" icon={starIcon} />
      <Chip kind="filter" label="Nonstop" shape="expressive" defaultSelected />
      <Chip kind="input" label="Select recipient" shape="expressive" defaultSelected={false} />
    </ChipSet>
  ),
};
export const Removable: Story = { name: 'Input chips with removal', render: () => <InputChips /> };
export const SingleSelection: Story = { render: () => <ExclusiveFilters /> };
export const Disabled: Story = {
  render: () => (
    <ChipSet aria-label="Disabled chips" disabled>
      <Chip kind="assist" label="Add to calendar" icon={starIcon} />
      <Chip kind="filter" label="Nonstop" defaultSelected />
      <Chip kind="input" label="Alex Morgan" avatar="AM" readOnly />
      <Chip kind="suggestion" label="Show alternatives" variant="elevated" />
    </ChipSet>
  ),
};
export const RightToLeft: Story = {
  render: () => (
    <ChipSet aria-label="RTL chips" dir="rtl">
      <Chip kind="assist" label="إضافة تذكير" icon={starIcon} />
      <Chip kind="filter" label="بدون توقف" defaultSelected />
      <Chip kind="input" label="أليكس" avatar="A" readOnly />
    </ChipSet>
  ),
};
