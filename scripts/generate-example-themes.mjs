import { mkdir, writeFile } from 'node:fs/promises';
import { createTheme, themeToCss } from '@flaut-org/react-md3e/theme';

const themes = {
  material: createTheme(),
  forest: createTheme({
    sourceColor: '#386a20',
    keyColors: { secondary: '#5d6355', tertiary: '#386568' },
    customColors: { success: { value: '#008544', harmonize: true } },
    typography: { brandFontFamily: 'Georgia, serif', plainFontFamily: 'Arial, sans-serif' },
  }),
  expressive: createTheme({ sourceColor: '#a23b72', variant: 'expressive', shape: { medium: 18 } }),
};

await mkdir(new URL('../stories/', import.meta.url), { recursive: true });
await writeFile(new URL('../stories/themes.generated.json', import.meta.url), JSON.stringify(themes));
await writeFile(
  new URL('../apps/next-fixture/app/forest.generated.css', import.meta.url),
  themeToCss(themes.forest, { selector: '.forest-static' }),
);
