import Link from 'next/link';
import { LoadingIndicator, ProgressIndicator, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { IndicatorDemo } from './indicator-demo/indicator-demo.component';

const theme = createTheme({ sourceColor: '#9a91e0', motionScheme: 'standard' });

export default function IndicatorsPage() {
  return (
    <ThemeProvider theme={theme} colorScheme="light" data-testid="indicator-theme">
      <main>
        <h1>MD3 loading and progress indicators</h1>
        <section>
          <h2>Loading</h2>
          <div className="fixture-row">
            <LoadingIndicator aria-label="Loading results" data-testid="server-loading" />
            <LoadingIndicator variant="contained" aria-label="Contained loading" data-testid="contained-loading" />
            <LoadingIndicator value={50} aria-label="Loading preview" data-testid="determinate-loading" />
          </div>
        </section>
        <section>
          <h2>Progress</h2>
          {(['flat', 'wavy'] as const).map((appearance) => (
            <div key={appearance}>
              <h3>{appearance}</h3>
              <ProgressIndicator
                value={35}
                appearance={appearance}
                aria-label={`${appearance} linear progress`}
                data-testid={`${appearance}-linear`}
              />
              <div className="fixture-row">
                <ProgressIndicator
                  type="circular"
                  value={35}
                  appearance={appearance}
                  aria-label={`${appearance} circular progress`}
                  data-testid={`${appearance}-circular`}
                />
                <ProgressIndicator
                  type="circular"
                  appearance={appearance}
                  aria-label={`${appearance} circular loading`}
                  data-testid={`${appearance}-circular-indeterminate`}
                />
                <ProgressIndicator
                  type="circular"
                  value={60}
                  appearance={appearance}
                  thickness={8}
                  aria-label={`${appearance} thick circular progress`}
                />
              </div>
              <ProgressIndicator
                appearance={appearance}
                thickness={8}
                aria-label={`${appearance} thick linear loading`}
                data-testid={`${appearance}-linear-indeterminate`}
              />
            </div>
          ))}
        </section>
        <IndicatorDemo />
        <ThemeProvider theme={theme} colorScheme="dark" data-testid="dark-indicator-theme">
          <h2>Dark theme and RTL</h2>
          <LoadingIndicator variant="contained" aria-label="Dark loading" data-testid="dark-loading" />
          <ProgressIndicator value={30} dir="rtl" aria-label="RTL progress" data-testid="rtl-progress" />
        </ThemeProvider>
        <section>
          <h2>Boundaries and custom range</h2>
          <ProgressIndicator value={0} aria-label="Empty progress" data-testid="empty-progress" />
          <ProgressIndicator value={100} aria-label="Complete progress" data-testid="complete-progress" />
          <ProgressIndicator value={25} min={10} max={50} aria-label="Custom range" data-testid="custom-range" />
          <LoadingIndicator aria-hidden data-testid="decorative-loading" />
        </section>
        <Link href="/streaming">Streamed indicators</Link>
        <Link href="/">Back to components</Link>
      </main>
    </ThemeProvider>
  );
}
