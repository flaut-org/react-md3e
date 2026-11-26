import { defineConfig } from 'vite';
import type { Plugin, Rollup } from 'vite';
import wyw from '@wyw-in-js/vite';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const source = fileURLToPath(new URL('./packages/react-md3e/src/', import.meta.url));
// Public composition parts passed through ReactNode are absent from the owner's JS import graph.
const compositionCssDependencies: Readonly<Record<string, readonly string[]>> = {
  'components/app-bar/app-bar.component.js': ['search.js'],
  'components/split-button/split-button.component.js': ['menu.js'],
};

function importedCss(chunk: Rollup.OutputChunk): ReadonlySet<string> {
  return (
    (chunk as Rollup.OutputChunk & { viteMetadata?: { importedCss: Set<string> } }).viteMetadata?.importedCss ??
    new Set()
  );
}

/** Insert whole unmapped lines after the directive prologue; existing columns and VLQ deltas stay valid. */
function createCssImports(chunk: Rollup.OutputChunk, styles: readonly string[]): { code: string; mappings?: string } {
  if (styles.length === 0) {
    return { code: chunk.code };
  }

  const prologue = /^(?:(?:'[^'\r\n]*'|"[^"\r\n]*");\r?\n)*/.exec(chunk.code)?.[0] ?? '';
  const imports = styles
    .map((file) => {
      const relative = path.posix.relative(path.posix.dirname(chunk.fileName), file);

      return `import ${JSON.stringify(relative.startsWith('.') ? relative : `./${relative}`)};\n`;
    })
    .join('');

  // Vite's pure-CSS removal preserves character positions. Keep that property here too.
  const code = `${prologue}${imports}${chunk.code.slice(prologue.length)}`;

  if (chunk.map) {
    const lines = chunk.map.mappings.split(';');

    lines.splice(prologue.split('\n').length - 1, 0, ...styles.map(() => ''));

    return { code, mappings: lines.join(';') };
  }

  return { code };
}

/** Reuse Vite's extracted assets for automatic imports, native Node modules and legacy CSS entries. */
function componentCss(): Plugin {
  return {
    name: 'react-md3e-component-css',
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        for (const [owner, dependencies] of Object.entries(compositionCssDependencies)) {
          for (const file of [owner, ...dependencies]) {
            if (bundle[file]?.type !== 'chunk') {
              this.error(`Missing CSS composition module: ${file}`);
            }
          }
        }

        const collect = (entry: string): string[] => {
          const visited = new Set<string>();
          const styles = new Set<string>();
          const visit = (fileName: string): void => {
            const chunk = bundle[fileName];

            if (chunk?.type === 'chunk' && !visited.has(fileName)) {
              visited.add(fileName);

              for (const dependency of compositionCssDependencies[fileName] ?? []) {
                visit(dependency);
              }

              for (const dependency of [...chunk.imports, ...chunk.dynamicImports]) {
                visit(dependency);
              }

              // Vite 7 records extracted assets after removing its pure-CSS chunks.
              for (const file of importedCss(chunk)) {
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

        // Preserve the same relative ESM graph for native Node, which cannot evaluate CSS imports.
        // Bundlers select the module/browser conditions; Node (including react-server) selects node.
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk') {
            // WyW may retain an import alongside Vite's metadata. Replace it with equal-width
            // whitespace before generating canonical imports, preserving the existing source map.
            chunk.code = chunk.code.replace(/^import\s+(['"])[^'"\n]+\.css\1;?[^\S\n]*$/gm, (line) =>
              ' '.repeat(line.length),
            );
            this.emitFile({ type: 'asset', fileName: `node/${chunk.fileName}`, source: chunk.code });

            if (chunk.map) {
              const map = JSON.parse(chunk.map.toString()) as { sources: string[]; sourceRoot?: string };

              // The parallel graph is one directory deeper. Keep original source locations/content.
              if (!map.sourceRoot) {
                map.sources = map.sources.map((file) => (/^(?:\/|[\w+.-]+:)/.test(file) ? file : `../${file}`));
              }

              this.emitFile({
                type: 'asset',
                fileName: `node/${chunk.sourcemapFileName ?? `${chunk.fileName}.map`}`,
                source: JSON.stringify(map),
              });
            }

            const styles = new Set<string>();

            for (const dependency of compositionCssDependencies[chunk.fileName] ?? []) {
              for (const file of collect(dependency)) {
                styles.add(file);
              }
            }

            for (const file of importedCss(chunk)) {
              styles.add(file);
            }

            // Only direct metadata and explicit composition edges: never import the full catalog
            // or a transitive closure from a barrel. Shared assets keep their canonical URLs.
            const result = createCssImports(chunk, [...styles]);

            chunk.code = result.code;

            if (chunk.map && result.mappings !== undefined) {
              chunk.map.mappings = result.mappings;

              const asset = bundle[chunk.sourcemapFileName ?? `${chunk.fileName}.map`];

              if (asset?.type === 'asset') {
                asset.source = chunk.map.toString();
              }
            }
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
    sourcemap: true,
    lib: {
      entry: {
        'index': `${source}index.ts`,
        'theme-provider': `${source}theme/theme-provider/index.ts`,
        'calendar': `${source}components/calendar/index.ts`,
        'range-calendar': `${source}components/range-calendar/index.ts`,
        'loading-indicator': `${source}components/loading-indicator/index.ts`,
        'progress-indicator': `${source}components/progress-indicator/index.ts`,
        'snackbar': `${source}components/snackbar/index.ts`,
        'side-sheet': `${source}components/side-sheet/index.ts`,
        'bottom-sheet': `${source}components/bottom-sheet/index.ts`,
        'button-group': `${source}components/button-group/index.ts`,
        'split-button': `${source}components/split-button/index.ts`,
        'fab': `${source}components/fab/index.ts`,
        'extended-fab': `${source}components/extended-fab/index.ts`,
        'fab-menu': `${source}components/fab-menu/index.ts`,
        'segmented-button': `${source}components/segmented-button/index.ts`,
        'tabs': `${source}components/tabs/index.ts`,
        'navigation-bar': `${source}components/navigation-bar/index.ts`,
        'navigation-rail': `${source}components/navigation-rail/index.ts`,
        'navigation-drawer': `${source}components/navigation-drawer/index.ts`,
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
        'slider': `${source}components/slider/index.ts`,
        'radio': `${source}components/radio/index.ts`,
        'radio-group': `${source}components/radio-group/index.ts`,
        'avatar': `${source}components/avatar/index.ts`,
        'badge': `${source}components/badge/index.ts`,
        'text-field': `${source}components/text-field/index.ts`,
        'autocomplete': `${source}components/autocomplete/index.ts`,
        'chip': `${source}components/chip/index.ts`,
        'shape': `${source}components/shape/index.ts`,
        'search': `${source}components/search/index.ts`,
        'surface': `${source}components/surface/index.ts`,
        'card': `${source}components/card/index.ts`,
        'popover': `${source}components/popover/index.ts`,
        'menu': `${source}components/menu/index.ts`,
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
