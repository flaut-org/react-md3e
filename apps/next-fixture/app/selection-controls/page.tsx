import { Avatar, Checkbox, Radio, RadioGroup, ThemeProvider } from '@flaut-org/react-md3e';
import { createTheme } from '@flaut-org/react-md3e/theme';
import { ControlsDemo } from './controls-demo/controls-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  typography: { plainFontFamily: 'Arial, sans-serif' },
  shape: { small: 12 },
});

export default function SelectionControlsPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <h1>Selection controls and avatars</h1>
        <section aria-label="Server content" data-testid="server-controls">
          <h2>Server composition</h2>
          <div className="fixture-row">
            <Avatar alt="Alex Morgan" data-testid="initial-avatar">
              AM
            </Avatar>
            <Avatar src="/avatar.svg" alt="Taylor Reed" data-testid="server-image-avatar">
              TR
            </Avatar>
            <Avatar size="small" variant="rounded" data-testid="small-avatar">
              S
            </Avatar>
            <Avatar size="large" variant="square" data-testid="large-avatar">
              L
            </Avatar>
            <label>
              <Checkbox aria-label="Server checkbox" defaultChecked name="server-checkbox" /> Server checkbox
            </label>
            <RadioGroup aria-label="Server radio group" defaultValue="one" name="server-radio">
              <label>
                <Radio aria-label="Server first" value="one" /> Server first
              </label>
              <label>
                <Radio aria-label="Server second" value="two" /> Server second
              </label>
            </RadioGroup>
          </div>
        </section>
        <ControlsDemo />
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="dark-controls">
          <div className="fixture-row">
            <label>
              <Checkbox defaultChecked /> Dark checkbox
            </label>
            <RadioGroup aria-label="Dark group" defaultValue="dark">
              <label>
                <Radio value="dark" /> Dark radio
              </label>
            </RadioGroup>
            <Avatar alt="Dark avatar">DA</Avatar>
          </div>
        </ThemeProvider>
      </main>
    </ThemeProvider>
  );
}
