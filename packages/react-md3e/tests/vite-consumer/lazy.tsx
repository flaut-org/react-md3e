import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@flaut-travel/react-md3e';

const Button = lazy(async () => ({ default: (await import('@flaut-travel/react-md3e/button')).Button }));

export function App() {
  return (
    <ThemeProvider colorScheme="light">
      <Suspense fallback="Loading">
        <Button data-testid="automatic-button">Continue</Button>
      </Suspense>
    </ThemeProvider>
  );
}
