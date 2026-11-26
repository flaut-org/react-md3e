import { Chip, ChipSet, ThemeProvider } from '@flaut-travel/react-md3e';
import { ChipDemo } from './chip-demo/chip-demo.component';

export default function ChipsPage() {
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Material chips</h1>
        <section aria-label="Server composition">
          <h2>Four chip types</h2>
          <ChipSet aria-label="Server chips">
            <Chip kind="assist" label="Add to calendar" icon={<span>+</span>} data-testid="server-assist" />
            <Chip kind="filter" label="Nonstop" defaultSelected data-testid="server-filter" />
            <Chip kind="input" label="Alex Morgan" avatar="AM" readOnly data-testid="server-input" />
            <Chip kind="suggestion" label="Try nearby airports" data-testid="server-suggestion" />
          </ChipSet>
        </section>
        <ChipDemo />
      </main>
    </ThemeProvider>
  );
}
