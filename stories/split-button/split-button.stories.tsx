import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuCheckboxItem, MenuGroup, MenuItem, MenuSubmenu, SplitButton } from '@flaut-travel/react-md3e';
import { ControlledSplitButton } from './controlled-split-button/controlled-split-button.component';

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  args: {
    children: 'Send',
    menuButtonLabel: 'More send options',
    menu: (
      <>
        <MenuItem>Schedule send</MenuItem>
        <MenuItem>Save draft</MenuItem>
      </>
    ),
    variant: 'filled',
    size: 'small',
  },
  argTypes: {
    variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'elevated'] },
    size: { control: 'select', options: ['extraSmall', 'small', 'medium', 'large', 'extraLarge'] },
    menu: { control: false },
    buttonProps: { control: false },
    menuButtonProps: { control: false },
    menuProps: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Primary Button plus the existing Menu, with four color styles and five sizes. Two Tab stops, independent actions, connected corner morphs and an inward chevron rotation on standard motion. The split-button CSS entry includes all Button/Menu dependencies.',
      },
    },
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Tonal: Story = { args: { variant: 'tonal' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Elevated: Story = { args: { variant: 'elevated' } };
export const WithIcon: Story = { args: { startIcon: '✉' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const FullWidth: Story = { args: { fullWidth: true } };
export const RightToLeft: Story = { args: { dir: 'rtl', children: 'إرسال', menuButtonLabel: 'المزيد من الخيارات' } };
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
      {(['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
        <SplitButton {...args} key={size} size={size} />
      ))}
    </div>
  ),
};
export const GroupedMenu: Story = {
  args: {
    menuProps: { layout: 'grouped', variant: 'vibrant' },
    menu: (
      <>
        <MenuGroup aria-label="Send actions">
          <MenuItem>Schedule send</MenuItem>
          <MenuCheckboxItem defaultChecked>Request receipt</MenuCheckboxItem>
        </MenuGroup>
        <MenuGroup aria-label="Formats">
          <MenuSubmenu label="Send format">
            <MenuItem>Plain text</MenuItem>
          </MenuSubmenu>
        </MenuGroup>
      </>
    ),
  },
};
export const Controlled: Story = { render: () => <ControlledSplitButton /> };
