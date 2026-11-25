import { AppBar, Autocomplete, SplitButton, ThemeProvider } from '@flaut-travel/react-md3e';

export function App() {
  return (
    <ThemeProvider colorScheme="light">
      <AppBar title="Composition dependencies" />
      <Autocomplete label="Destination" options={['Kyiv', 'London']} />
      <SplitButton menuButtonLabel="More options" menu={null}>
        Save
      </SplitButton>
    </ThemeProvider>
  );
}
