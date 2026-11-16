import { Button, Popover, PopoverClose, TextField, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { PassengerPickerDemo } from './passenger-picker-demo/passenger-picker-demo.component';
import { PopoverDemo } from './popover-demo/popover-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  typography: { plainFontFamily: 'Arial, sans-serif' },
  shape: { large: 20 },
});

export default function PopoversPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <h1>Anchored popovers</h1>
        <section>
          <h2>Server composition</h2>
          <Popover trigger={<Button>Server popover</Button>} aria-label="Server options">
            <TextField label="Server note" defaultValue="Server-created content" fullWidth />
            <PopoverClose variant="text">Done</PopoverClose>
          </Popover>
        </section>
        <section>
          <h2>Passengers and cabin</h2>
          <PassengerPickerDemo />
        </section>
        <PopoverDemo />
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="popover-dark-theme">
          <section>
            <h2>Nested dark theme</h2>
            <Popover aria-label="Dark options" trigger={<Button>Dark popover</Button>}>
              <TextField label="Dark note" />
              <PopoverClose variant="text">Done</PopoverClose>
            </Popover>
          </section>
        </ThemeProvider>
        <div className="popover-flip-fixture">
          <Popover aria-label="Flipped options" trigger={<Button>Flip popover</Button>}>
            <p>Enough space for the content above its anchor.</p>
            <PopoverClose variant="text">Done</PopoverClose>
          </Popover>
        </div>
      </main>
    </ThemeProvider>
  );
}
