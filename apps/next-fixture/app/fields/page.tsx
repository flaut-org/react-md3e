import { Autocomplete, TextField, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { FieldsDemo } from './fields-demo/fields-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  typography: { plainFontFamily: 'Arial, sans-serif' },
  shape: { extraSmall: 8 },
});

export default function FieldsPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <h1>Text fields and autocomplete</h1>
        <section data-testid="server-fields">
          <h2>Server composition</h2>
          <div className="fixture-row">
            <TextField label="Server name" defaultValue="Alex" helperText="Name shown on your booking" />
            <TextField label="Server filled" variant="filled" defaultValue="Paris" />
            <Autocomplete label="Server destination" options={['Paris', 'Rome', 'Kyiv']} defaultValue="Paris" />
          </div>
        </section>
        <FieldsDemo />
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="dark-fields">
          <div className="fixture-row">
            <TextField label="Dark name" defaultValue="Morgan" />
            <Autocomplete label="Dark destination" options={['Oslo', 'Rome', 'Kyiv']} defaultValue="Oslo" />
          </div>
        </ThemeProvider>
      </main>
    </ThemeProvider>
  );
}
