import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import wyw from '@wyw-in-js/vite';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./packages/react-md3e/src/', import.meta.url));

/** Vite extracts each style module; this only publishes dependency-aware CSS entrypoints. */
function componentCss(): Plugin {
  return {
    name: 'react-md3e-component-css',
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const collect = (entry: string): string[] => {
          const visited = new Set<string>();
          const styles = new Set<string>();
          const visit = (fileName: string): void => {
            const chunk = bundle[fileName];

            if (chunk?.type === 'chunk' && !visited.has(fileName)) {
              visited.add(fileName);

              for (const dependency of [...chunk.imports, ...chunk.dynamicImports]) {
                visit(dependency);
              }

              // Vite 7 records extracted assets after removing its pure-CSS chunks.
              const metadata = (chunk as typeof chunk & { viteMetadata?: { importedCss: Set<string> } }).viteMetadata;

              for (const file of metadata?.importedCss ?? []) {
                styles.add(file);
              }
            }
          };

          visit(entry);

          return [...styles];
        };
        const emit = (name: string, styles: string[]): void => {
          if (styles.length === 0) {
            this.error(`No extracted CSS found for ${name}.`);
          }

          this.emitFile({
            type: 'asset',
            fileName: `${name}.css`,
            source: `${styles.map((file) => `@import ${JSON.stringify(`./${file}`)};`).join('\n')}\n`,
          });
        };
        const theme = collect('theme/theme-provider/theme-provider.component.js');

        emit('theme', theme);

        const all = new Set(theme);

        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk' && chunk.isEntry && chunk.name !== 'index') {
            const styles = collect(chunk.fileName);

            emit(chunk.name, styles);

            for (const file of styles) {
              all.add(file);
            }
          }
        }

        // Explicit CSS entrypoints keep JS barrels/RSC imports from eagerly loading every stylesheet.
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk') {
            chunk.code = chunk.code.replace(/^import\s+(['"])[^'"]+\.css\1;?\s*$/gm, '');
          }
        }

        // Compatibility opt-in for consumers that intentionally need the entire catalog.
        emit('styles', [...all]);
      },
    },
  };
}

export default defineConfig({
  plugins: [wyw(), componentCss()],
  build: {
    outDir: fileURLToPath(new URL('./packages/react-md3e/dist/', import.meta.url)),
    emptyOutDir: false,
    minify: false,
    cssMinify: true,
    cssCodeSplit: true,
    lib: {
      entry: {
        'index': `${source}index.ts`,
        'calendar': `${source}components/calendar/index.ts`,
        'range-calendar': `${source}components/range-calendar/index.ts`,
        'loading-indicator': `${source}components/loading-indicator/index.ts`,
        'progress-indicator': `${source}components/progress-indicator/index.ts`,
        'snackbar': `${source}components/snackbar/index.ts`,
        'side-sheet': `${source}components/side-sheet/index.ts`,
        'bottom-sheet': `${source}components/bottom-sheet/index.ts`,
        'button-group': `${source}components/button-group/index.ts`,
        'collapsible': `${source}components/collapsible/index.ts`,
        'tooltip': `${source}components/tooltip/index.ts`,
        'divider': `${source}components/divider/index.ts`,
        'skeleton': `${source}components/skeleton/index.ts`,
        'typography': `${source}components/typography/index.ts`,
        'button': `${source}components/button/index.ts`,
        'icon-button': `${source}components/icon-button/index.ts`,
        'app-bar': `${source}components/app-bar/index.ts`,
        'dialog': `${source}components/dialog/index.ts`,
        'list': `${source}components/list/index.ts`,
        'checkbox': `${source}components/checkbox/index.ts`,
        'switch': `${source}components/switch/index.ts`,
        'radio': `${source}components/radio/index.ts`,
        'radio-group': `${source}components/radio-group/index.ts`,
        'avatar': `${source}components/avatar/index.ts`,
        'badge': `${source}components/badge/index.ts`,
        'text-field': `${source}components/text-field/index.ts`,
        'autocomplete': `${source}components/autocomplete/index.ts`,
        'shape': `${source}components/shape/index.ts`,
        'search': `${source}components/search/index.ts`,
        'surface': `${source}components/surface/index.ts`,
        'card': `${source}components/card/index.ts`,
        'popover': `${source}components/popover/index.ts`,
      },
      formats: ['es'],
    },
    rollupOptions: {
      plugins: [preserveDirectives()],
      external: (id) => /^(react(?:-dom)?(?:\/|$)|@base-ui\/|@material\/)/.test(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: source,
        entryFileNames: '[name].js',
        assetFileNames: 'styles/[name]-[hash][extname]',
      },
      onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
          warn(warning);
        }
      },
    },
  },
});
