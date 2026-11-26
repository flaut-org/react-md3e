import { Toolbar } from '@flaut-travel/react-md3e/toolbar';
import { Divider } from '@flaut-travel/react-md3e/divider';
import { ThemeProvider } from '@flaut-travel/react-md3e/theme-provider';

export default function ServerToolbarPage() {
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Server toolbar composition</h1>
        <Toolbar keyboardNavigation={false} aria-label="Static toolbar" data-testid="passive-toolbar">
          <a href="#document">Open document</a>
          <Divider orientation="vertical" flexItem />
          <span id="document">Saved</span>
        </Toolbar>
        <Toolbar
          keyboardNavigation={false}
          variant="floating"
          aria-label="Static floating toolbar"
          data-testid="passive-floating-toolbar"
        >
          <span>Read only document</span>
        </Toolbar>
      </main>
    </ThemeProvider>
  );
}
