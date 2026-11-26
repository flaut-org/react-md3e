import { Chip } from '@flaut-travel/react-md3e/chip';
import { ThemeProvider } from '@flaut-travel/react-md3e/theme-provider';

export default function ServerChipsPage() {
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Server input chips</h1>
        <div className="fixture-row">
          <Chip kind="input" label="Server recipient" avatar="AM" readOnly data-testid="passive-chip" />
          <Chip kind="input" label="Static token" />
          <Chip kind="input" label="Selected token" selected readOnly shape="expressive" />
        </div>
      </main>
    </ThemeProvider>
  );
}
