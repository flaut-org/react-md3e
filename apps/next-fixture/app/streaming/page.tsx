import '@flaut-travel/react-md3e/autocomplete/styles.css';
import '@flaut-travel/react-md3e/avatar/styles.css';
import '@flaut-travel/react-md3e/badge/styles.css';
import '@flaut-travel/react-md3e/bottom-sheet/styles.css';
import '@flaut-travel/react-md3e/button-group/styles.css';
import '@flaut-travel/react-md3e/card/styles.css';
import '@flaut-travel/react-md3e/checkbox/styles.css';
import '@flaut-travel/react-md3e/switch/styles.css';
import '@flaut-travel/react-md3e/slider/styles.css';
import '@flaut-travel/react-md3e/collapsible/styles.css';
import '@flaut-travel/react-md3e/divider/styles.css';
import '@flaut-travel/react-md3e/dialog/styles.css';
import '@flaut-travel/react-md3e/list/styles.css';
import '@flaut-travel/react-md3e/popover/styles.css';
import '@flaut-travel/react-md3e/radio/styles.css';
import '@flaut-travel/react-md3e/radio-group/styles.css';
import '@flaut-travel/react-md3e/search/styles.css';
import '@flaut-travel/react-md3e/shape/styles.css';
import '@flaut-travel/react-md3e/side-sheet/styles.css';
import '@flaut-travel/react-md3e/skeleton/styles.css';
import '@flaut-travel/react-md3e/snackbar/styles.css';
import '@flaut-travel/react-md3e/surface/styles.css';
import '@flaut-travel/react-md3e/text-field/styles.css';
import '@flaut-travel/react-md3e/tooltip/styles.css';
import '@flaut-travel/react-md3e/typography/styles.css';
import '@flaut-travel/react-md3e/app-bar/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/loading-indicator/styles.css';
import '@flaut-travel/react-md3e/progress-indicator/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/range-calendar/styles.css';

import { Suspense } from 'react';
import { AppBar, Button, ThemeProvider, LoadingIndicator, ProgressIndicator } from '@flaut-travel/react-md3e';
import { RequestTimeContent } from './request-time-content/request-time-content.component';

export default function StreamingPage() {
  return (
    <ThemeProvider colorScheme="dark">
      <AppBar title="Streaming shell" position="static" data-testid="streaming-app-bar" />
      <main data-fixture="streaming-shell">
        <h1>Streaming fixture</h1>
        <Suspense
          fallback={
            <div data-fixture="streaming-loading">
              <Button disabled>Waiting for request-time content</Button>
              <LoadingIndicator aria-label="Loading streamed content" data-testid="streaming-loading-indicator" />
              <ProgressIndicator aria-label="Preparing streamed content" />
            </div>
          }
        >
          <RequestTimeContent />
        </Suspense>
        <a href="/">Back to the package consumer</a>
      </main>
    </ThemeProvider>
  );
}
