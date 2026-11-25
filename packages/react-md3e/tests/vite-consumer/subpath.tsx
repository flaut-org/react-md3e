import { Button } from '@flaut-travel/react-md3e/button';
import { Checkbox } from '@flaut-travel/react-md3e/checkbox';
import { ThemeProvider } from '@flaut-travel/react-md3e/theme-provider';

export function App() {
  return (
    <ThemeProvider colorScheme="light">
      <Button data-testid="automatic-button">Continue</Button>
      <Button loading>Saving</Button>
      <Checkbox defaultChecked aria-label="Accept terms" />
    </ThemeProvider>
  );
}
