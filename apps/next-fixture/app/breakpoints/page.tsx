import Link from 'next/link';
import { ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { BreakpointDialogDemo } from './breakpoint-dialog-demo/breakpoint-dialog-demo.component';
import styles from './breakpoints.module.css';

const theme = createTheme({ breakpoints: { xs: 480, sm: 640, md: 1000, lg: 1280, xl: 1600 } });

export default function BreakpointsPage() {
  return (
    <ThemeProvider theme={theme} colorScheme="light" data-testid="custom-breakpoints">
      <main>
        <h1>Theme breakpoints</h1>
        <p>Server-created widths, nested defaults, and CSS overrides. No client theme context.</p>
        <BreakpointDialogDemo name="Custom" />
        <ThemeProvider data-testid="default-breakpoints">
          <BreakpointDialogDemo name="Default" />
        </ThemeProvider>
        <ThemeProvider className={styles.overrides} data-testid="css-breakpoints">
          <BreakpointDialogDemo name="CSS" />
        </ThemeProvider>
        <Link href="/">Back to components</Link>
      </main>
    </ThemeProvider>
  );
}
