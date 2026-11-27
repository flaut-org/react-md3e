import { writeFile } from 'node:fs/promises';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme();

await writeFile(
  new URL('../packages/react-md3e/src/theme/default-theme.generated.json', import.meta.url),
  JSON.stringify(theme),
);
