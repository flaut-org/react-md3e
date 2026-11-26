import { Autocomplete, Chip, ThemeProvider } from '@flaut-travel/react-md3e';

export function App() {
  return (
    <ThemeProvider colorScheme="light">
      <Autocomplete multiple label="Destinations" options={['Paris', 'Rome']} defaultValue={['Paris']} />
      <Chip kind="input" label="Alex" readOnly />
    </ThemeProvider>
  );
}
