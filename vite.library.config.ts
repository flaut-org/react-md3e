import { defineConfig } from 'vite';
import wyw from '@wyw-in-js/vite';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./packages/react-md3e/src/', import.meta.url));

export default defineConfig({
  plugins: [wyw()],
  build: {
    outDir: fileURLToPath(new URL('./packages/react-md3e/dist/', import.meta.url)),
    emptyOutDir: false,
    minify: false,
    cssMinify: true,
    lib: {
      entry: {
        'index': `${source}index.ts`,
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
        'radio': `${source}components/radio/index.ts`,
        'radio-group': `${source}components/radio-group/index.ts`,
        'avatar': `${source}components/avatar/index.ts`,
        'text-field': `${source}components/text-field/index.ts`,
        'autocomplete': `${source}components/autocomplete/index.ts`,
        'shape': `${source}components/shape/index.ts`,
        'search': `${source}components/search/index.ts`,
        'surface': `${source}components/surface/index.ts`,
        'card': `${source}components/card/index.ts`,
        'popover': `${source}components/popover/index.ts`,
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    rollupOptions: {
      plugins: [preserveDirectives()],
      external: (id) => /^(react(?:-dom)?(?:\/|$)|@base-ui\/|@material\/)/.test(id),
      output: { preserveModules: true, preserveModulesRoot: source, entryFileNames: '[name].js' },
      onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
          warn(warning);
        }
      },
    },
  },
});
