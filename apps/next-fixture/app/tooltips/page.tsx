import { ThemeProvider, Tooltip, Typography } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { TooltipDemo } from './tooltip-demo/tooltip-demo.component';

const forest = createTheme({ sourceColor: '#386a20', typography: { plainFontFamily: 'Arial, sans-serif' } });

export default function TooltipsPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <Typography component="h1" variant="headlineLarge">
          Tooltips
        </Typography>
        <TooltipDemo />
        <Tooltip title={<strong>Server supplied content</strong>}>
          <button type="button">Server tooltip</button>
        </Tooltip>
      </main>
    </ThemeProvider>
  );
}
