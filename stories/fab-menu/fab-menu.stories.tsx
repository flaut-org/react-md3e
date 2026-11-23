import '@flaut-travel/react-md3e/fab-menu/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FabMenu, FabMenuItem } from '@flaut-travel/react-md3e';

const add = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
  </svg>
);
const meta = {
  title: 'Components/FabMenu',
  component: FabMenu,
  tags: ['autodocs'],
  args: {
    label: 'Create',
    closeLabel: 'Close create menu',
    icon: add,
    color: 'primary',
    size: 'regular',
    children: (
      <>
        <FabMenuItem icon={add}>Document</FabMenuItem>
        <FabMenuItem icon={add}>Folder</FabMenuItem>
        <FabMenuItem icon={add}>Spreadsheet</FabMenuItem>
      </>
    ),
  },
  argTypes: {
    icon: { control: false },
    children: { control: false },
    fabProps: { control: false },
    menuProps: { control: false },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'select', options: ['regular', 'medium', 'large'] },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 480, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'FAB plus the existing accessible Menu, presented as 2–6 floating pill actions. The toggle becomes a circular close button, preserving its top trailing corner. Items expand without scaling text and reverse on dismissal. Uses web Menu keyboard/focus semantics.',
      },
    },
  },
} satisfies Meta<typeof FabMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Medium: Story = { args: { size: 'medium' } };
export const Large: Story = { args: { size: 'large' } };
export const Secondary: Story = { args: { color: 'secondary' } };
export const Tertiary: Story = { args: { color: 'tertiary' } };
export const Disabled: Story = { args: { disabled: true } };
export const DefaultOpen: Story = { args: { defaultOpen: true } };
export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
    label: 'إنشاء عنصر',
    closeLabel: 'إغلاق القائمة',
    children: (
      <>
        <FabMenuItem icon={add}>مستند جديد</FabMenuItem>
        <FabMenuItem icon={add}>مجلد جديد</FabMenuItem>
      </>
    ),
  },
};
export const SixActions: Story = {
  args: {
    children: (
      <>
        {['Document', 'Spreadsheet', 'Presentation', 'Drawing', 'Form', 'Folder'].map((label) => (
          <FabMenuItem key={label} icon={add}>
            {label}
          </FabMenuItem>
        ))}
      </>
    ),
  },
};
export const LinksAndDisabledActions: Story = {
  args: {
    children: (
      <>
        <FabMenuItem icon={add} href="https://m3.material.io/components/fab-menu/overview">
          Read specification
        </FabMenuItem>
        <FabMenuItem icon={add} disabled>
          Upload file
        </FabMenuItem>
        <FabMenuItem onClick={() => false}>Keep menu open</FabMenuItem>
      </>
    ),
  },
};
