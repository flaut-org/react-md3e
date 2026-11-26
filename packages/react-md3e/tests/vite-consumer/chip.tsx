import { Chip, ChipSet, ThemeProvider } from '@flaut-travel/react-md3e';

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
