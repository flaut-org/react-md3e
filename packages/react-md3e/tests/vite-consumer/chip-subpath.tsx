import { Chip, ChipSet } from '@flaut-travel/react-md3e/chip';
import { ThemeProvider } from '@flaut-travel/react-md3e/theme-provider';

export function App() {
  return (
    <ThemeProvider colorScheme="light">
      <ChipSet aria-label="Travel chips">
        <Chip kind="assist" label="Reminder" />
        <Chip kind="filter" label="Nonstop" defaultSelected />
        <Chip kind="input" label="Alex" readOnly />
        <Chip kind="suggestion" label="Paris" />
      </ChipSet>
    </ThemeProvider>
  );
}
