import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL('./packages/react-md3e/dist/', import.meta.url)),
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: fileURLToPath(new URL('./packages/react-md3e/src/theme/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'theme.js',
    },
  },
});
