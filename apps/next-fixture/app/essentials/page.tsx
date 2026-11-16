import '@flaut-travel/react-md3e/autocomplete/styles.css';
import '@flaut-travel/react-md3e/dialog/styles.css';
import '@flaut-travel/react-md3e/bottom-sheet/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/button-group/styles.css';
import '@flaut-travel/react-md3e/collapsible/styles.css';
import '@flaut-travel/react-md3e/divider/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/side-sheet/styles.css';
import '@flaut-travel/react-md3e/skeleton/styles.css';
import '@flaut-travel/react-md3e/snackbar/styles.css';
import '@flaut-travel/react-md3e/text-field/styles.css';
import '@flaut-travel/react-md3e/tooltip/styles.css';
import '@flaut-travel/react-md3e/typography/styles.css';

import { Skeleton, Divider, Typography, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { EssentialsDemo } from './essentials-demo/essentials-demo.component';

const forest = createTheme({ sourceColor: '#386a20', typography: { plainFontFamily: 'Arial, sans-serif' } });

export default function EssentialsPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <Typography component="h1" variant="headlineLarge">
          Homepage essentials
        </Typography>
        <section aria-label="Loading placeholders" data-testid="skeletons" aria-busy="true">
          <Skeleton width={200} height={24} />
          <Skeleton variant="rounded" width={200} height={80} animation="wave" />
          <Skeleton variant="circular" width={48} height={48} animation={false} />
          <Skeleton width={200} data-testid="inert-skeleton">
            <button type="button">Hidden skeleton action</button>
          </Skeleton>
        </section>
        <Divider data-testid="horizontal-divider" variant="middle" />
        <div className="essentials-divider-row">
          <span>Language</span>
          <Divider orientation="vertical" flexItem data-testid="vertical-divider" />
          <span>Currency</span>
        </div>
        <EssentialsDemo />
      </main>
    </ThemeProvider>
  );
}
