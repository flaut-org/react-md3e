import '@flaut-travel/react-md3e/segmented-button/styles.css';

import { ButtonSegment, SegmentedButton, ThemeProvider } from '@flaut-travel/react-md3e';
import { SegmentedButtonDemo } from './segmented-button-demo/segmented-button-demo.component';

export default function SegmentedButtonsPage() {
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Segmented buttons</h1>
        <section>
          <h2>Server composition</h2>
          <SegmentedButton aria-label="Calendar view" defaultValue="week" data-testid="server-segments">
            <ButtonSegment value="day">Day</ButtonSegment>
            <ButtonSegment value="week">Week</ButtonSegment>
            <ButtonSegment value="month">Month</ButtonSegment>
          </SegmentedButton>
        </section>
        <SegmentedButtonDemo />
      </main>
    </ThemeProvider>
  );
}
