import Link from 'next/link';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ThemeProvider,
} from '@flaut-org/react-md3e';
import { createTheme } from '@flaut-org/react-md3e/theme';
import { DialogDemo } from './dialog-demo/dialog-demo.component';
import { ScopedDialogDemo } from '../../components/scoped-dialog-demo/scoped-dialog-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  typography: { brandFontFamily: 'Georgia, serif', plainFontFamily: 'Arial, sans-serif' },
  shape: { extraLarge: 32 },
});

export default function DialogPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <h1>MD3 Dialog</h1>
        <p>Server-created theme and content with an independent client modal boundary.</p>
        <DialogDemo
          serverContent={
            <p data-fixture="server-dialog-content">This dialog content was composed by a React Server Component.</p>
          }
        />
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="dark-dialog-scope">
          <ScopedDialogDemo />
        </ThemeProvider>
        <Dialog open={false}>
          <DialogTitle>Server composition</DialogTitle>
          <DialogContent>
            <DialogContentText>Server-authored dialog parts remain serializable.</DialogContentText>
          </DialogContent>
          <DialogActions />
        </Dialog>
        <p>
          <Link href="/streaming" prefetch={false}>
            Check request-time streaming
          </Link>
        </p>
        <Link href="/">Back to components</Link>
      </main>
    </ThemeProvider>
  );
}
