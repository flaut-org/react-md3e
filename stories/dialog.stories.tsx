import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { useId, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@flaut-org/react-md3e';
import type { DialogProps } from '@flaut-org/react-md3e';
import { starIcon } from './example-icons';

interface ExampleOptions {
  readonly withIcon?: boolean;
  readonly longContent?: boolean;
  readonly form?: boolean;
  readonly stacked?: boolean;
}

type ExampleProps = DialogProps & ExampleOptions & { readonly onOpen: () => void; readonly onDismiss: () => void };

function DialogExample({
  withIcon = false,
  longContent = false,
  form = false,
  stacked = false,
  onOpen,
  onDismiss,
  ...args
}: ExampleProps) {
  const fieldId = useId();
  const field = useRef<HTMLInputElement>(null);
  const [nestedOpen, setNestedOpen] = useState(false);
  const close = onDismiss;

  return (
    <>
      <Button onClick={onOpen}>Open dialog</Button>
      <Dialog {...args} onClose={close} initialFocus={form ? field : undefined}>
        <DialogTitle icon={withIcon ? starIcon : undefined}>
          {args.fullScreen && (
            <IconButton aria-label="Close dialog" variant="standard" onClick={close}>
              ×
            </IconButton>
          )}
          Save this collection?
        </DialogTitle>
        <DialogContent dividers={longContent}>
          <DialogContentText>Keep your favorite journeys together so you can find them later.</DialogContentText>
          {form && (
            <label className="story-dialog-field" htmlFor={fieldId}>
              Collection name
              <input id={fieldId} ref={field} defaultValue="Summer journeys" />
            </label>
          )}
          {longContent &&
            Array.from({ length: 20 }, (_, index) => (
              <p key={index}>
                Journey {index + 1}: dialog content can scroll while the title and actions remain available.
              </p>
            ))}
          {args.fullScreen && (
            <>
              <Button variant="text" onClick={() => setNestedOpen(true)}>
                Review discard confirmation
              </Button>
              <Dialog open={nestedOpen} onClose={() => setNestedOpen(false)}>
                <DialogTitle>Discard changes?</DialogTitle>
                <DialogContent>
                  <DialogContentText>Your collection has unsaved changes.</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="text" onClick={() => setNestedOpen(false)}>
                    Keep editing
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setNestedOpen(false);
                      close();
                    }}
                  >
                    Discard
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </DialogContent>
        <DialogActions stacked={stacked}>
          <Button variant="text" onClick={close}>
            Cancel
          </Button>
          <Button variant="text" onClick={close}>
            Save collection
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: {
    open: false,
    fullScreen: false,
    fullWidth: false,
    scroll: 'paper',
    keepMounted: false,
    disableEscapeKeyDown: false,
  },
  argTypes: {
    scroll: { control: 'inline-radio', options: ['paper', 'body'] },
    role: { control: 'select', options: ['alertdialog', 'dialog'] },
    children: { control: false },
    container: { control: false },
    initialFocus: { control: false },
    finalFocus: { control: false },
    ref: { table: { disable: true } },
  },
  render: function Render(args, context) {
    const [, updateArgs] = useArgs<DialogProps>();
    const options = context.parameters.dialogExample as ExampleOptions | undefined;

    return (
      <DialogExample
        {...args}
        {...options}
        onOpen={() => updateArgs({ open: true })}
        onDismiss={() => updateArgs({ open: false })}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        component:
          'Controlled MD3 modal built on Base UI. Basic dialogs use alertdialog; full-screen tasks use dialog. Includes focus containment/restoration, background scroll lock, Escape and outside-press dismissal, compiled motion and CSS theme inheritance through the portal. Compose DialogTitle, DialogContent, DialogContentText and DialogActions.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const WithIcon: Story = { parameters: { dialogExample: { withIcon: true } } };
export const FullWidth: Story = { args: { fullWidth: true } };
export const FullScreen: Story = {
  args: { fullScreen: true, fullWidth: true },
  parameters: { dialogExample: { longContent: true } },
};
export const LongContent: Story = { parameters: { dialogExample: { longContent: true } } };
export const OutsideScroll: Story = {
  args: { scroll: 'body' },
  parameters: { dialogExample: { longContent: true } },
};
export const Form: Story = { args: { role: 'dialog' }, parameters: { dialogExample: { form: true } } };
export const StackedActions: Story = { parameters: { dialogExample: { stacked: true } } };
export const KeepMounted: Story = { args: { keepMounted: true }, parameters: { dialogExample: { form: true } } };
export const RightToLeft: Story = { args: { dir: 'rtl' } };
