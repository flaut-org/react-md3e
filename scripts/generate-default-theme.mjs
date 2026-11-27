import { writeFile } from 'node:fs/promises';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme();

await writeFile(
  new URL('../packages/react-md3e/src/theme/default-theme.generated.json', import.meta.url),
  JSON.stringify(theme),
);

await writeFile(
  new URL('../packages/react-md3e/src/internal/picker-media.generated.json', import.meta.url),
  JSON.stringify({
    desktop: `(pointer: fine) and (hover: hover) and (min-width: ${theme.breakpoints.sm}px) and (min-height: 480px)`,
    compact: `(width < ${theme.breakpoints.sm}px), (height < 480px)`,
  }),
);
