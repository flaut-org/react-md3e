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
