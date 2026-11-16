import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Snackbar } from '@flaut-org/react-md3e';
import { SnackbarStory } from './snackbar-story/snackbar-story.component';

const meta = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main>
        <h1>Snackbar</h1>
        <Story />
      </main>
    ),
  ],
  args: { message: 'Travel preferences saved', showCloseButton: true },
  render: (args) => <SnackbarStory {...args} />,
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Timed: Story = { args: { autoHideDuration: 4000 } };
export const WithAction: Story = { args: { action: <Button variant="text">Undo</Button> } };
export const TopRight: Story = { args: { anchorOrigin: { vertical: 'top', horizontal: 'right' } } };
