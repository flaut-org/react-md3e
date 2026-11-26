import { defineConfig } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { fileURLToPath } from 'node:url';
import { App as Root } from './root';
import { App as Subpath } from './subpath';
import { App as Composition } from './composition';
import { App as Button } from './button';
import { App as Checkbox } from './checkbox';
import { App as Theme } from './theme';
import { App as Chip } from './chip';
import { App as ChipSubpath } from './chip-subpath';
import { App as ChipAutocomplete } from './chip-autocomplete';

const example = process.env.MD3E_CSS_CASE ?? 'root';
const cases = {
  'root': Root,
  'subpath': Subpath,
  'composition': Composition,
  'button': Button,
  'checkbox': Checkbox,
  'theme': Theme,
  'legacy': Root,
  'chip': Chip,
  'chip-subpath': ChipSubpath,
  'chip-autocomplete': ChipAutocomplete,
};

export default defineConfig({
  root: fileURLToPath(new URL('./', import.meta.url)),
  base: './',
  esbuild: { jsx: 'automatic' },
  // Reference the previous CSS-free consumption model to measure automatic-import overhead.
  resolve: example === 'legacy' ? { conditions: ['node', 'production'] } : {},
  plugins: [
    {
      name: 'css-consumer',
      // Each case is built independently so another entry cannot mask a missing dependency.
      transform(code, id) {
        if (id.endsWith('/main.tsx')) {
          if (example === 'legacy') {
            const styles = ['theme', 'button', 'checkbox']
              .map((name) => `import '@flaut-travel/react-md3e/${name}/styles.css';`)
              .join('\n');

            return { code: `${code}\n${styles}`, map: null };
          }

          return { code: code.replace(/from\s+['"]\.\/root['"]/, `from './${example}'`), map: null };
        }

        return undefined;
      },
      transformIndexHtml(html) {
        const App = cases[example as keyof typeof cases];

        return App
          ? html.replace('<div id="root"></div>', `<div id="root">${renderToString(createElement(App))}</div>`)
          : html;
      },
    },
  ],
  build: { outDir: `dist/${example}`, emptyOutDir: true, manifest: true },
});
