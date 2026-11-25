import { Button, Checkbox, ThemeProvider } from '@flaut-travel/react-md3e';

export function App() {
  return (
    <ThemeProvider colorScheme="light">
      <Button data-testid="automatic-button">Continue</Button>
      <Button loading>Saving</Button>
      <Checkbox defaultChecked aria-label="Accept terms" />
    </ThemeProvider>
  );
}
